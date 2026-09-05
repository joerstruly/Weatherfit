# Federal Sources of US Construction Cost Data

Verification: [VERIFIED] = confirmed from a fetched/searched official source (or an official PDF read from the WBDG S3 mirror); [UNVERIFIED] = prior knowledge, spot-check before use. The sandbox egress proxy blocked all .gov hosts, so most verification came via search extracts and GitHub mirrors of official API docs.

## 1. BLS — Producer Price Index (PPI): materials & construction output
| Field | Detail |
|---|---|
| URLs | API: `https://api.bls.gov/publicAPI/v2/timeseries/data/` (POST JSON; GET `.../data/{seriesID}`). Flat files: `https://download.bls.gov/pub/time.series/wp/` (commodity) and `.../pc/` (industry). Series-ID guide: `https://www.bls.gov/help/hlpforma.htm`. Commodity code list XLSX: `https://www.bls.gov/ppi/data-retrieval-guide/producer-price-index-commodity-data-series-id-codes.xlsx` [VERIFIED]. Inputs-to-construction factsheet: `https://www.bls.gov/ppi/factsheets/producer-price-index-by-commodity-for-inputs-to-industries-construction.htm`. |
| Series ID structure | Commodity: `WPU` + `U`/`S` + commodity code (e.g., `WPU081`); Industry: `PCU` + 6-digit NAICS + product code (e.g., `PCU236400236400`); Inputs-to-industry: `WPUIP…`. |
| Key series | [VERIFIED]: `WPU081` Lumber & wood products; `WPU1333` Ready-mixed concrete; `WPU1332` Concrete pipe; `WPU1342` Brick & structural clay tile; `WPU8011` New nonresidential building construction; `PCU236400236400` (+ regional sub-series `…222/223/224`); `PCU236500236500`; `WPUIP2300001` Inputs to construction, goods less foods & energy; `WPUIP2300002` Inputs, services; `WPUIP231000` new construction; `WPUIP231100` new residential; `WPUIP231200` new nonresidential; `WPUIP232000` maintenance & repair. [UNVERIFIED but standard]: `WPU0811` softwood lumber; `WPU1017` steel mill products; `WPU107` fabricated structural metal; `WPU1081` fasteners; `WPU102` nonferrous metal products; `WPU1022` copper & brass mill shapes; `WPU102603`-family copper wire & cable; `WPU1025` aluminum mill shapes; `WPU1322` cement; `WPU137` gypsum products; `WPU1391` construction sand/gravel/crushed stone; `WPU1392` insulation; `WPU1394` asphalt paving mixtures; `WPU0721` plastic construction products; `WPU0621` prepared paint; `WPU057303` No. 2 diesel; `WPU1311` flat glass; industry outputs `PCU236211236211`, `PCU236221236221`, `PCU236222…`, `PCU236223…`, `PCU236224…`; trades `PCU238110…`, `PCU238160…`, `PCU238210…`, `PCU238220…`. The AGC monthly "PPI Tables" PDF (`https://www.agc.org/sites/default/files/users/user21902/PPI%20Tables%202026_01%20Redo_v2.pdf`) is a curated list of ~40 construction PPI series IDs. |
| Covers / unit | Price indexes (not $); base 1982=100 for most commodities, Dec 2014=100 for IP series. |
| Geography | **National only**. Sole regional exception: 236400/236500 nonres building indexes by 4 Census regions since Nov 2016 [VERIFIED]. |
| Cadence / lag | Monthly, ~mid-month for prior month; revised 4 months later. |
| Access | REST JSON (v2 free key from `https://data.bls.gov/registrationEngine/`; 500 queries/day, 50 series/query, 20 years/query; v1 keyless: 25/day, 25 series, 10 years) [VERIFIED]. Flat files unlimited but BLS blocks non-browser user agents — set real UA + contact email. FRED mirrors most series. |
| License | Public domain; cite BLS. |
| Localization role | Temporal escalation of material costs (national). Not for geographic localization. |

## 2. BLS — OEWS
| Field | Detail |
|---|---|
| URLs | Tables: `https://www.bls.gov/oes/tables.htm` [VERIFIED]. Bulk zips: `https://www.bls.gov/oes/special-requests/oesm24all.zip`, `oesm24nat.zip`, `oesm24st.zip`, `oesm24ma.zip`, `oesm24in4.zip` [pattern UNVERIFIED]. County→area crosswalk: `https://www.bls.gov/oes/2024/may/county_links.htm` [VERIFIED]. |
| Covers / unit | Employment and wages by SOC (47-2031 carpenters, 47-2051 cement masons, 47-2061 laborers, 47-2073 operating engineers, 47-2111 electricians, 47-2152 plumbers/pipefitters, 47-2211 sheet metal, 47-2221 structural iron, 47-1011 supervisors…). Fields: `tot_emp, h_mean, a_mean, h_pct10, h_pct25, h_median, h_pct75, h_pct90`. $/hour excluding benefits/overtime. |
| Geography | National, state, ~530 MSAs + nonmetropolitan areas, national×industry [VERIFIED]. No county level. |
| Cadence / lag | Annual; May reference; released ~late March/early April following year (May 2024 released 2 Apr 2025 [VERIFIED]). |
| Caveats | Pools 6 semiannual panels over 3 years — not for YoY change; wages are all-industry cross-section; suppression in small areas. May 2024 adopted OMB Bulletin 23-01 metro definitions. |
| Access / license | XLSX/TXT zips, no key; public domain. |
| Localization role | Absolute local labor rates by trade by MSA; ratio (area/national) gives labor location factors. |

## 3. BLS — QCEW
| Field | Detail |
|---|---|
| URLs | CSV slices: `https://data.bls.gov/cew/data/api/{year}/{qtr|a}/industry/{naics}.csv` (e.g., `.../2024/1/industry/23.csv`) and `.../area/{areaFIPS}.csv` (e.g., `48201`) [VERIFIED pattern]. Docs: `https://www.bls.gov/cew/additional-resources/open-data/csv-data-slices.htm`. Annual zips: `https://www.bls.gov/cew/downloadable-data-files.htm`. |
| Covers / unit | Establishments, employment, total wages, average weekly wage by county × NAICS (236xxx, 237xxx, 238xxx) × ownership. |
| Geography | National, state, MSA, **county** [VERIFIED]. |
| Cadence / lag | Quarterly, ~5–6 months after quarter end; annual averages. Open-data API holds ~5 years; older in zips. |
| Caveats | Wage = all employees incl. office staff; suppression at fine NAICS×county. |
| Localization role | County-level labor cost multipliers by trade sector; interpolate OEWS MSA rates down to county. |

## 4. BLS — CES average hourly earnings, construction
- Series [VERIFIED]: `CES2000000003` AHE all employees, construction; `CES2000000008` AHE production/nonsupervisory; `…0007` avg weekly hours. State/metro via SAE: `SMU{state}{area}20000000003` [pattern UNVERIFIED].
- Monthly, first Friday, ~1-week lag. Flat files `pub/time.series/ce/` and `/sm/`; FRED. Use: monthly labor escalation.

## 5. BLS — Employment Cost Index (ECI), construction
- `CIU2012300000000I` Total compensation, private industry, construction (Dec 2005=100, quarterly) [VERIFIED]; wages-only analog `CIU2022300000000I` [UNVERIFIED]. National. Quarterly. Use: labor escalation incl. benefits burden.

## 6. DOL/SAM.gov — Davis-Bacon Wage Determinations
| Field | Detail |
|---|---|
| URLs | `https://sam.gov/wage-determinations`; individual WD pages `https://sam.gov/wage-determination/{WD#}/{revision}` e.g. `https://sam.gov/wage-determination/DC20250002/2` [VERIFIED]. DOL background: `https://www.dol.gov/agencies/whd/government-contracts/prevailing-wage-resource-book/db-wage-determinations`. |
| Covers / unit | Prevailing hourly base wage + fringe by classification (union-identified e.g. `ELEC0026-001`, or survey `SU…`) per county group, for Building, Residential, Heavy, Highway [VERIFIED]. Text format. |
| Geography | County (one WD may cover many counties; separate WDs per construction type). |
| Cadence | Weekly updates (Fridays) via modification numbers; annual January re-issue [VERIFIED]. SAM.gov official since 14 Jun 2019. |
| API / bulk | **No documented public WD API** — open.gsa.gov `_apidocs` has Opportunities, Entity, Exclusions, Contract Awards, Federal Hierarchy, Assistance Listings, but nothing for WDOL [VERIFIED by reading the GSA/open-gsa-redesign repo]. **No bulk download.** Third parties use SAM.gov web app's internal JSON endpoints (state/county/type filters, paginated); one vendor reports ~68,737 total WD records, ~4,235 (~6%) active. Undocumented endpoints may change. |
| License | Public domain. |
| Caveats | Survey-based (SU) rates can be years stale; many rural counties carry very old rates. |

## 7. Census Bureau
- **7a. Construction Spending (VIP)** — `https://www.census.gov/construction/c30/c30index.html`; API `https://api.census.gov/data/timeseries/eits/vip` [VERIFIED]. Monthly $ by category, national only. **Census API keys required as of 12 May 2026** (`https://api.census.gov/data/key_signup.html`) [VERIFIED].
- **7b. Building Permits Survey (BPS)** — `https://www.census.gov/construction/bps/`. Annual & monthly ASCII files at county (`CO{YYYY}A.TXT`), place, metro, state with buildings, units, valuation ($000s) by structure type [VERIFIED via `cntyasc.pdf`]. File tree `https://www2.census.gov/econ/bps/{County,Place,Metro,State}/` [UNVERIFIED]. Monthly ~1-month lag. Use: local $/unit permit valuations (self-reported, understated).
- **7c. Price Indexes of New Single-Family Houses Sold** — `https://www.census.gov/construction/cpi/index.html`. Quarterly constant-quality indexes, national + 4 regions; monthly Fisher deflator for houses under construction.
- **7d. Survey of Construction (SOC) microdata** — `https://www.census.gov/construction/chars/microdata.html`; doc `https://www2.census.gov/programs-surveys/soc/guidance/socmicro_info.pdf` [VERIFIED]. Annual CSV with sales price (`SLPR`), square footage (`SQFS`), region/division. 2025 file publishes 1 Jul 2026. Use: $/SF by census division.
- **7e. County Business Patterns** — API `https://api.census.gov/data/{year}/cbp` with `NAICS2017=23…` [VERIFIED]. Annual; ~2-year lag; establishments, employment, payroll by county/ZIP/MSA × NAICS.

## 8. FHWA — NHCCI, Bid Price Index, Highway Statistics, FMIS
- **NHCCI** `https://www.fhwa.dot.gov/policy/otps/nhcci/` [VERIFIED]; Data.gov `https://catalog.data.gov/dataset/nhcci`; BTS Socrata `https://data.bts.gov/Research-and-Statistics/National-Highway-Construction-Cost-Index-NHCCI-/wgzr-nyxc` [VERIFIED page; JSON endpoint `https://data.bts.gov/resource/wgzr-nyxc.json` UNVERIFIED]. Quarterly chained Fisher index from state DOT winning-bid pay items (Oman Systems BidTabs), national only, base 2003 Q1 = 1.0; NSA, SA, and component contributions. Math doc: `https://www.fhwa.dot.gov/policyinformation/nhcci/nhcci_math.pdf`.
- **Bid Price Index** (6 items) — quarterly, discontinued after 2006 (`https://www.fhwa.dot.gov/programadmin/pricetrends.cfm`) [VERIFIED]. Historical only.
- **Highway Statistics** `https://www.fhwa.dot.gov/policyinformation/statistics/` — obligations by state; financial, not unit prices.
- **FMIS project-level data** — `https://www.fhwa.dot.gov/transparencyact/` (e.g., `2024/2024_FMISF_intro.html`) [VERIFIED]: per project state, number, title, obligations, estimated total cost, county, improvement type. HTML/Excel per state. No federal open bid-tab dataset.

## 9. USACE — CWCCIS, Area Cost Factors, MII/MCACES
- **CWCCIS (EM 1110-2-1304)** `https://www.publications.usace.army.mil/Portals/76/Publications/EngineerManuals/EM_1110-2-1304.pdf` [VERIFIED exists]; editions 2018, 2021. Table A-1 quarterly indexes by Civil Works feature code (01 Lands, 02 Relocations, 03 Reservoirs, 04 Dams, 05 Locks, 06 Fish & wildlife, 07 Power plant, 08 Roads/RR/bridges, 09 Channels, 10 Breakwaters, 11 Levees, 12 Navigation ports, 13 Pumping plant, 14 Recreation, 15 Floodway control, 16 Bank stabilization, 17 Beach replenishment, 18 Cultural resources, 19 Buildings/grounds/utilities, 20 Permanent operating equipment, 30 PED, 31 CM) — semiannual; A-2 yearly forecast indexes; **A-3 State Adjustment Factors** (state level, annual). Base 1967=100 [UNVERIFIED]. PDF only.
- **DoD Area Cost Factors** — see §10; Army-specific in PAX Newsletter 3.2.1 (`https://usace.contentdm.oclc.org/digital/api/collection/p16021coll8/id/4441/download`, 31 Mar 2023) [VERIFIED exists].
- **MII/MCACES + Cost Book (UPB)** — ~70,000 line items; software free to USACE A-Es but **Cost Book database license must be purchased** [VERIFIED]. Not open data.

## 10. DoD — UFC/UFS 3-701-01 Facilities Pricing Guide (read directly from PDFs) [VERIFIED]
- **Current edition: UFS 3-701-01, 2 February 2026** (superseded UFC 3-701-01 of 17 Mar 2022 Ch.7). Page: `https://www.wbdg.org/dod/ufc/ufc-3-701-01`; PDF `https://www.wbdg.org/FFC/DOD/UFC/ufs_3_701_01_2026.pdf` (S3 mirror `https://nibs-s3-wbdg3-production.s3.us-east-1.amazonaws.com/FFC/DOD/UFC/ufs_3_701_01_2026.pdf`). **All data tables are in one combined "Related Materials" spreadsheet** on the WBDG page — that is the scrape target.
- **Table 2 — Facility unit costs** ($/SF and $/SM, as of Oct 2024) by DoD facility type, from ≥3 project awards since Sep 2021, normalized to ACF=1.0, escalated via DoD Selling Price Index. **Table 3** — Plant Replacement Value and Sustainment unit costs. **Table 6** — supporting-facility unit costs in $/UOM (site work, utilities, paving), built as MII assemblies from the 2024 Costbook with full markups. **Tables 4-2/4-3/4-4** — escalation factors by program year.
- **Table 4-1 Area Cost Factors:** ratio to a **96-Base-City average = 1.00**. Market basket of **8 labor crafts, 18 materials, 4 equipment items**, weighted M/L/E = **63/35/2** for MILCON (46/53/1 sustainment), modified by 7 matrix factors (weather, seismic, climatic, labor availability, OH&P, logistics, productivity). **2024 survey: 213 CONUS locations (incl. 96 base cities) + 55 OCONUS**; annual. Granularity city/installation, not every county. Guide warns ACFs are for programming-level costs, not for adjusting line items.
- License: US Government work. Use: best free location multiplier for building construction (city level); Tables 2/6 = benchmark $/SF and $/UOM.

## 11. GSA
- **P-120 (PBS 1000.6B, 7 Nov 2022)** — estimating policy (Uniformat II, escalation methodology). **Contains no cost index, location factors, or unit prices** [VERIFIED by grepping the PDF]. No public "GSA construction cost index."
- **CALC** — 18F repo archived 2019 [VERIFIED]; services labor categories, not trades.
- **GSA Advantage / eLibrary** — item-level MRO pricing in GSA Advantage (no public API); eLibrary links to vendor price-list files per MAS contract [VERIFIED]. Moderate value for material list-price benchmarks.

## 12. FEMA
- **Cost Estimating Format (CEF)** `https://www.fema.gov/public-assistance-cost-estimating-format-standard-operating-procedure`; tools `https://www.fema.gov/assistance/public/tools-resources/cost-estimating-tool` [VERIFIED]. Excel template Parts A–H. **FEMA cost-code unit prices are not published openly** (Grants Portal, login required).
- **Schedule of Equipment Rates** — national hourly rates for ~1,000 equipment types (codes 8xxx), revised every 2–3 years, `https://www.fema.gov/assistance/public/schedule-equipment-rates` (also `https://www.fema.gov/assistance/public/tools-resources/schedule-equipment-rates`). Best free equipment-rate table; rates exclude operator.
- **OpenFEMA API** — `https://www.fema.gov/api/open/v2/PublicAssistanceFundedProjectsDetails` (project amounts by county/damage category), no key, JSON/CSV [UNVERIFIED this session].

## 13. USDA NRCS — EQIP Payment Schedules
- `https://www.nrcs.usda.gov/getting-assistance/payment-schedules` → state pages e.g. `https://www.nrcs.usda.gov/state-offices/oregon/payment-schedule`; sample `https://www.nrcs.usda.gov/sites/default/files/2024-11/FY25_EQIP_CostList_RestOfState.pdf` (Kansas) [VERIFIED].
- Per practice code (342 Critical area planting, 382 Fence, 410 Grade stabilization, 430 Irrigation pipeline, 516 Livestock pipeline, 560 Access road, 587 Structure for water control, 620 Underground outlet…) × scenario: **typical cost** ($/ft, $/CY, $/ac, $/ea) built from component costs (materials, labor, equipment, mobilization).
- Geography: **state** (some regional splits). Cadence: annual, Oct–Dec. Format: PDF (some Excel) per state — ~50 heterogeneous files. Public domain. Rare source of absolute state-level unit prices for earthwork, fencing, pipe, concrete structures, roads. Costs are program "typical" estimates, not bids.

## 14. Bureau of Reclamation — Construction Cost Trends
- `https://www.usbr.gov/tsc/techreferences/mands/cct.html`; PDFs like `.../cct-pdfs/cct16-19.pdf` [VERIFIED]. Quarterly since 1940; composite + ~30 category indexes (earth dams, concrete dams, pipelines, pumping plants, canals, transmission lines). PDF only. Use: water-infrastructure escalation.

## 15. EIA — fuel & energy
- API v2: `https://api.eia.gov/v2/petroleum/pri/gnd/data/?frequency=weekly&data[0]=value&facets[product][]=EPD2D&facets[duoarea][]=R10`. Free key `https://www.eia.gov/opendata/register.php` [VERIFIED]. Weekly diesel by US, PADDs/sub-PADDs, ~9 states/cities; natural gas; electricity retail by state monthly. Use: fuel surcharges for hauling/asphalt/equipment.

## 16. FRED
- `https://api.stlouisfed.org/fred/series/observations?series_id=WPU081&api_key=…&file_type=json`; free key; **120 requests/min per key** [VERIFIED]. Mirrors BLS PPI/CES/ECI, Census VIP/permits. Some third-party series not redistributable.

## 17. USAspending / FPDS
- USAspending API v2, no auth: `POST https://api.usaspending.gov/api/v2/search/spending_by_award/` (filters `naics_codes`, `psc_codes`, `place_of_performance_locations`, `time_period`, `award_type_codes`) [VERIFIED]; `spending_by_transaction` more reliable for NAICS; `POST /api/v2/bulk_download/awards/` zipped CSV [VERIFIED]. Archives `https://files.usaspending.gov/award_data_archive/` [UNVERIFIED]. FPDS ATOM `https://www.fpds.gov/ezsearch/FEEDS/ATOM?FEEDNAME=PUBLIC&q=…` [UNVERIFIED]. Use: project-level cost benchmarks by county × NAICS 236/237/238; no unit prices.

## 18. VA and NPS
- **VA CFM** `https://www.cfm.va.gov/cost/`, Cost Estimating Manual (Aug 2022) `https://www.cfm.va.gov/cost/CostEstimatingManual.pdf` [VERIFIED]. **VAMC unit-cost guides moved to VA intranet** — not public.
- **NPS DSC** Cost Estimating Requirements Handbook (2025 DOCX `https://www.nps.gov/dscw/upload/CostEstimatingRequirementsHandbook-062025-508.docx`) [VERIFIED]; cost database internal.

## 19. DOE / NREL — solar & storage
- PV system cost benchmarks Q1 2025 dataset `https://www.osti.gov/dataexplorer/biblio/dataset/3009689` [VERIFIED]; battery cost projections 2025 `https://docs.nlr.gov/docs/fy25osti/93281.pdf` [VERIFIED]; ATB `https://atb.nrel.gov` CSV [UNVERIFIED]. NREL rebranding to NLR — URLs shifting. National, annual.

## 20. Additional federal sources
- **BEA Regional Price Parities** — annual RPP by state and MSA; API `https://apps.bea.gov/api/data` (free key); bulk `apps.bea.gov/regional/zip/MARPP.zip`, `SARPP.zip`.
- **HUD Total Development Cost (TDC) & Housing Construction Cost (HCC) limits** — annual notices, $/unit by bedroom count per PHA locality (city level), derived from RSMeans/Marshall & Swift with HUD multipliers [UNVERIFIED].
- **FTA Capital Cost Database** — transit project unit costs by Standard Cost Category, Excel [UNVERIFIED].
- **USGS Mineral Commodity Summaries / Minerals Yearbook** — annual avg prices for cement, crushed stone, sand & gravel, gypsum, copper; state production [UNVERIFIED].
- **DOL OFLC Online Wage Library** — OEWS-derived 4-level prevailing wages by SOC × MSA, yearly extract [UNVERIFIED].

## 21. Layering federal sources into a localization model
| Layer | Source | Granularity | Role |
|---|---|---|---|
| Material escalation (time) | BLS PPI commodities (WPU…), inputs-to-construction (WPUIP…) | National, monthly | Escalate base material prices |
| Output/assembly escalation | PPI PCU2362xx, WPU8011; NHCCI (highway); CWCCIS (civil); USBR CCT (water) | National (236400 by 4 regions), monthly/quarterly | Escalate whole-building/heavy costs |
| Labor rate (absolute) | OEWS (MSA/nonmetro), Davis-Bacon (county) | MSA / county | Local crew $/hr by trade |
| Labor escalation | CES AHE, ECI construction | National (state via SAE) | Bring OEWS forward from May reference |
| Labor location factor | QCEW county avg weekly wage by NAICS 238xxx ÷ national | County | Interpolate MSA→county |
| Composite location factor | DoD ACF (Table 4-1) | ~213 cities | Blended multiplier |
| State factor (civil) | CWCCIS Table A-3 | State | Heavy-civil multiplier |
| Equipment rates | FEMA Schedule of Equipment Rates | National | $/hr |
| Fuel adjustments | EIA weekly diesel by PADD/state | PADD/state | Surcharges |
| Absolute unit prices (site/civil) | NRCS payment schedules; UFS 3-701-01 Table 6 | State; national | $/LF fence, $/CY earthwork, $/SF paving |
| Building benchmarks | UFS 3-701-01 Table 2; SOC price/SF; HUD TDC | National/city; division; locality | $/SF sanity checks |
| Project-level actuals | USAspending/FPDS; FHWA FMIS; OpenFEMA PA | County/project | Calibration |

**Biggest gaps vs RSMeans:** no federal source gives a county-level composite location factor (DoD ACF is city-level; CWCCIS is state-level); no federal source publishes assembly-level material unit prices (MII Cost Book is licensed; FEMA cost codes are internal). Materials must be priced from PPI indexes anchored to a base you establish (vendor quotes, GSA Advantage price lists, NRCS component costs).
