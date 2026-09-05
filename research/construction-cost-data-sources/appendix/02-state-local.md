# State & Local Government Sources of US Construction Cost Data

**Verification legend:** ✓ = URL and description surfaced directly in search results; ~ = URL surfaced but details partly inferred; ? = unverified / not found. No page could be fetched directly (proxy egress blocked for .gov and most DOT domains). Treat every "history depth" and "all-bidder" claim as needing a confirmation fetch before building a scraper.

---

## 1. State DOT bid tabulations and average unit price reports

### 1a. Cross-cutting facts
- Nearly every state DOT lets through **AASHTOWare Project Bids + Bid Express (bidx.com)**; the per-letting **bid tabulation (all bidders, all items)** is public on the DOT's own site or on bidx.com's agency page, but bidx's **Bid Tab Analysis** (low/avg/high by item, by contractor) is a paid vendor service ("Advanced Plan" = ~40 agencies, one year of history) ✓.
- Two distinct products exist per state: (a) **per-letting bid tabs** (all bidders, PDF/HTML/TXT, ~weekly) and (b) **average/weighted-average unit price reports** (usually awarded/low-bid only, annual or semiannual PDF/XLS). Scrape (a) for an all-bidder database; use (b) for cross-checks.
- Item codes are state-specific (Caltrans 6-digit; TxDOT bid code + spec year; FDOT pay item; NYSDOT Pay Item Catalog; MDOT SHA; DDOT "DDOT13Catalog.xml"; etc.). A crosswalk to a common taxonomy (e.g., FHWA NHCCI item groups, or a MasterFormat-like civil schema) is the core engineering task.
- **FHWA NHCCI** is built from Oman Systems' Bid-Tabs database (state-posted bids, quarterly updates); FHWA dashboard exports index + component contributions but **not item-level bids** ✓.

### 1b. State-by-state table

| State | Source / URL | Format | Geo | Cadence / window | Bidders | History | Notes / status |
|---|---|---|---|---|---|---|---|
| CA | Caltrans Contract Cost Data DB: `https://sv08data.dot.ca.gov/contractcost/` (mirror `d8data.dot.ca.gov/contractcost/`) | HTML query by 6-digit item code/description; returns avg unit cost, std dev, total; `results.php?cs=1&item=833032` pattern | 12 districts + statewide | Continuous (per bid opening); formerly annual "Contract Cost Data Book" | Search returns contract-level bids (appears to include low bidder prices; all-bidder status ?) | DB claimed 1993–2025 ✓ | Apify scraper exists ✓. Quarterly "Price Index for Selected Highway Construction Items" (CCI) covers roadway excavation, AB, AC, PCC, rebar, structural steel ✓. Egress blocked—verify export. |
| TX | (1) **Texas Open Data Portal "Bid Tabulations"** `https://data.texas.gov/dataset/Bid-Tabulations/de7b-7dna` (Socrata, CSV `views/de7b-7dna/rows.csv`) ✓; (2) TxDOT Bid Item Averages dashboard (Power BI, 24-mo window, daily 6 a.m.) ✓; (3) legacy district HTML pages `dot.state.tx.us/insdtdot/geodist/{dal,hou,aus,...}/cserve/bidprice/s_MMYY.htm` and statewide `.../orgchart/cmd/cserve/bidprice/` ✓; (4) "Official and Unofficial Bid Items" `qh8x-rm8r` ✓ | Socrata API/CSV; Power BI; HTML | Statewide + 25 districts + county | Dataset updated per letting (monthly lettings); dashboard 24-mo rolling | **ALL bidders** (columns: BID RANK SEQUENCE NUMBER, LOW BIDDER FLAG, VENDOR NAME, ENGINEER'S ESTIMATE UNIT PRICE, BID CODE, SPEC BOOK YEAR, MEASUREMENT UNIT, COUNTY, DISTRICT) ✓ | Dataset depth ? (dashboard = 24 mo; legacy HTML monthly pages go back years) | **Best single structured source in the US.** Legacy 3-mo/12-mo avg low bid PDFs discontinued in favor of dashboard ✓. |
| FL | FDOT Historical Item Average Cost reports `https://www.fdot.gov/fpo/fpc/reports/historicalitemaveragecost`; blob PDFs e.g. `.../historical-item-averages-statewide-12-months.pdf`, `.../historical-item-averages-market-area-13.pdf`; annual statewide avg PDFs back to ≥2016 ✓ | PDF (moving 6/12-mo), public Bid Price Search dashboard (no download) ✓ | Statewide, 7 districts, ~14 "market areas" | Monthly-updated moving windows; annual | **Awarded (low-bid) prices only, quantity-weighted** ✓ | ≥2016 PDFs; older ? | Per-letting bid tabs on FDOT Contracts Admin (not confirmed). Public dashboard blocks export. |
| WA | WSDOT Unit Bid Analysis `https://wsdot.wa.gov/engineering-standards/design-topics/engineering-applications/unit-bid-analysis`; Bid tabulations page `.../public-works-contract-history/bid-tabulations` ✓ | Web query; results printable or **Excel export** ✓ | County, region, statewide | Continuous | Query by contractor, quantity, county, letting date; all-bidder status likely (BidTabs Pro used internally) ~ | ? | WSDOT publishes a CCI (not confirmed by snippet). |
| NY | NYSDOT Weighted Average Item Price Report (WAIPR) `https://www.dot.ny.gov/divisions/engineering/design/dqab/waipr`; PDFs e.g. `.../dqab-repository/WAIPRQ0713_0614.pdf` ✓ | PDF | 11 Regions + statewide, quarterly stats per item | Prepared March (prior CY) and September (Jul–Jun) ✓ | **Awarded (weighted avg awarded price)**; LS/fixed-price items excluded ✓ | Repository PDFs ≥2010 ✓ | Pay Item Catalog at `.../specifications/pay-item-catalog` ✓. Bid tabs via bidx NY. |
| MN | MnDOT Abstracts (awarded jobs) `https://www.dot.state.mn.us/bidlet/abstract.html`; Post-letting `.../bidlet/postletting.html`; Cost estimating (avg bid price reports, historical bid price files, CCI) `https://www.dot.state.mn.us/pre-letting/cost-estimating/index.html`; CCI `.../bidlet/cost-index.html` ✓ | Abstracts = PDF per project; avg price files (format ?) | Statewide (district in abstracts) | Per letting (monthly-ish); avg reports periodic | **Abstracts = ALL bidders + engineer's estimate** ✓ | ? (third-party `mndotbidprices.com` dashboard has scraped abstracts) ✓ | CPAM also mirrors abstracts. |
| PA | PennDOT ECMS `https://www.ecms.penndot.gov` — Bid Results, Bid Tabs, "Item Price History" help pages ✓ | HTML app; public read access for bid results appears available but some functions need Business Partner login ~ | Statewide/district | Per letting (biweekly) | Bid tabs = all bidders (ranked) ✓ | ? | APC (paconstructors.org) posts letting info ✓. Scrape feasibility ?—verify auth. |
| OH | ODOT Bid Data `https://www.transportation.ohio.gov/working/contracts/estimating/bid-data`: Item Price Search, Bid Tabs, Summary of Contracts Awarded (statewide avg unit price & qty per year) ✓; archive bid tabs 1994–2008 ✓ | Interactive reports (likely Power BI) + instructions page | Statewide, district | Per letting; annual summary | Bid Tabs = all bidders ✓ | 1994+ (archive) ✓ | Export ability ?. |
| OR | ODOT Bid Item Prices `https://www.oregon.gov/odot/business/pages/average_bid_item_prices.aspx` — **spreadsheet** with bid date, contract, region, project, item, qty, bid price, **bidder rank** ✓; annual Weighted Average Item Prices PDFs (2019–2022+ at `.../Business/Estimating/Weighted_Average_Prices_YYYY.pdf`) ✓; Bid tabulations `.../procurement/pages/bt.aspx`; Bid Item List XLSX ✓ | XLSX + PDF | 5 regions + Region 0 = statewide | Spreadsheet continuous; PDF annual | **ALL bidders with rank** in spreadsheet; PDF gives "Average of Low 3 Bidders" ✓ | ≥2019 PDFs; spreadsheet depth ? | Excellent structured source. |
| IL | IDOT Letting & Bidding `https://webapps.dot.illinois.gov/WCTB/LbHome`; "Unit Price Tabulation of Bids" (all bidders per item, published after execution) and "Pay Item Report with Awarded Prices" (qty, county, district, UOM, awarded price) per letting ✓; Electronic Subscription Service ✓ | PDF/HTML per letting | County + 9 districts | Per letting (≈monthly) | **ALL bidders** (Unit Price Tab) ✓ | ? | Third-party: flexureflow.com IDOT Bid Item Report (paid) ✓, DOTestimate ✓. |
| GA | GDOT "Pay Item Index & Item Mean Summary" and BidX bid tabs (referenced in GDOT QC-QA best-practices PDF) ~ | ? (likely PDF/XLS) | Statewide | ? | Item Mean = awarded ? | ? | URL not captured—**unverified**. |
| NC | Connect NCDOT Bid Averages: annual `.xlsm` files `https://connect.ncdot.gov/letting/LetCentral/2022%20BID%20AVERAGES.xlsm` (2017, 2020, 2022 seen) ✓; Bid Tab Sheets `https://connect.ncdot.gov/letting/pages/bid-tabs.aspx` ✓ | XLSM (macro workbook) + bid tab PDFs | Statewide (divisions ?) | Annual averages; bid tabs per letting | Averages = awarded ?; bid tabs = all bidders | 2017+ visible | NCDOT uses price-quantity curves internally ✓. |
| VA | VDOT Statewide Bid Tab Query `https://bidtabs.vdot.virginia.gov/` (NHCCI-indexed, Excel export) ✓; Two-Year Historical Bid Price Listing XLSX (updated 8/3/2026) + district & statewide 1-yr/2-yr averages; bid tabs page `virginiadot.org/business/const/resources-bidtabs.asp`; item codes page ✓ | Web app + XLSX/PDF | 9 districts + statewide | Continuous; listing refreshed ~monthly | Query includes all bidders ~ | ? (query indexed by NHCCI implies multi-year) | Users manual v1.1 (Aug 2024) ✓. |
| MI | MDOT Bid Letting `https://mdotjboss.state.mi.us/BidLetting/BidLettingHome.htm` (per-letting bid tabs) ✓; Michigan LTAP "Download MDOT Bid Letting Data" guide ✓; "Design Estimating Average Unit Price" (michigan.gov, URL ?) | HTML/PDF per letting; downloadable letting data | Statewide/region | Per letting (monthly) | **ALL bidders** ✓ | ? | LTAP guide describes computing avg/std dev from downloads ✓. |
| WI | WisDOT Statewide Average Unit Price List (3 fiscal years, by FY) `https://wisconsindot.gov/hccidocs/contracting-info/average-unit-price.pdf` ✓; per-letting "all bids received" on HCCI ✓; Bid Express history internal-access ✓; CF-CCI ✓ | PDF; letting results PDF | Statewide | Annual list; per letting | List = all projects using item (awarded) ; letting results = all bidders ✓ | 3 FY in list | Guidance says >6-mo bid history use with caution ✓. |
| IN | INDOT Unit Price Summaries `https://www.in.gov/indot/doing-business-with-indot/files/CY2024-Unit-Price-Summary.xlsx` (weighted avg/high/low, **from low bid**), archives to 2008 EN/metric ✓; Official Tabulation of Bids PDFs per letting ✓; INDOT Bid Viewer `https://erms12c.indot.in.gov/INDOTBidViewer/BidTabulations.aspx` ✓ | XLSX + PDF + web viewer | Statewide (district ?) | Annual (CY) summary; per letting | Summary = low bid only ✓; tabs = all bidders | 2008+ ✓ | Good structured XLSX. |
| CO | CDOT Cost Data Book (annual, weighted avg by item, CY) `https://www.codot.gov/business/eema/costdatabook`; state library PDF archive `spl.cde.state.co.us/artemis/traserials/tra4310internet/tra4310YYYY...pdf` 2001–2025 ✓; quarterly CCI PDF ✓ | PDF | Statewide (per-project detail in book) | Annual (Feb); CCI quarterly | Awarded (weighted) ✓ | 2001+ ✓ | English units from 2012 ✓. |
| AZ | ADOT Bid Tabulations `https://cnsads.azdot.gov/tabulations`, As-read results `cnsads.azdot.gov/as-read` ✓ | HTML/PDF | Statewide | Per letting; **tabs available only 4 months after award**, then public-records request ✓ | All bidders ✓ | 4-month window ✓ | "Searchable historical price index" mentioned but URL ?. Scrape continuously to retain history. |
| UT | UDOT — PDBS Engineer's Estimate Price Comparison (internal); bid tabs via bidx UT (?) | ? | ? | ? | ? | ? | **Not found**; flag. |
| MO | MoDOT annual district "Unit Bid Prices" PDFs (avg qty, #bids, avg/high/low) served from `modotweb.modot.mo.gov/BidLettingPlansRoom/Letting/ViewStream/{id}?type=general_info` (2020–2023 NW district seen) ✓; bid opening info `modot.org/bid-opening-info` ✓ | PDF | **By district** | Annual | Avg/high/low across bids (all bidders implied) ✓ | 2020+ seen | Opaque IDs—crawl plans room. |
| KS | KDOT Historical Bid Tabs Index `https://kdotapp.ksdot.gov/BidTabs/` (**CSV index download**) ✓; bidx KS lettings ✓ | CSV index + tab files | Statewide | Per letting | All bidders ✓ | ? | |
| IA | Iowa DOT Bid Tabulations `https://iowadot.gov/consultants-contractors/contracts/historical-completed-lettings/bid-tabulations` (≈1 week after opening) ✓; Bid Item Information page ✓ | PDF | Statewide | Per letting (monthly) | All bidders | ? | Free full tabs on `bidtabs.us/ia/` ✓. |
| LA | LADOTD bid tabs `https://wwwapps.dotd.la.gov/engineering/lettings/bidstabs/tabulations/btitems.aspx?LetId=...&propid=...`; results `.../bidsresl/brhqYYYYMMDD.aspx` ✓ | HTML (ASP.NET) | Statewide/district | Per letting | All bidders ✓ | ? | Clean HTML; scrapeable. |
| AL | ALDOT Item Bid Summary (~last 18 months, low/avg/max, excludes LS; updated each letting) `https://alletting.dot.state.al.us/DW_Pages/Pages/Item_Bid_Summary.html` ✓; Bid Tabs by year `.../DW_Pages/Bid_Tabs/Bidtab_2026.html` (text + PDF) ✓ | HTML/TXT/PDF | Statewide | Per letting | Tabs = all bidders; summary = low/avg/max ✓ | Bid tab pages by year (2025, 2026 seen; older ?) | Text-format tabs are easy to parse. |
| SC | SCDOT `https://info2.scdot.org/bidtabs/Pages/home.aspx` per letting date, PDF ✓ | PDF | Statewide | Per letting | All bidders | 2017+ seen | Subject to change until award ✓. |
| TN | TDOT Average Unit Prices annual PDF `https://www.tn.gov/content/dam/tn/tdot/construction/previous_lettings/Const_aup2025.pdf` (2021–2025) ✓; Summary of Bids PDF per letting ✓ | PDF | Statewide | Annual + per letting | AUP = awarded ?; summary = all bidders | 2021+ | Bid Express TN. |
| KY | KYTC Average Unit Bid Prices `https://transportation.ky.gov/Construction-Procurement/Pages/Average-Unit-Bid-Prices.aspx` ✓; Bid Items XLS; bid codes; item lists per letting HTML ✓ | XLS/HTML | Statewide | Annual/periodic | ? | 2015+ (per KTC study) ~ | |
| OK | ODOT Average Price History `https://www.odot.org/contracts/avgprices/index.php` — PDFs covering ~18-month windows (e.g., Oct 2015–Mar 2017; Apr 2018–Sep 2019) ✓ | PDF | Statewide | Semiannual, 18-mo window | Awarded ? | 2011+ ✓ | |
| NM | NMDOT PS&E Average Unit Bid Prices by year `https://www.dot.nm.gov/infrastructure/plans-specifications-estimates-pse-bureau/average-unit-bid-prices/` ✓ | PDF/XLS ? | Statewide | Annual | ? | ? | |
| ND | NDDOT Bid Opening Reports (apparent low + EE) `https://www.dot.nd.gov/pacer/bidopenrptindex.html` ✓; bids via bidx | PDF | Statewide | Per letting | Low bidder totals (item tabs via bidx) | ? | No avg unit price list found. |
| SD | SDDOT annual Bid Item Price Report PDF `https://dot.sd.gov/media/qqhgg24h/2024-bid-item-price-report.pdf` (2020–2024) ✓; letting app `apps.sd.gov/hc65bidletting/` ✓ | PDF | Statewide | Annual | Avg (bidders ?) | 2020+ | Standard Bid Items list ✓. |
| MT | MDT Weighted Average Prices Catalog (AASHTOWare PRECON002 report) `https://mdt.mt.gov/other/webdata/external/contractplans/contract/Archives/Average_prices/2025.pdf` (2016–2025) ✓; Bid Archives ✓ | PDF | Statewide | Annual (CY) | Weighted awarded ✓ | 2016+ ✓ | |
| WY | WYDOT Weighted Average Bid Price `https://www.dot.state.wy.us/home/business_with_wydot/contractors/contractor_bids/weighted_bid_price.html`; Bid Tabulations page ✓; 2006 report in state digital collections ✓ | PDF/HTML | Statewide | Annual | Weighted awarded | 2006+ (archive) | Base Index Prices page (fuel/asphalt) ✓. |
| NV | NDOT E-Bidding Portal `appss.nevadadot.com/EBiddingPortalClient/`; Active & Awarded Contracts page ✓ | HTML | Statewide | Per letting | Bid tabs per contract ~ | ? | No avg unit price list found. |
| HI | HDOT Contracts page (current/prior bid results by FY) `https://hidot.hawaii.gov/administration/con/` ✓; HANDS ✓ | PDF | Statewide/island | Per letting | Totals; item tabs ? | ? | Weakest state; GCA Hawaii bid data site ✓. |
| AK | DOT&PF Bid Item Search `https://dot.alaska.gov/procurement/awp/biddata.html` ✓; pre-7/2018 history `dot.alaska.gov/aashtoware/Historical_Bid_Prices/`; post-2018 on bidx AK ✓ | Web search + archive | Region | Continuous | ? | Pre-2018 archive ✓ | |
| MA | MassDOT Construction Project Estimator – Weighted Bid Prices `https://hwy.massdot.state.ma.us/CPE/` (ItemSearch, WeightedAverageCriteria) ✓ | Web app (export ?) | Statewide, quantity bands | **Weekly** updates ✓ | **ALL responsive bids**, trimmed outliers, mean & median ✓ | ? | Unique: quantity-banded means. |
| CT | CTDOT Estimating Guidelines PDF (2024/2026) `portal.ct.gov/dot/.../cost_estimating/...` — Estimator® 3-yr/5-yr catalogs (internal) ✓ | PDF guidelines | Statewide | Annual guidelines | n/a | n/a | Public bid tabs ? (likely via bidx CT). |
| NJ | NJDOT Bid Price Report (annual, weighted avg all pay items) `https://www.nj.gov/transportation/business/aashtoware/pdf/report2013.pdf` ✓; bid tabs TXT per contract `.../procurement/ConstrServ/report/TB05407.TXT` ✓; awards page ✓ | PDF + **TXT** | Statewide | Annual report; per letting tabs | Report = awarded weighted; tabs = all bidders ✓ | 2013 report seen; current ? | TXT tabs are trivially parseable. |
| DE | DelDOT Historic Bid Tab Search (Design Resource Center) ✓; final bid tab display `deldot.gov/public.ejs?command=PublicFinalBidtabDisplay&id=T2015...` ✓ | HTML | Statewide | Per letting | All bidders ✓ | 2015+ seen | |
| MD | MDOT SHA Price Index (semiannual Jan/Jul PDF) `https://roads.maryland.gov/ohd2/MDSHA_Price_Index_January_2025.pdf`; index page `roads.maryland.gov/mdotsha/pages/Index.aspx?PageId=34` ✓ | PDF | Statewide | Semiannual | Awarded (contract, date, qty, unit price per item) ✓ | 2020+ seen | |
| NH | NHDOT Current Weighted Average Unit Prices PDF `https://www.dot.nh.gov/sites/g/files/ehbemt811/files/inline-documents/current-weighted-average-unit-prices.pdf` ✓ | PDF | Statewide | Periodic | Weighted awarded | Current only | Bid results via Records Section ✓. |
| VT | VTrans Cost Estimating `https://vtrans.vermont.gov/cost-estimating` — 2/5-year Average Prices (Dec 2023) + Master Pay Item List ✓ | PDF/XLS | Statewide | Annual | Awarded ? | 5-yr window | |
| ME | MaineDOT — bidx ME only ✓ | — | — | — | — | — | **No public avg price list found.** |
| RI | RIDOT PMP Bid Tabs `https://www.pmp.dot.ri.gov/PMP/...cp=bidtabs` ✓; Weighted Average Unit Prices (Contractors & Consultants page) ✓ | Web portal + PDF | Statewide | Per letting; periodic | All bidders (tabs) | ? | |
| WV | WVDOH Average Unit Bid Prices `https://transportation.wv.gov/highways/contractadmin/Lettings/Pages/AverageUnitBidPrices.aspx`; annual **XLS + PDF** (`.../2025AverageBid/AverageUnitBidPrice 2025.xls`), TXT reports 2008, 2013 ✓ | XLS/PDF/TXT | **By district**; min/mean/max, frequency, qty ✓ | Annual | All bids (min/mean/max) ✓ | 2008+ ✓ | Good structured source. |
| DC | DDOT Price Index `https://ddot.dc.gov/page/price-index`; Bid Tabulations `https://ddot.dc.gov/page/bid-tabulations`; Estimation Catalog (`DDOT13Catalog.xml`) ✓ | PDF/XML | District | Per letting | As submitted by offerors ✓ | ? | |
| NE | NDOT Bid Item History `https://dot.nebraska.gov/business-center/hwy-bridge-lp/item-history/` (search by std item code) ✓; AUP PDF `dot.nebraska.gov/media/5nrobrwj/aupj2018_j2019.pdf` ✓ | Web + PDF | Statewide | Annual (Jul–Jun) | ? | ? | |
| MS | MDOT Item Bid Prices `https://mdot.ms.gov/portal/item_bid_prices` (JS app) ✓; BidSystem `mdot.ms.gov/Applications/BidSystem/` ✓ | JS app (likely JSON API behind) | Statewide | Continuous | ? | ? | Inspect XHR for API. |
| AR | ARDOT Weighted Average Prices (annual PDF: high/low/avg/weighted) `https://ardot.gov/.../weighted-average-prices/`; Bid Tabulations page ✓ | PDF | Statewide | Annual + per letting | All bids (high/low) ✓ | 2020+ seen | bidtabs.us/ar ✓. |
| ID | ITD Item Average Price Report **spreadsheet** (bid date, contract, key, description, contractor **rank**) `https://apps.itd.idaho.gov/Apps/contractors/Reports/Avg_Unit_Price_Instructions.pdf`; bid results PDFs `apps.itd.idaho.gov/apps/contractors/brNNNNN.pdf` ✓ | XLSX + PDF | Statewide/district | Continuous | **ALL bidders with rank** ✓ | ? | |

**States with no public avg-price product found:** UT, NV, HI, ME, ND (tabs only), CT (internal catalogs), GA (unverified).

### 1c. Bid-letting platforms and aggregators

| Platform | Data exposure | Notes |
|---|---|---|
| Bid Express / bidx.com (Infotech) ✓ | Per-agency lettings and posted bid tabs viewable; **Bid Tab Analysis** (low/avg/high by item/proposal/contractor) is a paid service; Advanced Plan covers 40+ agencies, 1 year history | 44 state agencies use it. No public API. TOS restricts bulk reuse (verify). |
| AASHTOWare Project (Bids/Preconstruction) ✓ | Agency back-end; no public API. Reports like "PRECON002 Weighted Average Prices Catalog" are what states post. | |
| Oman Systems BidTabs.NET / BidTabs Pro ✓ | 46 states (all but HI), some states back to 1993; updated ~1 week after letting; **feeds FHWA NHCCI** | Commercial subscription. |
| DOTestimate / **bidtabs.us** ✓ | 22 states (IL, IA, WI, MI, KS, KY, MO, MN, GA, AR, …), full tabs since 2004, free viewer no account | Best free multi-state mirror; check TOS before scraping. |
| flexureflow.com (IDOT) ✓, mndotbidprices.com ✓ | Single-state third-party dashboards | Evidence that abstracts are scrapeable. |
| CivCast (TX) ✓ | Local-agency lettings + instant tabulations; requires account; no bulk data | |
| Bonfire + DemandStar (merged under GTY) ✓, BidNet Direct, PlanetBids, PublicPurchase, iSqFt ✓ | Agency-scoped portals; bid results/tabs posted per solicitation; no cross-agency public tab API; aggregators charge $100–500/mo for public data ✓ | Municipal bid tabs (e.g., Chicago DPS Bid Tabs page ✓) are per-city HTML/PDF. |
| Texas Open Data Portal (Socrata) ✓ | Full TxDOT tabs as CSV/API — see TX row | Model for what other states could publish. |

---

## 2. State prevailing wage rates

| State | URL | Granularity | Cadence | Format | Fringe broken out | Notes |
|---|---|---|---|---|---|---|
| CA DIR ✓ | `https://www.dir.ca.gov/oprl/dprewagedetermination.htm`; per-issue `.../oprl/2026-1/PWD/index.htm` | County / locality, by craft; journeyman + apprentice | Semiannual (Feb 22 & Aug 22 issues; 2026-2 current) | HTML index → PDF (+ some XLS) | Yes (basic, H&W, pension, vacation, training) | Archive back to at least 2021-1 online ✓. |
| NY DOL ✓ | `https://apps.labor.ny.gov/wpp/viewPrevailingWageSchedule.do?typeid=1&county=NN`; Article 8 statewide PDF `dol.ny.gov/system/files/documents/2023/06/article-8.pdf` | County; general vs residential | Annual (Jul 1) with monthly corrections (1st business day) ✓ | HTML per county / PDF | Yes (supplemental benefits) | Parameterizable URL by county id. |
| WA L&I ✓ | Lookup `https://fortress.wa.gov/lni/wagelookup/prvWagelookup.aspx`; page `lni.wa.gov/licensing-permits/public-works-projects/prevailing-wage-rates/` | County × trade, journey + apprentice | Semiannual (effective first week Mar & Sep) ✓ | Web lookup with **DOWNLOAD WAGES → spreadsheet** ✓ | Yes (wage + benefits listed) | Historical by effective date. |
| IL DOL ✓ | `https://labor.illinois.gov/laws-rules/conmed/prevailing-wage-rates.html`; per-issue `.../rates/fy2026/2026-april-15-prevailing-wage-rates.html`; historical `.../rates.html` | County | Annual (Jul 15) + periodic revisions (Apr 15, 2026 seen) ✓ | HTML per county | Yes (base + fringe: H&W, pension, vacation, training) | Portal exists. |
| MA DLS ✓ | `https://www.mass.gov/info-details/prevailing-wage-for-contractors` | **Project-specific schedules** requested by awarding authority (valid 90 days) ✓; county-based | Per project; rates from CBAs | PDF per project | Yes | No single statewide table—scrape from posted bid packages. |
| NJ DOL ✓ | `https://www.nj.gov/labor/wagehour/...`; county PDFs e.g. `nj.gov/labor/forms_pdfs/lsse/wagearchives/Burlington/2015/...pdf` | County × craft | Rolling updates per CBA; archives | PDF | Yes | State Building Service rates separate ✓. |
| PA L&I ✓ | `https://www.pa.gov/agencies/dli/resources/forms-and-documents/labor-law/prevailing-wage-projects` (project search) | **Per-project determinations** (Building/Highway/Heavy/Residential), county | Per project | Web search → PDF | Yes | No statewide schedule ✓. |
| OH Commerce ✓ | New rate system (launched June 27, year ?) — search by occupation & jurisdiction | County/region | Per CBA | Web | Yes | `com.ohio.gov` prevailing wage page. |
| MN DLI ✓ | Commercial `https://www.dli.mn.gov/business/employment-practices/prevailing-wage-commercial-rates`; data `secure.doli.state.mn.us/prevwage/commercial_data.php?county=NN`; Highway/Heavy separate page | County | Annual survey-based certification | HTML/CSV-ish per county ✓ | Yes | Parameterizable by county id. |
| OR BOLI ✓ | `https://www.oregon.gov/boli/employers/pages/prevailing-wage-rates.aspx`; rate books PDF | Region (multi-county) × classification | Quarterly (Jan/Apr/Jul/Oct 5) ✓ | PDF rate book | Yes (base + fringe) ✓ | ODOT mirrors combined BOLI/Davis-Bacon PDFs ✓. |
| NV Labor Commissioner ✓ | `https://labor.nv.gov/PrevailingWage/2025-2026_Prevailing_Wages/` | 4 regions (Clark, Southern rural, Washoe, Northern rural), 42 classifications | Annual (Oct 1–Sep 30) ✓ | PDF (per region) | ? (likely total incl. fringe) | 2026: adopted for Davis-Bacon ✓. |
| HI DLIR ✓ | `https://labor.hawaii.gov/rs/wage-rate-schedule/`; bulletins `.../files/2026/02/WRS510.pdf` | Statewide (by island?) × occupation | Semiannual (Feb 15, Sep 15) ✓ | PDF | Yes (basic + fringe, current & future years) ✓ | |
| AK DOL | Pamphlet 600 / Title 36 rates (labor.alaska.gov) ? | Statewide/regional | ~Semiannual | PDF | Yes | **Not verified**. |
| CT DOL ✓ | `https://portal.ct.gov/dol/divisions/wage-and-workplace-standards/prevailing-wage` — Annual Adjusted rates Jul 1 | Town/county, Building/Heavy-Highway/Residential | Annual (Jul 1) | PDF | Yes | |
| MD DOL | dllr.state.md.us informational rates by county (Building/Highway/Heavy) ? | County | Annual | PDF | Yes | **Not verified**; $500k threshold ✓. |
| DE DOL ✓ (partial) | delaware.gov prevailing wage annual determination | 3 counties × Building/Highway/Heavy | Annual survey | PDF | Yes | URL not captured. |
| RI DLT ✓ (partial) | dlt.ri.gov prevailing wage | Statewide | Annual/CBA | PDF | Yes | URL not captured. |
| TX | No state PW schedule; TxDOT incorporates **federal Davis-Bacon** (TX has 172 building/54 heavy/13 highway/51 residential determinations) ✓ | County groups | Per WD revision | SAM.gov | Yes | TxDOT county wage-rate tables historically posted (?). |
| Federal Davis-Bacon (SAM.gov) ✓ | `https://sam.gov/wage-determinations`; per WD `sam.gov/wage-determination/{ID}/{rev}` | County × construction type | Continuous revisions | HTML/PDF; **no bulk download**, paginated search; ~68.7k records, ~6% active ✓ | Yes | Third-party APIs (govconapi, prevailingwageindex) exist ✓. Use as fallback for all 50 states. |

---

## 3. Property-tax assessor cost manuals (per-SF replacement cost + local multipliers)

| State | Source / URL | Content | Cadence | Format | Notes |
|---|---|---|---|---|---|
| WI DOR ✓ | Wisconsin Property Assessment Manual Vol. 2 `https://www.revenue.wi.gov/documents/wpamvol2.pdf`; annual editions `wpam11.pdf`…`wpam25.pdf` | Residential, apartment, agricultural cost tables, depreciation, **area modifiers** ✓ | Annual (Dec) | PDF | Archive 2011–2026 ✓. Commercial in Vol 1? (verify). |
| CA BOE ✓ | AH 531 Residential Building Costs `https://www.boe.ca.gov/proptaxes/ah531.htm`; PDFs `boe.ca.gov/proptaxes/pdf/ah53126.pdf` (2018–2026); AH 531A (text) | Per-SF residential costs by class/quality, regional factors | Annual (effective Jan 1) ✓ | PDF | Commercial = AH 534 (not searched). |
| MI STC ✓ | `https://www.michigan.gov/treasury/local/stc/accordion/pubs/michigan-assessor-manuals` — Vol I Residential/Ag (2025), Vol II Commercial/Industrial (2003 base + 2025 updates), Vol III | Cost tables prepared **under contract with Marshall & Swift** ✓ | Periodic (2025 base cost changes) | PDF | M&S-derived → licensing caveat. |
| IA DOR ✓ | 2008 Iowa Real Property Appraisal Manual `https://publications.iowa.gov/6278/`; `revenue.iowa.gov/.../iowa-real-property-appraisal-manual` | Cost tables compiled by Vanguard Appraisals; 9 sections | Static (2008) | PDF | Dated; multipliers applied locally. |
| NC counties ✓ | County Schedules of Values, e.g., Orange (2025) `orangecountync.gov/DocumentCenter/View/12851/...`, Cumberland (2025), Martin (2025), Rowan, Wake, Buncombe (2026) | Per-SF base rates by building type/grade, local multipliers, depreciation | Per revaluation (4–8 yr cycle per county) | PDF | 100 counties → 100 documents; excellent local granularity. |
| IN DLGF ✓ | 2021 Real Property Assessment Guidelines: Appendix C Residential/Ag `in.gov/dlgf/files/2021-assessment-guidelines/241220-Appendix-C.pdf`; Appendix G Commercial/Industrial `in.gov/dlgf/files/2022_Appendix_G_Final.pdf` incl. **Location Cost Multipliers by County** ✓ | Full cost schedules | Reassessment cycle + cost table updates (2022 update presentation ✓) | PDF | Very complete. |
| AZ DOR ✓ | Construction Cost Manual 2009-10 archived at Arizona Memory Project `azmemory.azlibrary.gov/nodes/view/104725` | Cost models | Historical (current editions restricted?) | PDF | Current manual availability ?. |
| FL DOR ✓ | No state cost tables; Florida Real Property Appraisal Guidelines (2024) reference **Marshall & Swift** subscriptions ✓ | — | — | PDF guidelines | Counties use M&S/CAMA. |
| TX ✓ | Comptroller "Residential Cost Schedules" examples `https://comptroller.texas.gov/taxes/property-tax/residential-schedules/`; CAD manuals: HCAD 2025 Mass Appraisal Report (base $89/SF) ✓, TAD 2026 Residential Appraisal Manual ✓, FBCAD, Bee, Borden, Sterling | Per-SF base rates, class factors | Annual per CAD | PDF | 250+ CADs; largest ~20 cover most population. |
| OH ✓ | No state tables; Dept. of Taxation reviews vendor cost schedules (OAC 5703-25-16) ✓ | — | — | — | County auditor CAMA vendors. |
| KY ✓ | PVA Assessment Administration Manual (2022) `revenue.ky.gov/PVANetwork/...` — process, not cost tables | — | — | PDF | No cost tables found. |
| TN ✓ | Comptroller IMPACT CAMA; cost tables not published | — | — | — | ? |
| MT DOR ✓ | Residential/Commercial/Industrial Property Valuation Manual (2021-22 cycle) via Lincoln Institute mirror | Local cost indexes + national manuals | Biennial reappraisal | PDF | State-appraised. |
| UT ✓ | Personal property schedules only found; real-property cost tables in "Paragon" CAMA (Multicounty Appraisal Trust) — not public | — | — | — | ? |
| ID, KS, NE, OK | Only personal-property valuation schedules surfaced (KS PVD `ksrevenue.gov/pdf/ppvg.pdf`, OK Business PP schedule) ✓; real-property cost manuals **not found** | — | — | — | Likely M&S-based; flag. |

Caveat: several states (MI, FL, NE per statute, many others) license Marshall & Swift tables; republishing those numbers may violate M&S copyright even when embedded in a public manual. IN, WI, CA, NC, TX CADs appear to be state/county-authored.

---

## 4. Building permit datasets with declared valuation

| Jurisdiction | Dataset / URL | Valuation field | Access | Cadence / depth | Notes |
|---|---|---|---|---|---|
| NYC ✓ | DOB Permit Issuance `data.cityofnewyork.us` (mirrored `data.ny.gov/.../ipu4-2q9a`) — BIS only; **DOB NOW: Build – Approved Permits** for current permits ✓ | `estimated_job_costs` (Job Application Filings) | Socrata SODA API (50k/page) | Daily | Two systems; join job filings for cost. |
| Chicago ✓ | Building Permits `data.cityofchicago.org` (2006–present) | `REPORTED_COST` (renamed from ESTIMATED_COST) ✓ | Socrata API | Daily | |
| Los Angeles ✓ | `data.lacity.org`: Building Permits Issued 2020–present (`pi9x-tg5x`), Permits >$100K Valuation (`y5ik-mwat`), LADBS Permit Valuation GOVSTAT (`w53t-rwwp`, stale 2023) | Valuation | Socrata/OData | Weekly | |
| San Francisco ✓ | DataSF Building Permits `i98e-djp9` | `estimated_cost` + `revised_cost` ✓ | Socrata | Weekly | Revised cost is a rare quality signal. |
| Seattle ✓ | Building Permits `76t5-zqzr`, Issued `8tqq-u7ib`, Housing Permit Estimated Cost map `bicw-sgia` | EstProjectCost | Socrata + ArcGIS | Weekly | Median $100k / mean $715k ✓. |
| Austin ✓ | Issued Construction Permits `3syk-w9eu` (BLDS-compliant), Census high-valuation `rifm-ftf3` | `total_job_valuation`, sq ft | Socrata | Daily | BLDS standard eases normalization. |
| Philadelphia ✓ | L&I Building & Zoning Permits (OpenDataPhilly → Carto/ArcGIS) | declared cost? (verify field) | API | Daily | |
| Houston ✓ | `data.houstontx.gov` monthly counts only; detailed permits via Houston Permitting Center/ArcGIS ? | ? | — | — | Weak. |
| Dallas ✓ | `dallasopendata.com/Services/Building-Permits/e7gq-4sah` | Valuation | Socrata | Daily | |
| Phoenix | Not surfaced | ? | ? | ? | flag. |
| Aggregators ✓ | **Shovels.ai** (178M permits, 2,750+ jurisdictions, ~85% pop., API/warehouse, updates 1st & 15th) ✓; **BuildZoom** (contractor marketplace + data) ✓; Construction Monitor, PermitVector (TX), Open Permit Data, ATTOM | Valuation normalized | Paid API | Semi-monthly | Shovels is the pragmatic national source. |

Caveats (✓ per Census BPS docs + MA analysis): valuations are self-declared at filing, frequently understated (fee avoidance), exclude land/soft costs, and Census BPS undercounted MA units by ≥14%. Use as a *relative* index (cost/SF by type × county), not absolute unit cost; cross-check against DOT bids and assessor schedules.

---

## 5. State facility cost guides and construction cost indexes

| Source | URL | Content | Cadence | Format |
|---|---|---|---|---|
| CA OPSC/SAB ✓ | `dgs.ca.gov/OPSC` forms SAB 5801/5775 reference **Sierra West** cost data & allowances | Cost-estimate forms; per-SF anecdotal ($725–950/SF) | Per program | PDF |
| CA DGS CCCI ✓ | `https://www.dgs.ca.gov/RESD/Resources/.../DGS-California-Construction-Cost-Index-CCCI` | Statewide building CCI | Monthly/annual | HTML |
| CA DGS Price Book ✓ | `dgs.ca.gov/-/media/Divisions/OFS/Pricebooks/.../FY-2025-2026-Price-Book.pdf` | State services pricing (not construction unit costs) | Annual | PDF |
| MA MSBA ✓ | Cost Data `https://www.massschoolbuildings.org/building/CP_Information_Cost_Data` (Designer Construction Cost Chart 2019–2023; avg $698/SF end-2023); Repair Program cost data (roof/window/boiler) ✓ | Project-level $/SF | Annual | Web/PDF |
| OH OFCC ✓ | Ohio School Design Manual Ch.1 §04 Cost Information `https://osdm.ofcc.ohio.gov/current-osdm/chapter-1-introduction/04-cost-information` | Cost/SF by grade level + regional factors | Annual | Web |
| FL DOE ✓ | Cost per Student Station `https://www.fldoe.org/finance/fco/cost-of-construction/public-schools.stml`; 2022 report; EDR review | $/student station caps (2022: ES $25,392 / MS $27,421 / HS $35,617) | Annual | PDF |
| WA OSPI ✓ | SCAP / Construction Cost Allocation — FY24 $258.92/SF, FY25 $375/SF; actual avg $599.45/SF ✓ | Statewide $/SF | Biennial budget | PDF |
| TX THECB ✓ | Average Construction Costs FY2017–2023 `reportcenter.highered.texas.gov/reports/data/average-construction-costs-fy-2017-2023/`; Construction Cost Standards page; Capital Expenditure Plans | $/SF by facility type for universities | Periodic | Web/PDF |
| TX TFC ✓ | `tfc.texas.gov/divisions/facilities/prog/construct/` (projects, no cost dataset found) | — | — | — |
| UC / CSU / SUNY (SUCF) | Not searched | ? | ? | ? |
| DOT CCIs ✓ | Caltrans quarterly Price Index (selected items) ✓; CDOT quarterly CCI PDF ✓; WisDOT Chained-Fisher CCI ✓; MnDOT CCI page ✓; WSDOT CCI ~; FHWA NHCCI dashboard/export ✓ (`fhwa.dot.gov/policy/otps/nhcci`) | Highway cost indices | Quarterly | PDF/XLS/dashboard |

---

## 6. Municipal/county unit price lists (bond/engineer's estimate)

| Agency | URL | Cadence | Format | Notes |
|---|---|---|---|---|
| City of Austin ✓ | Average Unit Bid Prices DB `https://www.austintexas.gov/averageunitbidprices` — 48-month history by bid item, LS excluded, **quarterly** update | Quarterly | Web (Power BI?) | Best municipal example. |
| Riverside County Transportation ✓ | Engineer's Estimate Guidelines `https://trans.rctlma.org/engineers-estimate-guidelines`; Appendix G Estimating Guides PDF | Periodic | PDF/XLS templates | Fees & Securities Report process ✓. |
| County of San Diego DPW ✓ | Unit Price List `https://www.sandiegocounty.gov/content/dam/sdc/dpw/LAND_DEVELOPMENT_DIVISION/landpdf/unit_price_list/County%20Unit%20Price%20List%20PDS%20DPW%20-%202023.pdf` | ~Annual | PDF | Bonding estimates. |
| City of San Diego DSD ✓ | Unit Price List (2009 legacy PDF) + IB 502 fee schedule | Irregular | PDF | Dated. |
| Clark County NV PW ✓ | Off-Site Improvement Bond Estimate Tabulation form `clarkcountynv.gov/adobe/assets/...bond-estimate-form.pdf`; bond processing page | — | PDF form (unit prices embedded?) | Verify prices in form. |
| Maricopa County MCDOT ✓ | Cost Estimation app `https://apps.mcdot.maricopa.gov/estimation/estimation.aspx` | Continuous | Web app | Likely unit-cost DB behind it. |
| City of Phoenix, Miami-Dade | Not found | ? | ? | flag. |
| Chicago DPS ✓ | Bid Tabulations page `chicago.gov/city/en/depts/dps/provdrs/contract/svcs/bid_and_bond_bidtabulationsbidtabs.html` | Per bid | PDF | Municipal all-bidder tabs. |

---

## 7. Sales tax rates by jurisdiction

| Source | URL | Granularity | Cadence | Format | License |
|---|---|---|---|---|---|
| Avalara free tables ✓ | `https://www.avalara.com/taxrates/en/download-tax-tables.html` | ZIP (state/county/city/special rate, risk level) | Monthly email | CSV | Free w/ registration; ZIP≠jurisdiction caveat ✓ |
| CA CDTFA ✓ | `https://data.ca.gov/dataset/cdtfa-salesandusetaxrates-public` | Jurisdiction polygons | Quarterly | CSV/GeoJSON/Shapefile + query API ✓ | Open |
| TX Comptroller ✓ | `https://comptroller.texas.gov/taxes/file-pay/edi/sales-tax-rates.php` | Local jurisdiction rate files | Quarterly | Flat file | Open |
| Tax Foundation ✓ | `https://taxfoundation.org/data/all/state/2026-sales-tax-rates-midyear/` (pop-weighted avg combined; US avg 7.53%) | State + avg local | Semiannual | HTML/XLS | CC-BY-style |
| Streamlined Sales Tax rate/boundary DBs, WA DOR GIS, CO DOR GIS | Not searched | Address-level | Quarterly | CSV | flag |

Note: material sales-tax treatment for contractors varies (AZ contracting TPT ✓, ID contractor guide ✓) — rate alone is insufficient for localization.

---

## 8. Recommended ingestion priority (all-bidder, structured, deep history first)
1. **TX Socrata `de7b-7dna`** (CSV/API, all bidders, EE, county, district).
2. **OR bid-price spreadsheet** (all bidders w/ rank, region) + annual weighted PDFs.
3. **ID Item Average Price spreadsheet**, **WV annual XLS by district**, **IN CY XLSX (2008+)**, **NC XLSM**, **VDOT 2-yr XLSX + query**, **MA CPE** (all-bid, quantity-banded, weekly).
4. Per-letting HTML/TXT tabs that are trivially parseable: **LA (ASP pages)**, **NJ (TXT)**, **AL (TXT)**, **KS (CSV index)**, **MI**, **MN abstracts**, **IL**, **DE**, **AZ (must poll—4-month window)**.
5. Annual PDF weighted-average books (CO 2001+, MT 2016+, TN, SD, AR, MO by district, OK, MD SHA, NY WAIPR by region, WY, NM, NE, NH, VT) via PDF table extraction.
6. Caltrans DB (1993+) via query scraper — confirm TOS.
7. Fallback/mirror: bidtabs.us (22 states, 2004+) — confirm TOS before bulk use.

**Unverified / gaps to close with fetches when egress permits:** UDOT, GDOT Item Mean Summary URL, PennDOT ECMS auth, ODOT (OH) export, WSDOT UBA bidder scope, FDOT Excel availability, Caltrans DB TOS/export, MaineDOT/NDOT(NV)/HDOT price lists, AK/MD/DE/RI PW URLs, UC/CSU/SUNY cost guides, Phoenix/Miami-Dade unit price lists, Streamlined Sales Tax boundary files, and history depth for most per-letting tab archives.
