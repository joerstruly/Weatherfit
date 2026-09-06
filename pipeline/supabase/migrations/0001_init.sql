-- Construction cost warehouse — initial schema
--
-- Two stores, one project:
--   Storage  = immutable raw artifacts, keyed by content hash. Source of truth.
--   Postgres = manifest, extraction attempts, observations, fitted parameters.
--
-- The warehouse is rebuildable from Storage. That is deliberate: parsers will be
-- wrong and will need re-running across years of archived documents, and sources
-- disappear (the WA escalation committee disbanded; the Duncan fee survey stopped).

create schema if not exists cost;
set search_path = cost, public;

-- ---------------------------------------------------------------- manifest --
-- Mirrors research/construction-cost-data-sources/sources.csv. That file already
-- functions as the ingestion manifest; this is its queryable form.
create table source (
  id                      text primary key,          -- F01, K03, U01, ...
  tier                    smallint,
  category                text,
  subcategory             text,
  source_name             text not null,
  publisher               text,
  url                     text,
  covers                  text,
  unit_type               text,
  geo_granularity         text,
  cadence                 text,
  lag                     text,
  format                  text,
  access_method           text,
  all_bidders_or_awarded  text,
  history_depth           text,
  license                 text,
  verification            text not null,
  verification_note       text,
  notes                   text,

  -- pipeline control
  watch_enabled           boolean not null default true,
  -- Hard gate. Sources whose licence bars redistribution are watched for change
  -- but their bytes are never retained. Enforced again in the fetch workflow.
  may_store               boolean not null default true,
  schedule_bucket         text,                      -- annual|quarterly|monthly|continuous
  last_checked_at         timestamptz,
  last_http_status        int,
  consecutive_failures    int not null default 0,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);
create index on source (schedule_bucket) where watch_enabled;
create index on source (verification);

-- --------------------------------------------------------------- artifacts --
-- One row per distinct document CONTENT. Re-fetching an unchanged file does not
-- create a row; a changed file does. Version history falls out for free.
create table artifact (
  sha256          text primary key,
  bytes           bigint not null,
  content_type    text,
  storage_bucket  text not null default 'artifacts',
  storage_path    text not null,        -- raw/{source_id}/{sha256}{ext}
  first_seen_at   timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

-- Identical bytes can arrive from more than one source — Novogradac mirrors many
-- state housing-agency documents, so this is a real case in this catalog, not a
-- hypothetical. Content dedups; sightings do not.
create table artifact_sighting (
  sha256        text not null references artifact(sha256) on delete cascade,
  source_id     text not null references source(id),
  url           text not null,
  http_status   int,
  etag          text,
  last_modified text,
  seen_at       timestamptz not null default now(),
  primary key (sha256, source_id, seen_at)
);
create index on artifact_sighting (source_id, seen_at desc);

-- ------------------------------------------------------------- extractions --
-- Every attempt is recorded, including failures. The gate report is the audit
-- trail behind every number downstream.
create table extraction (
  id              bigint generated always as identity primary key,
  sha256          text not null references artifact(sha256) on delete cascade,
  source_id       text not null references source(id),
  tier            text not null
                    check (tier in ('sidecar','ruled','template','stream','ocr','llm')),
  template_id     text,
  engine_version  text not null,        -- 'pymupdf 1.28.2' etc; part of provenance
  passed          boolean not null,
  gates           jsonb not null default '{}'::jsonb,
  row_count       int not null default 0,
  page_from       int,
  page_to         int,
  created_at      timestamptz not null default now()
);
create index on extraction (sha256);
create index on extraction (passed, created_at desc);
create index on extraction using gin (gates jsonb_path_ops);

-- ------------------------------------------------------------ observations --
-- Long and narrow, deliberately. This catalog spans $/LB, $/stall, $/GSF, %/yr
-- and dimensionless indexes; a wide table would be almost entirely NULL.
create table observation (
  id                bigint generated always as identity primary key,
  extraction_id     bigint not null references extraction(id) on delete cascade,
  sha256            text   not null,    -- denormalised: provenance without a join
  source_id         text   not null references source(id),

  metric            text   not null,    -- unit_price | cost_per_gsf | cost_per_stall | escalation_rate | location_factor | fee_per_unit ...
  metric_family     text   not null     -- bid_item | benchmark | index | fee | parametric
                      check (metric_family in ('bid_item','benchmark','index','fee','parametric')),
  value             numeric not null,
  unit              text   not null,    -- USD/LB, USD/GSF, USD/stall, pct_per_yr, index

  item_code         text,
  item_desc         text,
  quantity          numeric,

  geo_kind          text check (geo_kind in ('nation','region','state','cbsa','county','city','district','project')),
  geo_code          text,               -- FIPS, CBSA code, USPS state, agency district id
  period_start      date,
  period_end        date,

  typology          text,               -- garden | podium | wrap | highrise | office | industrial | retail
  construction_type text,               -- IBC: VA, VB, IIIA, IA ...
  stories           int,

  attrs             jsonb not null default '{}'::jsonb,   -- source-specific remainder

  method            text not null,      -- extraction tier that produced this
  confidence        real not null default 1.0 check (confidence between 0 and 1),
  row_index         int,
  created_at        timestamptz not null default now()
);

-- One row per source line, so a re-run replaces rather than duplicates.
create unique index observation_natural_key
  on observation (extraction_id, coalesce(row_index, -1), metric);
create index on observation (metric, geo_kind, geo_code, period_start);
create index on observation (metric_family, period_start);
create index on observation (source_id);
create index on observation using brin (created_at);
-- When bid-item volume passes ~50M rows (48 states x years is plausible),
-- convert to declarative LIST partitioning on metric_family. Not before —
-- partitioning an empty warehouse buys nothing and costs flexibility.

-- -------------------------------------------------------------- parameters --
-- The fitted output. This — not the raw sources — is what the read API serves.
create table parameter (
  id              bigint generated always as identity primary key,
  metric          text not null,
  geo_kind        text,
  geo_code        text,
  typology        text,
  period          date not null,        -- effective period / construction midpoint
  p10             numeric,
  p50             numeric not null,
  p90             numeric,
  n_observations  int not null,
  mape            real,                 -- from the validation protocol
  fit_version     text not null,
  source_ids      text[] not null default '{}',
  fitted_at       timestamptz not null default now()
);
create unique index on parameter (metric, coalesce(geo_kind,''), coalesce(geo_code,''),
                                  coalesce(typology,''), period, fit_version);
comment on column parameter.n_observations is
  'Published with every value. A cell fitted on 3 projects must not look like one fitted on 90.';

-- ------------------------------------------------------------------ queues --
create table synthesis_queue (
  sha256        text primary key references artifact(sha256) on delete cascade,
  source_id     text not null references source(id),
  failed_gates  jsonb not null default '{}'::jsonb,
  attempts      int not null default 0,
  resolved_at   timestamptz,
  queued_at     timestamptz not null default now()
);

create table records_request (
  id           bigint generated always as identity primary key,
  source_id    text references source(id),
  agency       text not null,
  jurisdiction text,
  statute      text,          -- e.g. 'HUD Handbook 7460.8 Ch.6', '30 ILCS 500 Art.30'
  requested_at date,
  due_at       date,
  status       text not null default 'draft'
                 check (status in ('draft','sent','acknowledged','partial','fulfilled','denied')),
  notes        text
);

-- --------------------------------------------------------------------- RLS --
-- Tables created through raw SQL do NOT get RLS automatically. Without this,
-- anything reachable through PostgREST is readable with the anon key.
alter table source            enable row level security;
alter table artifact          enable row level security;
alter table artifact_sighting enable row level security;
alter table extraction        enable row level security;
alter table observation       enable row level security;
alter table parameter         enable row level security;
alter table synthesis_queue   enable row level security;
alter table records_request   enable row level security;

-- No policies on the ingestion tables: service_role bypasses RLS, everyone else
-- is denied. Only fitted parameters are public, and only for reading.
create policy parameter_read_all on parameter for select to anon, authenticated using (true);

-- Dedicated least-privilege role for the orchestrator, so n8n never holds
-- service_role. It can move the queues and nothing else.
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'n8n_orchestrator') then
    create role n8n_orchestrator nologin;
  end if;
end $$;
grant usage on schema cost to n8n_orchestrator;
grant select                         on cost.source           to n8n_orchestrator;
grant select, insert, update         on cost.synthesis_queue  to n8n_orchestrator;
grant select, insert                 on cost.artifact_sighting to n8n_orchestrator;
grant update (last_checked_at, last_http_status, consecutive_failures)
                                     on cost.source           to n8n_orchestrator;
