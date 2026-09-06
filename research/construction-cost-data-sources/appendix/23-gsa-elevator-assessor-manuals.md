# GSA price lists, elevator pricing, state assessor cost manuals, sprinkler and steel

Budget used: 43 web searches. Stopping here.

## Environment constraint that shaped this round (important)

WebFetch and `curl` are both blocked by the org egress proxy for essentially every external host I tried — including `gsaadvantage.gov`, `gsaelibrary.gsa.gov`, `open.gsa.gov`, `api.gsa.gov`, `gsa.gov`, `doa.la.gov`, `dms.myflorida.com`, `ogs.ny.gov`, `nucor.com`, `crsi.org`, `steeljoist.org`, `pci.org`, `mass.gov`, `energy.gov`, and even `wikipedia.org`. Only `github.com` responded. Verified by `curl -sS -o /dev/null -w "%{http_code}"` → `CONNECT tunnel failed, response 403` on all of them.

So **everything below is search-derived**. "VERIFIED-DETAIL" means a dollar figure or field was returned in a search engine's extraction of that page; I could not open a single PDF myself. A follow-up session on an unrestricted network should re-verify the DETAIL rows by actually opening them — several are one fetch away from being fully confirmed.

---

## TASK A — GSA Advantage price lists, SINs, APIs, state term contracts

### A1. The ref_text URL convention — CONFIRMED, two forms

| Source | URL | What it gives | Granularity | Date | Format | Status |
|---|---|---|---|---|---|---|
| ref_text HTML form (the machine-readable one) | `https://www.gsaadvantage.gov/ref_text/GS07F5992P/GS07F5992P_online.htm` | Full text price list. Search extraction returned real rates: **Analysis/Evaluation/Consulting $75/hr; Expert Witness Testimony $90/hr** | Line item + price | n/a | HTML | VERIFIED-DETAIL |
| ref_text HTML form, 2nd example | `https://www.gsaadvantage.gov/ref_text/47QSWA18D000Y/47QSWA18D000Y_online.htm` | "Authorized Federal Supply Schedule Price List" | Line item | n/a | HTML | VERIFIED-URL |
| ref_text HTML form, 3rd/4th examples | `https://www.gsaadvantage.gov/ref_text/GS35F238CA/GS35F238CA_online.htm` · `https://www.gsaadvantage.gov/ref_text/GS21F043GA/GS21F043GA_online.htm` | Commercial price list / FSS price list | Line item | n/a | HTML | VERIFIED-URL |
| ref_text PDF form | `https://www.gsaadvantage.gov/ref_text/GS21F149AA/0OSQB9.37QSQ6_GS-21F-149AA_CPL02015.PDF` | "GSA Advantage! Catalog and Price List" | Catalog | n/a | PDF | VERIFIED-URL |
| ref_text PDF form, more examples | `https://www.gsaadvantage.gov/ref_text/GS00F441GA/0UZ46X.3QPH8P_GS-00F-441GA_GS00F441GAOCT2019.PDF` · `https://www.gsaadvantage.gov/ref_text/GS00F205CA/GS00F205CA_GS00F205CA_GSA_PriceList_PS0063.pdf` · `https://www.gsaadvantage.gov/ref_text/47QREA25D0003/107P2F.3VY1X3_47QREA25D0003_ELECTRONICCATALOG47QREA25D0003.PDF` | Price lists / electronic catalogs | Catalog | 2019–2025 | PDF | VERIFIED-URL |

**The convention, stated precisely:**

- Deterministic form (guessable from a contract number alone):
  `https://www.gsaadvantage.gov/ref_text/&lt;CONTRACT_NO_DASHES&gt;/&lt;CONTRACT_NO_DASHES&gt;_online.htm`
- Opaque form (needs the filename, which is *not* derivable):
  `https://www.gsaadvantage.gov/ref_text/&lt;CONTRACT_NO_DASHES&gt;/&lt;6char&gt;.&lt;6char&gt;_&lt;CONTRACT-WITH-DASHES&gt;_&lt;VENDORDOCNAME&gt;.PDF`
  The `&lt;6char&gt;.&lt;6char&gt;` prefix is an upload token. You cannot construct it. You get it from the eLibrary contractor page's "View Catalog / Terms and Conditions" link, or by site-scoped search.

**Practical crawl strategy:** try `_online.htm` first (deterministic, ~1 request per contract, and it's plain text so it parses cleanly). Fall back to eLibrary scraping for the PDF-only vendors. Note the third variant seen — `GS00F205CA_GS00F205CA_GSA_PriceList_PS0063.pdf` — where the token is replaced by a repeat of the contract number; worth trying as a second deterministic guess.

**I did NOT confirm a working ref_text URL for a named HVAC or elevator manufacturer.** Trane contract 47QSWA20D002A returned nothing under a quoted search. This is the one Task-A objective I failed outright.

### A2. HVAC manufacturer price lists — closest hits

| Source | URL | What it gives | Granularity | Date | Format | Status |
|---|---|---|---|---|---|---|
| Daikin Applied MAS price list GS-07F-0377V (self-hosted) | `https://tahoeweb.daikinapplied.com/api/general/DownloadDocumentByName/media/Multiple_Award_Schedule_GS07F0377V.pdf` | Search extraction states it contains sections for **Chillers, Commercial Rooftop Systems, HVAC Equipment, Air Filtration Products** | Product category, unknown whether unit-priced | July 2020 | PDF | VERIFIED-URL (contents UNVERIFIED — host egress-blocked) |
| Daikin Applied MAS price list GS-21F-0027W | `https://tahoeweb.daikinapplied.com/api/general/DownloadDocumentByName/media/Multiple_Award_Schedule_GS21F0027W.pdf` | Labor categories incl. HVAC technician rates | Labor rate | July 2020 | PDF | VERIFIED-URL |
| Air Quality Innovative Solutions (AQUIS) FSS list | `https://www.gsaadvantage.gov/ref_text/GS21F0151X/0W0SP8.3RR5NZ_GS-21F-0151X_AQUIS.PDF` | Air handler services / installation | Service | n/a | PDF | VERIFIED-URL |
| DOE-mirrored GSA MAS contract 47QRAA20D0044 | `https://www.energy.gov/sites/default/files/2023-09/1b.%20GSA%20MAS%20Contract%2047QRAA20D0044_47QRAA20D0044R01.PDF` | A full MAS award mirrored outside gsa.gov — proof that agency sites mirror these when the primary host is unreachable | Contract | 2023 | PDF | VERIFIED-URL, scope unknown |
| "Trane Chiller Price list" (Scribd) | `https://www.scribd.com/document/668210556/Trane-Chiller-Price-list` | Titled as a Trane chiller price list by capacity | Model-level, allegedly | unknown | PDF on Scribd | UNVERIFIED — third-party re-upload, provenance and date unknown, likely not licensable |

The Scribd item is the only thing resembling a manufacturer chiller list price I saw all session. Treat as a lead, not a source.

### A3. GSA APIs and bulk files

| Source | URL | What it gives | Granularity | Date | Format | Status |
|---|---|---|---|---|---|---|
| **eLibrary bulk contract file** | `https://www.asap.gsa.gov/datagov/eLibrary_Schedule_Contracts.xls` | Every current schedule contract: company, contract number, schedule, **SIN codes**, address, contact, socioeconomic status, dates. **No prices.** This is the enumeration primitive Task A asked for. | Contract × SIN | data.gov says last updated **2019** — likely stale, re-check | XLS | VERIFIED-URL (freshness UNVERIFIED) |
| data.gov dataset record | `https://catalog.data.gov/dataset/gsa-elibrary-schedules-and-contracts` | Metadata/landing for the above | — | 2019 | HTML | VERIFIED-URL |
| eLibrary download page | `https://www.gsaelibrary.gsa.gov/ElibMain/home.do/downloadInfo.do?fromPage=ss` | eLibrary's own bulk-download entry point | — | — | HTML | VERIFIED-URL |
| GSA APIs index | `https://open.gsa.gov/api/` | API catalog | — | — | HTML | VERIFIED-URL |
| FAS Catalog Platform (FCP) docs | `https://vsc.gsa.gov/drupal/node/212` · `https://vsc.gsa.gov/drupal/node/85` | What vendors must put in an electronic catalog for GSA Advantage | Schema | current | HTML | VERIFIED-URL |
| FCP rollout announcement | `https://www.gsa.gov/blog/2025/11/21/gsas-fas-catalog-platform-now-available-for-new-mas-awardees` | FCP now mandatory for new MAS awardees; replaces SIP and EDI-832 | — | 2025-11-21 | HTML | VERIFIED-URL |

**Negative, and it matters:** GSA's only public *pricing* API is **CALC**, and CALC is **labor rates on services schedules only** — no products, no equipment, no HVAC, no elevators. There is **no public API returning GSA Advantage product catalog pricing**, and I found **no public bulk product-price file**. FCP is a vendor-facing submission platform, not a public data feed; its "Compliance &amp; Pricing report" goes to the contractor, not the public.

Net: the ref_text scrape is the only route to GSA product prices, and it is a scrape, not an API.

### A4. SINs for HVAC and elevators — NOT FOUND

Could not confirm the SIN numbers for either category. eLibrary is egress-blocked and search would not surface the SIN detail pages. What I can say: the eLibrary bulk XLS above carries SIN codes per contract, so **enumerate by pulling that file and filtering on the SIN string or on NAICS 333415 / 238220 (HVAC) and 333921 / 238290 (elevators)** rather than by browsing eLibrary. One elevator contract number surfaced incidentally: **GS-21F-0107Y, Specialized Elevator Corporation** (VERIFIED-URL via a malformed eLibrary link in results) — useful as a seed for testing the `_online.htm` convention on an elevator vendor.

### A5. State term contracts

| Source | URL | What it gives | Granularity | Date | Format | Status |
|---|---|---|---|---|---|---|
| **FL DMS elevator STC 72101506-25-STC** | `https://www.dms.myflorida.com/content/download/424343/8796624/00%20Executed%20Contract_TEI%20Group.pdf` | Executed elevator maintenance &amp; repair contract, term **June 1 2025 – May 30 2028** | Contract | 2025 | PDF | VERIFIED-DETAIL (dates) |
| **FL DMS per-vendor price sheets** | `https://www.dms.myflorida.com/business_operations/state_purchasing/state_contracts_and_agreements/alternate_contract_source/elevator_maintenance_services/pricing/price_sheets_schindler_elevator_corporation_region_3` | Schindler Region 3 price sheet — FL publishes **actual dollar price sheets per vendor per region**, not a discount % | Vendor × region × line item | current + archive | web/xlsx | VERIFIED-URL |
| FL DMS elevator STC landing | `https://www.dms.myflorida.com/business_operations/state_purchasing/state_contracts_and_agreements/state_term_contract/elevator_maintenance_and_repair_services` | Index of all awarded elevator vendors &amp; their contracts | — | current | HTML | VERIFIED-URL |
| NY OGS Award 23271, Group 71004 | `https://ogs.ny.gov/award-23271` · CAN PDF `https://ogs.state.ny.us/purchase/snt/awardnotes/7100423271ra.pdf` | Elevator/escalator/lift maintenance backdrop contracts; **"successful contractors' maximum, not-to-exceed prices are included in the Contract Award Notification"**. Term from 2023-07-20. Mini-bid model. | NTE rates by contractor/region | 2023– | PDF | VERIFIED-DETAIL (structure), prices UNVERIFIED |
| NY OGS prior award 22913 | `https://online.ogs.ny.gov/purchase/snt/awardnotes/7100422913pm.pdf` | Prior Group 71004 elevator CAN, 2016-04-20 → 2023-07-19 | Same | 2016–2023 | PDF | VERIFIED-URL |
| WA DES HVAC master contract 02919 | `https://apps.des.wa.gov/contracting/02919c.Macdonald.pdf` | HVAC services master contract | Contract | rev. 2017 | PDF | VERIFIED-URL |
| WA DES contract 07815 — HVAC Parts &amp; Supplies | `https://apps.des.wa.gov/DESContracts/Home/ContractSummary/07815` | Awarded vendor Mechtronics Controls dba HVAC USA | Contract summary | current | HTML | VERIFIED-URL (pricing model unknown — likely discount-off-list) |
| WA DES elevator solicitation 28723 | `https://des.wa.gov/sites/default/files/2025-10/28723-Elevator-Services-Contract-Example.pdf` · `https://apps.des.wa.gov/contracting/28723a_WA%20Elevator.pdf` | Full-service elevator maintenance/testing/repair by geographic area; solicitation dated **2024-10-03** | Contract | 2024–25 | PDF/DOC | VERIFIED-URL |

**Texas DIR/TXMAS and Minnesota: NOT FOUND.** Both searches returned only consumer HVAC cost-guide spam. Neither state's HVAC contract pricing surfaced. Virginia eVA, California CMAS, and Massachusetts COMMBUYS were not reached — budget ran out.

**The Florida pattern is the important one.** FL DMS posts a discrete price-sheet page per vendor per region, in a stable URL shape, and keeps an archive of expired contracts alongside the live ones. That is a crawlable, dated, dollar-denominated series. It is elevator *maintenance*, not new install — but it is the first state contract I've confirmed that publishes prices rather than a percentage.

---

## TASK B — Elevator new-install pricing

| Source | URL | What it gives | Granularity | Date | Format | Status |
|---|---|---|---|---|---|---|
| **Michigan Assessors Manual Vol II 2025, Unit-in-Place** | `https://www.michigan.gov/treasury/-/media/Project/Websites/treasury/STC/Assessors-Manual/Vol-II/20-2025-Michigan-Assessors-Manual-Vol-II-Unit-in-Place-Costs-11-16.pdf` | **Elevators: add $9,400–$14,400 per basement stop** (2025 cost basis). Also carries sprinkler, wall, and structural unit costs. | **Per stop, in dollars** | 2025 | PDF | VERIFIED-DETAIL |
| **Garland VA Medical Center, Replace Elevators 549-24-425** | `https://sam.gov/workspace/contract/opp/10700f52b2ea419ba214bb1696b176c1/view` | **10 electric traction + 4 hydraulic = 14 elevators; estimated construction magnitude $10M–$20M** → **~$714K–$1.43M per elevator**, full scope: demo, controls, machine rooms, hoistways, doors, safety, cab interiors, MEP, fire protection, monitoring | Per elevator, hospital, full replacement | FY2024 | web | VERIFIED-DETAIL |
| **University of Kentucky bid tabs** | `https://purchasing.uky.edu/sites/default/files/2022-11/cck-2639-22tab.pdf` · `https://purchasing.uky.edu/sites/default/files/2022-01/cck-2594-22bidtab.pdf` · `https://purchasing.uky.edu/sites/default/files/2022-09/cck-2651-23tab.pdf` | **Parking Structure #8, Install New Elevator: owner estimate $600,000, D.C. Elevator awarded $993,000.** Plus the previously known Med Plaza hydraulic jack: est. $86,000, awarded $55,000 | Per project, new install | 2022 | PDF | VERIFIED-DETAIL (figures confirmed; *which* of the three tab files they sit in is not — one fetch resolves it) |
| VA Elevator Modernization Initiative (presolicitation) | `https://console.sweetspotgov.com/federal-contracts/adf1ccc0-3755-5104-bb57-c977dc060c00` | Turnkey elevator modernization at **101 VA medical centers**, hydraulic + traction. If awarded values publish, this is a large per-unit dataset. | Program | 2024– | web | VERIFIED-URL |
| VA design standard 14 21 10, Traction Elevator Modernization | `https://www.wbdg.org/FFC/VA/VAASC/VA%2014%2021%2010.pdf` | Scope definition — useful for normalizing what "modernization" includes. No prices. | Spec | — | PDF | VERIFIED-URL |
| Chesapeake Bay Bridge &amp; Tunnel District, Replace Elevator | `https://www.cbbt.com/wp-content/uploads/2024/03/Replace-Elevator-Spec-Book.pdf` | Single-elevator replacement spec book | Project | 2024 | PDF | VERIFIED-URL, no price seen |
| Housing Authority of Pittsburgh IFB 300-25-24 bid tab | `https://hacp.org/app/uploads/2024/08/Bid-Tabulation-IFB-300-25-24-Elevator-Repair-Maintenance-Authority-Wide-1.pdf` | Elevator repair &amp; maintenance bid tab, opened 2024-09-17 | Authority-wide | 2024 | PDF | VERIFIED-URL — repair/maintenance, **not** new install |
| NYC DCAS bid tab EPIN 85623B0001 | `https://www.nyc.gov/assets/dcas/downloads/pdf/business/bidtabs/dcas-bid-tab-epin-85623B0001.pdf` | DCAS bid tab (elevator-adjacent; scope unconfirmed) | Project | — | PDF | UNVERIFIED |
| MA DCAMM winning bids | `https://www.mass.gov/info-details/winning-bids-awarded-by-dcamm-for-public-contracts` | DCAMM's published award listing | Project | current | HTML | VERIFIED-URL |
| MA DCAMM BidExpress | `https://www.bidexpress.com/businesses/10279/home` | Where DCAMM filed sub-bid results actually live | Sub-bid × trade | current | web app | VERIFIED-URL |

**Massachusetts filed sub-bid — the lead did not pan out as hoped, and here is why.** Elevators (Section 14 24 00 / 142400) *are* a filed sub-bid class and DCAMM does prequalify elevator bidders — I confirmed a Wilmington town hall/school project where "the trade bid for Section 142400 (Elevators) is open to all bidders DCAMM certified for Elevators." But **DCAMM's sub-bid results are not posted as static tabulation PDFs.** They sit behind BidExpress, which requires free registration. So the filed sub-bid data almost certainly exists at exactly the granularity we want — per-project elevator-only bid amounts across many projects — but it needs an account and a session-authenticated crawl, not an anonymous fetch. **That is the single highest-value unexploited lead in this whole round.**

**Louisiana FP&amp;C — clean negative, now specific.** I enumerated the elevator bid tabs on doa.la.gov and every one is repair, refurbishment, cabs, or upgrade: `bid-tab-f-01004479-elevator-repair.pdf`, `bid-tab-f-19002561-elevator-refurb.pdf`, `bid-tab-f-01004410-elevator-repair.pdf`, `bid-tab-f-01004182-elevator-cabs.pdf`. **Louisiana FP&amp;C has no new-install elevator tab.** Stop looking there.

---

## TASK C — Precast, joists, deck, rebar, CMU, structural steel

### The find that changes this task: state assessor cost manuals

| Source | URL | What it gives | Granularity | Date | Format | Status |
|---|---|---|---|---|---|---|
| **Michigan Assessor's Manual Vol II (Commercial &amp; Industrial), 2025** | landing `https://www.michigan.gov/treasury/local/stc/assessor-manual/2025-assessors-manual-volume-ii-commercial-and-industrial` | The State of Michigan **publishes Marshall &amp; Swift/Boeckh commercial cost data free as a public PDF set** — the copyright line reads "© 2025 Marshall &amp; Swift/Boeckh, LLC". Covers unit-in-place costs, segregated costs, and O&amp;P. | Component unit costs | **2025** | PDF set | VERIFIED-DETAIL |
| — Unit-in-Place sections 11–16 | `https://www.michigan.gov/treasury/-/media/Project/Websites/treasury/STC/Assessors-Manual/Vol-II/20-2025-Michigan-Assessors-Manual-Vol-II-Unit-in-Place-Costs-11-16.pdf` | Elevator per-stop ($9,400–$14,400 basement stop), sprinklers by sprinklered area, walls incl. concrete block, "average costs per square foot, typical 8' wall height" | $/SF, $/stop | 2025 | PDF | VERIFIED-DETAIL |
| — Unit-in-Place sections 1–5 | `https://www.michigan.gov/treasury/-/media/Project/Websites/treasury/STC/Assessors-Manual/Vol-II/18-2025-Michigan-Assessors-Manual-Vol-II-Unit-in-Place-Costs-1-5.pdf` | Foundation walls, concrete slab &amp; foundation, floor construction | $/SF, $/LF | 2025 | PDF | VERIFIED-URL |
| — Segregated Cost Method | `https://www.michigan.gov/treasury/-/media/Project/Websites/treasury/STC/Assessors-Manual/Vol-II/17-2025-Michigan-Assessors-Manual-Vol-II-Segregated-Costs.pdf` | Costs broken out by building system (frame, floor, roof, walls, services) | System $/SF | 2025 | PDF | VERIFIED-URL |
| — Overhead &amp; Profit | `https://www.michigan.gov/treasury/-/media/Project/Websites/treasury/STC/Assessors-Manual/Vol-II/12-2025-Michigan-Assessors-Manual-Vol-II-O-and-P.pdf` | The O&amp;P loading applied on top of the unit costs — needed to un-load them back to bare cost | Factor | 2025 | PDF | VERIFIED-URL |
| — all manuals index | `https://www.michigan.gov/treasury/local/stc/accordion/pubs/michigan-assessor-manuals` | Entry point; also hosts the 2014 edition (`.../Volume-II---2014/UIP-11-16.pdf`) → **a time series** | — | 2003–2025 | HTML | VERIFIED-URL |
| **Iowa Analyzed Unit Cost Schedule** | `https://publications.iowa.gov/6278/4/Analyzed_Unit_Cost,_Section_4.pdf` (also `https://revenue.iowa.gov/media/84/download`) | Commercial unit costs incl. **joists and metal deck** (with topping-thickness adjustments), masonry/stucco (waterproofing included; **deduct 35% if non-waterproofed**), **sprinklers costed at one head per 110 SF of sprinkler area**, elevators and moving stairs. Basis: a 100,000 SF building. Exterior wall prices ±20% for quality/quantity. | Component $/SF | current | PDF | VERIFIED-DETAIL |
| Iowa Commercial &amp; Industrial Schedule Short Form | `https://revenue.iowa.gov/media/85/download` | Condensed companion schedule | $/SF | current | PDF | VERIFIED-URL |
| Iowa Grading section | `http://publications.iowa.gov/6278/3/Grading,_Section_3.pdf` | Quality-grade multipliers to apply to the unit costs | Factor | current | PDF | VERIFIED-URL |
| California BOE Assessors' Handbook 531 | `https://boe.ca.gov/proptaxes/pdf/ah53126.pdf` · `https://www.boe.ca.gov/proptaxes/pdf/ah53124.pdf` | Concrete block walls, elevators, sprinklers — but **AH 531 is Residential Building Costs**, so scope is limited for us | $/SF | 2024, 2026 eds. | PDF | VERIFIED-URL |

This is the strongest result of the session. It is dated, versioned across editions, free, published by state governments, and covers **elevators per stop, sprinklers per SF, CMU walls per SF, joists, deck, and structural components** in one place — which is five of the gaps at once. Caveats to carry into the catalog: these are *replacement-cost-new for assessment*, they carry an embedded O&amp;P loading, they are calibrated to a state's cost level (Michigan and Iowa both need a location factor for national use), and Michigan's is M&amp;S-derived, so licensing for redistribution needs a look even though the PDF is public.

### DOT bid-price reports (rebar $/LB, structural steel $/LB, precast items)

| Source | URL | What it gives | Granularity | Date | Format | Status |
|---|---|---|---|---|---|---|
| **WisDOT Average Unit Price List** | `https://wisconsindot.gov/hccidocs/contracting-info/average-unit-price.pdf` | Steel reinforcement and structural steel items among others | Item $/unit statewide | **report dated 2025-10-21, FY2025 data** | PDF | VERIFIED-DETAIL (date + item coverage) |
| TxDOT Average Low Bid Unit Prices, statewide | `https://www.dot.state.tx.us/insdtdot/orgchart/cmd/cserve/bidprice/s_0403.htm` | Statewide average low bid unit prices | Item $/unit | rolling | HTML | VERIFIED-URL |
| FDOT Historical Item Average Cost Reports | `https://www.fdot.gov/fpo/fpc/reports/historicalitemaveragecost` | Weighted average prices from awarded bids, weighted by item quantity; has a Bid Price Search Dashboard | Item $/unit, weighted | rolling | web/dashboard | VERIFIED-DETAIL (methodology) |
| SD DOT Bid Item Price Report 2024 | `https://dot.sd.gov/media/qqhgg24h/2024-bid-item-price-report.pdf` | Includes **Reinforcing Steel** and **Epoxy Coated Reinforcing Steel** (projects &gt;10,000 lb) | Item $/LB | CY2024 | PDF | VERIFIED-DETAIL |
| SD DOT 2023 edition | `https://dot.sd.gov/media/5695ecdf/2023BidItemPriceReport.pdf` | Prior year — time series | Item $/LB | CY2023 | PDF | VERIFIED-URL |

WisDOT, TxDOT and FDOT are all new relative to the SD DOT / Caltrans you already hold. FDOT's is the most useful because it's quantity-weighted and has a queryable dashboard rather than a flat PDF.

### Index series (escalation, not levels)

| Source | URL | What it gives | Granularity | Date | Format | Status |
|---|---|---|---|---|---|---|
| **FRED PPI PCU33231233231211** | `https://fred.stlouisfed.org/series/PCU33231233231211` | PPI: *Fabricated Structural Iron and Steel for Industrial Buildings — **Metal Bar Joists, Short Span***. A free monthly index for exactly the joist category SJI won't price. | Monthly index | current | API/CSV | VERIFIED-URL |
| BLS PPI, via market report | `https://www.carrolldaniel.com/q4-2025-market-report/` | Quotes **PPI steel joists and rebar +8.8%, fabricated steel +7.6%, 12 months ending Aug 2025** — a contractor market report citing BLS series | Index Δ | Q4 2025 | HTML | VERIFIED-DETAIL |
| Nucor/Gerdau/CMC rebar price announcements | `https://gmk.center/en/news/nucor-and-gerdau-announce-40-price-increase-for-rebar/` | **Nucor + Gerdau +$2/cwt = +$40/short ton, early 2025.** Mid-July 2025: Nucor Bar Group, Gerdau, Deacero all **+~$60/short ton** | $/ton delta, mill list | 2025 | HTML | VERIFIED-DETAIL |
| Nucor Q3 2025 tonnage/earnings | `https://s202.q4cdn.com/531038915/files/doc_financials/2025/q3/Sales-Earnings-Tondata-Q3-2025.pdf` | Realized average selling price per ton by segment — a **derived mill price** from SEC-grade data | $/ton, segment avg | Q3 2025 | PDF | VERIFIED-URL |

Mill *deltas* are public; mill *levels* are not, except as backed out of Nucor's quarterly realized ASP. That's an underused trick worth noting: Nucor reports tons shipped and sales dollars by segment (steel mills / steel products), so ASP/ton falls straight out, quarterly, going back years.

---

## TASK D — Commercial fire sprinkler and fire alarm

| Source | URL | What it gives | Granularity | Date | Format | Status |
|---|---|---|---|---|---|---|
| **Iowa Analyzed Unit Cost Schedule** | `https://publications.iowa.gov/6278/4/Analyzed_Unit_Cost,_Section_4.pdf` | Sprinkler cost **based on one head per 110 SF of sprinkler area** — gives you both a $/SF and an implied $/head basis, from a state agency | $/SF, implied $/head | current | PDF | VERIFIED-DETAIL |
| **Michigan Assessors Manual Vol II UIP** | `https://www.michigan.gov/treasury/-/media/Project/Websites/treasury/STC/Assessors-Manual/Vol-II/20-2025-Michigan-Assessors-Manual-Vol-II-Unit-in-Place-Costs-11-16.pdf` | Sprinkler costs "include all system and supply line costs based on total installation area" | $/SF | 2025 | PDF | VERIFIED-DETAIL (methodology; figures not extracted) |
| **Lower Columbia College Fire Sprinkler System, WA project 2024-855 G** | `https://omwbe.wa.gov/bid-opportunities/2024-855-g-1-1-lcc-%E2%80%93-fire-sprinkler-system-lower-columbia-college` | **Estimated base bid range $360,000–$515,000**, bid Aug 2024 — a standalone public-agency sprinkler package | Project total | 2024 | HTML | VERIFIED-DETAIL |
| **UW System MEP bid tabulations** | `https://www.wisconsin.edu/procurement/2024/05/02/mep-bid-tabulation-for-engineering-hall-sprinkler-and-gas-piping-project-phase-2-posted/` | UW System routinely posts **MEP-only bid tabs**, this one a sprinkler + gas piping package. A recurring, crawlable series of separated MEP packages. | Trade package | 2024 | HTML/PDF | VERIFIED-URL |
| School District of Lee County FL sprinkler award | `https://www.leeschools.net/common/pages/DisplayFile.aspx?itemId=169343133` | Award recommendation to Total Fire Protection | Project | recent | web | VERIFIED-URL, amount not extracted |
| Baltimore Metro Council RFP JBO-703-23 sprinkler | `https://baltometro.org/wp-content/uploads/2025/07/JBO-703-23RFPSprinklerSystem.pdf` | Sprinkler system RFP | Project | 2023/25 | PDF | VERIFIED-URL |
| SC State Fire Marshal, Fire Sprinklers | `https://www.firesafe.sc.gov/docs/Fire Sprinklers.pdf` | State fire marshal sprinkler publication | — | — | PDF | VERIFIED-URL, cost content unconfirmed |
| FPRF Home Fire Sprinkler Cost Assessment 2013 | `https://homefiresprinkler.org/wp-content/uploads/2016/05/HomeFireSprinklerCostAssessment2013.pdf` | **$1.35 per sprinklered SF average** (2013 update) | $/SF | 2013 | PDF | VERIFIED-DETAIL |
| FPRF 2008 original ("the $1.61 report") | `https://nfsa.org/wp-content/uploads/2019/07/NFPA_fire_sprinkler_cost_assessment_2008.pdf` | **$1.61/sprinklered SF average, range $0.38–$3.66**, all-in to the builder incl. design, install, permits, tap and meter fees, across 10 communities | $/SF + range | 2008 | PDF | VERIFIED-DETAIL |
| NFPA project page | `https://www.nfpa.org/education-and-research/research/fire-protection-research-foundation/projects-and-reports/home-fire-sprinkler-cost-assessment-final-report` | Landing for the series | — | — | HTML | VERIFIED-URL |
| AFSA Facts &amp; Figures | `https://firesprinkler.org/facts-figures/` | AFSA's public statistics page | — | current | HTML | VERIFIED-URL, cost content not extracted |

**The code-adoption cost-impact-analysis lead did not pan out, and I want to be precise about the failure mode.** Searching for state fiscal/regulatory impact analyses of sprinkler mandates returned nothing but contractor marketing pages. The reason is almost certainly that these analyses exist as legislative fiscal notes and building-code-council agenda packets buried on state legislature sites, and a general web search cannot reach them — they need per-state, site-scoped searching against legislature and code-council domains. The lead is still good; it just needs 15–20 targeted `site:` searches, one state at a time, which I did not have budget for.

**The FPRF sprinkler work is residential only.** There is no commercial analogue. The 2008 and 2013 studies are one-and-two-family dwellings. This is now a firm negative, not an open question.

---

## Not found / dead ends

Stated specifically, because these are worth not re-searching:

- **Trane GSA price list.** A quoted search on contract **47QSWA20D002A** returns nothing. Trane's own GSA page (`https://www.trane.com/commercial/north-america/us/en/support/funding-implementation/cooperative-and-group-purchasing/gsa-contract-holder.html`) says the "GSA Schedule Contracts Online Price List including Terms and Conditions" exists but links into GSA Advantage rather than hosting it.
- **No GSA API returns product pricing.** CALC is labor rates on services schedules only. FCP is vendor-facing. There is no public bulk product-price file. The eLibrary bulk XLS carries SINs but zero prices.
- **HVAC and elevator SIN numbers: not confirmed.** eLibrary is egress-blocked and search would not surface SIN detail pages.
- **Louisiana FP&amp;C has no new-install elevator bid tab.** All elevator tabs are repair, refurb, cabs, or upgrade. Confirmed by enumerating filenames.
- **MA DCAMM filed sub-bid results are not static PDFs** — they live behind BidExpress registration. The data exists; anonymous fetching cannot reach it.
- **SJI publishes no dollars.** Confirmed the user's hypothesis: the SJI design tool "helps structural engineers compare weights, costs, and floor depths for selected bay sizes" — it is a *relative* comparison between joist / wide-flange beam / joist-girder framing schemes. No $/lb, no price tables. `https://steeljoist.org/professional-resources/design-tools/`
- **PCI publishes no dollar guide.** Every "PCI cost" result traces to contractor marketing pages or a PCI chapter's qualitative "budget management" page (`http://www.pci-ma.org/index.cfm/precast_solutions/budget`). The "$30–$100/SF per PCI" figure circulating on cost-guide blogs is uncited and should not be used.
- **SDI: not reached.** No searches spent; still open.
- **CRSI publishes no public rebar $/ton index.** Only mill price-change announcements and paid indices (ChemAnalyst, Expert Market Research).
- **No CMU or brick manufacturer list price.** Every result was a consumer cost-guide site ($1.25–$2.50/block, $150–$260/pallet of 90) with no manufacturer or agency behind it. The county/school-district materials term contract route also failed — the tabs I surfaced (Kent County, Gwinnett, Minneapolis Event 3552 at $1,629,884 to S&amp;S Concrete and Masonry) are lump-sum or poured-concrete, not per-block CMU line items.
- **No commercial HVAC manufacturer publishes a list price book.** AAON, Bard, Modine, Reznor all confirmed negative. The only public artifacts are surcharge announcements (AAON **6% surcharge on all equipment effective 2025-03-31**).
- **No authoritative fabricated-and-erected structural steel $/ton.** Everything returned was vendor content marketing (SteelFlo, Design Transition Studio, Meichen Steel). Their numbers — $2,100–$4,000/ton all-in, erection $400–$600/ton low-rise to $900–$1,500/ton high-rise urban — are internally plausible but have no traceable basis and should not enter the catalog as sourced data.
- **Texas DIR/TXMAS and Minnesota state contract HVAC pricing: not found.** Both queries returned only consumer HVAC spam.
- **JOC unit price books are all proprietary.** Gordian's Construction Task Catalog and 4BT's UPB are the market; no public agency posts its UPB line items.

---

## Which gaps are genuinely unclosable, and which just need more crawling

**Genuinely unclosable from public data — stop spending on these.**

Model-level HVAC equipment pricing is the one true structural blind spot, and this round hardened rather than softened that conclusion. Every path terminates in the same place: manufacturers do not publish list prices, cooperatives publish only a percentage off a list that isn't public, GSA has no pricing API and no bulk product file, and the one remaining route — scraping ref_text price lists — is now confirmed to exist as a mechanism but was not confirmed to contain model-level equipment prices for any HVAC manufacturer. Daikin's self-hosted MAS list is the best candidate and it is five years stale and behind an egress block. I would treat model-level equipment as permanently out of reach and design the schema so HVAC enters as $/ton or $/CFM installed from assembly-level sources, with equipment-only cost as a modeled fraction rather than a sourced field. Likewise, manufacturer list prices for CMU, brick, joists, and deck do not exist publicly in any form and will not appear; those categories have to be sourced as installed assemblies, not as materials. Mill-level rebar and structural steel *levels* are similarly closed — but see below, because the deltas are not.

**Just needs more crawling — and the ceiling here is higher than I expected going in.**

The state assessor cost manuals are the answer to most of Task C and a good part of Tasks B and D, and I found them with two searches at the very end of the budget. Michigan's 2025 Volume II is Marshall &amp; Swift/Boeckh commercial data published free by a state treasury, with a 2014 edition still online for a time series; Iowa's Analyzed Unit Cost Schedule is an independent second opinion with an explicit and unusually transparent methodology (one sprinkler head per 110 SF, 100,000 SF building basis, ±20% on exterior walls, 35% deduction for non-waterproofed masonry). Between them they carry elevators per stop, sprinklers per SF, CMU walls per SF, joists, deck, and structural components. The immediate next move is to pull the full Michigan Vol II and Iowa set, extract the tables, and check whether other states republish the same M&amp;S-derived data — Michigan, Iowa and California all do in some form, so the pattern likely repeats across a dozen more. That single line of work would close more of Task C than every other lead combined. The one thing to resolve carefully is licensing: a public PDF is not automatically redistributable when the underlying tables are M&amp;S copyright.

Elevator new-install is closable but needs authenticated crawling rather than cleverness. MA DCAMM filed sub-bids are the prize — elevators are a statutory filed sub-bid class, so every DCAMM project yields an elevator-only bid amount, across hundreds of projects — and they sit behind a free BidExpress registration. That is a session-authenticated crawl, not a research problem. In the meantime the three anchors now in hand bracket the range honestly: Michigan's $9,400–$14,400 per stop at the assessment end, UK's $993,000 for a new parking-structure elevator against a $600,000 estimate in the middle, and Garland VA's $714K–$1.43M per elevator for full hospital replacement at the top. The VA Elevator Modernization Initiative across 101 medical centers is worth a standing watch for awarded values.

Fire sprinkler is closable and I under-searched it. The code-adoption cost-impact route is still the right idea; it simply cannot be reached by general search and needs per-state site-scoped queries against legislature and building-code-council domains. Separately, UW System's practice of posting MEP-only bid tabulations is a recurring series of separated trade packages that would give real sprinkler and fire-alarm package costs against known building areas — that is a crawl, and a cheap one.

Rebar and structural steel escalation are effectively already closed and I'd stop treating them as gaps. The FRED PPI series for short-span metal bar joists is a free monthly index for precisely the category SJI refuses to price; the companion series for rebar and fabricated steel are equally free. Mill price *levels* stay private, but Nucor's quarterly tonnage-and-earnings disclosures let you back out realized average selling price per ton directly from SEC-grade data, quarterly, for years back. Combine the DOT bid-price reports (now WisDOT, TxDOT and FDOT in addition to SD DOT and Caltrans, with FDOT's quantity-weighted dashboard the best of them) for installed $/LB levels, and index them forward with the PPI series. That is a complete and defensible construction.

Last, the GSA ref_text convention is worth one more short session on an unrestricted network, but scoped tightly. The deterministic `_online.htm` form is real and returns plain text with real dollars in it. Pull the eLibrary bulk XLS, filter to elevator and HVAC NAICS or SINs, and try `_online.htm` against every contract number in that filtered set. It is a few hundred requests and it will settle definitively whether any HVAC or elevator vendor's GSA catalog contains equipment unit prices. If that comes back empty, the HVAC equipment gap is closed as unclosable and the catalog should say so explicitly rather than leaving it as an open TODO.
