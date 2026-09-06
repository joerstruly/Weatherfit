# Supabase target

Two stores in one project, with a clear division of labour:

| | Holds | Why |
|---|---|---|
| **Supabase Storage** | Raw artifacts, immutable, keyed by content hash | **Source of truth.** Parsers will be wrong and need re-running across years of archived documents. Sources vanish — the WA escalation committee disbanded, the Duncan fee survey stopped. |
| **Supabase Postgres** | Manifest, extraction attempts, observations, fitted parameters | Queryable, joinable, serves the read API |

**The warehouse is rebuildable from Storage. The archive is not rebuildable from anything.** Budget accordingly: if you can only afford to protect one, protect the bucket.

---

## 1. Storage layout

```
artifacts/                      (private bucket)
  raw/{source_id}/{sha256}{ext}     immutable; the hash IS the key
derived/                        (private, optional, lifecycle-able)
  ocr/{sha256}.pdf                  text layer added
  page/{sha256}/{n}.png             rasterised pages for LLM template synthesis
```

Content hash as key gives free dedup, free change detection, and free version history: re-fetching an unchanged file writes nothing, a changed file writes a new object. Keep `derived/` separate so you can expire it — rasterised pages balloon and are always re-derivable.

**Use the S3-compatible endpoint, not the JS/py client, for ingestion.** `https://<ref>.storage.supabase.co/storage/v1/s3` with access keys from the dashboard. Reasons: real multipart upload (several documents in this catalog exceed 10 MB, and scanned assessor manuals go well beyond), plus boto3, rclone and n8n's S3 node all work unchanged. Set the bucket's `file_size_limit` explicitly rather than relying on the project default.

---

## 2. Schema

`migrations/0001_init.sql`, in a `cost` schema.

| Table | Grain |
|---|---|
| `source` | The manifest — one row per catalogued source, seeded from `sources.csv` |
| `artifact` | One row per distinct document **content** |
| `artifact_sighting` | Where and when that content was seen — many-to-one |
| `extraction` | One row per attempt, **including failures**, with the full gate report |
| `observation` | The fact table, long and narrow |
| `parameter` | Fitted output with P10/P50/P90 and observation counts — what the API serves |
| `synthesis_queue`, `records_request` | Work queues |

**Three decisions worth defending:**

**`artifact` and `artifact_sighting` are separate.** Identical bytes arrive from more than one source in this catalog — Novogradac mirrors state housing-agency documents, and DOT reports get re-hosted. Content dedups; sightings do not.

**`observation` is long and narrow, not wide.** The catalog spans `$/LB`, `$/stall`, `$/GSF`, `%/yr` and dimensionless indexes. A wide table would be almost entirely NULL. Source-specific extras go in `attrs jsonb`.

**Failed extractions are recorded.** `extraction.passed = false` rows with their gate reports are how you find out a template broke, and how you measure whether the LLM tier is any good.

Every `observation` carries `sha256`, `source_id`, `extraction_id`, `method` and `confidence`. That is not bookkeeping — publishing error statistics by typology and vintage is the project's stated differentiator, and it requires knowing exactly which document version produced every number.

---

## 3. Loading

```bash
export SUPABASE_DB_URL='postgresql://postgres:...@db.<ref>.supabase.co:5432/postgres'
export SUPABASE_S3_ENDPOINT='https://<ref>.storage.supabase.co/storage/v1/s3'
export SUPABASE_S3_ACCESS_KEY=... SUPABASE_S3_SECRET_KEY=...

psql "$SUPABASE_DB_URL" -f migrations/0001_init.sql
python3 seed_sources.py ../../research/construction-cost-data-sources/sources.csv
```

Seeding the real catalog classifies it as:

```
total 473   storable 426   watch-only (licence gate) 47

schedule buckets:  annual 229 | continuous 108 | monthly 62 | static 46 | quarterly 28
```

The 47 watch-only rows are correctly caught — RSMeans, Craftsman, Bid Express, Oman Systems, Shovels.ai, the MII unit price book. Those are **watched for change but their bytes are never retained**, because their terms bar redistribution and database use. The gate lives in the manifest, is re-checked in the fetch workflow, and is a column in the database, so no single mistake defeats it.

---

## 4. Gotchas that will actually bite

**1. RLS is not automatic for tables created in raw SQL.** The dashboard table editor enables it; `create table` does not. A table without RLS reachable through PostgREST is world-readable with the anon key. The migration enables it on all eight tables and grants a read policy on `parameter` only.

**2. `service_role` must never reach n8n.** It bypasses RLS entirely. The migration creates an `n8n_orchestrator` role that can move the queues and update watch timestamps and nothing else. The parser service holds `service_role`; the orchestrator does not.

**3. Pooler mode is not a detail.** Supavisor transaction mode (port 6543) suits n8n's short-lived queries. `COPY`, prepared statements and advisory locks need **session mode or a direct connection** (5432). Getting this wrong produces `prepared statement "..." already exists`, which reads like a bug in your code and is not.

**4. Never bulk-insert through PostgREST.** Fine for hundreds of rows, hopeless for millions. `load.py` uses `COPY` into a temp table then upserts. At bid-tab volume that is the difference between seconds and hours.

**5. Storage write precedes database write.** An orphaned object is harmless and reconcilable by listing the bucket. A database row pointing at nothing is a broken provenance chain, which is the one thing this design exists to prevent.

**6. Free-tier projects pause on inactivity.** Two of the three projects on this account are currently `INACTIVE`. An ingestion pipeline against a project that pauses will fail silently at 3am and you will find out weeks later. This needs a plan where the database stays up.

---

## 5. Where `pg_cron` replaces n8n

Supabase ships `pg_cron` and `pg_net`. For the ~30 pure-API sources — Socrata, ArcGIS, BLS, FRED, Census — a scheduled function can fetch and upsert with no orchestrator at all:

```sql
select cron.schedule('fred-monthly', '0 6 2 * *', $$
  select net.http_get(url := 'https://api.stlouisfed.org/fred/series/observations?...')
$$);
```

That is genuinely simpler and worth using. It does **not** extend to the ~180 PDF sources, which need the parser service — `pg_net` can fetch bytes but nothing in Postgres is going to run PyMuPDF over them. Split on that line rather than picking one tool for everything.

---

## 6. Partitioning

`observation` is unpartitioned on purpose. Convert to declarative LIST partitioning on `metric_family` when bid-item volume passes roughly 50M rows — plausible at 48 states × years — and not before. Partitioning an empty warehouse buys nothing and costs flexibility. The BRIN index on `created_at` carries you a long way first.
