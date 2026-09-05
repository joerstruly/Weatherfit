# Multifamily / commercial cost certification and hard-cost datasets (Opus agent; budget hit after ~30 queries)

## A. HUD / FHA multifamily cost data
| Source | URL | Contains | Status |
|---|---|---|---|
| HUD-92330 Mortgagor's Certificate of Actual Cost (blank) | https://www.hud.gov/sites/dfiles/OCHCO/documents/92330.pdf | CPA-certified actual cost at final endorsement | VERIFIED-URL; no compiled dataset exists |
| HUD-92330-A Contractor's Certificate of Actual Cost (blank) | https://www.hud.gov/sites/dfiles/OCHCO/documents/92330-a.pdf | contractor actual cost; required with identity-of-interest GC | VERIFIED-URL |
| **HUD-92331-B trade cost breakdown** | https://www.hud.gov/sites/documents/doc_20668.pdf | **the CSI-division schedule (Concrete, Masonry, Metals, …)** attached to 92330-A | VERIFIED-DETAIL — canonical division taxonomy |
| Worked example 92330-A (AHACPA) | https://ahacpa.org/resources/_free/cost-cert-contractor.pdf | filled example (schema template) | VERIFIED-URL |
| Handbook 4470.2; MAP Guide 4430.G; Ch.14 cost certification; Ch.6 cost processing | https://www.hud.gov/hudclips/handbooks/housing-4470-2 · https://www.hud.gov/sites/dfiles/OCHCO/documents/4430GHSGG.pdf · https://archives.glb.hud.gov/offices/hsg/mfh/map/chapt14.pdf | rules | VERIFIED-URL |
| HUD-92264 Rental Housing Project Income Analysis & Appraisal (blank) | https://www.hud.gov/sites/dfiles/OCHCO/documents/92264.pdf | building type & structure, GFA, NRA, replacement cost (G.36–G.50) — **filed forms not published** | VERIFIED-DETAIL |
| 24 CFR 200.96 | https://www.law.cornell.edu/cfr/text/24/200.96 | legal basis | VERIFIED-URL |
| HUD Multifamily Data hub; Insured Multifamily Mortgages (monthly XLSX); Firm Commitments & Initial Endorsements (quarterly, FY2001+); FY production | https://www.hud.gov/hud-partners/multifamily-data · https://www.hud.gov/hud-partners/multifamily-fhasl-active · https://catalog.data.gov/dataset/insured-multifamily-mortgages-database | project number, name, city/state/ZIP, units, endorsement dates, mortgage amount, SOA — **no cost breakdown, SF, or building type** | VERIFIED-DETAIL |
| HUD USER Section 202/811 Construction Cost Indices (NAHB Research Center) | https://www.huduser.gov/portal/publications/costindices.pdf | index comparison + Excel cost model | VERIFIED |
| HUD LIHTC Database | https://www.huduser.gov/portal/datasets/lihtc/property.html | no TDC / no trade breakdown | VERIFIED |
| HUD FOIA | https://www.hud.gov/foia | route for filed 92330/92330-A/92331-B/92264 | VERIFIED-URL |
**Bottom line:** division-level FHA hard cost is FOIA-only, project by project; target form is HUD-92331-B.

## B. State HFA / LIHTC application repositories with cost schedules
| State | URL | What | Format | Status |
|---|---|---|---|---|
| **TX TDHCA** | https://tdhca.texas.gov/competitive-9-housing-tax-credits · archive https://www.tdhca.texas.gov/9-competitive-housing-tax-credits-archive · procedures https://www.tdhca.texas.gov/sites/default/files/multifamily/docs/25-MFProceduresManual_0.pdf | "Individually Imaged Full Applications" per project incl. Development Cost Schedule; Application Log | PDF (native XLS) | VERIFIED |
| **CA CTCAC** | https://www.treasurer.ca.gov/ctcac/applications · staff reports https://www.treasurer.ca.gov/ctcac/meeting/staff · round index e.g. https://www.treasurer.ca.gov/ctcac/2015/firstround/applications.pdf | "posts worksheets in PDF from the Excel version of all applications submitted each round" incl. Sources & Uses with construction cost breakdown; ~12+ yr depth | PDF | VERIFIED |
| **FL FHFC** | https://www.floridahousing.org/programs/developers-multifamily-programs/competitive/rfa-submitted-applications · pattern `.../submitted-rfas/{yr}/{rfa}/Download?appNumber={app}&docType=APP+PACKAGE` (also ftp.floridahousing.org) | full application packages incl. Development Cost Pro Forma and TDC | PDF | VERIFIED — most machine-enumerable |
| **VA Virginia Housing** | https://www.virginiahousing.com/en/partners/rental-housing/housing-tax-credit-application-archive | all 9% and 4% reservation applications + market studies per project, by year | PDF (from XLSX) | VERIFIED |
| WA WSHFC | https://www.wshfc.org/mhcf/9percent/app.htm · cost data report https://wshfc.org/admin/publications.htm | forms; annual Cost Data Report; applications via portal (not posted) | XLSX/PDF | VERIFIED |
| MN Housing Cost Containment Reports (2003–2024 model) | https://mnhousing.gov/documents/52434/2024-cost-containment-report-final-11132024/view | TDC/unit; predictive model; splits new/rehab, metro/Greater MN, LIHTC/non | PDF | VERIFIED |
| **CO CHFA Affordable Housing Development Cost Dashboard** | https://www.chfainfo.com/chfa-news/12152021-affordable-housing-dev-dashboard · awards https://www.chfainfo.com/rental-housing/housing-credit/awards | $/unit and $/SF by year, region, credit type, **development type**; 5-yr avg $289,737/unit, $286/SF; Denver $308k vs rest $237k | BI dashboard | VERIFIED |
| OH OHFA | https://ohiohome.org/ppd/documents/2026-4-LIHTC-CostContainmentStandards.pdf | per-unit hard cost caps; no application repository | PDF | VERIFIED |
| MI MSHDA | https://www.michigan.gov/mshda/-/media/Project/Websites/mshda/developers/lihtc/assets/liaf/mshda_li_af_i_cost_cert_guide_pdf.pdf | cost cert guide; TDC/unit safe harbors; filed certs not published | PDF | VERIFIED |
| IL IHDA | https://www.ihda.org/developers/applying-for-tax-credits-for-multifamily-housing/ | lists (PPAs, full applications received, allocations); no cost schedules posted | PDF | VERIFIED |
| PA PHFA; NC NCHFA; SC Housing; GA DCA ("Cost Certifications" resource category exists — filed certs unconfirmed) | https://www.phfa.org/mhp/developers/housingapplication.aspx · https://www.nchfa.com/rental-housing-application · https://dca.georgia.gov/affordable-housing/housing-development/housing-tax-credit-program/resources-applying | schemas/QAPs | PDF/XLSX | partial |
| **MD DHCD Guide to Project Development Costs** | https://dhcd.maryland.gov/HousingDevelopment/Documents/mfresources/MFH-Guide-Project-Development-Costs.pdf | line-item definitions of MF development cost budget (taxonomy) | PDF | VERIFIED |
| OR OHCS | https://www.oregon.gov/ohcs/development/pages/housing-data-analysis.aspx | operating cost portfolio analysis | PDF | VERIFIED |
**Bottom line:** four states post full applications with cost schedules per project (TX, CA, FL, VA), all as PDF; building type (garden vs podium) must be inferred from stories/structure/parking narrative.

## C. Other project-level and benchmark hard-cost datasets
| Source | URL | Contains | Status |
|---|---|---|---|
| **RAND High Cost of Producing Multifamily Housing in California (2025)** — Appendix Table A.18 "Hard Cost Differences per NRSF from Subcontractor Bids for Two Concurrent 'Wrap' projects" | https://www.rand.org/pubs/research_reports/RRA3743-1.html · appendix https://www.rand.org/content/dam/rand/pubs/research_reports/RRA3700/RRA3743-1/RAND_RRA3743-2.pdf | sub-bid-level deltas for wrap product CA vs TX; fees $1k (TX) / $12k (CO) / $29k (CA) per unit | VERIFIED — most relevant public wrap artifact |
| **Terner Center Hard Costs of Construction (Mar 2020)** | https://ternercenter.berkeley.edu/wp-content/uploads/2020/08/Hard_Construction_Costs_March_2020.pdf | line-item costs for 240 CA multifamily projects 2009–2018; dataset not published | VERIFIED |
| Terner LIHTC 2020 / prevailing wage 2024; development fees 7 cities | https://ternercenter.berkeley.edu/wp-content/uploads/2020/08/LIHTC_Construction_Costs_2020.pdf · https://ternercenter.berkeley.edu/wp-content/uploads/pdfs/Development_Fees_Report_Final_2.pdf | | VERIFIED-URL |
| SDHC Cost of Affordable Housing (Apr 2025) | https://sdhc.org/wp-content/uploads/2025/04/Att-1_Affordable-Housing-Cost-Study-4.17.25.pdf | new construction 38.7% of TDC; land 26.2% | VERIFIED |
| **WA Commerce Housing Trust Fund cost reports** | https://www.commerce.wa.gov/housing-policy/housing-reports/ | median cost/unit 2019 $207k → 2022 $316k → 2023 $302k; King Co. $357k vs rural $222k | VERIFIED |
| NMHC/NAHB Cost of Regulations (2022) | https://www.nmhc.org/globalassets/research--insight/research-reports/cost-of-regulations/2022-nahb-nmhc-cost-of-regulations-report.pdf | regulation = 40.6% of MF TDC | VERIFIED |
| NAHB Cost of Constructing a Home | (single-family only; no MF equivalent) | | VERIFIED |
| ULI/Enterprise Bending the Cost Curve (2014) | https://uli.org/wp-content/uploads/ULI-Documents/BendingCostCurve-Solutions_2014_web.pdf | qualitative | VERIFIED |
| **RLB North America Quarterly Cost Report** | https://www.rlb.com/americas/insights/theme/construction-cost-report/ | **$/SF GFA for 15 typologies × 14–16 metros incl. multifamily and parking structures** | VERIFIED — best free $/SF by metro by typology |
| C&W Industrial Construction Cost Guide | https://www.cushmanwakefield.com/en/united-states/insights/industrial-construction-cost-guide | 46 markets × 3 DC sizes | VERIFIED |
| C&W Office Fit-Out Cost Guide | https://www.cushmanwakefield.com/en/united-states/insights/office-fit-out-cost-guide | fit-out $/SF by market | VERIFIED-URL |
| Turner & Townsend GCMI 2025 | https://publications.turnerandtownsend.com/global-construction-market-intelligence-2025/north-america | typologies: CBD office ≤20 fl, 3/5-star hotels, large DC, automotive retail, **high-rise apartments**; US labor $76/hr avg, NY $131.4 | VERIFIED |
| T&T Data Centre Cost Index 2025-26 | https://www.turnerandtownsend.com/insights/data-centre-construction-cost-index-2025-2026/ | $/W by market (Silicon Valley $13.3/W) | VERIFIED |
| JLL US/Canada office fit-out 2025/2026 | https://www.jll.com/en-us/guides/us-canada-office-fit-out-costs-guide | $280/SF avg | VERIFIED |
| CBRE law-firm fit-out guide 2025 | https://www.cbre.com/insights/books/us-canada-law-firm-fit-out-cost-guide-2025 | 24 markets $/RSF | VERIFIED |
| Cumming Market Analysis; Mortenson (8 metros; nonres only); Gordian/RSMeans (12,000+ assemblies, 100+ SF models incl. apartments; licensed) | see earlier appendices | | VERIFIED |
| **Apartment REIT development schedules (EDGAR 8-K Ex-99 supplementals)**: AvalonBay (per-community Total Capital Cost + homes + city; e.g. 6,595 homes / $2.493B ≈ $378k/unit), Camden (pipeline $/unit ≈ $361k–$423k), Prologis (TEI incl. land/leasing), American Homes 4 Rent (BTR per-home $250k–$400k) | https://www.sec.gov/Archives/edgar/data/915912/000091591224000002/q42023ex-992.htm · https://www.sec.gov/Archives/edgar/data/906345/000090634521000007/exhibit992supplementq420.htm | market-rate $/unit by project and metro, 15+ years | VERIFIED — free structured calibration |
| Yardi Matrix; CoStar | https://www.yardimatrix.com/publications/ · https://www.costar.com/products/market-analytics | supply/rents; no construction-cost dataset | VERIFIED (negative) |

**Not reached:** Marshall & Swift commercial; Trepp; Urban Institute; Up for Growth; Arcadis; Compass; Green Street; NY HCR / MA EOHLC cost reports; Rexford/EQR/MAA/UDR/Invitation Homes; ADOH, NJHMFA, MHDC, THDA, UT, NV, ID, NM HFAs.
