# US Construction Labor Cost Data Sources

Legend: [V] verified this session (fetched page/repo code, or exact URL pattern observed in working client code) · [S] from search-result snippets · [K] prior knowledge, not re-verified (official host blocked by sandbox proxy).

## 1. Government wage data

| Source | URL / access | Covers | Granularity | Cadence / lag | Format & API | License | Key caveats |
|---|---|---|---|---|---|---|---|
| **BLS OEWS** [V] | Zips under `https://www.bls.gov/oes/special-requests/`: `oesm{yy}all.zip` (→ `all_data_M_{yyyy}.xlsx`), `oesm{yy}ma.zip` (metro + nonmetro), `oesm{yy}st.zip`, `oesm{yy}nat.zip` [V]. Time-series flat files: `https://download.bls.gov/pub/time.series/oe/` (`oe.series`, `oe.data.1.AllData`, `oe.area`, `oe.datatype`) [V]. API v2 (free key, 500 req/day, 50 series/req) [V] | ~830 SOC occupations incl. 47-1011 supervisors, 47-2031 carpenters, 47-2051 cement masons, 47-2061 laborers, 47-2073 operating engineers, 47-2111 electricians, 47-2152 plumbers/pipefitters, 47-2181 roofers, 47-2211 sheet metal, 47-2221 structural iron, 49-9021 HVAC | National (cross-industry **and** by NAICS incl. 236/237/238 and 4-5 digit); State (cross-industry); MSA + nonmetropolitan areas (cross-industry only). **No county.** "OEWS research estimates" give state × NAICS sector × occupation (since May 2012) | Annual; May reference; **May 2025 estimates released 15 May 2026** (~12-month lag) [S] | XLSX; flat text; JSON API. Series ID example `OEUM0042540000000112022 13` = metro 42540, cross-industry, SOC 11-2022, datatype 13 (annual median). Datatype 06–10 = hourly P10/P25/median/P75/P90; 11–15 annual percentiles; 03/04 hourly/annual mean [V] | Public domain | Straight-time employer-reported pay **excluding fringe, OT, self-employed**. MSA cells are cross-industry. Pools 6 semiannual panels over 3 years, aged with ECI. Suppression flags `*`, `**`, `#` (>$115/hr). MSA delineations changed May 2024 (OMB 23-01): 27 MSAs added, 12 dropped, NECTAs gone; nonmetro areas redrawn May 2018 and May 2024 — never join vintages on `area_code` without the vintage's `msa_def.htm` |
| **BLS QCEW** [V] | CSV slices `https://data.bls.gov/cew/data/api/{year}/{1-4|a}/area/{area_fips}.csv` and `.../industry/{naics}.csv` (e.g. `.../2024/a/industry/238.csv` = every county for NAICS 238). Bulk zips back to 1975. R client `mikeasilva/blsAPI::blsQCEW`, Python `armollica/qcew-data` | Establishments, employment, total wages, avg weekly wage by county × NAICS (236, 2361, 2362, 237, 2371-2379, 238, 2381-2389, 23821 electrical, 23822 plumbing/HVAC, 23831 drywall, 23832 painting, 23833 flooring, 23834 tile, 23835 finish carpentry, 23891 site prep…) × ownership | **County**, state, national; MSA/CSA aggregates | Quarterly; ~5–6 months lag (Q1 2024 released 21 Aug 2024); annual averages ~Sept | CSV fields: `area_fips, own_code (5=private), industry_code, agglvl_code (county NAICS3=75, NAICS4=76, NAICS5=77, NAICS6=78 [K]), size_code, year, qtr, disclosure_code (N=suppressed), qtrly_estabs, month1-3_emplvl, total_qtrly_wages, avg_wkly_wage, lq_*, oty_*` | Public domain | Not occupational: avg weekly wage = all payroll ÷ all employees. Small-county cells suppressed at 4-6 digit NAICS. **From Q3 2025 data (released Mar 2026) MSA rows carry no industry detail — aggregate county cells yourself** [V]. MSA aggregates on 2013 delineations through 2023, 2020-Census delineations from 2024; CT switched to planning regions in 2024 |
| **BLS CES State & Area (SAE)** [V/S] | Series `SMU` + state FIPS(2) + area(5) + industry(8) + datatype(2), e.g. `SMU36000002000000003` = NY statewide construction AHE all employees; datatype 03 AHE all, 08 AHE prod/nonsup, 02 avg weekly hours, 11 AWE. Flat files `https://download.bls.gov/pub/time.series/sm/`; FRED mirror | Monthly employment, hours, AHE for construction supersector | State; ~430 metro areas, but hours/earnings only for larger areas | Monthly; state release ~3 weeks after national; benchmark March | JSON/flat | PD | Composition-sensitive, supersector only. Best use: monthly escalation/nowcast |
| **BLS ECI** [V] | `https://www.bls.gov/eci/`; quarterly ~1 month after quarter | Fixed-weight index of wages & total comp; construction industry series | National; census regions/divisions; selected MSAs | Quarterly | JSON/flat | PD | Index only. DOL uses it to age stale Davis-Bacon survey rates (2023 rule) |
| **BLS ECEC** [V] | `https://www.bls.gov/ecec/` | $/hour worked: wages, benefits split into paid leave, supplemental pay, insurance, retirement, legally required (SS, Medicare, FUTA, SUTA, WC); by industry incl. construction; union/nonunion | National, region/division, 15 largest MSAs; **no state** | Quarterly, ~3 months lag | HTML/XLSX; API | PD | March 2026 all-private: $46.60 total, $32.60 wages (69.9%), $14.01 benefits (30.1%) [S]. Use for benefit-burden ratios |
| **Census QWI (LEHD)** [V] | `https://api.census.gov/data/timeseries/qwi/sa?get=Emp,EmpS,EarnS,EarnBeg,EarnHirAS,Payroll&for=county:*&in=state:{fips}&year=&quarter=&industry={naics}&ownercode=A05&key=` (also `/qwi/se`, `/qwi/rh`). Raw CSV `https://lehd.ces.census.gov/data/qwi/`. LED Extraction Tool `https://ledextract.ces.census.gov/qwi/all` | Employment, hires, separations, **average monthly earnings** (EarnS stable workers; EarnHirAS new hires) by industry | **County**, CBSA, WIB, state; NAICS 2/3/**4-digit** (e.g. 2382) | Quarterly; ~9-month lag | JSON API (key required); CSV | PD | Monthly earnings not hourly; noise-infused with flags; suppressed small cells. New-hire earnings ≈ current market bid |
| **ACS PUMS** [K] | `https://api.census.gov/data/{yr}/acs/acs5/pums?get=OCCP,WAGP,WKHP,WKWN,COW,INDP,PUMA…`; bulk `www2.census.gov/programs-surveys/acs/data/pums/` | Person-level wages/hours by occupation (OCCP 6230 electricians, 6440 plumbers, 6260 laborers, 6355 HVAC…) incl. **self-employed** | PUMA, state | Annual | CSV/API | PD | Only public source including self-employed/cash economy |
| **Davis-Bacon Wage Determinations (SAM.gov)** [V] | Search: `GET https://sam.gov/api/prod/sgs/v1/search?index=dbra&state=CO&page=0&size=1000&sort=title` (optional `is_active=true`, `is_standard=true`, `q=`, `sort=-modifiedDate`). Detail: `GET https://sam.gov/api/prod/wdol/v1/wd/{decision}/{rev}` → JSON with `document` (plain-text WD), `active`, `publishDate`, `constructionType`, `location.mapping[]`. History: `/wd/{ref}/history`. File: `/wd/{ref}/{rev}/download`. Needs browser-like `User-Agent` and `Accept: application/hal+json`; `index=dba` returns 400 [V — from `cliwant/mcp-sam-gov` (live-verified 2026-07-03 per its comments) and `grey-flannel/usdol-wage-determination-data`] | Per-craft base rate + fringe for Building / Residential / Heavy / Highway | **County** (or county groups / statewide) × construction type; ~3,000+ general decisions | WDs modified weekly (Fridays); union lines update on CBA anniversaries; survey lines only when DOL re-surveys | Undocumented keyless JSON; rates inside fixed-width text → parse. Parsers: `grey-flannel/usdol-wage-determination-data` (Python, MIT, JSON schema) [V]; `cliwant/mcp-sam-gov` (TS regex `^(.*?)\.*\$\s*(\d+\.\d{2})(?:\s+(\d+\.\d{2}))?`) [V]; `NuAxis/wage-determinations-text-parser` [V]; `mthelm85/SamScraper` [V]. Third-party: govconapi.com (~68,737 DBA records, ~4,235 active) [S], Apify `jungle_synthesizer/samgov-scraper` [S]. **No official bulk download** | PD | Each line carries provenance: `ELEC0113-005 06/01/2022` = IBEW Local 113 CBA (fresh); `SUCO2013-008 07/31/2015` = DOL survey (stale). Example El Paso Co., CO Building WD 2023: union electrician $34.90 + $17.25 fringe vs survey carpenter $22.63 + $6.98 and laborer $13.40 from a 2013 survey [V]. GAO-11-486T criticized survey methodology; ~46% of nonunion rates ≥10 years old [S]. 2023 final rule (eff. 23 Oct 2023) restored 30% rule, ages survey rates with ECI every 3 years, allows adopting state PW rates [S]. Fringe may be `%+$` strings |
| **Service Contract Act WDs** [V/K] | Same endpoints with `index=sca` | SCA occupations; H&W (~$5.36/hr 2024 [K]) | County groups | Annual + updates | Same | PD | Codes 23130 Carpenter-Maint., 23160 Electrician-Maint., 23410 HVAC Mechanic, 23810 Plumber-Maint. give county-level maintenance-trade cross-check |

### State prevailing wage laws (2026)
From `kadcee/PrevailingWageState` map data [V for file content; not independently verified against statutes]:
- **Comprehensive (26 + DC):** AK, CA, CO, CT, DE, HI, IL, ME, MD, MA, MI (reinstated 2024), MN, MO, MT, NV, NJ, NM, NY, OH, OR, PA, RI, TX (Gov. Code 2258 — each public body sets rates, usually adopting DB), VT, VA (2021), WA, DC.
- **Limited:** FL (Miami-Dade only), TN (highway only), WY.
- **None (federal DB only):** AL, AZ, AR (repealed 2017), GA, ID, IN (repealed 2015), IA, KS, KY (repealed 2017), LA, MS, NE, NH, NC, ND, OK, SC, SD, UT, WV (repealed 2016), WI (repealed 2017).
- **Discrepancy:** a 2026 Buildermuse article claims "32 states + DC" [S]. Reconcile against statutes.

| State | Where | Granularity | Basis | Cadence | Format |
|---|---|---|---|---|---|
| CA | `dir.ca.gov/OPRL/DPreWageDetermination.htm` | Craft × county (many N./S. CA regional) | Modal CBA rate | **22 Feb & 22 Aug**, effective 10 days later; predetermined increases listed | HTML/PDF per craft |
| WA | `lni.wa.gov/…/prevailing-wage-rates/` | Trade × county | CBA where union; survey otherwise | ~early Mar & Sep 1 | Web lookup; downloadable all-rates file |
| IL | `labor.illinois.gov/laws-rules/conmed/prevailing-wage-rates.html` | Craft × 102 counties, H&W/pension/vacation/training splits | CBA (statute since 2019) | Annual (Sept) + revisions | HTML per county; archive |
| NY | `dol.ny.gov` Article 8 | Craft × county, supplemental benefits | CBA | Annual July 1 + interim | PDF/HTML per county |
| NJ | `nj.gov/labor/wageandhour/prevailing-rates/` | Craft × county | CBA | Continuous | PDF per county |
| PA | L&I e-PW portal | Per-project by county | CBA | Per project | Web/PDF |
| OH | Commerce Wage & Hour lookup | Craft × county | CBA | Continuous | PDF |
| MA | DLS project schedules | Per project | CBA | Annual July + per project | PDF |
| MN | DLI commercial (county) / highway-heavy (statewide) | County | Survey (modal) | Annual | PDF |
| OR | BOLI PWR rate books | 14 regions | Survey/CBA | Jan 1 & Jul 1 (quarterly amendments) | PDF |
| MO | Annual Wage Order | County | CBA/survey hybrid | Annual | PDF |
| NV | Labor Commissioner | County/region | Survey | Annual Oct 1 | PDF |
| CO, VA | Adopt federal DB | County | DB | DB | — |
| VT | State OEWS-derived mean + fringe | State | OEWS | Annual | PDF |
| DE, ME, MD | State surveys | County/project | Survey | Annual | PDF/XLS |
| AK | "Pamphlet 600" | Statewide | Survey/CBA | Twice yearly | PDF |
| HI, MT, NM, RI, CT | State DOL bulletins | State/district/county | CBA/survey | Semi-annual/annual | PDF |

In CBA-basis states (CA, IL, NY, NJ, PA, OH, MA, WA, MI, MN-partly) the state schedule is the **freshest public union-scale compilation**; DB duplicates most of it.

## 2. Union collective-bargaining rates

| Source | URL | Covers | Granularity | Cadence | Access | Notes |
|---|---|---|---|---|---|---|
| **CLRC** [S] | `https://www.clrcconsulting.org/products` | Largest union wage & fringe database: Settlements Report, Union Labor Costs in Construction (wage + fringe by craft × city) | Craft × city/region | Jul/Oct/Jan; 2025 avg first-year package +4.7% | Paid | AGC news posts publish headline numbers free |
| **Davis-Bacon union lines** [V] | SAM.gov | Verbatim CBA base+fringe with local number and effective date | County | When DOL ingests new CBAs | PD | Most complete *free* union scale map. Prefix → craft (ELEC, PLUM, CARP, IRON, ENGI, LABO, PAIN, SHEE, ASBE, BRxx, ROOF, TEAM, SFxx, ELEV) |
| **Union locals** [K] | IBEW locals (`ibew{n}.org`), UA locals, Carpenters regional councils, LIUNA, IUOE, Ironworkers | Journeyman + apprentice % schedules, fringe breakdowns (H&W, pension, annuity, JATC, dues) | Local jurisdiction | CBA anniversaries | Public PDFs, heterogeneous | Backfill fringe components |
| **DOL OLMS CBA file / Cornell Catherwood** [K] | `dol.gov/agencies/olms/regs/compliance/cba` | Full CBAs (≥1,000 workers) | Agreement | Irregular | PD/free | Sparse for construction |
| **ENR Quarterly Cost Report** [K] | `enr.com/economics` | Union rates for 20 cities: bricklayers, carpenters, ironworkers, common labor | 20 cities | Quarterly | Subscription | Index anchor |
| **RSMeans methodology** [K] | Gordian | Labor = avg union scale in 30 major cities Jan 1 (46 trades) + Open-Shop tables (~20–30% lower); O&P table adds WC%, FICA/UI, overhead, profit by trade | 30-city avg; 730 CCI | Annual | Copyrighted | Emulate structure only |
| **Union density** [K] | `unionstats.com` | Union membership/coverage in construction by state, MSA | State, MSA | Annual | Free w/ citation | Blending weights |

## 3. Open-shop surveys and posting data

| Source | What | Granularity | Cadence | Access | Quality |
|---|---|---|---|---|---|
| **ABC** chapters [K] | Annual Wage & Benefit Surveys, members-only | Chapter region | Annual | Member | Not scrapeable |
| **PAS Inc.** [K] | Construction Craft Compensation Survey (craft hourly by region/state); Contractor Compensation Quarterly | Region/state | Annual | ~$500–$2,000 | Standard merit-shop survey; no API |
| **Indeed Hiring Lab open data** [V] | `github.com/hiring-lab/job_postings_tracker` (metro/state postings index, daily; sector index), `github.com/hiring-lab/indeed-wage-tracker` (posted wage growth YoY by sector, monthly) | Metro/state (postings), national (wages) | Weekly/monthly | **CC BY 4.0** | Demand/escalation signal; not levels |
| Indeed / ZipRecruiter / Glassdoor / Payscale / Salary.com [K] | Modeled/self-reported pay by title × city | City | Continuous | TOS prohibit scraping; Payscale/Salary.com sell APIs | Low reliability for trades |
| **Lightcast** [K] | Posting advertised wages by occupation × county/MSA | County/MSA | Monthly | Paid API | Highest-quality commercial posting data |

## 4. Labor burden components by location

| Component | Source | Where | Granularity | Cadence | Access |
|---|---|---|---|---|---|
| **WC — NCCI states (~35 + DC)** [K] | NCCI advisory loss costs by class code (5645 carpentry–detached dwellings, 5403 carpentry NOC, 5190 electrical, 5183 plumbing, 5551 roofing, 5221 concrete flat, 5213 concrete NOC, 5474 painting, 5538 sheet metal, 5606 exec supervisor, 8810 clerical) | `ncci.com` (Class Look-Up free; rates by subscription); state insurance depts post approved filings as PDFs; FL OIR, ID publish full tables | State × class | Annual | NCCI restrictive; state PDFs public record |
| **Independent bureaus** [K] | WCIRB (CA; own codes; pure premium rates Sept 1/Jan 1 free PDF), NYCIRB, PCRB/DCRB (PA/DE), NJCRIB, WCRIBMA, MWCIA (MN), CAOM (MI), NCRB (NC), WCRB (WI), ICRB (IN) | Bureau sites | State × class | Annual | Free PDFs |
| **Monopolistic states** [K] | OH BWC (base rates by class, free), WA L&I (rates **per worker-hour**, WA risk classes 0510, 0601…), WY (by NAICS), ND WSI | State sites | State × class | Annual | Public |
| **Oregon DCBS 50-state ranking** [V URL] | CY2022 `https://www.oregon.gov/DCBS/DCBSPubs/reports/general/prem-rpt/22-2083.pdf`; CY2024 edition exists [K] | Index rate per $100 payroll for each state (50 largest Oregon classes) + per-class tables | State (all 51) | Biennial | Free PDF + XLS. **Best free cross-state WC level source** |
| **SUTA** [K] | DOL ETA "Significant Provisions of State UI Laws" (`oui.doleta.gov/unemploy/statelaws.asp`); state new-employer notices | New-employer rate (many states higher for construction), wage base | State | Annual | Free PDF |
| **FICA / FUTA** [K] | SSA wage base ($176,100 in 2025), IRS Pub. 15 | 7.65%; FUTA 0.6% net on first $7,000 | National | Annual | Free |
| **General liability** [K] | ISO/Verisk GL class codes (91340 carpentry, 92215 electrical, 98305 plumbing, 98502 roofing) | — | State | — | Paid; use 1–3% allowance |
| **Benefit-burden calibration** [V] | BLS ECEC construction line | National/region | Quarterly | PD |

## 5. Productivity / crew-hour data

| Source | Covers | Status / license | Notes |
|---|---|---|---|
| **NAVFAC P-405 Seabee Planner's & Estimator's Handbook** [K] | Man-hour tables by CSI division: site work, concrete, masonry, framing, roofing, doors/windows, finishes, plumbing, electrical, utilities; delay/efficiency factors, crew sizes | **Public domain** (US Navy). PDFs on navybmr.com, globalsecurity, archive.org | Older edition (1990s); largest PD man-hour table set |
| **Army FM 5-412**, FM 5-426 Carpentry, FM 5-424 Electrical, TM 5-800-4 [K] | Some man-hour/production tables | PD | Thin vs P-405 |
| **UFC 3-701-01** & ACFs [K] | Unit costs by facility type; ACFs by location | PD | Location factor set |
| **USACE MII / TRACES crew & labor libraries** [K] | Full crew/productivity/unit-price database | Distribution controlled (license) | Not openly downloadable |
| **NECA Manual of Labor Units** [K] | Electrical labor units, normal/difficult/very-difficult | Copyrighted; ~$600 | No redistribution |
| **MCAA Labor Estimating Manual / WebLEM+Plus** [K] | Piping/plumbing/HVAC labor units; productivity factors | Copyrighted, members | |
| **PHCC, SMACNA, PDCA/PCA guides** [K] | Trade labor units | Copyrighted | |
| **Craftsman NCE** [V exists] | Manhours + crews + labor $ per item; ZIP3 area modifiers | Copyrighted; `Lakescape/costbook-parser` parses the PDF for licensed users [V] | |
| **Walker's Building Estimator's Reference Book** [K] | Productivity by trade | Current copyrighted; **pre-1929 editions PD** (HathiTrust/Google Books) | Hand-labor productivities still cited |
| **Richardson's, Page's Man-Hour Manuals** [K] | Industrial man-hours | Copyrighted | |
| Open-source productivity datasets | **None found** on GitHub [V] | — | Gap for an open project; seed from P-405 + PD Walker editions |

## 6. Labor cost indexes and location factors
ENR CCI/BCI (20 cities) [K]; RSMeans CCI (~730) [K]; Turner (national) [K]; Mortenson (~6 metros) [K]; RLB/Cumming/JLL (12 cities) [K]; BLS ECI/CES/PPI [V/K]; FHWA NHCCI, CWCCIS, USBR [K]; **DoD ACFs** — best free location factor [K]; **Awarded JOC coefficients** (e.g. 0.85–1.10 × RSMeans/Gordian UPB) in public procurement records are a direct public signal of local market vs RSMeans [K].

## 7. Subcontractor quote / marketplace signals
Angi/HomeAdvisor True Cost Guide (ZIP via UI; TOS prohibits scraping) [K]; Fixr, HomeGuide, Porch (editorial) [K]; Thumbtack cost pages, Yelp Cost Guides (`yelp.com/costs`), Houzz, Sweeten (NYC $/sf) — real-quote based, strongest of marketplaces but service-level [K]; TaskRabbit/Handy (handyman-tier) [K]; **Public bid tabulations** (state DOT, municipal portals, USAspending) — best real price data [K].

## 8. Proposed blend: county-level trade wage estimate
1. **Base level (annual, May):** OEWS `H_MEDIAN` (+P10/P25/P75/P90) for the SOC at the MSA/nonmetro area. Adjust cross-industry → construction with national ratio `OEWS(NAICS 238xx, SOC) / OEWS(cross-industry, SOC)`, refined at state level with OEWS research estimates.
2. **County disaggregation (quarterly):** `f_c = QCEW avg_wkly_wage(county, NAICS 2382x private, 4-qtr avg) ÷ same aggregated over the OEWS area`. Empirical-Bayes shrink toward 1 by county employment; clip to [0.80, 1.25]; fall back 23822 → 2382 → 238 → 23 → state on suppression. Cross-check with QWI `EarnS`/`EarnHirAS`.
3. **Time escalation (monthly):** ECI construction wages (region) and CES state construction AHE YoY; QCEW's last two quarters override when available.
4. **Tiering:** journeyman = median; foreman = P75–P90; apprentice/helper = P25 (or DB apprentice % schedules).
5. **Union overlay:** parse active DB WDs (Building, Residential, Heavy, Highway); classify union (`XXXX####-###`) vs survey (`SU…`). Blend `w_u × DB_union + (1 − w_u) × open_shop`, `w_u` = union coverage (unionstats). Age `SU` lines with ECI; flag >5 years old. In CBA-basis states prefer state schedule.
6. **Fringe:** union → DB/state fringe split from local's sheet; open-shop → ECEC construction benefits share with nonunion discount.
7. **Burden:** WC = state class-code loss cost × LCM ÷ 100 × wage; FICA 7.65%; FUTA 0.6% × $7k/annual hours; SUTA construction new-employer rate × wage base; optional GL 1–3%.
8. **Validation:** residuals vs CES state AHE, QWI hourly-equivalent, DB, Indeed posted-wage growth; publish P10–P90 bands. Refresh: OEWS annually, QCEW quarterly, DB weekly, ECI/CES monthly, WC annually.

## 9. Verification gaps
Exact OEWS May 2025 file names (`special-requests` vs `special.requests`); QCEW `agglvl_code` values; ECEC construction-line values; "32 states" vs 26 + DC PW count; Oregon DCBS 2024 URL; CLRC/PAS product details; current `.mil` host for P-405; SCA H&W rate; 2026 SSA wage base.

**Repos to clone:** `grey-flannel/usdol-wage-determination-data` + `-model` (MIT; SAM.gov scraping, WD parsing, JSON schema) [V]; `cliwant/mcp-sam-gov` (`src/pricing.ts` documents SGS/WDOL endpoints) [V]; `hiring-lab/*` (CC BY 4.0) [V]; `mikeasilva/blsAPI`, `armollica/qcew-data` [V]; `lowmason/agent-skills/skills/bls-data-context/references/{oews,qcew,ecec,eci,ces,sae}.md` [V]; `kadcee/PrevailingWageState/index.html` [V].
