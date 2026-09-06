# Ingestion pipeline — plan

How the 473 catalogued sources become fitted model parameters, and where an LLM belongs in that.

**Headline:** there is a much more deterministic way to get data out of these PDFs than asking a model to read them, and it is also cheaper by about three orders of magnitude. The LLM's job is to **write the extraction recipe once**, not to read the numbers every time.

---

## 1. Why not just have an LLM read the PDFs

Three reasons, in order of how much they should bother you.

**It is unauditable.** The stated differentiator for this whole project is publishing error statistics — mean absolute percentage error by typology, metro tier and year, with observation counts. That claim requires knowing exactly where every number came from. "A model read it off page 14" is not a provenance chain you can defend to a lender.

**It is not reproducible.** Re-run the same document next quarter against a silently updated model version and you get a different number, with no diff to review. Every downstream fitted parameter shifts and nobody can say why.

**It fails silently and plausibly.** This is the one that actually costs you. A model that misreads `1,284,500` as `1,284,600` produces a number that looks entirely reasonable and passes every eyeball check. The prototype in `extract/` catches exactly this class of error — the negative test fixture has a **$800 discrepancy in an $8,064,073 total, 0.01%**, and it is rejected outright, because bid-tab arithmetic is exact and can be checked.

Cost is the least interesting reason, but it is stark. Synthesising a reusable template for every distinct layout in the catalog is roughly **$20–50, once**. Re-extracting every document with an LLM on every refresh is that much *per refresh cycle*, forever, and buys you worse data.

---

## 2. The deterministic ladder

Implemented and tested in `extract/ladder.py`. Try tiers in order; stop at the first that clears the gates.

| Tier | Method | When it works | Determinism |
|---|---|---|---|
| **0** | **Look for a sidecar** | An XLSX/CSV of the same data exists — MSBA, several DOTs, Socrata mirrors | Total. Always check first. |
| **1** | **Ruled tables** | Ruling lines present; recover cells from the line graph | Near-total |
| **2** | **Pinned template** | A version-controlled column geometry for this layout | Total, and diffs in git |
| **3** | **Stream / whitespace** | Cluster words by x-position to infer columns | Layout-sensitive; always gate |
| **4** | **OCR** | No text layer; add one, re-enter at tier 1 | Deterministic given fixed engine + version |
| **5** | **LLM** | Last resort — and only to *synthesise a tier-2 template* | Not deterministic; never trusted directly |

**Tier 2 is the workhorse and the whole trick.** A template is a small JSON object — page selector, column x-boundaries, header marker, stop marker, gate config (see `templates/dot_bid_item_v1.json`). It is written once per *layout*, not per document. A five-year DOT series with a stable layout is one template, not five extractions. Michigan's assessor manual has editions back to 2014 under the same design; one template reads all of them.

Note what the test output shows: on this fixture the pinned template **beat** the ruling-line extractor, which mis-associated the header and total rows. That is typical. Line-graph extraction is impressive on clean tables and erratic on real government layouts; a pinned geometry is boring and correct.

### Tooling

`PyMuPDF` alone covers tiers 1–3 and is already proven here. Add for production:

- `pdfplumber` and `camelot` (lattice + stream) as **independent second opinions** — agreement between two engines is a free confidence signal
- `ocrmypdf` / `tesseract` for tier 4; pin the version, it is part of the provenance
- `qpdf` for repair of malformed files, which government PDFs frequently are

---

## 3. The validation gates

In `extract/gates.py`. **Every tier is gated identically. No tier gets a discount, including the LLM tier.**

| Gate | What it catches |
|---|---|
| `column_count` + `shape_precondition` | Misaligned tables. On mismatch the run **fails** rather than skipping the column-indexed checks. |
| `numeric_parse_col{n}` | Currency symbols, footnote markers, merged cells. Requires ≥98% parse rate. |
| `row_arithmetic` | `quantity × unit_price == amount`, row by row. Catches column misalignment that every other check sails past. |
| `reconciles_to_stated_total` | Extracted amounts sum to the total printed on the document. |
| `unit_price_in_range` | `$/LB` for rebar outside `[0.20, 25.00]` is a parse error until proven otherwise. |

**Two gate bugs the test caught in my own first draft, both worth internalising:**

1. **Proportional tolerance hides whole rows.** A 0.05% tolerance on an $8M total is ±$4,000 — comfortably enough to swallow a missing line item. Reconciliation tolerance must be cents-scale and absolute, because the arithmetic on these documents is exact.
2. **A gate that weakens itself when data looks wrong is not a gate.** The first version skipped column-indexed checks when the shape did not match, so a 4-column mis-extraction "passed" on the row-count check alone. It now fails closed.

**The reconciliation gate is the domain insight.** Bid tabs, cost certifications and HUD-92331-B schedules all carry a stated total. That total is a free, exact checksum over the entire extraction, and almost nothing else in document processing gives you one. Build around it.

---

## 4. Where the LLM actually belongs

Four roles. None of them is reading a number into the warehouse.

**1. Routing.** Given the first page, which template applies — or is this a spec book with no cost table at all? High volume, cheap model, trivially verifiable.

**2. Template synthesis.** The important one. Deterministic tiers fail → send page text (or a page image) to the model → it returns a **candidate template JSON** → the pipeline re-runs the *deterministic* tier-2 extractor with that template → if the gates now pass, the template is committed to git behind review; if not, it goes to a human. The model never touches the output data. It proposes a recipe, and a deterministic run must then satisfy exact arithmetic before anything is accepted.

**3. Header and schema mapping.** `"Est. Const. Cost"` → `construction_cost`. Fuzzy string work models are genuinely good at, with a closed target vocabulary so the output is checkable.

**4. Triage.** When two deterministic engines disagree, or gates fail, summarise *why* for the human queue. Advisory only.

### If you must extract values with a model

For scanned one-offs with no stable layout, where a template will never be reused:

- Force a JSON schema (`response_format: {type: "json_schema", strict: true}`), and pin models that actually support strict mode
- **Two-model agreement.** Run two models from *different families* so errors decorrelate; accept only on exact numeric match. OpenRouter makes this a one-line change.
- Run the same gates. Arithmetic does not care where the number came from.
- Tag the rows `extraction_method = 'llm'` with lower confidence, so the fitting stage can down-weight or exclude them, and so you can measure whether they are worse

---

## 5. Architecture: n8n as control plane, Python as data plane

n8n schedules, watches, routes and alerts. It does not parse.

The reason is specific, not snobbery. Parsers need golden-file tests, readable diffs, and the ability to be re-run across five years of archived documents after a bug fix. In n8n that logic lives inside Code nodes — which means your real logic sits in a JSON blob with no test harness and an unreviewable diff. Also, n8n passes binary through the node chain; a 40 MB scanned manual will hurt.

**Pass S3 keys between nodes, never file bytes.**

```
                    ┌──────────────── n8n ────────────────┐
  sources.csv ─────▶│ W1 Watch    (schedule per cadence)  │
   (the manifest)   │ W2 Fetch    → object store + hash   │
                    │ W3 Extract  → HTTP → parser service │──▶ parser svc
                    │ W4 Synthesise template (OpenRouter) │    (FastAPI,
                    │ W5 Records-request queue (human)    │     PyMuPDF,
                    │ W6 Refit + publish                  │     gates)
                    └─────────────────────────────────────┘
                                    │
                        raw artifacts (immutable, hashed)
                                    │
                        warehouse (Postgres / DuckDB)
                                    │
                        fitted parameters ──▶ read API
```

**`sources.csv` is already the manifest.** Its columns map straight onto pipeline behaviour, which is why the catalog was worth building in this shape:

| Column | Drives |
|---|---|
| `url` | fetch target |
| `format` + `access_method` | which connector (Socrata / ArcGIS / HTTP+PDF / authenticated crawl) |
| `cadence` | which schedule bucket — annual sources do not need nightly polling |
| `license` | **hard gate** on whether an artifact may be stored, or only referenced |
| `verification` | whether the row is build-ready or still a lead |

The `license` gate matters and should be enforced in code, not remembered by a person: several rows are subscription or ToS-restricted, and RSMeans terms bar redistribution and database use outright.

### The workflows

| # | Workflow | Trigger | Does |
|---|---|---|---|
| **W1** | Watch | Schedule, one per cadence bucket | `GET`/`HEAD` each URL, hash body, compare to last seen; on change enqueue W2. Alerts on 404 — dead sources are findings, and this catalog has already seen sources vanish. |
| **W2** | Fetch & archive | Queue from W1 | Download → object store keyed by content hash → insert `artifact` row. **Never parse here.** |
| **W3** | Extract | Queue from W2 | `POST /extract {artifact_id, template_id?}` → rows + gate report → pass: load to warehouse; fail: W4. |
| **W4** | Template synthesis | Gate failure | OpenRouter → candidate template → re-run W3 deterministically → pass: open PR; fail: human queue. |
| **W5** | Records requests | Manual / schedule | Generate templated public-records requests (HUD Handbook 7460.8 guarantees a housing authority *holds* the abstract, but you have to ask), track responses, chase. Genuinely human-in-the-loop, and the one place n8n is unambiguously the right tool. |
| **W6** | Refit | After a load batch | Re-fit parameters, recompute bands and observation counts, publish. |

### n8n operational notes

- **Self-host.** `Execute Command` is self-hosted only, and you want your own network egress anyway.
- **Queue mode + Redis** for concurrency; a single-process n8n will serialise the whole crawl.
- **Prune execution data** (`EXECUTIONS_DATA_PRUNE`, `EXECUTIONS_DATA_MAX_AGE`) or Postgres bloats fast at this volume.
- **Export workflows to git in CI** (`n8n export:workflow --all`). The UI is not source of truth.
- Raise `N8N_PAYLOAD_SIZE_MAX` only as a stopgap — if you are hitting it, you are passing bytes where you should pass keys.

### OpenRouter notes

- OpenAI-compatible: `POST https://openrouter.ai/api/v1/chat/completions`. In n8n use an HTTP Request node, or the OpenRouter credential against the AI nodes.
- `models: [...]` gives automatic fallback routing; `provider: {order, allow_fallbacks}` pins where inference runs, which matters if you care about data handling.
- Structured outputs via `response_format` — **support varies by model**, so pin models that implement strict mode rather than assuming.
- OpenRouter also offers server-side PDF parsing plugins with selectable engines (a cheap text extractor and paid OCR options). Useful for tier 4/5. **Verify the current parameter names against their docs** — that surface has moved more than once.
- Send `HTTP-Referer` and `X-Title` for attribution, and read exact spend from the generation-stats endpoint rather than estimating.

**Model choice.** Template synthesis is rare, hard and high-leverage — use a strong model; Claude Opus 5 is $5/$25 per MTok first-party. Routing and header mapping are high-volume and easy — Claude Haiku 4.5 at $1/$5 is the right shape. For two-model value-extraction cross-checks, deliberately pick *different families* so the errors are uncorrelated; two runs of the same model agreeing tells you very little. OpenRouter's rates carry a margin over first-party, so price the real thing before committing.

---

## 6. Cost

The asymmetry is the whole argument.

| Approach | Scale | Rough cost |
|---|---|---|
| **Template synthesis** (recommended) | ~180 PDF sources, perhaps 60 distinct layouts, ~50k input tokens each | **~$20–50 one time**, then near-zero forever |
| **LLM-extract every document, every refresh** | Same sources × 10–40 pages × several refreshes a year | Hundreds of dollars a year, **and non-reproducible, and unauditable** |

The cheap option is also the correct one. That is not usually true and it is worth not overthinking.

---

## 7. Build order

| Phase | Work | Effort |
|---|---|---|
| **0** | **Fetch prober.** Walk all 473 URLs; record status, content-type, size, hash, redirects. Promotes or demotes 313 `VERIFIED-URL` rows and tells you what is Cloudflare-walled or JS-only *before* you write parsers. | 0.5 day |
| **1** | Object store + `artifact` table + W1/W2. Watch and archive only, no parsing. Start accumulating history immediately — it is the one thing you cannot backfill. | 2–3 days |
| **2** | Parser service wrapping `extract/`, plus templates for the ten highest-value sources (SD DOT, WisDOT, FDOT, MSBA, Michigan Vol II, Iowa AUCS, DoD ACF, HFA lists). | 1 week |
| **3** | Structured connectors — Socrata, ArcGIS, BLS/FRED/Census. Easy and high-yield; ~30 sources. | 3–4 days |
| **4** | W4 template synthesis with OpenRouter + PR-based template review. | 3 days |
| **5** | W5 records-request queue. | 2 days |
| **6** | Warehouse schema, fitting, read API serving parameters with bands and provenance. | 2 weeks |

**Start with phase 0 and phase 1 even if nothing else gets built.** Sources disappear — the Washington escalation committee disbanded in February, the Duncan fee survey is discontinued — and an archive you did not start last year is one you cannot have.

---

## 8. What is in this directory

```
extract/ladder.py     tiers 1-3, tested
extract/gates.py      validation gates, tested, fails closed
templates/            version-controlled column geometries
tests/make_fixture.py synthetic DOT bid tabs: ruled, stream, and a bad-total negative
tests/test_ladder.py  proves a wrong extraction is REJECTED, not just that a right one works
n8n/                  workflow skeletons
```

Run `python3 tests/make_fixture.py && python3 tests/test_ladder.py`.

**Caveat on the prototype:** the fixtures are synthetic, built to mimic the layouts described in the catalog. The ladder and the gates are real and tested; they have not yet met an actual government PDF, because this research environment has no network egress. Phase 0 is where that gets settled.
