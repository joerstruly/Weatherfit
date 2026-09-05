# US Commercial Construction Cost Data Landscape — Competitive Research Report

Legend: **[V]** = verified from search-result snippets this session; **[U]** = prior knowledge or inference, not verified this session; **[C]** = conflicting sources. Direct fetches of vendor sites were blocked by the sandbox egress proxy.

## 1. Master comparison table

| Vendor / Product | Type | Line items | Localization | Cadence | Approx price (USD) | API / bulk license | Scraping/redistribution terms | Free public view |
|---|---|---|---|---|---|---|---|---|
| **Gordian RSMeans** (Fortive) | Unit cost + assemblies + SF models, all CSI divisions | >92,000 unit lines [V]; ~25,000 assemblies [U] | City Cost Index: 731 US/CA cities mapped to >930 3-digit ZIPs [V]; "970 locations" [V]; 30-city national avg base [V] | Books annual; online quarterly [V] | Online: Core / Complete / Complete Plus — sources conflict: ~$2,268 / $4,589 / $5,799 per user-yr vs. Capterra's $396 / $1,019 / $5,973 [C] | Yes — "RSMeans data API" used by Esri, eTakeoff, WebTMA; requires active subscription [V] | Explicit: no sale/license/distribution of Data Files; no use as basis for pricing products for sale; no archival/searchable DB; only "insubstantial portions" to a spreadsheet on a single device [V] | Quarterly CCI/Location Factor PDFs for book buyers; free trial; sample pages [V/U] |
| **Craftsman Book Co.** | Trade costbooks (residential-heavy) | NCE ~10,000+ [U] | Area Modification Factors by state and 3-digit ZIP, split material/labor [U] | Books annual; licensed datasets quarterly [V] | Books ~$100–130 each [U]; NCE was $87.50 (2019), $97.50 (2020) [V]; Site License Cloud monthly fee [V] | **Yes** — formal Data Licensing program: APIs + downloadable DBs in Excel, Bacpac, MS Access, PDF; licensed to software cos, insurers, appraisers [V] | Standard copyright; licensing is negotiated [U] | Book preview PDFs (NCE, NBC Manual 2026) [V]; Building-Cost.net free residential calculator [U] |
| **BNi Building News** | Costbooks (general, public works, electrical, mech, home builder, remodeling, SF, facilities) | General Construction Costbook: >15,000 cost units w/ man-hours + assemblies [V] | >600 Metro Area Multipliers [V] | Annual [V] | ~$100–150/book [U]; BNi ACCESS online subscription price unknown [U] | BNi ACCESS online platform; no public API [V/U] | Standard copyright [U] | Product pages only [V] |
| **Marshall & Swift** (Cotality, ex-CoreLogic) | Valuation Service (commercial), Residential Cost Handbook, SwiftEstimator | Cost-per-SF by class/quality + unit-in-place [U] | Local multipliers for >825 US/territory/CA locations [V]; quarterly multipliers back to 2004 [V] | Handbook annual/semi-annual [V]; Valuation Service multipliers monthly [U] | Handbook ~$300+/yr; SwiftEstimator per-report [U] | Enterprise data feeds for assessors/insurers [U] | Restrictive; subscription-only [U] | Product marketing pages [V] |
| **Verisk Xactimate / XactAnalysis** | Insurance restoration unit costs | ~20,000+ [U] | Metro-level price lists; "467" not confirmed [U]; 360Value uses 431 US regions + ZIP components [V] | **Monthly** general prices; vendor-specific nightly [V] | Xactimate ~$1,900–2,700/user-yr [U] | Xactware APIs for carriers/partners [U] | Subscription-only, no export of price lists [U] | Public "Pricing Research Methodology" PDF [V] |
| **Verisk 360Value** | Replacement cost (personal + commercial) | Component-based [V] | 431 US regions + ZIP-level components [V] | Quarterly reconstruction cost reports [V] | Enterprise [U] | Web Integration option for online quotes [V] | Enterprise contract [U] | Quarterly national/state trend reports [V] |
| **Cotality RCT / e2Value** | Replacement cost | — | ZIP-level [U] | Quarterly [U] | Enterprise [U] | Yes (insurer integrations) [U] | Enterprise contract [U] | None |
| **1build** | Live material/labor/equipment cost API | "68 million live costs" [V] | Every US county [V] | Continuous [V] | Usage-based API [U] | **Yes — API-first**; powers Buildxact live pricing and CostCertified/Bolster AutoCost [V] | Contract | Marketing site only |
| **Clear Estimates / RemodelMAX** | Remodeling unit costs | 13,000+ [V] | 400+ US market areas [V] | Quarterly [V] | SaaS ~$59–129/mo [U] | No public API [U] | Subscription | Marketing |
| **ENR CCI / BCI** | Composite index | 4 inputs | 20 cities [V] | Monthly [V] | ENR subscription for history [V/U] | No | Subscriber-only | Headline values in articles |
| **EquipmentWatch Rental Rate Blue Book** | Equipment ownership/operating rates | Thousands of models [V] | Regional adjustment factors by state [U] | Annual w/ updates [U] | ~$1,000–3,000+/yr [U] | Enterprise data licensing [U] | Restrictive | FHWA-rate explainer pages [V] |
| **Caltrans Labor Surcharge & Equipment Rental Rates** | Equipment hourly rates | Thousands [U] | California | Annual (Apr 1–Mar 31); misc. list daily [V] | **Free public PDF** [V] | No API; PDF + web calculator [V] | Public record (CA gov) | Full book public [V] |
| **USACE EP 1110-1-8** | Equipment O&O expense | Thousands | 12 regions (Vols 1–12) [V] | Irregular (2016–2020 eds found) [V] | **Free** [V] | PDF only | US Gov work — public domain [U] | Full PDFs public [V] |
| **Rouse (RB Global)** | Rental rate/utilization benchmarks; used-equipment prices | — | By Cat Class per market [V] | Daily feeds [V] | Enterprise | Client-only | Restrictive | Blog summaries |

## 2. RSMeans (Gordian / Fortive) — detailed

**Products [V/U]:** Annual cost books (2026 editions exist [V]): Building Construction Costs, Square Foot Costs, Assemblies, Facilities Construction, Facilities Maintenance & Repair, Electrical, Mechanical, Plumbing, Residential, Heavy Construction, Site Work & Landscape, Commercial Renovation, Light Commercial, Interior, Concrete & Masonry, Green Building, Labor Rates, Contractor's Pricing Guides [U for the full list]. Sage Estimating ships an RSMeans integration guide (2024) [V].

**RSMeans Data Online tiers [V]:** Core (material/task-level costs, localization); Complete (adds square-foot model estimator, WBS, custom reports); Complete Plus (full data history, Predictive Cost Data, Life Cycle Costing). Pricing conflicts [C]: ~$2,268 / $4,589 / $5,799 per year vs. Capterra $396 / $1,019 / $5,973. RSMeans inside Sage is a separate $1,500–3,000/user/yr subscription [V].

**Scale/methodology [V]:** >92,000 line items, >970 locations; "30,000+ hours/year" of cost-engineer research; sources = contractors, suppliers, actual project data; quarterly online updates.

**City Cost Index [V]:** 731 US/Canadian cities covering >930 3-digit ZIP locations; composite computed from quantities of **66 materials, labor-hours for 21 trades, rental days for 6 equipment types**; base = national average of 30 major US cities = 100. Separate material and installation indexes per CSI division. Free quarterly CCI/Location Factor downloads have been offered [V].

**API [V]:** "RSMeans data API from Gordian" is real and used by Esri ArcGIS "Cost Map for Water Utilities", eTakeoff, WebTMA, Join.build. Requires paid subscription.

**License terms [V]** (RSMeans Terms effective May 1, 2023 + RSMeansOnline SaaS Terms): prohibits (a) selling, licensing, or distributing Data Files to third parties; (b) using the Data Files "as a component of or as a basis for pricing any material, service, or product offered for sale"; (c) use in an archival or other searchable database. **Implication:** scraping RSMeans Online, or hand-transcribing substantial portions into an open DB, is a clear breach; only the CCI structure/methodology (not the numbers) is safe to emulate.

## 3. Craftsman Book Company — detailed
- 2026 editions confirmed [V]: National Construction Estimator (74th ed.), National Building Cost Manual (preview PDF public), National Home Improvement Estimator, National Building Cost Estimator (software). Others: Electrical, Plumbing & HVAC, Renovation & Insurance Repair, Painting, Framing & Finish Carpentry, Earthwork & Heavy Equipment, Repair & Remodeling [U for 2026 status].
- Area Modification Factors: by state and by 3-digit ZIP with separate material and labor percentages [U].
- Software: National Estimator Cloud — 10 cost databases with area modifiers, monthly fee [V]; CraftsmanSiteLicense.com [V]; National Appraisal Estimator online [V].
- **Data licensing [V — key finding]:** craftsman-book.com/data-licensing: data licensed via **APIs and downloadable databases in Excel, Bacpac (SQL Server), MS Access, and PDF**; most datasets updated **every three months**; customers are software companies, insurers, appraisal firms. **This is the most accessible commercial bulk-license path found.**
- Free: book preview PDFs [V]; Building-Cost.net free residential calculator [U].

## 4. BNi Building News
- 2026 titles [V]: General Construction Costbook (with Assemblies), Square Foot, Electrical, Home Builder's, Facilities Manager's, Guide to Construction Costs, Home Remodeler's, Remodeling, Public Works.
- General Construction Costbook: >15,000 cost units with man-hours, assemblies, **>600 Metro Area Multipliers**, 50-division CSI, print + **BNi ACCESS** online [V].

## 5. Marshall & Swift (Cotality)
- Residential Cost Handbook: local multipliers for **>825 locations**; historical quarterly multipliers back to 2004 [V]. Valuation Service (commercial) multipliers monthly [U].
- Legally embedded in assessor rules (e.g., South Dakota rule 64:04:04:01 cites M&S) [V].
- Rebrand CoreLogic → Cotality announced March 2025 [U — verify]. Product page at cotality.com/products/marshall-swift [V].

## 6. Verisk (Xactware) — Xactimate, XactAnalysis, 360Value
- Public "Pricing Research Methodology" PDF exists [V]. Monthly: "millions of data points" from contractor/supplier surveys, invoices, actual claims; vendor-specific pricing nightly, general quotes monthly [V]. Feedback loop: users submit city, line item, price, contacts [V].
- Price-list count (~467 metro lists) not confirmed [U].
- 360Value [V]: **431 US regions** with ZIP-level components; feedback from ~92,000 contractors; >5 million repair estimates analyzed annually; quarterly reconstruction-cost trend reports (free); Web Integration (API).
- XactRemodel supplies cost data to Zonda's Cost vs Value [V].

## 7. Cost data embedded in software

| Product | Bundled data source | Notes |
|---|---|---|
| Sage Estimating | RSMeans (separate $1.5–3k/user/yr) [V] | Official RSMeans integration guide |
| Trimble WinEst | RSMeans refresh bundling contract-dependent [V] | |
| Beck DESTINI Estimator | No bundled national DB found [V/U] | |
| STACK | RSMeans integration [V] | |
| Procore | RSMeans integration [V] (third-party claim) | |
| Buildertrend | **No** third-party cost DB; user-built [V] | |
| Autodesk Construction Cloud / ProEst | ProEst acquired by Autodesk 2021 [U] | |
| HCSS HeavyBid, B2W, Bluebeam | User-built resource libraries [U] | |
| Clear Estimates | RemodelMAX (acquired 2020): 13,000+ items, 400+ markets, quarterly [V] | |
| Contractor Foreman | "Real-time Cost Database" feature; source not identified [V/U] | |
| Buildxact | 1build live pricing (2023) + Home Depot Optimal Pro live catalog + supplier price-file API + AI Estimator [V] | |
| Bolster (ex-CostCertified) | AutoCost powered by 1build API (2023) [V] | |
| Togal.ai | $199 / $299 per user/mo; takeoff-focused [V] | |
| Kreo | UK-based; no US cost DB [V] | |
| **1build** | 68M live material/labor/equipment costs, every US county, API-first; $14.6M raised; YC. **No evidence of acquisition by Kojo or shutdown**; latest partnership press found is 2023 [V]. Status in 2026 = **unverified**. |

## 8. Indexes and market reports

| Index | Publisher | Geography | Cadence | Method | Free? |
|---|---|---|---|---|---|
| CCI / BCI | ENR | 20 cities | Monthly | CCI = 200 hrs common labor + 25 cwt structural steel + 1.128 tons cement + 1,088 bf 2x4 lumber [V]; base 1913=100 [U] | Headlines free; history subscriber |
| Building Cost Index | Turner | National | Quarterly | Labor, material, productivity, competitive condition; Q1 2026 = 1530 (+4.87% y/y); Q2 2026 = 1552 (+5.15% y/y) [V] | Yes |
| Construction Cost Index | Mortenson | Metro-level (Chicago, Denver, Milwaukee, Minneapolis, Phoenix, Portland, Seattle + national) [U] | Quarterly | Q1 2026: +1.69% q/q, +6.77% y/y [V] | Yes |
| NA Cost Report | RLB | ~12–14 US cities [U] | Quarterly | Q1 2026: ~1%/qtr, ~4% annualized [V] | PDF free |
| Dodge Momentum Index | Dodge Construction Network | National | Monthly | Leads spending 12–18 mo [V] | Yes |
| Construction Cost Insights | Gordian | National/regional | Quarterly | RSMeans-derived [V] | Yes |
| Backlog Indicator | ABC | National + size/region | Monthly | Member survey; 8.1 months Feb 2026 [V] | Yes |
| Cost of Constructing a Home | NAHB | National | Biennial [U] | 2024: avg $428,215, ~$162/sf, 2,647 sf; construction = 64.4% of price; lot 13.7% [V] | Summary free |
| Cost vs Value | Zonda (38th ed., 2025) | 150 metros | Annual | 28 projects; XactRemodel data + BLS indices + realtor surveys [V] | Web free |
| True Cost Guide | Angi/HomeAdvisor (independent since IAC spin-off Apr 1, 2025) | ZIP | Rolling | Median of consumer-reported project costs [V] | Free web |
| Fixr | Fixr | National | Quarterly [V] | Independent research | Free web |
| Global Construction Costs Yearbook | Compass International | 101 countries; R&M yearbook 10,000+ lines [V] | Annual | Sample PDF public [V] | Paid |
| Whitestone Research | — | — | — | No current presence found; likely dormant [U] | — |
| Beck Group Cost Report | Beck | — | Semiannual [V] | | Free |

## 9. Equipment cost references
- **EquipmentWatch Rental Rate Blue Book [V]:** specified by 47–48 state DOTs; monthly/weekly/daily + FHWA rates for thousands of models; FHWA rate = monthly rate ÷ 176 + hourly operating cost. Now Fusable (ex-Randall-Reilly) [U]. WSDOT-AGC Equipment Rental Agreement (eff. 07/16/2024) documents DOT application [V].
- **Caltrans Labor Surcharge & Equipment Rental Rates [V]:** free PDF, April 1 2026–March 31 2027 edition (book_26_27.pdf); miscellaneous rates list updated daily; web calculator at mets.dot.ca.gov. **Best free, authoritative equipment O&O rate source.**
- **USACE EP 1110-1-8 [V]:** Vols 1–12 for Regions I–XII; operating cost = fuel + FOG + repairs + tire wear + tire repair; editions found 2016, 2018, 2020; free on publications.usace.army.mil.
- **Rouse (RB Global) [V]:** invoice-level data from 400+ rental companies; benchmarks by Cat Class per market; client-only.
- **Ritchie Bros / MachineryTrader:** third-party scrapers exist on Apify [V] — public listing pages but ToS-risky.

## 10. Implications for an open RSMeans alternative
1. **Do not derive numbers from RSMeans/BNi/Xactimate** — RSMeans terms explicitly bar database use and commercial pricing derivation [V]. Emulate the *schema* (CSI MasterFormat + crew/daily-output/bare-cost columns + CCI structure) instead; that structure is not protectable.
2. **Licensable commercial inputs, ranked by openness:** Craftsman (formal API/Excel/Access licensing, quarterly) > 1build (county-level live API, if still operating) > BNi/Marshall & Swift (enterprise only) > RSMeans (API exists but redistribution barred).
3. **Fully free/public building blocks:** Caltrans equipment book, USACE EP 1110-1-8, state DOT bid tabs, Davis-Bacon/BLS OEWS wages, ENR/Turner/Mortenson/RLB headline indexes, NAHB cost survey, Zonda Cost vs Value (150 metros), Angi/Fixr consumer cost guides (aggregated medians, ToS-restricted for scraping).
4. **Localization benchmark to match:** RSMeans' 731 cities / >930 ZIP3 / 66-material-21-trade-6-equipment basket; Craftsman's ZIP3 material+labor factors; Xactimate's ~430–470 metro price lists monthly; 1build's county-level.

## Unverified items
RSMeans exact 2026 tier prices; Craftsman 2026 prices, ZIP3 factor count; BNi ACCESS pricing; M&S update cadence and Cotality rebrand date; Xactimate price-list count (467) and pricing; 1build's 2025–26 status; ConstructConnect Expansion Index; Whitestone status; EquipmentWatch pricing/ownership; e2Value/RCT methodology; USACE 2023+ editions.

## Sources consulted
rsmeans.com/products/online/tiers · rsmeans.com/rsmeans-city-cost-index · rsmeans.com/resources/rsmeans-data-accuracy-deep-dive · rsmeansonline.com/Content/RSMeansOnlineUserAgreement.pdf · damassets.autodesk.net/.../RSMeans-Terms.pdf · gordian.com/products/rsmeans-data-services/ · join.build/integrations/gordian-rsmeans/ · docs.sage.com/.../SageEstimatingMeansIntegration_2024.pdf · craftsman-book.com/data-licensing · craftsman-book.com/national-estimator-cloud/ · craftsman-book.com/media/static/previews/2026_NCE_book_preview.pdf · bnibooks.com/products/2026-bni-general-construction-costbook-with-assemblies · content.cotality.com/marshall-swift/residential-cost-handbook/ · verisk.com/.../pricing-research-methodology.pdf · verisk.com/products/360value-personal/ · 1build.com · buildxact.com/us/news/...1build-and-buildxact-partnership/ · prnewswire.com/...costcertified-taps-1builds-live-construction-data-api... · developer.buildxact.com/suppliers-price-file · buildxact.com/us/home-depot-pro/ · enr.com/economics/faq · turnerconstruction.com/cost-index · mortenson.com/news-insights/construction-cost-index-q1-2026 · rlb.com/americas/insight/rlb-construction-cost-report-north-america-q1-2026/ · nahb.org/.../cost-of-constructing-a-home-in-2024 · zondahome.com/2025-cost-vs-value-report/ · compassinternational.net · equipmentwatch.com/resource/fhwa-rate/ · wsdot.wa.gov/publications/fulltext/construction/equipment-rental-agreement.pdf · dot.ca.gov/-/media/dot-media/programs/construction/documents/equipment-rental-rates-and-labor-surcharge/book_26_27.pdf · mets.dot.ca.gov/equipment-rental-rate-calculator/ · publications.usace.army.mil/Portals/76/Users/182/86/2486/EP%201110-1-8_RV1-12.pdf · rbglobal.com/insights/rouse-rental-insights/
