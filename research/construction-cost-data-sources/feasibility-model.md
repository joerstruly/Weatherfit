# Feasibility Cost Model — Specification

**Scope.** AACE Class 5 and Class 4 estimates for commercial and multifamily development: garden, podium, wrap, build-to-rent, office, retail, industrial. Input is a site, a program and a massing assumption. Output is a total development cost with a published uncertainty band.

**Design principle.** At this class the estimate is parametric. Precision on unit prices is irrelevant because the error is dominated by typology, parking scheme, escalation to construction midpoint, location, gross-to-net efficiency, and contingency. The model should therefore be small, transparent, and honest about its band. Every node below names the catalog sources that feed it; see `sources.csv` and `README.md`.

---

## 1. Calculation chain

```
Units, GSF per Unit (measured directly — see §2 node 6)
        └─> Residential GSF = Units × GSF per Unit

Hard Cost =
      Shell            GSF × $/GSF(typology, metro, quality)
    + Parking          Stalls × $/stall(structure type, metro)
    + Site / offsite   Acres × $/acre  OR  % of shell
    + Amenity / FF&E   $/unit  OR  folded into $/GSF
    + GC markups       (general conditions + fee + insurance + bonds) as % of direct
    × Location factor  (if base $/GSF is national rather than metro)
    × Escalation       (1 + e)^(months to construction midpoint ÷ 12)
    + Design contingency  % by estimate class

Total Development Cost =
      Land
    + Hard Cost
    + Soft Cost        A/E fees, permits, impact fees, legal, insurance, marketing
    + Financing        construction interest, loan fees, carrying cost
    + Developer Fee
    + Owner Contingency
```

**Report P10, P50 and P90, not a point.** A single number at Class 5 is a false claim.

### Why the efficiency ratio is not a parameter here

The natural way to write this model is `cost/unit = cost/SF × unit SF ÷ efficiency`. That is a trap. It forces an estimate of the one quantity nobody publishes: no institutional gross-to-net dataset exists for US multifamily, from NMHC, NAHB, ULI, or any large practice. The only figures in circulation are a trade article and a set of building-type rules of thumb.

But the model does not need efficiency. It needs the product `unit SF ÷ efficiency`, and that product **is** gross square feet per unit — which is directly observable at scale, free, for hundreds of thousands of real US buildings. Assessor and energy-benchmarking datasets carry gross building area and residential unit count on the same record.

So the model estimates `$/GSF` and `GSF per unit` directly, stratified by story count, and never estimates efficiency at all. Efficiency becomes a *reported output*, computed by dividing a published net unit size by the measured gross per unit, and used only as a sanity check: if the implied ratio lands in the 70–80% band, two independent data families corroborate each other; if it does not, that is a real definitional problem surfacing rather than an inherited one.

The same move attacks the typology problem, because story count is the stratifier for both.

**A definitional warning that applies to every efficiency figure in the literature.** Net-assignable-to-gross, net-rentable-to-gross, usable-to-gross and net-to-GFA are four different ratios, and published numbers mix them freely. REBNY loss factor is a fourth thing again — a Manhattan pricing convention layered onto usable area, not a measurement. Pick one definition, state it, and hold it. Mixing definitions is a larger error source than the dispersion within any one of them.

---

## 2. Node-by-node input map

| # | Node | Unit | Primary public sources | Weakness to disclose |
|---|---|---|---|---|
| 1 | **Shell $/GSF by typology × metro** | $/GSF | RLB quarterly (15 typologies × 14–16 metros, includes multifamily and parking structures); Cushman & Wakefield industrial (46 markets × 3 sizes) and data centers ($/MW); JLL, CBRE, C&W office fit-out; Turner & Townsend (99 cities, 11 types, high-rise apartments); DoD UFS 3-701-01 Table 2 ($/SF by facility category, free); MSBA school $/SF | No publisher codes garden, podium or wrap separately. Harvard JCHS gives one anchored differential: high-rise concrete runs about $75/SF above six-story stick-on-podium. Everything else must be derived from project data. |
| 2 | **Typology differential** | ratio | Harvard JCHS / Brookings framework; RAND's 2025 California study, which defines garden, podium, wrap and high-rise explicitly and weights the California pipeline at 49% garden, 38% podium, 7% wrap and 6% high-rise; WoodWorks on the code path, which is what actually drives the step change. | Derive from project-level cost data rather than contractor blogs. The per-door figures circulating for garden, podium and wrap are marketing, not data. |
| 3 | **Parking $/stall** | $/stall | **WGI Parking Structure Cost Outlook** (annual, metro-level; 2026 national median $33,300/space and $98.75/SF, +6% YoY; San Francisco high $43,000, Houston low $27,806; hard cost only, add 15–25% for soft). **UCLA ITS, *No Such Thing as Free Parking*, Feb 2026** (free, built on 2025 RLB data, 17 cities) for the grade differential: underground averages about $73,000/space against about $52,000/space above grade, and parking adds roughly $50,000–$100,000 per apartment unit. Public bid tabs and university regents' budgets for total-project-cost anchors (Iowa: 1,259 stalls / $96M ≈ $76,250 per stall all-in). | The largest single differentiator between garden, wrap and podium on the same site. Surface, above-grade structured and subterranean are three different cost regimes. WGI's full report is gated and the UCLA study is a one-off; neither includes land. Parking cost has risen about 50% faster than general inflation since 2012, so a stale per-stall number decays quickly. The survey is **WGI's**, successor to the Carl Walker series — not Walker Consultants'. |
| 4 | **Location factor** | index | Build county-level from the labor and material layers in the catalog. **DoD Area Cost Factors** are the best free substitute for the RSMeans City Cost Index: UFC 3-701-01 Table 4-1 and the PAX Newsletter 3.2.1 tables, which publish the basket (weather, seismic, climate, labor availability, contractor overhead and profit, logistics, productivity). BEA Regional Price Parities as a sanity check; USACE CWCCIS state factors for heavy civil. | No public county-level composite exists. The ACF is calibrated to DoD scope and updates irregularly. RSMeans' ZIP3 factors are interpolations of roughly 730 surveyed cities and have no published validation against bids. |
| 5 | **Escalation to midpoint** | %/yr | **Official state and agency forward assumptions first** — Maryland DBM, California DOF Budget Letter 26-03, San Francisco's AICCIE, Washington CPARB, Kansas OFPM. Federal deflator paths from USACE CWCCIS and the DoD Green Book as a lower bound. BLS PPI 236500 and 236400 for regional history. Free private national indexes (Skanska, Cumming, Gordian, Turner) and Mortenson's per-metro quarterly deltas as the upper bound and the geographic spread. | Feasibility estimates precede the construction midpoint by twelve to thirty-six months, so this node frequently moves the number more than the base cost. Escalate to the midpoint, not to the start. No free forward index exists by US metro — San Francisco's AICCIE is the only official sub-national forward curve found, and it covers one city. BLS stops at four Census regions with data only from February 2014, so a metro model cannot be fitted at all. Only two state DOTs even attempt to forecast their own index. |
| 6 | **Gross SF per unit** | GSF/unit | **Measure it directly from assessor and benchmarking data rather than deriving it.** NYC PLUTO (`BldgArea`, `UnitsRes`, `NumFloors`, `BldgClass` across ~860k tax lots); Maryland's statewide CAMA on Socrata; Maricopa County's Apartment Master file; the Local Law 84 family of energy-benchmarking disclosures, which exist in a dozen large cities. Cross-check the implied efficiency against published net unit size: UDR's 10-K reports average home size by market across roughly 21 markets with a ten-year back-series, Census Survey of Construction publishes median multifamily unit square footage nationally and by region, and RentCafe publishes a city-level series. | Assessor areas are assessment-derived and can be stale or noisy, and PLUTO's `ResArea` is a gross residential area, not a net rentable one — dividing it by `BldgArea` measures the residential share of a mixed-use building, not efficiency. Stratify by `NumFloors` and building class, and drop mixed-use lots or handle them explicitly. |
| 7 | **Site and offsite** | $/acre, $/LF | State DOT bid tabs and average unit prices (48 states; Texas fully open) for earthwork, utilities, paving; NRCS state cost lists | Highly site-specific. At Class 5 carry a wide band or an allowance. |
| 8 | **Soft costs and fees** | % , $/unit | Duncan Associates National Impact Fee Survey (5 land uses including multifamily, retail, office and industrial, roughly 250 jurisdictions); Terner Center fee studies; state A/E fee schedules that publish fee as a percentage of construction by building type and size plus the phase split (Washington OFM, Utah DFCM, Arizona ADOA); California HCD's statutory requirement that every jurisdiction post its residential fee schedule; HUD MAP Guide underwriting limits (working capital 4% of loan, BSPRA 10% of costs other than land). | Impact fees vary by an order of magnitude across jurisdictions. The RAND study puts entitlement-adjacent fees near $1k per unit in Texas, $12k in Colorado and $29k in California; Terner finds 691 California tax-credit projects averaged $19,806 per unit and that California fees can exceed $150,000 per unit. The Duncan survey's last edition is 2019 and appears discontinued, and no post-2019 multi-city comparison exists outside California. HUD's percentages are underwriting caps, not market observations. |
| 9 | **Contingency** | % | AACE 18R-97 (full text available free through the City of Austin's document system) for the class definitions; AACE 58R-10 and 68R-11 for escalation and its Monte Carlo extension; HUD MAP Guide requirements; state tax-credit program caps on contingency and developer fee, with 15% the commonly recommended maximum developer fee. | Contingency at Class 5 is not a rounding allowance. It is the honest expression of scope undefined. 18R-97 justifies carrying a range but supplies no number: it states explicitly that the accuracy range must come from project-specific risk analysis and must never be pre-set. |
| 10 | **Validation anchors** | $/unit, $/SF | LIHTC application cost schedules (TX TDHCA, CA TCAC, FL FHFC, VA Housing; NV and NE lists carry total development cost directly; Novogradac mirrors many); WA Commerce, MN Housing, CO CHFA per-unit series; Urban Institute Oklahoma project set; apartment REIT development schedules on EDGAR (per-community cost, units, city, 15+ years); trade-package bid tabs in multi-prime states | Affordable and market-rate cost structures differ. Keep them as separate calibration populations and disclose which one a given cell was fitted on. |

---

## 3. Cost breakdown structure

Use **Uniformat II (ASTM E1557)** for the parametric level, not MasterFormat. Uniformat is elemental (substructure, shell, interiors, services, equipment, sitework), which is how a feasibility estimate is actually reasoned about and how benchmarks are published. The ASTM standard is paid, but the full element list is obtainable free: Connecticut's Department of Administrative Services publishes the complete Uniformat II classification as a required project form, and NIST's originating report is free. Neither needs a licence to adopt.

For multifamily development budgets, mirror the **HUD-92331-B** trade schedule. It is a free, CSI-ordered, government-published division list, and it is the schema the four scrapable HFA repositories already report against. That alignment means project data can be loaded without a mapping layer.

Keep MasterFormat only as an optional drill-down for a later design-development product.

---

## 4. Uncertainty

Each node carries a distribution, not a value. Combine by Monte Carlo, or by root-sum-square if the nodes are treated as independent.

- Report P10, P50, P90 for total development cost and for hard cost per unit.
- Publish the **observation count** behind every typology and metro cell. A cell fitted on three projects should look different to the user than one fitted on ninety.
- Expect roughly plus or minus three to five percent on the location factor in dense metros and eight to twelve percent in rural counties, before typology and escalation uncertainty is added.
- AACE 18R-97 defines Class 5 at 0–2% project definition with a typical range of −50% to +100%, and Class 4 at 1–15% definition with −30% to +50%. Treat those as the sanity check on the width of a fitted band, not as the band. The same document warns that accuracy ranges must be derived from project-specific risk analysis and must never be pre-set, so the model should publish a band it computed and show what drove it.
- Sanity-bound the output against published program caps where they exist: Massachusetts caps eligible basis near $250k per assisted unit in the Boston metro and $200k outside it; New York City Open Door caps run $165k to $190k per unit. A model that produces numbers far outside such bounds for comparable product is signalling an input error.

---

## 5. Validation protocol

1. Assemble a hold-out set of completed projects with known cost, units, gross square feet, typology, parking count and location. Rank the sources by evidentiary quality, because they are not equivalent:

   **Tier A — owner budgets at a defined design stage.** The Massachusetts School Building Authority publishes project name, gross square footage, reconciled construction budget and total project cost at schematic design for board-approved projects, plus a separate historical series. GSA's Capital Investment and Leasing Prospectus Library gives estimated total project cost split into design, construction and management, alongside gross square feet, per project and filterable by fiscal year — though most prospectuses are alterations rather than new construction and must be filtered by hand. These are actual owner budgets and should carry the most weight even though they are institutional and federal rather than speculative commercial.

   **Tier B — program cost schedules and disclosures.** State housing finance agency application cost schedules, the Nevada and Nebraska application lists that carry total development cost directly, the Urban Institute's Oklahoma project set, apartment REIT development schedules on EDGAR, and university regents' capital items, which state gross and assignable square footage against an approved budget.

   **Tier C — trade-package bid tabs**, which validate the trade mix rather than the total.

   **Tier D — permit valuation, with a published caveat.** See the warning below. Use it as a censored lower bound only.

**The permit valuation warning.** Declared permit valuation is a fee basis, not a construction cost, and treating it as a cost observation is the single most dangerous shortcut available in this domain. In jurisdictions that apply the ICC Building Valuation Data table, the recorded valuation is computed as gross area × a published dollars-per-square-foot rate. Portland states in writing that its valuation is the greater of that formula output or the applicant's stated value, and Oregon mandates the method statewide by administrative rule; numerous California jurisdictions publish their own valuation schedules or adopt the ICC table outright. Where that method binds, **regressing declared value on square footage recovers the ICC fee table, not the market.** That is not a weak signal, it is a circular one, and it would silently validate the model against a fee schedule. Any use of permit data must first classify each jurisdiction as cost-of-work-declared versus table-derived and drop or separately flag the table-derived ones. Even where valuation is applicant-declared it is systematically understated, because it sets the fee: the limited public evidence puts declared value at roughly one-third to one-half of actual cost. Permit valuation also excludes land and soft costs and is frequently split across shell and tenant-improvement permits that must be re-assembled by parcel before any per-square-foot figure means anything.

   Three cities were confirmed to carry declared value, square footage and use type in one free table: Austin, Boston and New York. Seattle and Chicago publish cost but **no square footage field at all**, which rules them out on their own despite being two of the cleanest permit APIs.
2. Run the model blind on each project's program inputs.
3. Report mean absolute percentage error and bias by typology, by metro tier and by year.
4. Publish the result. **No incumbent does this.** RSMeans publishes location factors with no public validation against bids, and no GAO, state DOT or academic study validating them spatially was found in this research. A feasibility model that ships its own error statistics is more defensible to a lender or equity partner than a more granular model that does not.
5. Re-fit quarterly as new cost certifications and bid tabs land.

---

## 6. What this model deliberately does not do

- It does not price line items. That is Class 3 through Class 1 work and needs quantities from drawings.
- It does not need material list prices, distributor multipliers or a MasterFormat unit-cost library. Those are catalogued in the appendices as phase two, for a later design-development product.
- It does not attempt ZIP-level resolution. County is the finest defensible resolution for a composite factor built from public data.

---

## 7. The typology step is a code step

Garden, podium and wrap are not styles. They are the visible result of where a project lands in the building code, and that is what a parametric model should key on rather than on a marketing label.

- **IBC §510.2 horizontal building separation** lets the upper and lower portions of a podium be treated as separate structures for allowable area, firewall continuity, story count and construction type. A Type III-A frame over a Type I-A podium yields five upper stories and 85 feet overall across a three-hour rated horizontal assembly.
- The cost discontinuity sits at those thresholds. Adding a story that pushes a project from Type V-A to Type III-A, or from stick to concrete, moves the number far more than any unit price does.
- The one anchored differential found in public work: high-rise concrete runs roughly $75 per square foot above six-story stick over podium (Harvard JCHS). Terner's Washington DC figures put five-over-two or five-over-three near $138 per gross square foot against $180 to $220 for high-rise.

So the shell node should take construction type and story count as inputs, not typology name, and derive the label for display.

---

## 8. Constructing the escalation curve

Build it in three separated layers, and never let the geography layer carry more weight than the evidence supports.

**Layer 1 — method and timing.** Adopt AACE 68R-11, implemented with California DOF Budget Letter 26-03's stated convention: escalate from the estimate's data date to the **construction midpoint, defined as construction start plus half the duration in months**, compounding monthly, and carry escalation as a disclosed line item rather than burying it in the unit rates. That letter gives a citable public-agency definition of the midpoint and a monthly compounding rate, which makes the arithmetic defensible without any proprietary source.

**Layer 2 — the forward national rate, bracketed rather than pointed.** Do not pick one forecaster. Take the median of a small, dated, reproducible panel of **official state capital-budget assumptions** — Maryland at 5.0% for 2026 then 3.5% through 2029, California at no more than 5.0%, Washington at 3.66% to 4.9%, San Francisco at 3.5% then 5.0% — bounded below by the federal deflator paths (CWCCIS runs about 2.6% to 2.9%) and above by the free private national indexes (Skanska's composite at +6% year over year, Cumming at about 5%).

The state assumptions deserve to be the centre of gravity for three reasons: they are dated and versioned, they are published by organizations that actually buy construction and are held to their own numbers, and they are revised on a visible cadence. Maryland's revision from 10%/7.5%/5% in spring 2025 down to 4.5%/5.0%/3.5% that autumn is the clearest example, and that revision history is itself the honest expression of forecaster disagreement. **Report the escalation line as a range spanning the panel's minimum and maximum at your midpoint, not as a single number.**

**Layer 3 — geography, as a bounded spread and nothing more.** There is no free forward metro index, so do not manufacture one. Apply a region adjustment measured as the trailing three-to-five-year annualized spread between the relevant Census region PPI series and the national parent, and for metros Mortenson covers, blend in the trailing metro-versus-national spread. **Cap the total geographic adjustment at roughly one to one and a half percentage points on the annual rate.** That cap matters: with only twelve years of four-region monthly history and no metro data at all, the geographic signal is far weaker than the national-rate uncertainty, and an uncapped adjustment would let the least-supported layer dominate the best-supported one.

**Where a jurisdiction publishes its own official rate — San Francisco, Maryland, California, Washington, Kansas — use it directly in place of layers 2 and 3**, cite it by document and date, and skip the synthesis. A dated, official, geographically specific number that someone else has already had to stand behind is the most defensible position available.

---

## 9. Ranked model risk

Where the error actually comes from, worst first. This is the build priority.

1. **Escalation to midpoint.** Substantially improved: official dated forward rates now exist from five jurisdictions and two federal deflator paths, and section 8 sets out how to combine them. What remains unfixable is metro resolution — no free forward index exists below the four Census regions, and San Francisco is the only city in the country publishing its own forward curve.
2. **Typology and construction type differential.** Now partly addressable: Eriksen and Orlando model marginal cost and break-even rent by story count across the 50 largest US cities and find non-linearities at the fourth and eighth stories, which is the cost curve this node needs. RAND supplies per-net-rentable-SF costs across three states, and Abt's LIHTC study categorises 2,500-plus projects into walk-up, low-rise, mid-rise and high-rise. All three need their PDFs opened and the tables extracted.
3. ~~**Efficiency ratio.**~~ **Resolved by reparameterization** — see the design note in section 1. Gross SF per unit is measured, not estimated, so the ratio is no longer a free parameter. What remains is data engineering: assemble the assessor and benchmarking panel and stratify it.
4. **Parking scheme.** Well sourced at the national median but thin at the metro level, and the above-versus-below-grade split rests on a single 2026 study of 17 cities.
5. **Location factor.** The DoD Area Cost Factor table is free and defensible but calibrated to DoD scope and updated irregularly.
6. **Soft costs and fees.** Impact fees vary by an order of magnitude and the national survey stopped in 2019.
7. **Base shell rate.** Paradoxically the least of the problems, because several publishers cover it quarterly and the errors above swamp it.
