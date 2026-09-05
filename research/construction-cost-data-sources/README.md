# US Construction Cost Data Sources — Exhaustive Catalog

**Purpose.** Map every scrapable or licensable source of US construction cost data (materials from nails to I-beams, labor, equipment, assemblies, indexes, and the geographic crosswalks that localize them) well enough to design an open alternative to RSMeans. For each source: where it lives, what it covers, how localized it is, how accurate, how often it updates, how you get it, and what the license allows.

**Files.**
- `README.md` — this document: the answer, the resolution ladder, the coverage matrix, the tiered source index, legal constraints, build order, and open gaps.
- `sources.csv` — machine-readable catalog (286 rows) with tier, category, URL, unit, geographic granularity, cadence, format, access method, all-bidder vs awarded, history depth, license, verification status.
- `appendix/` — the twelve underlying research reports (federal, state/local, commercial, retail/distributor, labor, localization method, equipment/open data, and five verification passes).

**Research date:** 5 September 2026. **Verification caveat:** the sandbox blocked direct fetches of every `.gov` and vendor host, so verification relied on search-result snippets, GitHub-hosted API clients and mirrors, and two DoD/GSA PDFs read from the WBDG S3 mirror. Every row in `sources.csv` carries a `verification` value (`verified`, `partially verified`, `knowledge`, `unverified`, `not found`, `pending verification`). Treat `knowledge` and `unverified` rows as leads to confirm before building on them. Section 9 lists what is still open.

---

## 1. The short answer

**There is no single public source that does what RSMeans does, and no federal or state body publishes a county-level composite location factor or an assembly-level material price book.** But the pieces exist, and they are better than most people assume:

1. **Real bid prices for civil work exist at district/county level in nearly every state.** State DOTs publish bid tabulations (usually all bidders) and average unit price reports for thousands of pay items: concrete by CY, asphalt by ton, rebar by LB, pipe by LF, excavation by CY, structural steel, signs, striping, traffic control. Texas publishes the entire all-bidder tabulation as an open Socrata dataset with county and district. Oregon, Idaho, West Virginia, Indiana, North Carolina, Virginia, Massachusetts, and Ohio publish structured spreadsheets or exportable apps. About twenty more publish per-letting tabs as parseable HTML or text. This is the deepest free source of localized *transaction* prices in the US.
2. **Labor is solvable at county level from public data.** BLS OEWS gives trade wages by MSA with percentiles; BLS QCEW gives county wages by NAICS 238 sub-trade quarterly; Davis-Bacon gives county base + fringe by craft for four construction types (with a scrapable, undocumented JSON endpoint on SAM.gov); state prevailing wage schedules in about 27 states are fresher union-scale compilations; Census QWI adds county new-hire earnings. Burden components (workers' comp by class code and state, SUTA, FICA) are public or semi-public.
3. **Material prices at store level are scrapable from big-box and distributor sites**, with real legal and anti-bot friction. Home Depot's GraphQL gateway returns batch price + inventory per store (about 2,000 stores); Lowe's product-detail endpoint does the same per store; Ace, Tractor Supply, Grainger, Zoro, Fastenal, SupplyHouse, Platt, City Electric, McMaster-Carr (official API) expose public prices. State DOT monthly asphalt/fuel/steel indexes give regional commodity movement free.
4. **Equipment is essentially solved for free**: Caltrans' annual rate book (about 2,176 standard models plus 7,300 miscellaneous, already parsed to JSON on GitHub), FEMA's 2025 Schedule of Equipment Rates, and USACE EP 1110-1-8 regional ownership/operating schedules, plus EIA weekly fuel by PADD/state.
5. **Location factors**: the best free composite is DoD's UFS 3-701-01 Area Cost Factors (213 CONUS locations, city/installation level, published methodology: 8 crafts, 18 materials, 4 equipment items, weighted 63/35/2). Below that, you build your own from the layers above. RSMeans' 900+ ZIP3 factors are largely interpolations of about 730 surveyed cities, so ZIP3 is not a resolution you need to match with observations.
6. **Productivity (labor hours per unit) is the real gap.** The only public-domain man-hour tables are the Navy's P-405 Seabee Planner's and Estimator's Handbook (1996), Army FMs, and pre-1929 editions of Walker's. NECA, MCAA, Craftsman, and RSMeans crew data are all copyrighted. No open dataset exists on GitHub. This is where an open project would need to survey or license.
7. **What you must not do:** copy RSMeans/BNi/Xactimate/Marshall & Swift numbers. RSMeans' terms explicitly prohibit use in a searchable database, redistribution, or use as a basis for pricing products. Emulate the *schema* (MasterFormat line, crew, daily output, bare M/L/E, O&P, CCI structure) and the *methodology*, not the numbers. Craftsman is the one commercial publisher with a formal bulk-data licensing program (Excel, Access, Bacpac, API; quarterly updates) if you want a licensed seed.

---

## 2. How localized can each cost component get?

| Component | Finest defensible resolution from public/scrapable data | Sources that reach it | What limits going finer |
|---|---|---|---|
| **Civil / heavy unit prices** (earthwork, asphalt, concrete, rebar, pipe, structural steel, traffic items) | **County / DOT district** | State DOT bid tabs (TX county; OR region; WV district; FL market area; VA district; NY region; IL county; WA county) | Sparse items in rural counties; state-specific pay-item codes need a crosswalk |
| **Building materials** (lumber, drywall, fasteners, roofing, insulation, plumbing, electrical, paint, flooring) | **Store / ZIP** for big-box SKUs; **branch** for distributor SKUs; **CBSA** as the honest aggregation unit | Home Depot GraphQL (`storeId`), Lowe's `/wpd/…/{store}/Guest/{zip}`, Ace Kibo API, Tractor Supply, Platt/CES/Elliott branch pricing, Fastenal branch stock | Anti-bot (Akamai, DataDome), ToS; MAP-hidden prices; pro pricing login-only; manufacturers publish nothing |
| **Commodities** (steel, copper, cement, aggregates, asphalt binder, lumber composites) | **State / region** | State DOT asphalt/fuel/steel/cement indexes (37 states verified, monthly); USGS Minerals Yearbook state cement/aggregate values (annual); SteelBenchmarker (national, twice monthly); EIA diesel by PADD/state (weekly) | Random Lengths/CRU/Platts are paid and non-redistributable |
| **Labor wage (bare)** | **County** | Davis-Bacon (county × type), QCEW (county × NAICS 4-6 digit, quarterly), OEWS (MSA/nonmetro × SOC with percentiles), state PW schedules (county in CA/NY/IL/MI/MO/MD/NJ/OH/WA/MN), QWI (county × NAICS 4) | OEWS suppression; Davis-Bacon survey rates can be a decade stale in non-union counties |
| **Labor fringe & burden** | **State** (WC class rates, SUTA) + **county** (DB/state PW fringe) | Oregon DCBS 50-state WC ranking; state rating bureaus and monopolistic-state tables; NCCI (paid); DOL ETA UI provisions; BLS ECEC (national/region benefit shares) | NCCI loss costs are paid; independent-bureau class codes differ |
| **Equipment** | **Region / state** | Caltrans (CA), USACE EP 1110-1-8 (12 regions), FEMA (national), EIA fuel (PADD/state) | Rental rates by ZIP are behind rental-company logins; EquipmentWatch is paid |
| **Productivity** | **National** | P-405, Army FMs, Caterpillar Performance Handbook | Nothing public and current; must license or survey |
| **Composite location factor** | **City/installation** (DoD ACF: 213 CONUS) → **county** if you build it from the layers above | UFS 3-701-01 Table 4-1; CWCCIS state factors (heavy civil); BEA RPP (state/MSA, general prices) | No public county-level composite exists |
| **Whole-building $/SF** | **Project / county** (calibration), **city** (benchmarks) | LIHTC cost data (WA WSHFC annual report, TX TDHCA logs, CA TCAC Excel, GAO-18-637 appendix), MSBA school costs, DoD Table 2, Census SOC by division, RLB/Cumming/Mortenson metro reports, NAHB | Scope definitions vary; permit valuations are self-declared and understated |
| **Scope drivers** (seismic, wind, snow, flood, frost, soils, climate zone, impact fees, sales tax, union density) | **Point / county / jurisdiction** | USGS design maps API, ATC Hazards API, FEMA NFHL, IECC county CSV, SSURGO, Duncan impact fee survey (2019), Avalara ZIP tax tables, unionstats | Frost depth and local code amendments must be hand-compiled |

**Practical ceiling: county for the composite factor; ZIP/store only where you actually hold store-level observations.**

---

## 3. Coverage matrix — "nails to I-beams" by cost item

| Item family | Absolute price source (localized) | Escalation/index source | Notes |
|---|---|---|---|
| Fasteners (nails, screws, bolts, anchors) | Home Depot/Lowe's store prices; Fastenal branch; Grainger/Zoro/McMaster list | PPI `WPU1081` (bolts, nuts, screws) | McMaster official API requires customer approval |
| Dimensional lumber, engineered wood, panels | Home Depot/Lowe's/Menards store prices; 84 Lumber partial | PPI `WPU081`, `WPU0811`; Random Lengths (paid; NAHB republishes composite chart); CME `LBR` | Pro yards (BFS, US LBM) do not publish |
| Structural steel, rebar, plate, joists | Ryerson online quotes by location; Metals Depot/OnlineMetals national; DOT bid tabs (rebar $/LB, structural steel $/LB) | SteelBenchmarker (free, twice monthly); PPI `WPU1017`, `WPU107`; state DOT steel indexes (NY, NC, IL, NH, WY) | Nucor/CMC/Gerdau mill prices are announcements only |
| Ready-mix concrete, cement, aggregates | DOT bid tabs (concrete $/CY by class; aggregate base $/ton); NRCS state cost lists | PPI `WPU1333`, `WPU1322`, `WPU1391`; USGS state cement/aggregate values; GDOT/WV cement indexes | No ready-mix producer publishes list prices |
| Masonry (brick, block, mortar) | Home Depot/Lowe's bagged products; DOT bid tabs for block/brick items | PPI `WPU1342` | Acme/General Shale/Glen-Gery do not publish |
| Asphalt paving | DOT bid tabs ($/ton by mix) | 37 state DOT monthly binder/fuel indexes; PPI `WPU1394` | Best regional commodity signal available free |
| Gypsum/drywall, insulation | Home Depot/Lowe's store prices; GMS/L&W/FBM login-only | PPI `WPU137`, `WPU1392` | |
| Roofing | Home Depot/Lowe's; ABC/Beacon/SRS login-only | PPI asphalt roofing series; NRCA surveys | |
| Doors, windows | Home Depot/Lowe's stocked SKUs | PPI millwork series | Andersen/Pella/Marvin dealer-only |
| Plumbing, pipe, fittings | SupplyHouse, PlumbingSupply, Home Depot/Lowe's; Ferguson partial; Core & Main login | PPI plastic pipe / copper tube series | Ferguson "Trade Partner API" appears in code but program unverified |
| Electrical (wire, conduit, devices, gear) | Platt, City Electric Supply, Elliott Electric (branch-localized public prices); Graybar list; Home Depot/Lowe's | PPI `WPU102603` copper wire; CME `HG` copper | Trade Service (Trimble) is the paid SKU-level list-price feed |
| HVAC equipment | HVACDirect, eComfort, AC Wholesalers, Alpine (public); Johnstone/Watsco login | PPI HVAC series | Carrier/Trane/Lennox dealer-only |
| Paint, coatings | Sherwin-Williams store-select; Home Depot/Lowe's | PPI `WPU0621` | |
| Flooring, tile | Floor & Decor store-select; Home Depot/Lowe's | PPI series | |
| Site utilities, fencing, culverts, erosion control | DOT bid tabs; NRCS EQIP cost lists by state; UFS 3-701-01 Table 6 | NHCCI components | NRCS lists are the only state-level absolute price for fencing/pipe/earthwork outside DOT work |
| Solar / EV | LBNL Tracking the Sun (per-system $/W, state); NREL benchmarks; Solar TRACE fees by AHJ | NREL ATB | Best-instrumented specialty trade |
| Equipment | Caltrans book; FEMA 2025 schedule; USACE EP 1110-1-8 | EIA fuel | |
| Labor | See section 5 | ECI, CES | |

---

## 4. Tiered source index

Tier 1 = public domain or open license, structured, machine-readable. Tier 2 = public but PDF/HTML that must be parsed. Tier 3 = publicly visible but ToS-restricted (scrape at your own risk) or third-party scraper APIs. Tier 4 = licensable commercial data. Full detail and URLs are in `sources.csv` and the appendices.

### 4.1 Federal (appendix 01, 08)
- **BLS PPI** (national, monthly; API + flat files) — material escalation. Only construction PPI with regional split: new nonresidential building by 4 Census regions.
- **BLS OEWS** (MSA/nonmetro/state, annual May; `oesm25all.zip` released 15 May 2026) — trade wage levels with percentiles. 25-character series IDs.
- **BLS QCEW** (county × NAICS 236/237/238 sub-industries, quarterly; open CSV slices, no key) — county labor multiplier. MSA industry detail dropped from Q3 2025; aggregate counties yourself.
- **BLS CES/SAE, ECI, ECEC** — monthly/quarterly labor escalation and benefit-burden shares.
- **Davis-Bacon (SAM.gov)** — county base + fringe by craft × Building/Residential/Heavy/Highway; weekly modifications; no official API or bulk file; undocumented JSON search/detail endpoints documented in open-source clients (`grey-flannel/usdol-wage-determination-data`, `cliwant/mcp-sam-gov`); govconapi.com resells ($19/mo).
- **Census** — BPS county permit valuations (annual county file `coYYYYa.txt` under `www2.census.gov/programs-surveys/bps/`), SOC microdata ($/SF by division), VIP, CBP, QWI (county × NAICS 4 earnings). **API key required for all Census API calls since May 2026.**
- **FHWA NHCCI** (national quarterly; BTS Socrata `wgzr-nyxc`) and FMIS project listings; **FHWA Federal Lands EEBACS bid unit price analysis** and Federal Lands bid tabs (bonus find).
- **USACE CWCCIS** (feature-code indexes, semiannual tables to Sep 2025; state adjustment factors), **EP 1110-1-8** equipment O&O (12 regions; latest verified edition Nov 2016), **MII/UPB** (about 70k items, licensed, not open).
- **DoD UFS 3-701-01 (2 Feb 2026)** — Area Cost Factors for 213 CONUS locations, $/SF by facility type, site/utility $/UOM, escalation tables; combined Excel "Related Materials" file on WBDG.
- **FEMA** — 2025 Schedule of Equipment Rates (PDF + OpenFEMA dataset); CEF cost codes are internal.
- **USDA NRCS EQIP payment schedules** — state-level typical unit costs for fencing, pipe, earthwork, concrete structures, roads; annual PDFs per state.
- **EIA** (weekly fuel by PADD/state; API v2), **FRED** (aggregator; 120 req/min), **USAspending** (contract awards by county × NAICS; no key), **BEA RPP** (state/MSA; 2024 data released Feb 2026), **HUD** (ZIP crosswalk API quarterly; TDC/HCC limits derived from RSMeans + Marshall & Swift), **FTA Capital Cost Database** (transit unit costs), **USGS** (state cement/aggregate values), **DOL OFLC** wage search, **NREL/LBNL** solar cost datasets.

### 4.2 State and local (appendix 02, 11, 12)
- **State DOT bid tabulations and average unit prices — 48 states catalogued.** Best structured: **TX** (Socrata `de7b-7dna`, all bidders, county, engineer's estimate; 44 columns listed in appendix 12), **OR** (XLSX with bidder rank by region), **ID** (XLSX with rank), **WV** (XLS by district, min/mean/max), **IN** (annual XLSX 2008+), **NC** (XLSM), **VA** (query app + XLSX), **MA** (weekly all-bid mean/median by quantity band), **OH** (Power BI with PDF/Excel export), **NDDOT** (annual Average Awarded Bid Prices PDFs). Parseable per-letting tabs: LA (ASP), NJ (TXT), AL (TXT), KS (CSV index), MI, MN, IL, DE, ME, AZ (4-month window — poll continuously). PDF annual books: CO (2001+), MT (2016+), TN, SD, AR, MO (by district), OK, MD, NY (by region), WY, NM, NE, NH, VT, GA (Item Mean Summary). Web-app only: Caltrans Contract Cost Data (district + year filters, imported every 2 weeks, no bulk export), FDOT (public dashboard blocks download), WSDOT Unit Bid Analysis (3 lowest bidders; bid tabs page has all bidders), PennDOT ECMS (3 lowest bidders item-by-item; Item Price History reportedly public), MS (JS app). No public average-price product: UT, NV, HI, CT, ME.
- **Aggregators:** Bid Express (44 agencies; paid Bid Tab Analysis), Oman BidTabs (46 states, feeds NHCCI, commercial), bidtabs.us (22 states free viewer since 2004 — check ToS).
- **State DOT asphalt binder / fuel / steel / cement price indexes — 37 states verified**, monthly. Genuinely regional: WSDOT (West/East), PennDOT (3 zones), Oregon (Boise/Portland), Ohio (Cleveland/Toledo/Cincinnati average), Montana (East/West). Caltrans now uses a single statewide Brent crude index, not regional asphalt indexes. Illinois exports CSV. Not found: TX, MN, MI, UT, NV, ND, NE, NM, DE, HI, DC.
- **State DOT construction cost indexes:** CO (quarterly), MN (quarterly, archive to 2009), WI CF-CCI (quarterly), IA (annual, 1987 base), NH (semiannual), MD SHA Price Index (semiannual), MI MHCCI (research report).
- **State prevailing wage schedules — about 27 states + DC** (best-supported list in appendix 11; DOL's own page is stale on Michigan). Machine-readable: **Maryland XLSX**, Washington multi-select export, Missouri county-parameterized app, Minnesota county pages, Michigan predictable per-county PDF path, California per-issue index pages, Illinois HTML tables, New York county web app. Ohio's new lookup (June 2025) is gated behind an OH|ID account. Rhode Island and Virginia simply adopt Davis-Bacon; Vermont uses OEWS mean + flat 42.5% fringe.
- **Assessor cost manuals with state-authored tables and regional multipliers:** **Oregon DOR Cost Factors for Residential Buildings** (county Local Cost Multipliers; rev. Oct 2024), **Illinois Pub 123/126** (central-Illinois base + local cost factor), **Indiana DLGF** (county Location Cost Multipliers), **Wisconsin WPAM Vol 2** (area modifiers), **California AH 531**, **North Carolina county Schedules of Values** (100 counties), **Texas CAD schedules**, Montana (state-published, M&S-derived), New Jersey (farm supplement confirmed). Vendor-mandated (do not republish): SD, NE, OK, UT, KS, ID, WA, MI (all Marshall & Swift), PA/CT (Tyler/Vision), MD (internal CAMA).
- **Permit data with valuation:** NYC, Chicago, LA, SF (has revised cost), Seattle, Austin (BLDS), Dallas, Philadelphia via Socrata/ArcGIS; **Shovels.ai** (178M permits, 2,750+ jurisdictions, paid API) nationally. Valuations are self-declared — use as relative index only.
- **Facility cost reports:** MSBA (MA schools, $/SF per project), Ohio OFCC, Florida cost-per-student-station, WA OSPI, TX THECB, CA DGS CCCI.
- **Municipal unit prices:** Austin Average Unit Bid Prices (48 months, quarterly), San Diego County unit price list, Riverside County, Maricopa MCDOT estimation app, Chicago DPS bid tabs.
- **LIHTC development cost data** (calibration for multifamily $/unit and $/SF): WA WSHFC annual cost data report, TX TDHCA application logs (XLSX), CA TCAC project Excel, FL FHFC underwriting PDFs, MN cost containment reports, NV application lists with TDC, NYC HPD open data; GAO-18-637 appendix (12 agencies) and Abt/NCSHA 2018 (2,500 properties). HUD's LIHTC database has no cost fields.
- **Sales tax:** Avalara free ZIP tables (monthly), CA CDTFA GIS, TX Comptroller files, Tax Foundation.
- **Workers' comp:** Oregon DCBS CY2024 50-state ranking (June 2025) with per-state index rates; state bureau PDFs (WCIRB, NYCIRB, PCRB, etc.); monopolistic-state tables (OH BWC, WA per-hour, WY by NAICS, ND); FL OIR posts NCCI filings; NCCI Class Look-Up needs a free account.

### 4.3 Retail and distributor material prices (appendix 04)
- **Home Depot** — `POST https://apionline.homedepot.com/federation-gateway/graphql` with `x-experience-name` header; ops `searchModel`, `productClientOnlyProduct`, `mediaPriceInventory` (25–50 items per call, per `storeId`); IDs: Internet # (itemId), Store SKU, Model #, UPC/GTIN, OMS ID; default store 2414 (Bangor) when omitted; Akamai Bot Manager (HTTP 206 "GenericError" on TLS/UA mismatch); about 1 rps sustainable. No public price API; Pro Xtra and HD Supply/SRS/GMS are login-gated.
- **Lowe's** — `GET https://www.lowes.com/wpd/{productId}/productdetail/{store}/Guest/{zip}` returns `finalPrice`, on-hand qty, MAP flag; cookies `sn`, `sd`, `zipcode`, `dbidv2`; Akamai; proxy geolocation can override store cookie. Official partner APIs (Products/Inventory/Stores) at `apis.lowes.com` for B2B registrants.
- **Menards** (Midwest, store-specific prices + 11% rebate; store cookie unverified), **Ace** (public Kibo JSON API with per-location inventory), **Tractor Supply** (per-store price endpoint; Akamai), **Walmart** (store cookies; Affiliate API national), **Floor & Decor**, **Harbor Freight**.
- **Distributors with public prices:** Platt, City Electric Supply, Elliott Electric (branch-localized), Graybar (list), Fastenal (branch stock), Grainger (list; CAPTCHA), Zoro (DataDome), MSC, SupplyHouse, HVACDirect/eComfort/AC Wholesalers/Alpine (HVAC equipment), Ryerson (metals quotes by location), Metals Depot, OnlineMetals, McMaster-Carr (official API for approved customers, per-part subscription). Login-only: Ferguson (partial), Winsupply, Hajoca, Core & Main, Johnstone, Watsco, White Cap (partial), SiteOne (partial), ABC, Beacon, SRS, GMS, L&W, FBM, Builders FirstSource, US LBM, 84 Lumber (partial).
- **Third-party scraper APIs** absorb anti-bot risk: SerpApi Home Depot engine (`store_id`, `delivery_zip`; no Lowe's engine), BigBox/Traject Data (from $15/mo, ZIP-localized), Unwrangle, Apify actors, Oxylabs (Lowe's, Menards), Bright Data (datasets not store-level), Nimble.
- **Upstream commodity series:** SteelBenchmarker (free PDF), USGS, EIA, FRED PPI; paid: Random Lengths, Fastmarkets AMM, CRU, Platts, LME, CME history, PCA, NRMCA, ICIS, DAT.

### 4.4 Commercial cost databases and indexes (appendix 03, 09)
- **RSMeans (Gordian)** — 85–97k line items (vendor figures inconsistent), 970 locations, 900+ US ZIP3 location factors, quarterly online; tiers Core/Complete/Complete Plus (prices reported anywhere from $396 to $5,973/yr; treat as unverified); API for licensees; **terms prohibit redistribution, searchable databases, and use as a basis for pricing products.**
- **Craftsman Book Co.** — National Construction Estimator family; ZIP3 area modification factors split material/labor; **formal data licensing (Excel, Bacpac, Access, PDF, API; quarterly updates)**; pricing negotiated.
- **BNi** — >15,000 units with man-hours; 600+ metro multipliers; BNi ACCESS bundled with books in three tiers (Reference tier has Excel-downloadable unit-cost DB).
- **Marshall & Swift (Cotality, rebranded from CoreLogic 24 Mar 2025)** — 825+ multiplier locations, quarterly; embedded in many state assessor rules; license requires consent and fees for integration.
- **Verisk Xactimate / 360Value** — 460+ geographic price lists (the "467" figure is not confirmed), monthly; per-user licensing (~$2,690/yr reported); 360Value 431 regions; feeds Zonda Cost vs Value.
- **1build → Handoff** — 1build marketed a county-level Cost Data API (68M costs); company rebranded to Handoff; API status in 2026 unconfirmed. Bolster and Buildxact were customers.
- **Indexes (free):** Turner (national quarterly; Q2 2026 = 1552), Mortenson (~7 metros), RLB (12–14 cities, $/SF ranges), Cumming (~10 metros), Gordian Cost Insights, Dodge Momentum, ABC backlog, NAHB Cost of Constructing a Home (2024: ~$162/SF), Zonda Cost vs Value (150 metros). Paid: ENR CCI/BCI (20 cities; 4-input basket), Compass International, CLRC union wage database, PAS craft compensation survey.
- **Equipment:** EquipmentWatch Blue Book (paid; specified by 47–48 DOTs), Rouse (rental-company only), Ritchie Bros results (login), rental quotes (login/ToS).
- **Labor units (copyrighted):** NECA Manual of Labor Units, MCAA WebLEM, PHCC, SMACNA, Walker's (current), Richardson's, Page's.

### 4.5 Open data, taxonomies, tools (appendix 07)
- **OpenConstructionEstimate DDC-CWICR** — 55,719 work items with labor/machine hours across 30 countries including a US track, but US prices are PPP-repriced (synthetic) and the data license is CC BY-NC 4.0. Useful as a structure/norm seed only. **OpenConstructionERP** (AGPL app) wraps it.
- **Taxonomies:** CSI MasterFormat/UniFormat/OmniClass are CSI-copyrighted (2016 MasterFormat JSON exists on GitHub; legally grey). **Uniclass 2015** (CC BY-SA CSV + public API) is the only fully open classification. ICMS, NRM, UNSPSC free with terms.
- **Tools on GitHub:** `bulklc/cm_tools` (Caltrans equipment book, 8 editions as JSON), `grey-flannel/usdol-wage-determination-data` (Davis-Bacon scraper/parser, MIT), `cliwant/mcp-sam-gov` (SAM.gov endpoint docs), `mikeasilva/blsAPI` and `armollica/qcew-data` (QCEW), `hiring-lab/*` (Indeed postings/wage trackers, CC BY 4.0), `tracykm/impact-fees` (Duncan 2019 survey as JSON), `IMMM-SFA/diyepw` (IECC zones by county), `aubreybailey/bigbox-stock-mcp` and `fruvs/hd-clearance-bot` (Home Depot GraphQL docs), `My-kal/lowes-crawler`, `ericboehs/tractor-supply-cli`.
- **Productivity (public domain):** NAVFAC P-405 (Oct 1996; mirrored on EverySpec), Army FM 5-412/5-426/5-424, TM 5-800-4, pre-1929 Walker's, Caterpillar Performance Handbook (free but proprietary).

---

## 5. Labor: how to get to a county-level loaded rate

1. **Base level (annual):** OEWS median (and P10–P90) for the SOC at the MSA/nonmetro area; adjust cross-industry to construction using the national NAICS-238x/SOC ratio.
2. **County disaggregation (quarterly):** ratio of QCEW county average weekly wage (NAICS 2382x private, 4-quarter average) to the same measure over the OEWS area; empirical-Bayes shrink toward 1 by employment; clip to roughly 0.80–1.25; fall back 23822 → 2382 → 238 → 23 → state on suppression; cross-check with QWI new-hire earnings.
3. **Escalation (monthly):** ECI construction wages (region) and CES state construction AHE; latest QCEW quarters override.
4. **Tiers:** journeyman = median; foreman = P75–P90; apprentice/helper = P25 or Davis-Bacon apprentice schedules.
5. **Union overlay:** parse active Davis-Bacon WDs; union-identified lines (e.g., `ELEC0113-005 06/01/2022`) are fresh CBA scale; survey lines (`SU…`) may be a decade old — age them with ECI as DOL now does; blend by union coverage from unionstats. In CBA-basis states (CA, IL, NY, NJ, PA, OH, MA, WA, MI) prefer the state schedule.
6. **Fringe:** union tier from DB/state schedule (split from local sheets where available); open-shop from ECEC construction benefit shares with a nonunion discount.
7. **Burden:** WC = state class-code loss cost × LCM / 100 × wage (Oregon DCBS for 50 classes across 50 states; bureau PDFs otherwise); FICA 7.65%; FUTA 0.6% on $7k; SUTA construction new-employer rate × wage base; GL 1–3% allowance.
8. **Validate** against CES state AHE, QWI hourly-equivalent, Davis-Bacon, Indeed posted-wage growth; publish P10–P90 bands and observation counts.

---

## 6. Localization method (appendix 06)

- **Basket:** define 3–5 building models (single-family, low-rise MF, mid-rise MF, light commercial, heavy civil) with published division weights and material/labor/equipment shares.
- **Component ratios per county:** materials from scraped store baskets by CBSA (tax-inclusive, freight-adjusted); labor from the section 5 blend; equipment by state/region.
- **Composite:** `LF_c = Σ_d w_d (m_d·M_{d,c} + l_d·W_{d,c} + e_d·E_c)`, with separate *scope multipliers* for seismic/wind/snow/flood/frost/soils/IECC zone applied to the divisions they affect rather than blended into the factor.
- **Calibration:** regress log(actual unit price or $/SF) from DOT bid tabs, LIHTC cost data, USAspending awards, and permit values on log(LF_c) plus project controls; shrink county effects toward CBSA/state parents.
- **Error bars:** bootstrap over basket items and wage sources; expect roughly ±3–5% in dense metros and ±8–12% in rural counties; publish observation counts.
- **Accuracy context:** AACE Class 5 through Class 1 ranges run from −50/+100% down to −3/+15%; RSMeans positions unit-price estimates at ±5% but its location factors have no published validation against bids. No GAO/DOT/academic study validating RSMeans CCI spatially was found; Garcia & Molloy (Fed, 2025) validate its *time* trend against Census. A published bid-tab-vs-factor validation would be a genuine contribution.

---

## 7. Legal constraints (not legal advice)

- **Government data:** BLS, Census, DOL, DOT, USACE, DoD, FEMA, NRCS, EIA outputs are US Government works (public domain). State DOT and DOL publications are public records; check individual state terms for bulk use (Caltrans, bidtabs.us, Bid Express have ToS).
- **Retail/distributor scraping:** prices, SKUs, model numbers are facts (Feist); do not copy descriptions, images, reviews. hiQ v. LinkedIn (2022) supports logged-out scraping under CFAA; Ryanair v. Booking (2024) shows credentialed access is different — never bulk-pull behind Pro Xtra, Lowe's Pro, or distributor logins. Home Depot, Lowe's, Menards, Grainger, McMaster ToS prohibit robots/data mining; expect IP bans and cease-and-desist risk; DMCA §1201 arguments against defeating Akamai/DataDome are untested. Rate-limit (≤1 rps/host), respect robots.txt, cache, identify your UA.
- **Commercial databases:** RSMeans terms bar redistribution, searchable databases, and pricing products; Marshall & Swift requires consent and fees for integration; Xactimate price lists are not licensed for external redistribution; Random Lengths/CRU/Platts index values are licensed compilations. Several state assessor manuals embed Marshall & Swift tables (MI, MT, SD, NE, OK, UT, KS) — republishing those numbers carries the same risk even though the PDF is public.
- **Taxonomy:** CSI MasterFormat numbers and titles are copyrighted; Uniclass 2015 is CC BY-SA.
- **Open datasets:** CWICR is CC BY-NC (no commercial use without a DDC licence); Indeed Hiring Lab is CC BY 4.0; LBNL Tracking the Sun is open.

---

## 8. Recommended build order

1. **County spine and crosswalks:** TIGER + OMB `list1_2023.csv` + HUD ZIP↔county API (quarterly) + IECC county CSV + BEA RPP.
2. **Labor layer:** QCEW county slices (no key), OEWS May 2025 zips, Davis-Bacon scraper (clone `grey-flannel/usdol-wage-determination-data`), state PW scrapers for MD (XLSX), WA, CA, IL, NY, MI, MO, MN; Oregon DCBS WC tables; ECI/CES for escalation.
3. **Civil unit-price layer:** TX Socrata first (all bidders, county, engineer's estimate), then OR/ID/WV/IN/NC/VA XLSX, MA CPE, OH Power BI export, then per-letting HTML/TXT parsers (LA, NJ, AL, KS, MI, MN, IL, DE, ME, AZ-polling), then PDF annual books. Build the pay-item crosswalk to a common civil schema (NHCCI item groups as the starting point).
4. **Commodity layer:** 37 state DOT asphalt/fuel/steel/cement indexes (monthly), SteelBenchmarker, USGS state values, EIA fuel, FRED PPI.
5. **Retail material layer:** Home Depot `mediaPriceInventory` over a fixed basket × store graph (from `StoreSearchServices`), Lowe's `/wpd` per SKU × store, Ace Kibo API, distributor branch prices; normalize IDs via UPC/GTIN and model number; Avalara ZIP tax.
6. **Equipment layer:** Caltrans JSON mirror, FEMA 2025 schedule, USACE EP 1110-1-8 parse, EIA fuel adjustment.
7. **Assemblies and $/SF benchmarks:** DoD UFS 3-701-01 Tables 2/6 + ACFs, Census SOC, NAHB, RLB/Cumming/Mortenson metro reports, LIHTC and school cost datasets for calibration.
8. **Productivity:** seed from P-405, Army FMs, pre-1929 Walker's, Caterpillar; plan to license Craftsman or survey contractors.
9. **Index construction and validation** per section 6; publish weights, factors, error bars, observation counts, and a bid-tab validation.

---

## 9. Verification status and open gaps

Search budget in this session was 200 queries total across all agents and ran out mid-way through the second verification pass. Items below were not resolved and should be the first tasks of a follow-up session with fresh search budget (or a machine with direct egress to `.gov` and vendor hosts):

**State DOT:** TX `de7b-7dna` history start and update frequency; TxDOT and MnDOT/MDOT(MI) asphalt/fuel index pages; UT/NV/HI/CT/ME average price products (likely none); Caltrans CCI standalone page; WSDOT/TxDOT/ODOT/FDOT/NYSDOT construction cost index pages; whether PennDOT Item Price History is truly public; MassDOT CPE export; Caltrans Contract Cost Data all-bidder coverage; GDOT Item Mean Summary editions after 2012.

**Prevailing wage / assessor:** Delaware, New Mexico, Colorado rate-table URLs; Tennessee 2026 PDF; Ohio lookup app URL; the authoritative 2026 count of state PW laws (27 + DC is best-supported; "32" claims are unsupported); assessor manuals for VA, SC, WV, KY, TN, OH, FL, VT, NH, ME, DE, AZ (current), NV, NM, WY, AK, HI; Alabama 2015 and Mississippi appraisal manual URLs; whether Colorado ARL Vol 3 and New Jersey's main manual carry per-SF tables.

**Federal:** ECEC construction-line dollar values; HUD 2025/2026 TDC schedules; USGS Minerals Yearbook state XLSX filenames; OFLC bulk file name; NHCCI current quarter and sub-index downloads; FEMA equipment code count; any EP 1110-1-8 edition after 2016; MII/UPB vendor and price; states other than FL posting NCCI loss-cost PDFs; BEA RPP bulk zip URL; EIA API rate limit.

**Commercial/retail (not attempted in verification):** EquipmentWatch owner/pricing; Trade Service owner; 1build/Handoff API status; Clear Estimates; ConstructConnect/Dodge ownership and licensing; Whitestone status; Compass; CLRC/PAS pricing; ENR history access; Home Depot/Lowe's/Menards robots.txt and ToS text; Platt/CES/Elliott/White Cap/SiteOne/Ryerson public-price behavior; Ferguson partner API existence; SerpApi/BigBox current pricing; HVAC distributor visibility; AI entrants' data APIs; Shovels pricing tiers.

**Calibration/validation (not attempted):** state school construction cost reports beyond MA/OH/FL/WA/TX; municipal average unit price databases beyond Austin/San Diego/Riverside/Maricopa/Chicago; procurement portal data exposure (PlanetBids, BidNet, DemandStar, Bonfire, OpenGov); any RSMeans-vs-bid or engineer's-estimate-vs-low-bid accuracy studies (state DOT research reports, NCHRP syntheses); AACE 18R-97/56R-08 citations; BuildZoom/Construction Monitor/Dodge permit-value terms.

**Corrections to common assumptions surfaced by verification:** Caltrans no longer publishes regional asphalt indexes (statewide Brent crude index instead); WSDOT Unit Bid Analysis returns only the three lowest bidders; FDOT's public dashboard blocks export; Census BPS county files live under `/programs-surveys/bps/`, not `/econ/bps/`; OEWS bulk path uses a hyphen (`special-requests`); OEWS series IDs are 25 characters; BEA 2024 RPP shipped in Feb 2026; Xactimate's list count is "more than 460", not 467; the Cotality rebrand was March 2025; DOL's state-PW page still omits Michigan's 2024 reinstatement; HUD's LIHTC database has no cost fields.
