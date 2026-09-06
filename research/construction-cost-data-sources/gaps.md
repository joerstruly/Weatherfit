# Open blind spots — register

A live list of what this catalog cannot yet answer, ranked by how much it moves a feasibility-level estimate. Every entry names what was already tried, so a later pass does not re-run the same searches.

Status values: **OPEN** (no usable source found), **PARTIAL** (a source exists but is stale, narrow or unvalidated), **CLOSED** (a usable source is catalogued), **UNCLOSABLE** (public data does not contain it; only a survey, a licence or a purchase will close it).

**Last pass:** round six, four Opus agents, ~175 searches. Four gaps closed or substantially closed, three confirmed unclosable, one dissolved by restructuring the model.

---

## Tier 1 — moves the estimate most

| # | Gap | Status | Where it stands |
|---|---|---|---|
| 1 | **Gross-to-net efficiency ratio** | **DISSOLVED** | Not closed — *removed*. The model needed the product `unit SF ÷ efficiency`, which is simply gross SF per unit, and that is directly observable at scale from assessor and benchmarking data (NYC PLUTO, Maryland CAMA, Maricopa Apartment Master, the Local Law 84 family). Efficiency is now a reported output and a sanity check, not an input. See the design note in `feasibility-model.md` §1. What remains is data engineering, not research. |
| 2 | **Forward escalation by metro** | **PARTIAL, much improved** | Five jurisdictions publish official dated forward rates: Maryland DBM, California DOF (which also defines the midpoint convention), San Francisco's AICCIE, Washington CPARB, Kansas OFPM. Federal deflator paths from USACE CWCCIS and the DoD Green Book bound it below. §8 of the model sets out the three-layer construction. **Metro resolution stays unfixable**: BLS stops at four Census regions with data only from Feb 2014, San Francisco is the only city publishing a forward curve, and only two state DOTs even attempt to forecast their own index. |
| 3 | **Typology differential** | **PARTIAL, much improved** | Eriksen and Orlando model marginal cost by story count across the 50 largest US cities and find non-linearities at the fourth and eighth stories — that is the curve this node needs. Abt's HUD study categorises 2,500-plus LIHTC projects into walk-up, low-rise, mid-rise and high-rise. California's cost study gives a usable coefficient: podium or subterranean parking adds 6% to cost per unit. All three need their PDFs opened and tables extracted. **Cost per SF by IBC construction type remains NOT FOUND from any primary source** — every clean Type V / III / I-A figure in circulation is marketing. |
| 4 | **Non-residential project cost data** | **PARTIAL** | MSBA's cost data (project, GSF, reconciled construction budget, total cost, 2019–2023) and GSA's prospectus library (total project cost plus GSF, fiscal-year filterable) are now the Tier A validation set. Permit valuation is usable only as a censored lower bound with a published caveat — see below. Office, retail and industrial project-level data beyond these remains thin. |
| 5 | **County-level composite location factor** | PARTIAL | Unchanged. DoD Area Cost Factors are the free composite; build the county layer from labour. |

### The permit valuation trap (found in round six, worth reading before using any permit data)

Declared permit valuation is a **fee basis, not a construction cost**. In jurisdictions applying the ICC Building Valuation Data table, the recorded valuation is computed as gross area × a published rate. Portland states in writing that its valuation is the greater of that formula output or the applicant's stated value, and **Oregon mandates the method statewide by administrative rule**. Where that binds, regressing declared value on square footage recovers the ICC fee table rather than the market — a circular result that would silently validate the model against a fee schedule.

Classify each jurisdiction as cost-of-work-declared versus table-derived before using any of it. Even where declared, limited public evidence puts it at one-third to one-half of actual cost. Only Austin, Boston and New York were confirmed to carry value, square footage and use type in one free table; Seattle and Chicago publish cost but **no square footage field at all**.

## Tier 2

| # | Gap | Status | Where it stands |
|---|---|---|---|
| 6 | **Impact fees after 2019** | PARTIAL | Florida Statutes §163.31801 requires every local government to report fee amounts by purpose and dwelling type in its annual financial report — the strongest state reporting statute found, and whether those schedules are extractable in bulk is now the highest-value open question here. Georgia DCA and Washington (BIAW, MRSC) give genuine post-2019 multi-jurisdiction comparisons. ImpactFees.org claims nationwide coverage but has no visible sponsor or methodology and **must be spot-checked against primary schedules before use**. Only four states index fees to inflation, so every fee figure needs its adoption date carried alongside it. |
| 7 | **A/E fee curves** | **CLOSED enough** | Massachusetts DCAMM publishes fee as a percentage of construction cost by complexity group and project size — exactly the needed artifact. Florida DMS ships an interactive calculator. Ohio OFCC, Washington OFM, Utah and Arizona fill in. Federal work is bounded by a 6% statutory ceiling. **AIA and ACEC confirmed to publish no such benchmark** — that is settled, not a search failure. |
| 8 | **Owner soft-cost percentages** | OPEN | No public agency publishes benchmark soft-cost percentages. Every result was vendor content with uncited 20–30% ranges. Washington OFM and Ohio OFCC impose a soft-cost *structure* without benchmark values. |
| 9 | **Productivity (labor hours per unit)** | UNCLOSABLE without a licence | Unchanged. Only 1996-era Navy P-405 and Army field manuals are public domain. |

## Tier 3 — phase two, design-development product

| # | Gap | Status | Where it stands |
|---|---|---|---|
| 10 | **Unit-in-place component costs** | **CLOSED — the round-six unlock** | State assessor manuals publish them free. Michigan's 2025 Volume II is Marshall & Swift/Boeckh **commercial** data published as public PDFs by a state treasury, with a 2014 edition still online for a time series; Iowa's Analyzed Unit Cost Schedule is an independent second opinion with unusually transparent method. Between them: elevators per stop, sprinklers per SF, CMU walls, joists, deck, foundations. **Three caveats**: they are replacement-cost-new for assessment, they carry an embedded overhead-and-profit loading that must be backed out, and **Michigan's underlying tables are Marshall & Swift copyright — a public PDF is not automatically redistributable.** |
| 11 | **Elevator new-install benchmark** | PARTIAL | Now bracketed honestly: Michigan assessor manual at $9,400–$14,400 per basement stop, University of Kentucky at $993,000 awarded against a $600,000 estimate for a parking-structure elevator, Garland VA at roughly $714k–$1.43M per elevator for full hospital replacement. **Massachusetts DCAMM filed sub-bids are the prize and are reachable** — elevators are a statutory filed sub-bid class, so every project yields an elevator-only amount — but they sit behind free BidExpress registration and need an authenticated crawl. Louisiana FP&C confirmed to hold *no* new-install tab; stop looking there. |
| 12 | **HVAC equipment prices** | **UNCLOSABLE** | Round six hardened this. Manufacturers publish no list prices (AAON, Bard, Modine, Reznor all confirmed negative); cooperatives publish a percentage off a list that is not public; **GSA has no pricing API for products** — CALC is labour rates on services schedules only — and no bulk product file. The GSA Advantage `ref_text` scrape is real and the deterministic `_online.htm` form works, but no HVAC or elevator manufacturer example was confirmed. **Design the schema so HVAC enters as $/ton or $/CFM installed from assembly-level sources, with equipment-only cost as a modeled fraction rather than a sourced field.** |
| 13 | **Commercial fire sprinkler benchmark** | **CONFIRMED ABSENT** | The NFPA studies are one- and two-family dwellings only. No commercial analogue exists. Remaining route: state legislative fiscal notes and building-code-council packets on sprinkler mandates, which general search cannot reach and which need per-state site-scoped queries. University of Wisconsin System's MEP-only bid tabulations are a cheap partial substitute. |
| 14 | **Joists, deck, precast, rebar, CMU** | Split | **Escalation is closed**: FRED carries a monthly PPI for short-span metal bar joists — exactly the category SJI refuses to price — plus rebar and fabricated steel. Levels come from DOT bid reports (now WisDOT, TxDOT and FDOT alongside SD DOT and Caltrans; FDOT's is quantity-weighted with a dashboard) and from state assessor manuals. Mill price levels stay private, but Nucor's quarterly tonnage and earnings disclosures let realized average selling price per ton be backed out from SEC-grade data. **SJI, PCI and CRSI confirmed to publish no dollar guidance** — do not re-search them. |
| 15 | **Distributor multiplier** | UNCLOSABLE without a survey | Unchanged. |

---

## Standing method notes

- **Verification tags.** `VERIFIED-DETAIL` means the specific number or field was seen; `VERIFIED-URL` means the URL is real but contents were not confirmed; `PARTIAL` means the source is confirmed but something in it is unresolved; `UNVERIFIED` means it was asserted in a snippet that could not be opened; `NOT-FOUND` and `VERIFIED-NEGATIVE` record dead ends so they are not re-searched. The original free-text qualifier is preserved in `verification_note`.
- **The sandbox blocks direct fetches.** Every research round ran with `WebFetch` and `curl` blocked for essentially all external hosts, so most of this catalog rests on search-result extraction. 313 of 473 rows are `VERIFIED-URL` against only 67 `VERIFIED-DETAIL`. **A fetch pass from an unblocked network is the single highest-value next action** — it would promote or demote most of the catalog and is a larger correctness risk than any individual missing source.
- **Negative findings are catalogued deliberately.** A confirmed absence stops the next pass spending budget on it.
- **Do not calibrate on contractor marketing.** Search engines surface per-square-foot figures on GC, broker and lead-generation sites, and several such figures are returned *attributed to Terner or other credible institutions* when they actually originate on marketing pages. Verify attribution on every number before use.

## Highest-value next actions

1. **A fetch pass from an unblocked network**, targeted at the documents whose tables are known to exist but were never opened: Abt's LIHTC building-type cost table, Eriksen and Orlando's cost-by-story curve, Massachusetts DCAMM's designer fee Table I, Kansas OFPM's forward cost projections, UFC 3-701-01 Table 4-2, the current CWCCIS forward tables, and Michigan Assessors Manual Volume II in full.
2. **Enumerate state assessor manuals.** Michigan, Iowa and California all republish this data in some form, so the pattern likely repeats across a dozen more states. This would close more of the component-cost layer than every other lead combined.
3. **Build the gross-SF-per-unit panel** from PLUTO, Maryland CAMA and the benchmarking disclosures, stratified by story count.
4. **An authenticated BidExpress crawl** of Massachusetts filed sub-bids, which yields elevator, glazing and other trade-package amounts across hundreds of projects.
