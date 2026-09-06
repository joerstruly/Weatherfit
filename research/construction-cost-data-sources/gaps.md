# Open blind spots — register

A live list of what this catalog cannot yet answer, ranked by how much it moves a feasibility-level estimate. Every entry names what was already tried, so a later pass does not re-run the same searches.

Status values: **OPEN** (no usable source found), **PARTIAL** (a source exists but is stale, narrow or unvalidated), **CLOSED** (a usable source is catalogued), **UNCLOSABLE** (public data does not contain it; only a survey, a licence or a purchase will close it).

---

## Tier 1 — moves the estimate most

| # | Gap | Status | What we have | What was already tried | What would close it |
|---|---|---|---|---|---|
| 1 | **Gross-to-net efficiency ratio and average unit size** | OPEN | One undated trade article: commercial 82–85%, apartments 70–75%, efficient garden ≥82% | NMHC, NAHB, ULI, KTGY, Humphreys, Dahlin, Niles Bolton, BSB Design — none publishes one | A dataset carrying gross building area and unit count for the same asset, at scale. Assessor/CAMA and REIT disclosures are the untested routes. |
| 2 | **Forward escalation by metro** | PARTIAL | BLS PPI 236500 (4 Census regions) and 236400 (contractor type × region) for history; national narrative forecasts from Turner, RLB, T&T, JLL; Mortenson per-metro quarterly deltas | The five free publishers | Any official per-state or per-agency escalation assumption, or a fitted regional model with a published error band. Forecasts currently disagree by ~1.5 points, which is 3–5% of hard cost at a 24–36 month midpoint. |
| 3 | **Typology differential (garden / podium / wrap / high-rise)** | PARTIAL | Harvard JCHS: high-rise concrete ≈ $75/SF above six-story stick-on-podium. Terner DC: 5-over-2/3 ≈ $138/GSF, high-rise $180–$220/GSF. RAND for definitions and the California mix. | Contractor and A/E blogs, which circulate per-door figures that are marketing rather than data | A study that regresses cost on construction type or story count, or enough project-level data to fit one. |
| 4 | **Non-residential project-level cost data** | OPEN | Vendor benchmark reports only ($/SF by typology from RLB, C&W, JLL, CBRE, T&T) | Never researched — the budget ran out first | Permit valuation datasets, public-owner capital budgets, or economic development incentive disclosures. |
| 5 | **County-level composite location factor** | PARTIAL | DoD Area Cost Factors (free, published basket, ~213 CONUS locations); BEA Regional Price Parities as a sanity check | RSMeans publishes ZIP3 factors but no free extract exists and no public validation of them against bids was found | Build it from the labor layer, which is already solvable to county, plus a material basket. |

## Tier 2 — matters, but the estimate survives a wide band

| # | Gap | Status | Note |
|---|---|---|---|
| 6 | **Impact and development fees after 2019** | PARTIAL | Duncan Associates' survey stopped in 2019 and appears discontinued. California is well covered through HCD's statutory postings and Terner. Nothing multi-jurisdiction elsewhere. |
| 7 | **A/E fee curves** | PARTIAL | Washington OFM, Utah DFCM and Arizona ADOA publish fee as a percentage of construction by type and size. No current AIA or ACEC benchmark and no GSA fee guide was found. |
| 8 | **Productivity (labor hours per unit)** | UNCLOSABLE without a licence | Only 1996-era Navy P-405 and Army field manuals are public domain. NECA, MCAA, Craftsman and RSMeans are all copyrighted. Craftsman is the one publisher with a formal bulk-data licensing programme. |

## Tier 3 — phase two, design-development product

| # | Gap | Status | Note |
|---|---|---|---|
| 9 | **HVAC equipment prices** | OPEN | The biggest structural blind spot in the material layer. Cooperative contracts publish a percentage off a manufacturer list that is itself not public. Best remaining lead is the GSA Advantage `ref_text/<contract>/` file convention. |
| 10 | **Elevator new-install benchmark** | OPEN | Isolated awards only. Massachusetts filed sub-bids include an elevator class, which is the strongest untested route. |
| 11 | **Commercial fire sprinkler and fire alarm** | OPEN | The NFPA/Newport study is residential and stopped in 2013. No commercial equivalent exists. |
| 12 | **Precast, joists, deck, CMU, brick, fabricated steel $/ton** | OPEN | PCI, SJI, SDI and CRSI publish no dollar guidance. State DOT bid tabs cover rebar and structural steel by weight but not fabricated-and-erected building steel. |
| 13 | **Distributor multiplier by channel and volume** | UNCLOSABLE without a survey | List prices are public and the mechanic is documented. The multiplier is the surveyed unknown. County materials term contracts bound it but do not determine it. |

---

## Standing method notes

- **Verification tags.** Every source row carries one: `VERIFIED-DETAIL` means the specific number or field was seen; `VERIFIED-URL` means the URL is real but contents were not confirmed; `UNVERIFIED` means it was asserted in a snippet that could not be opened; `NOT FOUND` and `VERIFIED-NEGATIVE` record dead ends so they are not re-searched.
- **Negative findings are catalogued deliberately.** A confirmed absence is worth as much as a find, because it stops the next pass spending budget on it.
- **Do not calibrate on contractor marketing.** Per-door and per-square-foot figures circulating on GC and A/E blogs are sales material. They are recorded as leads, never as data.
