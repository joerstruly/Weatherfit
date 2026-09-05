# Verification round — state prevailing wage & assessor manuals (Opus agent; budget exhausted ~60% through Task B; Task C not attempted)

## A1. State prevailing wage schedules (gap states)
| State | URL | Granularity | Cadence | Format | Fringe | Status |
|---|---|---|---|---|---|---|
| Alaska Pamphlet 600 | https://labor.alaska.gov/lss/pamp600.htm · https://labor.alaska.gov/lss/forms/Pamphlet_600_Issue_52.pdf | 2 regions | ~2×/yr (Apr & Sep); Issue 52 eff. 2026-04-01 | PDF | separate | VERIFIED |
| Maryland | https://labor.maryland.gov/labor/prev/ · **XLSX** https://labor.maryland.gov/labor/prev/prevrevisedprevailingrates-20250410.xlsx | 23 counties + Baltimore City; Building vs Highway | annual determinations | web lookup + XLSX | separate | VERIFIED |
| Delaware | https://labor.delaware.gov/divisions/industrial-affairs-old/labor-law/ | 3 counties | annual survey; determination by Mar 15 | PDF | separate | rate-schedule URL NOT FOUND |
| Rhode Island | https://dlt.ri.gov/regulation-and-safety/prevailing-wage/prevailing-wage-faq | adopts federal Davis-Bacon; adjusts Jul 1 | — | SAM.gov | — | VERIFIED |
| Missouri Annual Wage Order | https://laborwebapps.mo.gov/dls/prevailingwage (county-parameterized) · https://labor.mo.gov/dls/prevailing-wage/general-wage-order | county × occupational title | annual; AWO 33 eff. 2026-05-29 | web → PDF | — | VERIFIED |
| New Mexico | https://www.srca.nm.gov/parts/title11/11.001.0002.html | 4 schedules (A street/highway, B building, C residential, H heavy) + zone/subsistence | set by Oct 1, eff. Jan 1 | PDF | separate | schedule PDF URL NOT FOUND |
| Montana | https://erd.dli.mt.gov/labor-standards/public-contracts-prevailing-wage-law/ · https://erd.dli.mt.gov/_docs/labor-standards/Prevailing-Wage/2026-Building-Construction-Preliminary-Rates.pdf · …/2026-Heavy-Construction-Preliminary-Rates.pdf | multi-county districts; Building/Heavy/Highway/NCS books | annual survey; preliminary then final; mid-year revision | PDF | itemized (wage incl. fringe, travel, zone, per diem) | VERIFIED |
| Maine | https://www.maine.gov/labor/docs/2026/laborstats/prevailingwage/Statewide/2026%20B2%20Statewide.pdf | region (changed from county for 2026) | annual; 2026 eff. Jan 10 | PDF | — | VERIFIED (region/county conflict) |
| Vermont | https://vtlmi.labor.vermont.gov/stateconstrprevailwage.pdf | 3 areas | annual Jul 1–Jun 30; OEWS-based | PDF | flat +42.5% fringe | VERIFIED |
| Michigan (reinstated eff. 2024-02-13, PA 10 of 2023) | https://www.michigan.gov/leo/bureaus-agencies/ber/wage-and-hour/prevailing-wage · pattern `.../PWRS-By-County/2026-Rates/2026-<County>-Prevailing-Wage-Rates.pdf` | county | rolling per CBA | PDF per county | combined wage+fringe total | VERIFIED |
| Colorado | https://cdle.colorado.gov/dlss-home-page/wage-and-hour-law/prevailing-wages | county | Jul 1 annual; ≥$500k | PDF | — | rate tables NOT FOUND (reportedly on Office of State Architect) |
| Virginia | https://doli.virginia.gov/programs/labor-law/prevailing-wage-law/ | statewide single determination from federal DB; >$250k; eff. 2021-05-01 | follows DB | — | — | VERIFIED |
| Wyoming | — | no active state PW (1967 Act repealed) | — | — | — | VERIFIED-DETAIL |
| Tennessee (highway only, Prevailing Wage Commission) | https://www.tn.gov/content/dam/tn/workforce/documents/pwc/2025-Highway-Prevailing-Wage-Rates.pdf · TDOT https://www.tn.gov/content/dam/tn/tdot/construction/special-provisions/Const-AA-ST_RATES.pdf | statewide | calendar year; >$50k | PDF | — | VERIFIED (2026 URL not found) |
| Miami-Dade Responsible Wages & Benefits | https://www.miamidade.gov/global/business/smallbusiness/responsible-wages-benefits.page · https://www.miamidade.gov/resources/management/documents/2026-rwb-building-schedule.pdf | county; Building + Heavy schedules | annual Jan 1; >$100k | PDF | base + fringe columns | VERIFIED |

## A2. State PW law count (2026)
- DOL WHD page https://www.dol.gov/agencies/whd/state/prevailing-wages says "24 states without" but enumerates 22 (AL, AZ, AR, FL, GA, ID, IN, IA, KS, KY, LA, MI, MS, NH, NC, ND, OK, SC, SD, UT, WV, WI) and is stale (MI reinstated 2024). Buildermuse "32 + DC" folds in narrow/partial regimes; its 8-state list was not retrieved.
- **Best-supported list (27 + DC, medium confidence):** AK, CA, CO, CT, DE, HI, IL, ME, MD, MA, MI, MN, MO, MT, NV, NJ, NM, NY, OH, OR, PA, RI (adopts DB), TN (highway only), TX (public-body adoption), VT, VA (adopts DB statewide), WA, + DC. Repeals: IN 2015, WV 2016, WI 2017, KY 2017, AR 2017, MI 2018 (reversed 2024). Nevada P3/incentive expansion and Oregon HB 2688 (2025) unverified.

## A3–A5. Machine-readable PW artifacts
- Washington: no discrete "download all" file; bulk = multi-select lookup export (https://fortress.wa.gov/lni/wagelookup/prvWagelookup.aspx; WSDOT procedure https://wsdot.wa.gov/sites/default/files/2021-10/Retrieving-State-Wage1.pdf). data.wa.gov Socrata `pcn2-jime` is affidavit (as-paid) detail.
- Ohio: new PW rate system launched 2025-06-27, gated behind OH|ID account; app URL not found.
- Maryland XLSX (above); Missouri county-parameterized web app; Michigan predictable per-county PDF path; California per-issue index pages (XLS claim unconfirmed); Minnesota `commercial_data.php` not re-confirmed.

## B. State assessor building-cost manuals
**States publishing their own tables (free):**
| State | URL | Notes | Status |
|---|---|---|---|
| **Oregon DOR Cost Factors for Residential Buildings (150-303-419)** | https://www.oregon.gov/dor/forms/FormsPubs/303-419-05.pdf (rev. 10-15-24) · https://www.oregon.gov/dor/forms/Pages/2026.aspx | Statewide base costs + **county Local Cost Multipliers**; companion books for manufactured structures and farm buildings; commercial book not found | VERIFIED — best free find |
| **Illinois DOR Publication 123 (residential) & 126 (commercial, Jan 2020)** | https://tax.illinois.gov/content/dam/soi/en/web/tax/research/publications/pubs/documents/pub-123.pdf · …/pub-126.pdf | Schedules benchmarked to central Illinois with local **cost factor** multiplier | VERIFIED |
| **Montana DOR Res/Comm/Ind Valuation Manual 2025-2026** | https://revenuefiles.mt.gov/files/DOR-Publications/Property-Reappraisal-Plan-and-Manuals/2025-2026-Res-Comm-Indust-Manual.pdf | State-published but M&S-derived base costs | VERIFIED |
| **New Jersey Real Property Appraisal Manual (3rd ed., 2021 update)** | https://www.nj.gov/agriculture/divisions/md/pdf/RealPropertyManual.pdf (farm supplement) · https://www.nj.gov/treasury//taxation/lpt/referencematerials.shtml | Farm-building schedules confirmed; main residential/commercial volume availability unconfirmed | partial |

**Vendor-mandated / not published:** South Dakota (rule names M&S Residential Cost Handbook 2013 / Marshall Valuation Service 2013 or Vanguard 2008 — https://sdlegislature.gov/api/Rules/Archived/653.pdf); Nebraska (Marshall Valuation Service mandated — https://revenue.nebraska.gov/sites/default/files/doc/legal/regs/pad/REGS_web_fullset.pdf); Oklahoma (OTC contracts with M&S — https://law.justia.com/codes/oklahoma/title-68/section-68-2817/); Utah (M&S Estimator primary — https://propertytax.utah.gov/standards/standard06.pdf); Kansas (M&S via Orion CAMA); Idaho (M&S listed; county-association manual procedural); Washington DOR (M&S trend factors; no real-property tables); Pennsylvania (no state manual; counties use Tyler/Vision); Connecticut (revaluation vendors, Vision named); Massachusetts (DLS guidance only); Maryland SDAT (tables inside AAVS CAMA, unpublished).

**Hybrid / unresolved:** Georgia APM (procedural; points to M&S — https://dor.georgia.gov/appraisal-procedure-manual); Alabama 2015 Appraisal Manual exists, URL not found (personal-property manual free); Mississippi DOR Appraisal Manual statutorily mandated (§27-35-50), URL not found; Colorado ARL Vol 3 free (https://arl.colorado.gov/volume-3-real-property-valuation-manual-all-chapters) — cost-table content unverified, high-value follow-up; Arkansas real-property manual not found (PP manual 2024 free); Missouri STC Assessor Manual (no per-SF tables found); Minnesota PTA Manual (cost tables unconfirmed); New York ORPTS (cost schedules inside RPS CAMA; not separately published); Louisiana, North Dakota not found.

**Not searched (budget):** VA, SC, WV, KY, TN, OH, FL, VT, NH, ME, DE, AZ (current), NV, NM, WY, AK, HI.

## C. State/university facility cost data — NOT ATTEMPTED (budget).
