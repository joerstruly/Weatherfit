# US Construction Cost Data Sources — Exhaustive Catalog (Commercial & Multifamily)

**Target segment.** Commercial construction: multifamily (garden, podium, wrap, build-to-rent), office, retail, industrial and warehouse, with data centers and institutional work as adjacent. Residential remodel and single-family retail channels are covered only where they matter as a price ceiling or a cross-check.

**Purpose.** Map every scrapable or licensable source of US construction cost data (materials from nails to I-beams, labor, equipment, assemblies, indexes, and the geographic crosswalks that localize them) well enough to design an open alternative to RSMeans for this segment. For each source: where it lives, what it covers, how localized it is, how accurate, how often it updates, how you get it, and what the license allows.

**Files.**
- `README.md` — this document: the answer, procurement channels by trade, the resolution ladder, the coverage matrix, the tiered source index, legal constraints, build order, and open gaps.
- `sources.csv` — machine-readable catalog (361 rows) with tier, category, URL, unit, geographic granularity, cadence, format, access method, all-bidder vs awarded, history depth, license, verification status.
- `appendix/` — fifteen underlying research reports: seven topical passes, five verification passes, and three commercial-segment passes (trade-level bid results, distributor channels and cooperative catalogs, multifamily cost certifications).

**Research date:** 5 September 2026. **Verification caveat:** the sandbox blocked direct fetches of every `.gov` and vendor host, so verification relied on search-result snippets, GitHub-hosted API clients and mirrors, and two DoD/GSA PDFs read from a mirror. Every row in `sources.csv` carries a `verification` value. Treat `knowledge`, `unverified` and `LOW-CONF` items as leads to confirm. Section 10 lists what is still open.

---

## 1. The short answer

**No public source does what RSMeans does for commercial work, and nothing public gives a county-level composite location factor or a division-level material price book.** But the commercial channel is far more visible than it first appears, and the pieces assemble:

1. **Commercial materials are bought as distributor net off a manufacturer list price, and the list price books are public.** Watts, Viega (Excel), Charlotte Pipe, NIBCO, Uponor, Tyler Pipe, Southwire, Cerrowire, Eaton (Price & Availability Digest and B-Line Excel sheets), Schneider DigestPLUS, Allegion, ASSA ABLOY and Lawrence Hardware (via SECLOCK's price-book library) all publish dated list prices openly. Southwire even publishes the mechanic: net = a four-decimal multiplier × list. The multiplier is the surveyed unknown, and it is bounded.
2. **Contractor net prices leak into the public record through government procurement.** County annual materials bids publish literal List / Discount / Net sheets from Ferguson and Graybar (Lee County FL is the exemplar). NY OGS statewide contracts publish discount-off-list schedules. GSA Advantage price lists are fully public and structured. Cooperative contracts (Sourcewell, HGACBuy, NASPO) post pricing files for some categories.
3. **Manufacturer price-increase letters are a free, dated, continuously updated level-and-direction feed** for drywall, steel studs, insulation, ceilings and commercial roofing membranes, archived by ABC Supply (low-slope and Interiors), SRS, FBM, Cameron Ashley, Negwer, Marjam and KAMCO.
4. **Trade-level building bid prices exist in the public record in multi-prime and filed-sub-bid states.** Pennsylvania (Separations Act; DGS eMarketplace bid tabs; Penn State trade packages), New York (Wicks Law; SUNY Construction Fund, DASNY, OGS, NYC DCAS), Wisconsin (filed MEP sub-bids posted within 48 hours, with a multi-year archive), Massachusetts (18 filed sub-bid classes via DCAMM), Illinois CDB, North Carolina eVP, plus per-package tabs from CM/GC owners such as Western Washington University. These are whole-building trade prices, not highway items.
5. **Multifamily hard cost by division is available project by project.** Four housing finance agencies post full LIHTC applications with development cost schedules per project (Texas TDHCA, California TCAC, Florida FHFC with an enumerable URL pattern, Virginia Housing). WA Commerce, MN Housing, CO CHFA and WA WSHFC publish per-unit cost series. Apartment REIT supplementals on EDGAR give per-community total cost, units and city for 15+ years. RAND's 2025 California study contains sub-bid-level deltas for two concurrent wrap projects. HUD's division-level form (HUD-92331-B) is the canonical CSI taxonomy but filed certifications are FOIA-only.
6. **Civil and site packages are the best-covered scope in the country**: state DOT bid tabulations and average unit prices in 48 states, with Texas fully open as Socrata, and 37 states publishing monthly asphalt, fuel, steel and cement indexes.
7. **Labor is solvable at county level** from OEWS, QCEW, Davis-Bacon (scrapable JSON endpoints), roughly 27 state prevailing-wage schedules, QWI and public workers'-comp tables. **Equipment is solved for free** (Caltrans book, FEMA 2025 schedule, USACE EP 1110-1-8, EIA fuel).
8. **Whole-building $/SF by typology and metro is free from four publishers**: RLB (15 typologies × 14 to 16 metros, quarterly, including multifamily and parking structures), Cushman & Wakefield (industrial: 46 markets × 3 sizes; data centers $/MW; office fit-out), JLL and CBRE fit-out guides, Turner & Townsend (99 cities, high-rise apartments among 11 types). None codes garden, podium or wrap as separate typologies.
9. **The unsolved parts** are HVAC equipment pricing (distributor-gated; the biggest structural blind spot), elevators, fire sprinkler, precast, CMU and fabricated steel $/ton (all bid-quoted with no public benchmark), and productivity (labor hours per unit; only 1996-era Navy P-405 and Army manuals are public domain).
10. **What you must not do:** copy RSMeans, BNi, Xactimate or Marshall & Swift numbers. Emulate the schema and methodology. Craftsman is the one publisher with a formal bulk-data licensing program; Trimble Trade Service, Vision InfoSoft EPIC and Harrison CINX are the licensable list-price feeds for MEP at roughly $450 to $1,800 per year.

---

## 2. How commercial and multifamily materials are actually bought, and where the price signal is

| Trade / scope | Real channel | Public price signal | Licensable feed | Gap |
|---|---|---|---|---|
| **Electrical** (wire, conduit, gear, devices, lighting) | Graybar, WESCO, CED, Rexel/Platt, Border States, City Electric on account; distributor net = multiplier × manufacturer list ("column" pricing) | Southwire and Cerrowire building-wire list PDFs plus published multiplier mechanic; Eaton Price & Availability Digest and B-Line Excel sheets; Schneider DigestPLUS; NY OGS Graybar price list; Lee County Graybar discount categories; daily copper close | Trimble Trade Service TRA-SER (~2M items; SX adds "average market pricing"); Vision InfoSoft EPIC ($456 to under $1,000/yr); NetPricer pulls a contractor's own negotiated prices | Multiplier by distributor and volume must be surveyed |
| **Plumbing / piping** | Ferguson, Winsupply, Hajoca, Core & Main on account; same list × multiplier structure | Watts 2026, Viega 2026 (Excel), Charlotte Pipe, NIBCO (Excel), Uponor, Tyler Pipe list books; Lee County Ferguson List/Discount/Net sheet; Sloan/Zurn/NIBCO increase letters | Harrison Publishing / CINX ($1,100/yr per location); Trimble MEP (Trade Service + Luckins); EPIC plumbing | Fixture-package pricing for multifamily is program-negotiated |
| **HVAC equipment** (RTUs, splits, VRF, chillers) | Watsco/Carrier Enterprise/Gemaire, Johnstone, RE Michel; contractor pricing account-gated; 20 to 40 percent variance across chains | Light-commercial e-tail (HVACDirect, AC Wholesalers, OnlineSupply) show some unit prices but mask above about $2,000; Sourcewell HVAC contracts route pricing to a rep; Trane holds a GSA schedule | none | **Biggest blind spot**; solve with sub bids and cooperative contract pulls |
| **Drywall, steel studs, insulation, ceilings** | GMS, ABC Supply Interiors (ex-L&W), FBM, Kenseal on account | Distributor price-increase archives (ABC Interiors, FBM, Cameron Ashley, Negwer, Marjam, Metro Interiors, Performance Pro, KAMCO) with effective dates; Kanopi (Armstrong DTC) $/SF | none needed | Percent levels sometimes omitted from snippets; commercial Armstrong list not found |
| **Commercial roofing / waterproofing** | ABC Supply, Beacon, SRS two-step distribution | ABC Supply low-slope increase letters (Carlisle 2026-07-01), SRS quarterly commercial announcements, Beacon, Mid-Atlantic, Carolina Atlantic archives | none | Membrane $/square by system is bid-quoted |
| **Ready-mix, cement, aggregates** | Producer quotes per project | Cemex nationwide increase announcements; USGS state values; state DOT cement indexes (GA, WV); DOT bid tabs (concrete $/CY by class) | PCA, NRMCA (members) | No producer list prices |
| **Rebar, structural steel, joists, deck** | Fabricator bids; mill price + fabrication + erection | Nucor weekly Consumer Spot Price via Steel Market Update coverage ($865 Aug 2025 → $1,180/ton Aug 2026); CMC and Nucor lockstep rebar announcements; SteelBenchmarker; DOT bid tabs (rebar $/LB, structural steel $/LB) | Steel Market Update, CRU, Platts | No public fabricated-and-erected $/ton; joist and deck pricing not published |
| **CMU, brick, precast** | Producer-quoted regionally (Oldcastle APG, General Shale; Tindall, Gate, Metromont) | none found | none | Rely on bid tabs and sub quotes |
| **Lumber, trusses, EWP** (wood-frame multifamily) | Builders FirstSource, US LBM, 84 Lumber pro desks; package quotes | Random Lengths composite (methodology guide public); Tax Credit Advisor benchmarks (lumber + EWP ≈ 12 to 18 percent of vertical hard cost) | Fastmarkets Random Lengths | Package pricing mechanism not documented |
| **Windows, storefront, curtain wall** | Glazing subs (Kawneer, YKK AP, Oldcastle BE); vinyl via builder programs | none usable | none | Bid-quoted |
| **Doors, frames, hardware** | Distributor list × multiplier | Allegion ProExpress price book; SECLOCK price-book library (Allegion Multi-Family book, ASSA ABLOY 2026); Lawrence Hardware 2026 | none needed | Multiplier survey |
| **Elevators** | OEM negotiation | Public maintenance/modernization bid tabs only | none | No new-install benchmark |
| **Fire sprinkler, fire alarm, low voltage** | Sub bids | none | none | Filed sub-bid states (MA) are the only public source |
| **Flooring, paint, appliances, cabinets** | National programs (Shaw/Mohawk multifamily, Sherwin-Williams accounts, Whirlpool–Greystar) | Shaw GSA price lists (2020 vintage); PPG/SHW increase disclosures | none | Program pricing not published |
| **Site work, utilities, paving** | Civil subs | State DOT bid tabs and average unit prices (48 states), NRCS cost lists | none needed | Best-covered scope |
| **Equipment** | Rental fleets | Caltrans book (JSON on GitHub), FEMA 2025, USACE EP 1110-1-8, EIA fuel | EquipmentWatch | Solved |
| **Labor** | Sub payrolls | OEWS, QCEW, Davis-Bacon, state prevailing wage, QWI, WC tables | CLRC, PAS | Solved to county |

**Retail (Home Depot, Lowe's) is a residential and punch-list channel.** It is catalogued in appendix 04 as a price ceiling and for small-job scope, not as the commercial material source.

---

## 3. How localized can each cost component get?

| Component | Finest defensible resolution | Sources that reach it | What limits going finer |
|---|---|---|---|
| **Trade packages for whole buildings** (GC, mechanical, electrical, plumbing, roofing, glazing, elevators) | **Project / county** in multi-prime and filed-sub-bid states | PA eMarketplace + Penn State; NY SUCF, DASNY, OGS, DCAS; WI DFD MEP tabs; MA DCAMM (18 classes); IL CDB; NC eVP; WWU per-package | Coverage limited to public owners in ~7 states; lump sums need SF normalization from plans |
| **Civil / site unit prices** | **County / DOT district** | State DOT bid tabs (TX county; OR region; WV district; FL market area; VA district; NY region) | Pay-item crosswalk across states |
| **MEP and openings materials** | **Distributor branch / metro** (list is national; multiplier and freight vary) | Manufacturer list books + surveyed multipliers; county materials bids; GSA and cooperative price files | Multiplier survey; HVAC equipment gated |
| **Commodities** | **State / region** | 37 DOT asphalt/fuel/steel/cement indexes; Nucor CSP; USGS state values; EIA fuel | Paid series non-redistributable |
| **Multifamily hard cost per unit / per SF** | **Project / county** | TDHCA, TCAC, FHFC, Virginia Housing application repositories; WA Commerce, MN, CO CHFA, WSHFC series; REIT supplementals | PDF extraction; typology must be inferred |
| **Whole-building $/SF benchmarks** | **Metro × typology** | RLB (15 × 16), C&W industrial (46 × 3), C&W data centers ($/MW), JLL/CBRE/C&W fit-out, T&T (99 cities) | Garden/podium/wrap not coded |
| **Labor wage and burden** | **County** | Davis-Bacon, QCEW, OEWS, state PW, QWI; Oregon DCBS WC, bureau tables | Stale survey rates in rural counties |
| **Equipment** | **Region / state** | Caltrans, USACE, FEMA, EIA | Rental quotes gated |
| **Productivity** | **National** | P-405, Army FMs, Caterpillar | Nothing public and current |
| **Composite location factor** | **City/installation** (DoD ACF) → **county** if built from the layers above | UFS 3-701-01; CWCCIS state factors; BEA RPP | No public county composite exists |

**Practical ceiling: county for the composite factor and for trade-package calibration; metro for material net pricing; ZIP only where you hold branch-level observations.**

---

## 4. Coverage matrix — nails to I-beams for commercial scope

| Item family | Absolute price source | Escalation / index | Notes |
|---|---|---|---|
| Fasteners, anchors, hangers | Eaton B-Line price sheets (Excel); Fastenal/Grainger list; Hilti and Simpson list books (not verified) | PPI `WPU1081` | |
| Building wire, cable | Southwire and Cerrowire list × published multiplier; Service Wire daily copper | CME `HG`; PPI copper wire | Cleanest list-to-net mechanic found |
| Switchgear, panels, breakers | Eaton PAD, Schneider DigestPLUS list; NY OGS Graybar contract | PPI electrical equipment | Discount symbols → multipliers |
| Pipe, valves, fittings | Viega (Excel), Watts, Charlotte, NIBCO, Uponor, Tyler list; Lee County Ferguson net sheet | PPI plastic pipe, copper tube | |
| Plumbing fixtures | Kohler price book (dealer mirror), Zurn, Sloan lists; increase letters | PPI | Multifamily programs negotiated |
| HVAC equipment | Light-commercial e-tail (partial); Sourcewell/GSA contracts; sub bids | PPI HVAC | Gap |
| Ductwork, sheet metal | Sub bids; MCAA/SMACNA labor units (paid) | PPI | |
| Drywall, studs, insulation, ceilings | Distributor increase archives (levels + dates); Kanopi $/SF | PPI `WPU137`, `WPU1392` | |
| Commercial roofing membranes | ABC/SRS/Beacon increase letters; Sourcewell roofing routes through ezIQC | PPI roofing | |
| Ready-mix, cement | DOT bid tabs ($/CY by class); Cemex announcements | USGS; DOT cement indexes; PPI `WPU1333` | |
| Rebar, structural steel, joists, deck | DOT bid tabs (rebar, structural steel $/LB); Nucor CSP series | SteelBenchmarker; PPI `WPU1017`; DOT steel indexes (NY, NC, IL, NH, WY) | Fab+erect $/ton bid-quoted |
| CMU, brick, precast | DOT bid tabs for block items; sub bids | PPI `WPU1342` | No list prices |
| Lumber, EWP, trusses | Random Lengths (paid) + Tax Credit Advisor benchmarks; DOT bid tabs for timber items | PPI `WPU081` | Package pricing undocumented |
| Doors, frames, hardware | Allegion, ASSA ABLOY, Lawrence list books (SECLOCK) | PPI millwork | |
| Glazing, storefront, windows | Sub bids; MA filed sub-bids (metal windows, glazing classes) | PPI flat glass | |
| Elevators | Public modernization bid tabs | — | No new-install benchmark |
| Fire protection | MA filed sub-bids (sprinkler class) | — | |
| Flooring, paint | Shaw GSA lists (2020); Mohawk programs; PPG/SHW disclosures | PPI `WPU0621` | |
| Site work, utilities, paving | 48 state DOT bid tabs; NRCS cost lists | 37 DOT asphalt/fuel indexes; NHCCI | Best-covered |
| Equipment | Caltrans, FEMA, USACE | EIA fuel | |
| Labor | See section 6 | ECI, CES | |

---

## 5. Tiered source index

Tier 1 = public domain or open license, structured. Tier 2 = public but PDF/HTML to parse. Tier 3 = publicly visible but ToS-restricted, or third-party scraper APIs. Tier 4 = licensable commercial data. Full detail and URLs are in `sources.csv` and the appendices.

### 5.1 Trade-level building bid results (appendix 13)
- **Multi-prime statutes:** New York Wicks Law (separate plumbing, HVAC, electrical above $3M NYC / $1.5M suburbs / $500k upstate); Pennsylvania Separations Act (four branches above $4,000; PA DGS eMarketplace BidTabs posted within 2 days; Penn State OPP posts bid tab per trade package); Wisconsin §16.855 (single prime with filed MEP sub-bids; DOA DFD posts MEP tabs within 48 hours, past-projects archive); Massachusetts c.149 §44F (18 filed sub-bid classes; DCAMM tabs via Bid Express show trade × sub × amount × alternates); Illinois CDB (results retained about one month, so poll); Delaware §6962 (named subs, no prices); Ohio (multi-prime until 2011, still used by OFCC; same-day posting); North Carolina eVP (final tabs include pricing).
- **Public owners with tab archives:** SUNY Construction Fund running bid-opening report; DASNY (48 hours); NY OGS D&C bid results; NYC DCAS citywide bid tabs 2021 to 2025; Louisiana Facility Planning & Control (stable-URL PDFs 2019 to 2026, mechanical/electrical packages); University of Kentucky (with owner's estimate); University of Iowa; Western Washington University per-package tabs; University of Washington; Michigan DTMB; Chicago Housing Authority (24 to 48 hours); Clark County School District; Miami-Dade schools; LAUSD; Utah DFCM (same-day tab in Bonfire). Not posted: Houston ISD, Texas A&M (request only), Chicago Public Schools, federal building bid abstracts (award totals only via SAM.gov/FPDS). California lists subcontractors by name on every public bid but without amounts.

### 5.2 Commercial material channels, cooperatives, JOC (appendix 15)
- **Manufacturer list books (free):** Watts, Viega (XLSX), Charlotte Pipe, NIBCO (XLSX), Uponor, Tyler Pipe, Southwire, Cerrowire, Eaton PAD and B-Line (XLSX), Schneider DigestPLUS, Allegion ProExpress, SECLOCK library (ASSA ABLOY 2026, Allegion Multi-Family), Lawrence Hardware 2026.
- **Public net-price sheets:** Lee County FL Ferguson (List/Discount/Net) and Graybar (per-manufacturer discount categories); NY OGS Graybar price list and Appendix C discount schedules; GSA Advantage `ref_text/` price lists (fully public, structured, include IFF); Sourcewell open pricing PDFs (Grainger MRO, construction equipment matrix); HGACBuy pricing worksheets; NASPO contractor documents; Equalis master agreements; Pavilion as the index across cooperatives.
- **Price-increase archives:** ABC Supply low-slope roofing and Interiors; SRS; FBM; Cameron Ashley; Negwer; Marjam; Metro Interiors; Performance Pro Supply; KAMCO; Mid-Atlantic and Carolina Atlantic roofing; Cemex ready-mix.
- **Licensable feeds:** Trimble Trade Service TRA-SER; Vision InfoSoft EPIC; Harrison CINX; Fastmarkets Random Lengths; Steel Market Update; IDEA (product content, not prices).
- **JOC:** Gordian CTC (275,000+ tasks; licensed; adjustment factors typically 0.8 to 1.2) and RSMeans JOC Core Bid Access; awarded coefficients are public in California county bid tabs (Fresno, San Bernardino, San Luis Obispo, San Diego: normal-hours factors 1.085 to 1.099, also 0.90 and 0.94); DASNY's public guide to using the CTC; NYC DDC multiplier-bid booklets in the FOIL repository; Texas Facilities Commission and Arizona ADOA JOC programs.
- **Platforms:** Trimble now owns both Trade Service (list feed) and StructShare/Trimble Materials (actual purchase data); Kojo, Toolbx publish nothing; Levelset tracker is retail; 1build claims county-level costs (price unpublished, status post-Handoff unclear); ENR publishes 20-city material prices weekly on a monthly rotation and sells ENRCostData with an API; Cumming, RLB, Mortenson, AGC publish free indexes.

### 5.3 Multifamily and commercial hard-cost data (appendix 14)
- **HUD:** HUD-92331-B is the CSI-division trade cost schedule attached to the contractor's certificate of actual cost; filed certificates are FOIA-only. Public HUD multifamily datasets stop at loan level (units, mortgage amount, location, endorsement dates). HUD LIHTC database has no cost fields.
- **State HFA application repositories with cost schedules per project (all PDF):** TDHCA (individually imaged full applications; archive), CTCAC (worksheets posted from the Excel application each round, ~12 years), FHFC (enumerable `Download?appNumber=…&docType=APP+PACKAGE`), Virginia Housing (9% and 4% applications by year). Series: WA Commerce HTF cost reports (median $/unit 2019 to 2023 by county/region), MN Housing cost containment model (2003 to 2024), CO CHFA development cost dashboard ($/unit and $/SF by region, credit type, development type), WSHFC annual cost data report. Taxonomy: Maryland DHCD Guide to Project Development Costs.
- **Studies with project-level data:** RAND 2025 (Appendix Table A.18: sub-bid hard cost deltas for two concurrent wrap projects, CA vs TX; fees $1k TX / $12k CO / $29k CA per unit); Terner Center Hard Costs (240 CA multifamily projects 2009 to 2018, line-item level; dataset unpublished); SDHC 2025; NMHC/NAHB Cost of Regulations 2022 (40.6 percent of TDC).
- **Market-rate calibration:** AvalonBay, Camden, Prologis (TEI includes land), American Homes 4 Rent (BTR $250k to $400k per home) development schedules in EDGAR 8-K supplementals, 15+ years.
- **Benchmarks by typology and metro:** RLB quarterly (15 typologies × 14 to 16 metros including multifamily and parking), Cushman & Wakefield industrial (46 markets × 3 sizes) and data centers ($/MW, 19 markets), JLL and CBRE and C&W fit-out guides, Turner & Townsend GCMI (99 cities; high-rise apartments among 11 types; US labor $76/hr average, NY $131/hr), Mortenson (8 metros, nonresidential index), Cumming quarterly, MSBA school costs. No source codes garden, podium or wrap.

### 5.4 Federal (appendix 01, 08)
BLS PPI (national; regional only for new nonresidential building), OEWS (May 2025 released 15 May 2026), QCEW (county × NAICS 238 sub-trades; MSA industry detail dropped from Q3 2025), CES/ECI/ECEC, Davis-Bacon (undocumented SAM.gov JSON endpoints; no official bulk), Census BPS/SOC/VIP/CBP/QWI (API key required since May 2026), FHWA NHCCI and Federal Lands bid unit price analysis, USACE CWCCIS (tables to Sep 2025) and EP 1110-1-8 (12 regions; latest verified 2016), DoD UFS 3-701-01 (Feb 2026; 213 CONUS Area Cost Factors; $/SF by facility type), FEMA 2025 equipment rates, NRCS EQIP state cost lists, EIA, FRED, USAspending, BEA RPP, HUD TDC limits (2024), FTA capital cost database, USGS, NREL and LBNL solar datasets.

### 5.5 State and local (appendix 02, 11, 12)
State DOT bid tabs and average unit prices in 48 states (Texas Socrata all-bidder dataset; Oregon, Idaho, West Virginia, Indiana, North Carolina, Virginia, Massachusetts, Ohio structured; about 20 parseable per-letting; annual PDF books elsewhere); 37 state DOT asphalt/fuel/steel/cement indexes; state DOT construction cost indexes (CO, MN, WI, IA, NH, MD, MI); about 27 state prevailing wage schedules (Maryland XLSX; Washington export; Missouri, Minnesota, Michigan, California, Illinois, New York parameterized); assessor cost manuals with state-authored tables and multipliers (Oregon, Illinois, Indiana, Wisconsin, California, North Carolina counties, Texas CADs); permit data (NYC, Chicago, LA, SF, Seattle, Austin, Dallas; Shovels.ai nationally); municipal unit prices (Austin, San Diego County); sales tax tables; workers' comp tables (Oregon DCBS 50-state, state bureaus).

### 5.6 Labor, equipment, indexes, open data (appendix 05, 06, 07)
Labor blend method to county; equipment (Caltrans JSON mirror, FEMA, USACE); productivity (P-405, Army FMs, pre-1929 Walker's; NECA, MCAA, Craftsman, RSMeans copyrighted); open databases (CWICR CC BY-NC, synthetic US prices); taxonomies (Uniclass CC BY-SA; CSI copyrighted; HUD-92331-B as free CSI-ordered schedule); GitHub tools for Davis-Bacon, QCEW, Home Depot and Lowe's endpoints.

### 5.7 Commercial cost databases (appendix 03, 09)
RSMeans (terms bar redistribution and database use; 900+ ZIP3 factors from ~730 surveyed cities), Craftsman (formal data licensing; ZIP3 factors), BNi (Excel unit-cost DB in Reference tier), Marshall & Swift/Cotality (rebranded March 2025), Xactimate (460+ regions), Compass, ENR, CLRC, PAS, EquipmentWatch.

---

## 6. Labor: county-level loaded rate

1. OEWS median and percentiles by SOC at MSA/nonmetro; adjust cross-industry to construction with national NAICS-238x ratio.
2. County disaggregation with QCEW county average weekly wage (NAICS 2382x, 4-quarter average) relative to the OEWS area; empirical-Bayes shrink; fallback 23822 → 2382 → 238 → 23 → state; cross-check with QWI new-hire earnings.
3. Escalate monthly with ECI construction wages and CES state AHE.
4. Tiers: journeyman = median; foreman = P75 to P90; apprentice = P25 or Davis-Bacon schedules.
5. Union overlay from Davis-Bacon union-identified lines and CBA-basis state schedules; age survey lines with ECI; weight by unionstats coverage.
6. Fringe from DB/state schedules (union) or ECEC shares (open shop). Burden: WC class-code loss cost (Oregon DCBS, bureau tables), FICA, FUTA, SUTA construction rate, GL allowance.
7. Validate against CES, QWI, DB, Indeed posted-wage growth; publish P10 to P90 bands and observation counts.

---

## 7. Localization method (appendix 06)

- Building models for the target typologies: garden (wood frame, surface parking), podium (wood over concrete, structured parking), wrap (wood around a parking structure), high-rise, BTR townhome, office core-and-shell and fit-out, retail shell, industrial tilt-up. Published division weights and material/labor/equipment shares per model.
- Component ratios per county: materials from list × multiplier by metro plus commodity indexes; labor per section 6; equipment by region.
- `LF_c = Σ_d w_d (m_d·M_{d,c} + l_d·W_{d,c} + e_d·E_c)` with scope multipliers for seismic, wind, snow, flood, frost, soils and climate zone applied to the divisions they affect.
- Calibration: regress log actual cost from trade-package bid tabs (PA, NY, WI, MA, IL, NC), DOT bid tabs, HFA cost schedules and REIT schedules on log(LF_c) plus project controls (typology, size, stories, parking type, prevailing-wage flag, procurement method); shrink county effects toward CBSA and state.
- Error bars by bootstrap; expect roughly ±3 to 5 percent in dense metros and ±8 to 12 percent in rural counties; publish observation counts.
- Accuracy context: AACE classes 5 to 1 span −50/+100 percent to −3/+15 percent; no public study validates RSMeans location factors against bids.

---

## 8. Legal constraints (not legal advice)

- Government outputs (BLS, Census, DOL, DOT, USACE, DoD, FEMA, NRCS, EIA, HUD forms, state and county procurement records, university bid tabs, EDGAR filings) are public domain or public record. Check individual portal terms for bulk use (Bid Express, bidtabs.us, Caltrans).
- Manufacturer list-price PDFs and price-increase letters are published for open distribution; prices are facts (Feist), but do not reproduce catalogs, descriptions or images wholesale.
- Distributor and rental sites: scrape logged-out only; never bulk-pull behind Pro or contractor accounts; respect robots.txt; rate-limit; expect Akamai/DataDome friction.
- Commercial databases: RSMeans terms bar redistribution, searchable databases and pricing products; Marshall & Swift requires consent and fees for integration; Gordian's CTC is licensed IP even when used in public JOC programs; Random Lengths, SMU, CRU, Platts are licensed compilations. Several state assessor manuals embed Marshall & Swift tables.
- Taxonomy: CSI MasterFormat is copyrighted; HUD-92331-B and Uniclass 2015 are free alternatives.
- Open datasets: CWICR is CC BY-NC; Indeed Hiring Lab CC BY 4.0; LBNL Tracking the Sun open.

---

## 9. Recommended build order (commercial segment)

1. **County spine:** TIGER, OMB CBSA, HUD ZIP crosswalk, IECC zones, BEA RPP.
2. **Labor layer:** QCEW, OEWS May 2025, Davis-Bacon scraper, state PW scrapers (MD XLSX first), Oregon DCBS WC, ECI/CES.
3. **Trade-package bid layer:** PA eMarketplace BidTabs and Penn State packages; WI DFD MEP tabs (past archive); MA DCAMM filed sub-bids; SUNY SUCF, DASNY, OGS, NYC DCAS; IL CDB (poll monthly); NC eVP; Louisiana FPC; WWU; University of Kentucky. Normalize to $/SF with plan quantities where available.
4. **Multifamily cost-schedule layer:** FHFC (enumerable URLs), TDHCA, TCAC, Virginia Housing PDF extraction into the HUD-92331-B division schema; WA Commerce, MN, CO CHFA series; REIT 8-K schedules; RAND Table A.18.
5. **Material list-price layer:** scrape Viega, NIBCO, Watts, Charlotte, Uponor, Tyler, Southwire, Cerrowire, Eaton, Schneider, Allegion/SECLOCK, Lawrence list files; build the multiplier survey from county materials bids (Lee County pattern), NY OGS schedules, GSA Advantage `ref_text/`, Sourcewell and HGACBuy price files; ingest distributor price-increase archives as a dated level feed.
6. **Commodity layer:** 37 DOT asphalt/fuel/steel/cement indexes; Nucor CSP series; SteelBenchmarker; USGS; EIA; FRED PPI; AGC subcontractor-segment PPI tables.
7. **Civil unit-price layer:** TX Socrata first, then OR/ID/WV/IN/NC/VA/MA/OH, then per-letting parsers; pay-item crosswalk.
8. **Equipment layer:** Caltrans JSON, FEMA 2025, USACE EP 1110-1-8, EIA.
9. **Benchmarks:** RLB, C&W, JLL, CBRE, T&T, Mortenson, Cumming, DoD Tables 2 and 6, MSBA.
10. **Gaps to close by survey or licensing:** HVAC equipment net pricing (cooperative contract pulls, sub bids), elevators, sprinkler, precast, CMU, fabricated steel $/ton; productivity (Craftsman license or contractor survey); MEP list feeds (Trade Service, EPIC, CINX) if list-book scraping is insufficient.
11. **Index construction and validation** per section 7, with a published bid-tab validation.

---

## 10. Verification status and open gaps

Search budget in each pass was 200 queries and every pass ran out before finishing. The following remain open and should lead a follow-up session:

**Trade-level bid results:** NJ N.J.S.A. 18A:18A-18 and NC G.S. 143-128 statute detail; Kansas, Missouri, New Mexico multi-prime; Illinois CDB statutory basis; NYC SCA per-bidder amounts; NJ DPMC and Chicago Public Schools tab pages; structured federal bid abstracts; Texas and Utah university systems; CA DGS/DSA, FL DMS, GA GSFIC, OR DAS, CT DAS, MD eMMA, VA eVA, CO OSA, AZ ADOA, TN STREAM, KY, UC/CSU bid-tab URLs.

**Material channels:** Trimble Trade Service list price; Sourcewell HVAC price files; CMU, brick, precast list prices; ready-mix and cement letters with amounts; AISC fabricated-and-erected $/ton; joist and deck pricing; elevator new-install benchmark; fire sprinkler benchmark; BFS/US LBM multifamily package pricing; multifamily vinyl window pricing; commercial paint list; current Shaw/Mohawk GSA lists; Armstrong commercial list; BuyBoard and E&I price files; fire alarm, low voltage.

**Multifamily cost data:** whether filed cost certifications are posted by Georgia DCA; per-project repositories for OH, IL, PA, MI, NC, WA, NJ, AZ, MO, TN, UT, NV, ID, NM; Marshall & Swift commercial; Trepp; Urban Institute; Up for Growth; Arcadis; Compass; Green Street; NY HCR and MA EOHLC cost reports; Rexford, Equity Residential, MAA, UDR, Invitation Homes schedules; garden/podium/wrap benchmarks from a primary source (the $/door figures circulating are contractor marketing, not data).

**Earlier passes (still open):** TX `de7b-7dna` history and cadence; TX/MN/MI asphalt indexes; UT/NV/HI/CT/ME DOT average prices; WSDOT/TxDOT/ODOT/FDOT/NYSDOT cost indexes; PennDOT Item Price History public access; Delaware, New Mexico, Colorado PW rate tables; Ohio PW lookup URL; the authoritative 2026 state PW count (27 + DC best supported); assessor manuals for 17 states; ECEC construction line values; HUD 2025/2026 TDC; USGS state XLSX filenames; NHCCI current quarter; EP 1110-1-8 editions after 2016; MII vendor and price; BEA RPP bulk URL; EIA rate limit; 1build/Handoff API status; retailer ToS text.

**Corrections surfaced by verification:** Caltrans uses a statewide Brent crude index, not regional asphalt indexes; WSDOT Unit Bid Analysis returns only the three lowest bidders; FDOT's public dashboard blocks export; Census BPS county files live under `/programs-surveys/bps/`; OEWS bulk path uses a hyphen and series IDs are 25 characters; BEA 2024 RPP shipped Feb 2026; Xactimate's list count is "more than 460"; Cotality rebrand was March 2025; DOL's state-PW page omits Michigan's 2024 reinstatement; HUD's LIHTC database has no cost fields; "EDA" as an electrical pricing body does not exist (IDEA is the data hub and publishes no prices); "Materials Market Data (Building Journal)" could not be found.
