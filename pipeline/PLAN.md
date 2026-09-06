# Construction Cost Platform — Build Plan

**Status:** planning. Nothing has been provisioned. No Supabase project has been touched.
**Research inputs:** `research/construction-cost-data-sources/` — 473 catalogued sources, 24 research appendices, a model spec and a gaps register.
**Working code in this directory:** a tested deterministic PDF extractor, validation gates, an importable n8n workflow, and a Supabase schema — all reference implementations for this plan, none deployed.

---

## 1. What is being built

A **feasibility-level construction cost model** for US commercial and multifamily development — garden, podium, wrap, build-to-rent, office, retail, industrial.

The input is a site, a program and a massing assumption. The output is a total development cost with a published uncertainty band. In estimating terms this is AACE **Class 5 and Class 4**, not Class 3 through 1.

**This is not an RSMeans clone, and that is the central design decision.** Unit-price line items belong to estimates that have drawings and quantities behind them. At Class 5 the error is dominated by six things, none of which is a unit price:

1. Typology and construction type — really a building-code question
2. Parking scheme — surface, structured and subterranean are three different cost regimes
3. Escalation to the construction midpoint, typically 12–36 months out
4. Location
5. Gross square feet per unit
6. Contingency — at this class an honest statement of undefined scope, not a rounding allowance

Precision on the price of a linear foot of conduit is irrelevant when those six carry the variance.

### The defensible differentiator

**Publish the model's own error statistics.** Mean absolute percentage error by typology, metro tier and year, with the observation count behind every cell.

No incumbent does this. RSMeans publishes location factors with no public validation against bids, and this research found no GAO, state DOT or academic study validating them spatially. A model that ships its error bars is more defensible to a lender or equity partner than a more granular model that ships none.

That single commitment drives most of the architecture below: it is why provenance is tracked to the document version, why extraction must be reproducible, and why an LLM is never allowed to read a number into the warehouse.

---

## 2. The model

Full specification: `research/construction-cost-data-sources/feasibility-model.md`.

```
Units, GSF per Unit  (measured directly — see §2.2)
        └─> Residential GSF = Units × GSF per Unit

Hard Cost =
      Shell            GSF × $/GSF(typology, metro, quality)
    + Parking          Stalls × $/stall(structure type, metro)
    + Site / offsite   Acres × $/acre  OR  % of shell
    + Amenity / FF&E   $/unit
    + GC markups       (general conditions + fee + insurance + bonds) as % of direct
    × Location factor
    × Escalation       (1 + e)^(months to construction midpoint ÷ 12)
    + Design contingency

Total Development Cost =
      Land + Hard Cost + Soft Cost + Financing + Developer Fee + Owner Contingency
```

Report **P10, P50 and P90**. A single number at Class 5 is a false claim.

### 2.1 Cost breakdown structure

**UNIFORMAT II (ASTM E1557)** at the parametric level — elemental, which is how feasibility estimates are actually reasoned about. The standard is paid but the full element list is free from Connecticut DAS and NIST, so it can be adopted without a licence. For multifamily, mirror **HUD-92331-B** so housing-agency data loads without a mapping layer. MasterFormat stays an optional drill-down for a later design-development product.

### 2.2 The efficiency ratio was dissolved, not solved

The obvious formulation is `cost/unit = cost/SF × unit SF ÷ efficiency`. That is a trap: no institutional gross-to-net dataset exists for US multifamily — not from NMHC, NAHB, ULI, or any large practice. The only figures in circulation are a single undated trade article.

But the model does not need efficiency. It needs the product `unit SF ÷ efficiency`, and that **is** gross square feet per unit — directly observable, free, at scale, from assessor and benchmarking data that carries gross building area and residential unit count on the same record. NYC PLUTO alone covers ~860,000 tax lots with `BldgArea`, `UnitsRes` and `NumFloors`.

So the model measures GSF per unit, stratified by story count, and reports efficiency as an *output* and sanity check. The same stratifier also attacks the typology node.

**A warning that applies to every efficiency figure in the literature:** net-assignable-to-gross, net-rentable-to-gross, usable-to-gross and REBNY loss factor are four different ratios that published sources mix freely. Pick one definition, state it, hold it. Mixing them is a larger error than the dispersion within any one.

### 2.3 Ranked model risk — this is the build priority

| # | Node | State |
|---|---|---|
| 1 | **Escalation to midpoint** | Improved. Five jurisdictions publish official dated forward rates — Maryland DBM, California DOF, San Francisco AICCIE, Washington CPARB, Kansas OFPM — bounded below by USACE CWCCIS and the DoD Green Book. **Metro resolution stays unfixable**: BLS stops at four Census regions with data only from Feb 2014, and San Francisco is the only city publishing a forward curve. |
| 2 | **Typology / construction type** | Partly addressable. Eriksen & Orlando model marginal cost by story count across the 50 largest cities and find non-linearities at the 4th and 8th stories. Abt's HUD study categorises 2,500+ LIHTC projects by building type. Both need their PDFs opened and tables extracted. |
| 3 | ~~Efficiency ratio~~ | **Resolved by reparameterisation.** Now data engineering, not research. |
| 4 | **Parking** | Well sourced nationally (WGI: 2026 median $33,300/space), thin per-metro. Above/below-grade split rests on one 2026 study of 17 cities. |
| 5 | **Location factor** | DoD Area Cost Factors are the free composite and publish their basket. Build the county layer from labour, which is already solvable to county. |
| 6 | **Soft costs and fees** | Impact fees vary by an order of magnitude; the national survey stopped in 2019. |

### 2.4 Escalation: build it in three layers

1. **Method and timing.** AACE 68R-11, implemented with California DOF Budget Letter 26-03's convention: escalate to the **construction midpoint = start + half the duration**, compounding monthly. That letter gives a citable public-agency definition.
2. **Forward national rate, bracketed not pointed.** Median of a dated panel of official state assumptions, bounded below by federal deflator paths and above by free private national indexes. Maryland's revision from 10%/7.5%/5% down to 4.5%/5.0%/3.5% within six months *is* the honest expression of forecaster disagreement. **Report a range, not a number.**
3. **Geography as a bounded spread.** No free forward metro index exists, so do not manufacture one. Apply the trailing region-vs-national PPI spread, blend Mortenson's trailing metro spread where covered, and **cap the total geographic adjustment at ~1–1.5 points**. With four regions and no metro data the geographic signal is far weaker than the national-rate uncertainty; an uncapped adjustment lets the worst-supported layer dominate.

Where a jurisdiction publishes its own official rate, use it directly and skip the synthesis.

---

## 3. The data

Catalogued in `research/construction-cost-data-sources/sources.csv` — 473 rows, 20 columns.

| Dimension | Distribution |
|---|---|
| Tier | 165 tier-1 (open/structured), 263 tier-2 (public, parse required), 22 tier-3 (ToS-restricted), 23 tier-4 (licensable) |
| Format | ~180 PDF-primary, ~30 true APIs, remainder HTML/XLSX/CSV |
| Cadence | 229 annual, 108 continuous, 62 monthly, 46 static, 28 quarterly |
| Verification | 67 `VERIFIED-DETAIL`, 313 `VERIFIED-URL`, 49 `PARTIAL`, 25 `UNVERIFIED`, 17 negative/not-found |

### What the catalog established

- **State DOT bid tabulations** are the deepest free localised transaction source — 48 states, Texas fully open as Socrata, Caltrans queryable and scrapeable, FDOT quantity-weighted with a dashboard.
- **State assessor cost manuals** are the component-cost unlock. Michigan publishes Marshall & Swift/Boeckh *commercial* data free as public PDFs — elevators per stop, sprinklers per SF, CMU, foundations — with a 2014 edition still online for a time series. Iowa's schedule is an independent second opinion with unusually transparent method.
- **Two systemic unlocks for trade pricing.** HUD Handbook 7460.8 Ch. 6 guarantees every HUD-funded housing authority *holds* an all-bidder abstract with alternates, making records requests a reliable national fallback. Illinois 30 ILCS 500 Art. 30 forces subcontractor names and prices onto single-prime higher-education bids over $250,000 — through 31 Dec 2026 only.
- **Labour is solvable to county** from OEWS, QCEW, Davis-Bacon, state prevailing wage and QWI. **Equipment is essentially free** (Caltrans, FEMA, USACE, EIA).

### Two traps recorded so they are not walked into

**Permit valuation is a fee basis, not a cost.** Where the ICC Building Valuation Data table is adopted, declared valuation *is* gross area × a published rate. Portland states this in writing; **Oregon mandates the method statewide by administrative rule.** Regressing cost on area there recovers the ICC fee table, not the market — the model would validate cleanly against a fee schedule and nobody would notice. Classify each jurisdiction as cost-of-work-declared versus table-derived first. Only Austin, Boston and New York were confirmed to carry value, square footage and use type together; Seattle and Chicago publish cost with **no square-footage field at all**. Census discontinued non-residential permit collection in **1995**.

**Search engines attribute contractor marketing to credible institutions.** Several per-square-foot figures surfaced *as Terner Center numbers* actually originate on lead-generation sites. Verify attribution on every figure before it enters the model.

### Confirmed unclosable — stop spending on these

Model-level HVAC equipment prices (no manufacturer list, no GSA product pricing API, no bulk file — model HVAC as installed $/ton with equipment as a fraction); commercial fire sprinkler benchmarks; dollar guidance from SJI, PCI and CRSI; AIA/ACEC fee-as-percent benchmarks; productivity hours-per-unit without a Craftsman-style licence; distributor multipliers without a survey.

Full register with statuses and what was already tried: `research/construction-cost-data-sources/gaps.md`.

---

## 4. Architecture

```
                    ┌──────────────── n8n (control plane) ────────────┐
  sources.csv ─────▶│ W1 Watch      schedule per cadence bucket       │
   (the manifest)   │ W2 Fetch      → Supabase Storage + content hash │
                    │ W3 Extract    → HTTP → parser service           │──▶ parser service
                    │ W4 Synthesise template (OpenRouter)             │    FastAPI + PyMuPDF
                    │ W5 Records-request queue (human in the loop)    │    + validation gates
                    │ W6 Refit + publish                              │
                    └─────────────────────────────────────────────────┘
                                        │
                    Supabase Storage — raw artifacts, immutable, hash-keyed
                                        │            ▲ source of truth
                    Supabase Postgres — manifest, extractions, observations
                                        │            ▲ rebuildable
                    parameter table ──▶ read API  (serves fitted values, not sources)
```

### Four principles

**1. The API serves parameters, not sources.** `GET /params?typology=podium&county=48453&midpoint=2027-09` returns a rate, a band, an observation count and a source vintage. On-demand source fetching is the wrong shape — ~170 sources update annually or slower, so it would re-download a document that last changed eleven months ago, and a fitted parameter cannot be derived from one live fetch anyway.

**2. Acquire, parse, normalise and fit are strictly separated.** Raw artifacts are stored immutably before anything parses them, because parsers will be wrong and need re-running across years of archive, and because sources vanish.

**3. n8n orchestrates; Python parses.** Parsers need golden-file tests, readable diffs and re-runnability. Inside n8n Code nodes that logic becomes an untested JSON blob. n8n also passes binary through the node chain, and plenty of these documents exceed 10 MB. **Pass object keys between nodes, never bytes.**

**4. `sources.csv` is the manifest.** `format` + `access_method` select the connector, `cadence` selects the schedule, `license` hard-gates whether bytes may be retained.

---

## 5. Extraction

Working reference implementation: `extract/ladder.py`, `extract/gates.py`, tested by `tests/test_ladder.py`.

### 5.1 The deterministic ladder

Try in order; stop at the first tier that clears the gates.

| Tier | Method | Determinism |
|---|---|---|
| 0 | **Sidecar** — a machine-readable version of the same data exists | Total. Always check first. |
| 1 | **Ruled tables** — recover cells from the ruling-line graph | Near-total |
| 2 | **Pinned template** — version-controlled column geometry | Total, and diffs cleanly in git |
| 3 | **Stream** — cluster words by x-position | Layout-sensitive; always gate |
| 4 | **OCR** — add a text layer, re-enter at tier 1 | Deterministic given pinned engine version |
| 5 | **LLM** — only to *synthesise a tier-2 template* | Never trusted directly |

**Tier 2 is the workhorse and the whole trick.** A template is a small JSON object — column x-boundaries, header marker, stop marker, gate config — written once per **layout**, not per document. A five-year DOT series is one template. Michigan's assessor manual has editions back to 2014 under one design; one template reads all of them.

Worth noting from the test run: the pinned template **beat** ruling-line recovery, which mis-associated the header and total rows. That is typical — line-graph extraction is impressive on clean tables and erratic on real government layouts.

### 5.2 Validation gates

Applied identically to every tier, **including the LLM tier**.

| Gate | Catches |
|---|---|
| `column_count` + `shape_precondition` | Misalignment. On mismatch the run **fails** rather than skipping later checks. |
| `numeric_parse_col{n}` | Currency symbols, footnote markers, merged cells. Requires ≥98%. |
| `row_arithmetic` | `quantity × unit_price == amount`, row by row. Catches misalignment everything else sails past. |
| `reconciles_to_stated_total` | Extracted amounts sum to the document's own printed total. |
| `unit_price_in_range` | `$/LB` for rebar outside `[0.20, 25.00]` is a parse error until proven otherwise. |

**Reconciliation is the domain insight.** Bid tabs, cost certifications and HUD-92331-B schedules all carry a stated total — a free, exact checksum over the whole extraction. Almost nothing else in document processing gives you one.

**Two gate bugs the tests caught in the first draft, both worth keeping in mind:**

- **Proportional tolerance hides whole rows.** 0.05% of an $8M total is ±$4,000 — enough to swallow a line item. Reconciliation tolerance must be absolute and cents-scale; this arithmetic is exact.
- **A gate that weakens itself when data looks wrong is not a gate.** The first version skipped column-indexed checks on a shape mismatch, so a 4-column mis-extraction passed on row count alone. It now fails closed.

The negative test fixture carries an **$800 discrepancy in an $8,064,073 total — 0.01%** — and no tier is permitted to accept it. That is precisely the error an LLM produces and no reviewer catches by eye.

### 5.3 Where the LLM belongs

Four roles. None is reading a number into the warehouse.

1. **Routing** — which template applies, or is this a spec book with no cost table?
2. **Template synthesis** — the important one. Gates fail → model returns a **candidate geometry** → the *deterministic* parser re-runs with it → gates pass → template lands via pull request. A hallucinated boundary produces a failed gate, not a bad row.
3. **Header mapping** — `"Est. Const. Cost"` → `construction_cost`, against a closed target vocabulary.
4. **Triage** — explain gate failures for the human queue. Advisory only.

If values must be model-extracted (scanned one-offs with no reusable layout): force a strict JSON schema, require **two-model agreement across different families** so errors decorrelate, run the same gates, and tag the rows `method = 'llm'` with lower confidence so fitting can down-weight them and you can measure whether they are worse.

Request shape and guardrails: `n8n/W4_template_synthesis.md`.

---

## 6. Storage and data model

Full schema: `supabase/migrations/0001_init.sql`. Rationale and traps: `supabase/README.md`.

| Store | Holds | Role |
|---|---|---|
| **Supabase Storage** | Raw artifacts, immutable, keyed by SHA-256 | **Source of truth** |
| **Supabase Postgres** | Manifest, extractions, observations, parameters | Rebuildable from Storage |

If only one store can be protected, protect the bucket. Content hash as key gives dedup, change detection and version history for free.

| Table | Grain |
|---|---|
| `source` | One row per catalogued source, seeded from `sources.csv` |
| `artifact` | One row per distinct document **content** |
| `artifact_sighting` | Where and when that content was seen — many-to-one |
| `extraction` | One attempt, **including failures**, with the full gate report |
| `observation` | The fact table, long and narrow |
| `parameter` | Fitted output with P10/P50/P90 and observation counts |

**Three decisions worth defending.** `artifact` and `artifact_sighting` are separate because identical bytes arrive from multiple sources — Novogradac mirrors state housing-agency documents. `observation` is long and narrow because the catalog spans `$/LB`, `$/stall`, `$/GSF`, `%/yr` and dimensionless indexes; a wide table would be nearly all NULL. Failed extractions are recorded because that is how a broken template is found and how the LLM tier is measured.

Every observation carries `sha256`, `source_id`, `extraction_id`, `method` and `confidence` — the precondition for publishing error statistics.

### Licence gate

Run against the real catalog the classifier gives **426 storable, 47 watch-only**, correctly catching RSMeans, Craftsman, Bid Express, Oman Systems, Shovels.ai and the MII price book. Those are watched for change but their bytes are never retained. The gate lives in the manifest classifier, the fetch workflow and a database column, so no single mistake defeats it.

### Operational traps

1. **RLS is not automatic for tables created in raw SQL.** Without it, anything reachable through PostgREST is world-readable with the anon key.
2. **`service_role` must never reach n8n.** A least-privilege `n8n_orchestrator` role moves the queues and nothing else.
3. **`COPY` needs session mode**, not Supavisor transaction mode — the usual cause of `prepared statement already exists`.
4. **Never bulk-insert through PostgREST.** COPY into a temp table, then upsert.
5. **Storage write precedes database write.** An orphan object is reconcilable; a row pointing at nothing is a broken provenance chain.
6. **Free-tier projects pause on inactivity.** A pipeline against a paused project fails silently at 3am.

### Where `pg_cron` replaces n8n

For the ~30 pure-API sources — Socrata, ArcGIS, BLS, FRED, Census — `pg_cron` + `pg_net` do the whole job in-database with no orchestrator. That does not extend to the ~180 PDF sources; nothing in Postgres will run PyMuPDF. Split on that line rather than forcing one tool across both.

---

## 7. Build phases

| Phase | Work | Effort |
|---|---|---|
| **0** | **Fetch prober.** Walk all 473 URLs; record status, content-type, size, hash, redirects. Promotes or demotes the 313 `VERIFIED-URL` rows and reveals what is Cloudflare-walled or JS-only *before* any parser is written. | 0.5 day |
| **1** | Supabase project, schema, buckets. W1/W2 — watch and archive only, no parsing. **Start accumulating history immediately; it is the one thing that cannot be backfilled.** | 2–3 days |
| **2** | Parser service wrapping `extract/`, plus templates for the ten highest-value sources: SD DOT, WisDOT, FDOT, Caltrans, MSBA, Michigan Vol II, Iowa AUCS, DoD ACF, HFA application lists, GSA prospectus library. | 1 week |
| **3** | Structured connectors — Socrata, ArcGIS, BLS/FRED/Census. ~30 sources, easy and high-yield. Consider `pg_cron` here rather than n8n. | 3–4 days |
| **4** | W4 template synthesis via OpenRouter, with PR-based template review. | 3 days |
| **5** | W5 records-request queue — HUD 7460.8 abstracts, Illinois Art. 30 disclosures. | 2 days |
| **6** | Warehouse fitting, validation protocol, read API serving parameters with bands and provenance. | 2 weeks |

**Phases 0 and 1 are worth doing even if nothing else gets built.** An archive not started this year is one you cannot have next year.

### The parallel research track

Independent of the pipeline, and cheap:

1. **A fetch pass from an unblocked network** against documents whose tables are known to exist but were never opened — Abt's LIHTC building-type table, Eriksen & Orlando's cost-by-story curve, Massachusetts DCAMM's designer fee Table I, Kansas OFPM's forward projections, UFC 3-701-01 Table 4-2, Michigan Vol II in full.
2. **Enumerate state assessor manuals.** Michigan, Iowa and California all republish this data; the pattern likely repeats across a dozen more states. This closes more of the component-cost layer than every other lead combined.
3. **Build the GSF-per-unit panel** from PLUTO, Maryland CAMA and the energy-benchmarking disclosures, stratified by story count.
4. **An authenticated BidExpress crawl** of Massachusetts filed sub-bids — elevators are a statutory bid class, so every project yields an elevator-only amount.

---

## 8. Cost

| Item | Scale | Estimate |
|---|---|---|
| **LLM template synthesis** | ~60 distinct layouts × ~50k input tokens | **$20–50 one time**, then near-zero |
| LLM per-document extraction *(rejected)* | 180 sources × 10–40 pages × N refreshes/yr | Hundreds per year, **and non-reproducible and unauditable** |
| Supabase | Raw archive likely tens of GB; DB modest until bid-item volume grows | Paid plan required — the DB must not idle-pause |
| n8n | Self-hosted, queue mode + Redis | Infrastructure only |

Model choice: a strong model for template synthesis (rare, hard, high leverage); a cheap one for routing and header mapping (high volume, easy, checkable); two **different families** for any value cross-check, because the same model agreeing with itself proves nothing. OpenRouter adds a margin over first-party rates — price the actual route before committing.

**The cheap option is also the correct one here**, which is unusual enough not to overthink.

---

## 9. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **313 of 473 rows are `VERIFIED-URL` only** — URL real, contents unconfirmed | **Highest.** Larger than any missing source. Every research round ran with fetches blocked, so most of the catalog rests on search-result extraction. | Phase 0. Half a day. |
| Sources disappear | High — already observed twice | Phase 1 archive, started early |
| Permit valuation is circular where ICC BVD is adopted | High — would silently validate against a fee table | Classify jurisdictions before use; Tier D with a published caveat |
| Template drift between editions | Medium | Gates fail closed; W4 re-synthesises; flag sources needing repeated new templates |
| Escalation forecast disagreement | Medium — 1.5 points ≈ 3–5% of hard cost at a 24–36 month midpoint | Report a range from a dated panel, never a point |
| Licence breach | Medium — legal, not technical | Three-layer gate; 47 sources watch-only |
| Marshall & Swift copyright inside public state manuals | Medium | A public PDF is not automatically redistributable — resolve before republishing derived values |
| Bid-item row volume | Low, later | Partition `observation` on `metric_family` past ~50M rows, not before |

---

## 10. Decisions still open

1. **Which Supabase project**, or a new one. Nothing has been applied. Two of the three existing projects are paused.
2. **Whether phase 0 runs from your infrastructure** — this environment has no network egress, so the prober must run elsewhere.
3. **Whether to buy a Craftsman-style productivity licence**, which is the only route to labour hours per unit and is the gate on ever moving beyond feasibility class.
4. **Where the read API lives** — Supabase Edge Functions, or a separate service alongside the parser.

---

## Appendix — file map

```
research/construction-cost-data-sources/
  README.md            source index, procurement channels, build order, gaps
  feasibility-model.md the model specification
  gaps.md              ranked open blind spots, what was tried, what would close it
  sources.csv          473 sources × 20 columns — also the ingestion manifest
  appendix/            24 underlying research reports

pipeline/
  PLAN.md              this document
  README.md            ingestion design detail
  extract/ladder.py    tiers 1-3, tested
  extract/gates.py     validation gates, tested, fail closed
  templates/           version-controlled column geometries
  tests/               synthetic fixtures incl. a bad-total negative
  n8n/                 importable W1-W3 workflow, W4 design
  supabase/            schema, seed script, COPY loader
```

Run the extractor tests: `cd pipeline && python3 tests/make_fixture.py && python3 tests/test_ladder.py`
