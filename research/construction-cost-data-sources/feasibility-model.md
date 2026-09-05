# Feasibility Cost Model — Specification

**Scope.** AACE Class 5 and Class 4 estimates for commercial and multifamily development: garden, podium, wrap, build-to-rent, office, retail, industrial. Input is a site, a program and a massing assumption. Output is a total development cost with a published uncertainty band.

**Design principle.** At this class the estimate is parametric. Precision on unit prices is irrelevant because the error is dominated by typology, parking scheme, escalation to construction midpoint, location, gross-to-net efficiency, and contingency. The model should therefore be small, transparent, and honest about its band. Every node below names the catalog sources that feed it; see `sources.csv` and `README.md`.

---

## 1. Calculation chain

```
Units, Avg Unit SF, Efficiency Ratio
        └─> Residential GSF = Units × Avg Unit SF ÷ Efficiency

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

---

## 2. Node-by-node input map

| # | Node | Unit | Primary public sources | Weakness to disclose |
|---|---|---|---|---|
| 1 | **Shell $/GSF by typology × metro** | $/GSF | RLB quarterly (15 typologies × 14–16 metros, includes multifamily and parking structures); Cushman & Wakefield industrial (46 markets × 3 sizes) and data centers ($/MW); JLL, CBRE, C&W office fit-out; Turner & Townsend (99 cities, 11 types, high-rise apartments); DoD UFS 3-701-01 Table 2 ($/SF by facility category, free); MSBA school $/SF | No publisher codes garden, podium or wrap separately. Harvard JCHS gives one anchored differential: high-rise concrete runs about $75/SF above six-story stick-on-podium. Everything else must be derived from project data. |
| 2 | **Typology differential** | ratio | Harvard JCHS / Brookings framework; RAND's 2025 California study, which defines garden, podium, wrap and high-rise explicitly and weights the California pipeline at 49% garden, 38% podium, 7% wrap and 6% high-rise; WoodWorks on the code path, which is what actually drives the step change. | Derive from project-level cost data rather than contractor blogs. The per-door figures circulating for garden, podium and wrap are marketing, not data. |
| 3 | **Parking $/stall** | $/stall | **WGI Parking Structure Cost Outlook** (annual, metro-level; 2026 national median $33,300/space and $98.75/SF, +6% YoY; San Francisco high $43,000, Houston low $27,806; hard cost only, add 15–25% for soft). **UCLA ITS, *No Such Thing as Free Parking*, Feb 2026** (free, built on 2025 RLB data, 17 cities) for the grade differential: underground averages about $73,000/space against about $52,000/space above grade, and parking adds roughly $50,000–$100,000 per apartment unit. Public bid tabs and university regents' budgets for total-project-cost anchors (Iowa: 1,259 stalls / $96M ≈ $76,250 per stall all-in). | The largest single differentiator between garden, wrap and podium on the same site. Surface, above-grade structured and subterranean are three different cost regimes. WGI's full report is gated and the UCLA study is a one-off; neither includes land. Parking cost has risen about 50% faster than general inflation since 2012, so a stale per-stall number decays quickly. The survey is **WGI's**, successor to the Carl Walker series — not Walker Consultants'. |
| 4 | **Location factor** | index | Build county-level from the labor and material layers in the catalog. **DoD Area Cost Factors** are the best free substitute for the RSMeans City Cost Index: UFC 3-701-01 Table 4-1 and the PAX Newsletter 3.2.1 tables, which publish the basket (weather, seismic, climate, labor availability, contractor overhead and profit, logistics, productivity). BEA Regional Price Parities as a sanity check; USACE CWCCIS state factors for heavy civil. | No public county-level composite exists. The ACF is calibrated to DoD scope and updates irregularly. RSMeans' ZIP3 factors are interpolations of roughly 730 surveyed cities and have no published validation against bids. |
| 5 | **Escalation to midpoint** | %/yr | Forward forecasts from Mortenson, RLB, Turner & Townsend, Cumming, Gordian Predictive; historical series from BLS PPI new nonresidential building construction (national plus four Census regions), ENR CCI/BCI, Turner, FHWA NHCCI | Feasibility estimates precede the construction midpoint by twelve to thirty-six months. This node frequently moves the number more than the base cost. Escalate to the midpoint, not to the start. The free forecasts currently disagree by about 1.5 points, which is a 3–5% swing on hard cost at a 24–36 month midpoint, and no free forward index exists by US metro. Use the PPI series 236500 and 236400, which are selling-price indexes rather than input-cost indexes and are therefore the correct type for escalation. |
| 6 | **Efficiency ratio and unit size** | % , SF | Project-level data from HFA cost schedules; REIT disclosures. The only located published figures are trade-press: about 82–85% for commercial and about 70–75% for apartments, with efficient garden product at or above 82%. | **The weakest link in the whole model.** Cost per unit equals cost per square foot times unit size divided by efficiency, so an error here invalidates the per-unit number even when the per-square-foot number is right. No institutional dataset was found from NMHC, NAHB, ULI or any of the large multifamily architecture practices. This ratio has to be fitted from project data the model itself collects. |
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

1. Assemble a hold-out set of completed projects with known cost, units, gross square feet, typology, parking count and location. Sources: HFA cost schedules, REIT supplementals, trade-package bid tabs, permit valuations as a weak third tier.
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

## 8. Ranked model risk

Where the error actually comes from, worst first. This is the build priority.

1. **Efficiency ratio.** No institutional dataset exists. Everything per-unit depends on it.
2. **Escalation to midpoint.** No free forward index by metro. Published forecasts disagree by about 1.5 points, which is 3–5% of hard cost over a typical feasibility horizon.
3. **Typology and construction type differential.** Only one anchored public differential was found. The rest must be fitted.
4. **Parking scheme.** Well sourced at the national median but thin at the metro level, and the above-versus-below-grade split rests on a single 2026 study of 17 cities.
5. **Location factor.** The DoD Area Cost Factor table is free and defensible but calibrated to DoD scope and updated irregularly.
6. **Soft costs and fees.** Impact fees vary by an order of magnitude and the national survey stopped in 2019.
7. **Base shell rate.** Paradoxically the least of the problems, because several publishers cover it quarterly and the errors above swamp it.
