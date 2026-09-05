# Localizing US Construction Costs: Sources, Resolution, and an Open-Index Method

Legend: [V] confirmed via a GitHub-hosted artifact this session (official repos, OpenAPI mirrors, API client code, mirrored reference text); [K] prior knowledge, not verifiable in this session.

## 1. Existing location-factor systems

| Source | URL | Spatial resolution | Cadence | Access / format | License | Caveats | Status |
|---|---|---|---|---|---|---|---|
| **RSMeans City Cost Index & Location Factors** | rsmeans.com | "over 730 cities in 900+ 3-digit zip codes"; CCI split Material / Installation / Total per MasterFormat division; Location Factor = single weighted total | Annual books; quarterly online | Paid | Proprietary | National base = "a mathematical average of trade-specific wages in 30 major U.S. cities," not a US-wide mean; wage type union / open-shop / residential per book; small ZIP3s interpolated from parent city; equipment not localized | [V] quotes |
| **Craftsman Area Modification Factors** | craftsman-book.com | State and 3-digit ZIP; split Material / Labor / Total | Annual | Paid book; National Estimator software | Proprietary | Residential/light-commercial bias; ZIP3 interpolated; no division breakdown | [K] |
| **Marshall & Swift / Cotality** | cotality.com | Local multipliers by state/city and ZIP; current-cost multipliers; climatic (mild/moderate/extreme) & seismic-zone adjustments; story-height/perimeter | Monthly (online), quarterly (books) | Paid | Proprietary | Replacement cost new, not bid cost | [K] |
| **ENR CCI / BCI** | enr.com/economics | 20 cities + national | Monthly | Paid; headlines republished | Proprietary | Basket: "200 hours of common labor at the 20-city average… plus 25 cwt of standard structural steel shapes… plus 1.128 tons of Portland cement… plus 1,088 board-ft of 2×4 lumber"; BCI uses skilled labor. Weak as a location index | [V] basket |
| **Turner Building Cost Index** | turnerconstruction.com/cost-index | National only | Quarterly | Free | Free to cite | Q2 2026 = 1552 (+1.44% q/q, +5.15% y/y) | [V] |
| **Mortenson Construction Cost Index** | mortenson.com/cost-index | ~7–8 metros | Quarterly | Free | Free to cite | Sample = Mortenson's own bid model | [K] |
| **RLB Construction Cost Report** | rlb.com/americas/insight/ | ~12–14 cities; $/sf ranges by type + city index | Quarterly | Free PDF | Free to cite | Q2 2026 national index 288.58; city escalation Chicago 1.42% → Honolulu 5.93% | [V] values |
| **Cumming Group Market Analysis** | cumming-group.com (e.g. `…/2025/09/CummingGroup_Market_Analysis_25Q2.pdf`) | ~10+ metros; $/sf by type | Quarterly | Free PDF | Free to cite | Consultancy opinion | [V] URL |
| **DoD UFC 3-701-01 Area Cost Factors** | wbdg.org/ffc/dod/unified-facilities-criteria/ufc-3-701-01 | Hundreds of CONUS locations (states, cities, installations) + OCONUS; single composite | Annual | Free PDF + Excel | Public domain | Blends labor/material/equipment plus weather/seismic/remoteness; installation-centric; not by division | [K] |
| **USACE CWCCIS** | usace.army.mil/Cost-Engineering/cwccis | National, by civil-works feature | Quarterly | Free PDF/Excel | PD | Time index; state factors in Table A-3 | [K] |
| **Xactimate (Verisk)** | verisk.com/products/xactimate | ~460+ US price lists; ZIP → price list; line-item M/L/E | Monthly | Paid | Proprietary | Insurance-repair pricing; ESX file = ZIP w/ XML (per open-source ESX tools) | [K] count; ESX [V] |
| **e2Value; Cotality RCT** | e2value.com; cotality.com | ZIP-level replacement cost | Continuous | Paid API | Proprietary | Insurance | [K] |
| **HUD** | Federal Register "High Cost Percentages" | High-cost % by area for FHA limits | Annual | Free | Public | Policy multiplier | [K] |
| **VA CFM cost/location factors** | cfm.va.gov/til/cost.asp | VA facility locations | Periodic | Free PDF | Public | Small set | [K] |
| **NAHB Cost of Constructing a Home** | nahb.org | National (41 usable responses) | Biennial | Free summary | Cite | 2024: avg sale price $665,298; construction 64.4% ($428,215; 2,647 sf); site work 7.6% incl. 1.5% impact fees | [V] |
| **Zillow ZHVI / Redfin Data Center** | zillow.com/research/data; redfin.com/news/data-center | ZIP / county / metro | Monthly | Free CSV | Attribution | Prices, not costs | [K] |
| **BEA Regional Price Parities** | apps.bea.gov/regional/zip/MARPP.zip, SARPP.zip; API apps.bea.gov/api | State, MSA (376 metros, 2008–2024), metro/non-metro portion; goods / rents / other | Annual (Dec) | Free bulk ZIP + API (key) | Public | General price level; rents dominate | [V] |
| **BLS metro CPI** | bls.gov/cpi/regional-resources.htm | ~23 metros | Monthly/bimonthly | Free API | Public | Consumer basket | [K] |
| **C2ER Cost of Living Index** | coli.org | ~260–300 urban areas | Quarterly | Paid; state averages republished by MERIC | Proprietary | Not construction | [K] |
| **MIT Living Wage** | livingwage.mit.edu/counties/{FIPS} | County & MSA | Annual | Free web | Non-commercial | Labor floor proxy | [V] URL |
| **OPM locality pay** | opm.gov | ~58 locality areas | Annual | Free | Public | White-collar proxy | [K] |
| **unionstats.com** | unionstats.com | State; construction industry; MSA tables | Annual since 1973 | Free Excel | Citation required | Small CPS cells | [V] |

## 2. Literature and methodology

**How location factors are built.** For location *L*, price a composite building model by division *d* with weights *w_d*; split each division into material share *m_d*, labor *l_d*, equipment *e_d*:

`LF_L = Σ_d w_d · [ m_d·(M_{d,L}/M_{d,nat}) + l_d·(W_{d,L}/W_{d,nat}) + e_d·(E_L/E_nat) ]`

RSMeans prices a basket of materials from local suppliers and trade wages per city; equipment essentially national. DoD ACF adds weather, seismic, remoteness and mobilization loadings on top of the basket.

| Work | What it does | Relevance | Status |
|---|---|---|---|
| Gyourko & Saiz (2006), *J. Regional Science*, "Construction Costs and the Supply of Housing Structure" | RSMeans CCI across metros; modest spatial dispersion, linked to union share, regulation, topography | Baseline of "real" variance | [K] |
| Albouy & Ehrlich (2018), *JUE* | RSMeans CCI as cost input; separates land vs structure | Hedonic decomposition | [K] |
| D'Amico, Glaeser, Gyourko, Kerr, Ponzetto, "Why Has Construction Productivity Stagnated?" (SSRN 4679195) | RSMeans SF costs for 24 of 36 years (1985–2021) | RSMeans is the only long panel | [V] |
| Garcia & Molloy (2025, Federal Reserve), "Productivity Growth in Construction" | RSMeans costs for 8 housing types 1987–2019 rose 2.7–3.6%/yr, matching Census single-family price index | RSMeans time trend not biased vs Census | [V] |
| Terner Center: "The Hard Costs of Construction" (2020); LIHTC cost studies (Reid, 2020); fee studies | CA multifamily hard-cost microdata; fees avg $23,455/unit (2015, ~3× national); LIHTC fees ~$19,806/unit | Best public hard-cost microdata for CA | [V] via secondary |
| GAO-18-637 (2018), LIHTC | ~1,849 projects across 12 agencies; per-unit cost by state | Only cross-state LIHTC cost compilation | [K] |
| NAHB/NMHC "Cost of Regulations" (2022) | Regulation = 40.6% of multifamily development cost | | [V] via secondary |
| Turner & Townsend ICMS; Arcadis; Compass International | City-level $/m² or relative indexes | Cross-checks | [K] |

## 3. Geographic building blocks and crosswalks (free)

| Layer | URL / endpoint | Resolution | Cadence | Access | License | Caveats | Status |
|---|---|---|---|---|---|---|---|
| Census TIGER/Line | www2.census.gov/geo/tiger/ | County, place, ZCTA, tract | Annual | Shapefiles | Public | ZCTA ≠ USPS ZIP | [K] |
| HUD USPS ZIP crosswalks | `https://www.huduser.gov/hudapi/public/usps?type={1..}&query={ZIP|state|All}`; docs huduser.gov/portal/dataset/uspszip-api.html | ZIP→tract (type=1), ZIP→county (type=2), ZIP→CBSA, ZIP→CD; `res_ratio`, `bus_ratio`, `oth_ratio`, `tot_ratio` | Quarterly | Free API (Bearer token) + Excel | Public | Ratios are address counts | [V] |
| OMB CBSA delineation | `https://www2.census.gov/programs-surveys/metro-micro/geographies/reference-files/2023/delineation-files/list1_2023.csv` | County→CBSA/CSA | Per OMB bulletin | CSV/XLS | Public | Match vintage to OEWS/RPP | [V] |
| BLS OEWS | `https://www.bls.gov/oes/special-requests/oesm{YY}all.zip` | National, state, MSA, nonmetro | Annual | ZIP/XLSX (needs browser UA) | Public | No benefits; suppression | [V] |
| BLS QCEW | `https://data.bls.gov/cew/data/api/{YEAR}/{QTR|a}/area/{AREA_FIPS}.csv`, `/industry/{NAICS}.csv` | County × NAICS | Quarterly | CSV, no key | Public | Weekly wage | [V] |
| Davis-Bacon | sam.gov/wage-determinations | County × type × classification | Weekly | Internal JSON + WD text | Public | "No documented public REST API… only working endpoint is the website's internal search" | [V] |
| IECC climate zones by county | DOE/PNNL `climate_zones.csv` (State FIPS, County FIPS, IECC zone, moisture regime, BA zone) — mirrored e.g. in `IMMM-SFA/diyepw` | County | Static (2021 IECC changed some) | CSV | Public | Verify vintage | [V] |
| ASHRAE 169 | ashrae.org | County | Edition | Paid | Proprietary | | [K] |
| ATC Hazards by Location API | `https://api-hazards.atcouncil.org/public/v1/wind.json?group=asce7-16&lat=&lng=`, `snow.json`, seismic | Point; ASCE 7-05/10/16/22 wind, snow, seismic, ice, rain, tornado | Live | Free API | ATC terms (non-commercial typical) | Confirm commercial terms | [V] |
| USGS Design Maps | `https://earthquake.usgs.gov/ws/designmaps/asce7-22.json?latitude=&longitude=&riskCategory=&siteClass=&title=` (also asce7-16, asce7-10) | Point | Live | Free JSON | Public | Seismic only | [V] |
| FEMA NFHL | `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query?geometry=lng,lat&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=FLD_ZONE,ZONE_SUBTY,SFHA_TF&f=json` (layer 28 = flood zones; 17 = BFE) | Polygon/point | Continuous | ArcGIS REST | Public | Coverage gaps | [V] |
| Frost depth | No national dataset; local code amendments, state DOT/NWS maps | Jurisdiction | — | PDFs | — | Hand-compile | [K] |
| USDA SSURGO | `https://sdmdataaccess.nrcs.usda.gov/Tabular/post.rest` (SQL); WFS `/Spatial/SDMWGS84Geographic.wfs` | Map unit polygon | Annual | Free | Public | Engineering-property queries | [V] |
| Building code adoption | iccsafe.org/adoptions; energycodes.gov/status | State (+ local amendments) | Rolling | Web | Public/ICC | No structured local-amendment dataset | [K] |
| Local sales tax | `https://www.avalara.com/taxrates/en/download-tax-tables.html` (`ZipCode`, `EstimatedCombinedRate`…) | ZIP | Monthly | Free CSV (registration) | Avalara terms | Materials taxability varies | [V] |
| Impact fees | Duncan Associates National Impact Fee Survey (impactfees.com; 2012, 2019 editions; 2019 data as JSON in `tracykm/impact-fees`) | City/county (~270 jurisdictions) | Irregular | Free PDF | Cite | Newer than 2019 unconfirmed | [V] |
| Union density | unionstats.com | State; MSA | Annual | Free | Cite | | [V] |
| Energy prices | EIA SEDS + API v2 | State | Annual/monthly | Free API | Public | | [K] |
| Freight distance | DIY: retailer DC locations + OSRM/OpenRouteService | Point | — | Free | — | Proxy | [K] |

## 4. Transaction data with locations (for calibration)

| Source | URL | Resolution | Cadence | Access | License | Caveats | Status |
|---|---|---|---|---|---|---|---|
| **State DOT bid tabs / avg unit prices** | state DOT sites | Item × district/county × letting | Monthly–annual | Excel/PDF | Public | Heavy-civil items only | [K] |
| **Public school construction cost reports** | state DOE (FL cost-per-student-station; TX; CA OPSC; MD IAC; NC DPI) | Project × county; $/sf | Annual | PDF/XLS | Public | Inconsistent scope | [K] |
| **Municipal bid portals** (PlanetBids, BidNet Direct, DemandStar, OpenGov, Bonfire) | per-agency | Solicitation × agency; tabs with award amounts | Continuous | Web; some login | ToS | Unstructured PDFs | [K] |
| **USAspending API** | `api.usaspending.gov/api/v2/search/spending_by_award/`, `/download/awards/` — filters `naics_codes` {require/exclude}, `place_of_performance_locations` [{country:"USA", state, county: 3-digit FIPS, city, zip}], `award_type_codes` A–D, `time_period` (from 2007-10-01) | County/ZIP × NAICS × $ | Daily | Free REST + bulk | Public | Obligations ≠ bid | [V] |
| FPDS | fpds.gov ATOM | Same | Daily | XML | Public | Verbose | [K] |
| **LIHTC cost certifications via state HFAs** — CA TCAC, TX TDHCA (application logs w/ cost/unit Excel), FL FHFC, WA WSHFC, MN Housing, OR OHCS | state HFA sites | Project × county; TDC, hard cost, per-unit | Annual rounds | PDF/Excel; TDHCA & TCAC most structured | Public | Format variance; affordable-housing premium | [K] |
| **Terner Center / Urban Institute** | ternercenter.berkeley.edu; urban.org | CA multifamily microdata; national LIHTC | Ad hoc | PDF | Cite | CA-centric | [K] |
| **Census SOC microdata** | census.gov/construction/chars/microdata.html | Division × metro flag; FSLPR, FSQFS, contract price | Annual | CSV | Public | No state/county | [K] |
| **Dodge; ConstructConnect** | paid | Project × address × value | Continuous | Paid | Proprietary | Best coverage, expensive | [K] |
| **Shovels.ai permit API** | `https://api.shovels.ai/v2` (`/permits/search` requires `geo_id` + `permit_from`/`permit_to`; filters `permit_tags`, `permit_min_job_value`, `permit_status`, `property_type`, `contractor_name`; returns `job_value`, `issue_date`, `geo_id`; `/contractors`, `/properties`; docs docs.shovels.ai; MIT CLI) | ZIP / city / county / jurisdiction | Continuous | Paid, credit-metered (429 limits) | Proprietary | Applicant-declared valuation | [V] |

## 5. Methodological recommendation

### 5.1 Finest defensible resolution by component
| Component | Native resolution | Why | Primary inputs |
|---|---|---|---|
| **Materials** | CBSA / ZIP3 (interpolate to county via HUD crosswalk) | Prices set at distributor/yard level; big-box near-uniform within metro; freight and sales tax drive residual | Scraped retailer/distributor quotes for a fixed basket; Avalara ZIP tax; distance-to-DC; PPI checks |
| **Labor** | County | Davis-Bacon county-native; QCEW county × NAICS 238; OEWS MSA × trade | DB, OEWS, QCEW, unionstats; MIT living wage floor |
| **Equipment** | Census region / state | Rental rates national with regional fuel/transport differentials | EIA fuel; blue-book; ACF equipment loadings |
| **Regulatory / site loadings** | County or jurisdiction | Code adoption, hazards, flood, frost, soils, impact fees change *scope*, not unit prices | ATC/USGS, NFHL, IECC CSV, SSURGO, Duncan, ICC/DOE |

Practical ceiling: **county for the composite factor**, with ZIP3 only where you actually have ZIP-level material or tax observations. RSMeans' 900+ ZIP3s are largely interpolations of ~730 city surveys.

### 5.2 Index construction
1. **Basket and weights.** 3–5 building models (SF residential, low-rise MF, mid-rise MF, light commercial, heavy civil). Division weights *w_d* and M/L/E shares from NAHB (residential) and assemblies (commercial) — publish the weights.
2. **Component ratios.** Per county: `M_c` basket-weighted material ratio (CBSA, tax-inclusive, freight-adjusted); `W_c` trade-weighted wage ratio (DB where WD exists, else OEWS MSA × QCEW county adjustment); `E_c` state equipment ratio. National base = employment-weighted mean of all counties (RSMeans "100" ≠ yours).
3. **Composite.** `LF_c = Σ_d w_d (m_d M_{d,c} + l_d W_{d,c} + e_d E_c)`, plus **scope multipliers** for hazard/code/frost/soil applied to specific divisions (seismic → structural; wind → envelope; IECC → insulation/HVAC).
4. **Hedonic calibration.** Regress log(actual unit price or $/sf) from transaction sources (DOT bid tabs; LIHTC hard cost/unit; USAspending; Shovels job values) on log(LF_c) + project controls (size, type, year, procurement, prevailing-wage flag). Empirical-Bayes shrink county effects toward CBSA/state parent.
5. **Error bars.** Bootstrap over basket items and wage sources; 90% interval per county. Expect ±3–5% for dense metros, ±8–12% rural; publish observation counts.
6. **Cadence.** Materials monthly, labor quarterly (QCEW) with annual OEWS re-base, hazards/code annual review, RPP annual sanity check.

### 5.3 Known accuracy of existing factors
- **AACE 18R-97 / 56R-08** ranges: Class 5: −20…−50 / +30…+100%; Class 4: −15…−30 / +20…+50; Class 3: −10…−20 / +10…+30; Class 2: −5…−15 / +5…+20; Class 1: −3…−10 / +3…+15 [K].
- RSMeans guidance: order-of-magnitude ±20%, square-foot ±15%, assemblies ±10%, unit-price ±5% [K].
- **Validation vs bids:** no GAO or DOT study quantifying RSMeans CCI error against actual bids could be verified; Garcia & Molloy validates the *time* trend, not spatial factors. Treat RSMeans location factors as ±10–15% at metro level and unknown at ZIP3; systematic errors: (a) union vs open-shop wage choice, (b) 30-city base, (c) equipment not localized. A published bid-tab-vs-LF validation would be a genuine contribution.

### 5.4 Build order
1. County spine: TIGER + OMB list1_2023 + HUD ZIP↔county.
2. Labor: QCEW county NAICS 236/237/238 + OEWS MSA SOC 47-xxxx + Davis-Bacon scraper.
3. Materials: scraped basket by CBSA + Avalara ZIP tax.
4. Scope layers: IECC CSV, ATC/USGS, NFHL layer 28, SSURGO, Duncan 2019.
5. Calibration: USAspending by county × NAICS, then DOT bid tabs and TDHCA/TCAC LIHTC cost sheets.
