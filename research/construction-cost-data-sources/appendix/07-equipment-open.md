# Equipment, Assemblies/SF, Specialty Trades, Open Databases & Taxonomies, AI Entrants

Legend: ✅ verified via GitHub-hosted evidence (parsed copies, official repos, YC dataset); ⚠️ prior knowledge, unverified; ❌ evidence contradicts premise. WebSearch was unavailable for this task and all non-GitHub hosts were proxy-blocked.

## 1. Equipment ownership/operating & rental rates

| Source | URL | Coverage / unit | Geo | Cadence | Format / access | License | Caveats | Status |
|---|---|---|---|---|---|---|---|---|
| **USACE EP 1110-1-8** | publications.usace.army.mil | $/hr ownership + operating (FCCM, depreciation, fuel, lube, tires, repair) by make/model | 12 regional volumes | **Biennial** ✅ (USACE ER 1110-2-1302 glossary); editions 2016 → 2021 ✅; 2023/2025 likely ⚠️ | PDF only; no official CSV | US Gov PD | Assumes USACE work rules; needs fuel adjustment; PDF parse | ✅/⚠️ |
| **Caltrans Labor Surcharge & Equipment Rental Rate Book** | `https://dot.ca.gov/-/media/dot-media/programs/construction/documents/equipment-rental-rates-and-labor-surcharge/book_26_27.pdf` (Apr 2026–Mar 2027) ✅; prior `book_25_26.pdf`, `book_2024.pdf`, `book_2023.pdf`, `book-sep2022-a11y.pdf`, `book-apr2022-aug2022.pdf`, `book_2021.pdf`, `book_2020.pdf` ✅ | ~**2,176** standard class/make/model rows ✅ with `RENTAL_RATE` $/hr, `RW_DELAY`, `OVERTIME`; ~**7,300** "miscellaneous" make/model rates ✅ (with begin/end dates, back to 1980s) | CA statewide | **Annual, Apr 1–Mar 31** ✅ | PDF; misc rates plain text `.../contract-administration/misc-equipment-rental-rates/misc-currtxt.txt` ✅. **Machine-readable mirror**: `github.com/bulklc/cm_tools` `public/equipment_data/all_standard.json` (2.7 MB, 8 editions 2020–2027) and `all_misc.json` (3.2 MB) ✅ | Public record | Force-account rates; mirror has no explicit license | ✅ |
| **FEMA Schedule of Equipment Rates** | `https://www.fema.gov/assistance/public/tools-resources/schedule-equipment-rates` ✅ (also on data.gov ✅) | Hourly (some per day/mile/each) by 4-digit FEMA code (e.g. `8814`); **excludes operator** ✅ | **National** | ~Annual ✅; **2025 schedule** current ✅ | PDF (historically Excel ⚠️) | PD | Reimbursement ceilings, not market rental. `KE4CON/FieldCommand-IMS` "FEMA 2025 rates" use non-FEMA codes — placeholders ❌ | ✅ |
| **EquipmentWatch Rental Rate Blue Book** (Fusable) | equipmentwatch.com | Monthly/weekly/daily rental + O&O by make/model; regional adjustment factors | US regions/states | Continuous | Paid; enterprise API ⚠️ | Proprietary | FHWA-accepted force-account basis in most DOT specs ⚠️; AED Green Book also EquipmentWatch ✅ | ⚠️ |
| State DOT equipment policies (WSDOT, TxDOT, FDOT, NYSDOT) | agency sites | Most adopt Blue Book × fixed % (80–85%); some publish own schedules ⚠️ | State | Annual | PDF | Public | | ⚠️ |
| **Rouse Services** (RB Global) | rouseservices.com | Rental rate benchmarks, fleet valuations | Metro/region | Monthly | Paid, rental companies only | Proprietary | No public data | ⚠️ |
| United Rentals / Sunbelt / Herc / EquipmentShare / BigRentz | vendor sites | Daily/weekly/monthly by cat-class | ZIP/branch | Live | BigRentz shows list prices ⚠️; United/Sunbelt require account ⚠️; ToS prohibit scraping | Proprietary | Legal risk; rates vary by account | ⚠️ |
| Ritchie Bros / IronPlanet | rbauction.com | Auction prices by make/model/year/hours | Auction site | Continuous | Price Results free w/ login ⚠️; Apify scrapers exist | Proprietary | Depreciation/salvage input | ⚠️ |
| MachineryTrader / Equipment Trader; Cat/Deere list prices | machinerytrader.com | Asking prices | National | Live | HTML; OEM list prices not published | Proprietary | | ⚠️ |
| **EIA weekly retail fuel** | `https://api.eia.gov/v2/petroleum/pri/gnd/data/?api_key=…&frequency=weekly&data[0]=value&facets[product][]=EPMR&facets[duoarea][]=NUS` ✅ | $/gal gasoline (`EPMR`), diesel (`EPD2D` ⚠️) | US, PADD (`R10`–`R50`), states (`SCA`), select cities | **Weekly** | JSON API (free key), XLS, CSV | PD | Diesel state series ~10 states ⚠️ | ✅ |
| Caterpillar Performance Handbook | cat.com | Productivity + O&O method (not $ rates) | n/a | ~annual (SEBD0351, ed. 49–50 ⚠️) | Free PDF | Proprietary (free) | Earthwork productivity | ⚠️ |
| Crane, scaffold, portable toilet, dumpster | Dumpsters.com publishes avg ranges by size & city ⚠️; WM/Republic quote by ZIP behind forms ⚠. | $/pull, $/day | City/ZIP | Live | HTML | Proprietary | Sparse | ⚠️ |

## 2. Assembly & square-foot costs

| Source | URL | Coverage | Geo | Cadence | Access | License | Status |
|---|---|---|---|---|---|---|---|
| RSMeans Square Foot Costs / Assemblies | rsmeans.com | $/SF by model + Uniformat assemblies | 700+ CCI | Annual | Paid | Proprietary | ⚠️ |
| **Craftsman National Building Cost Manual** / building-cost.net | building-cost.net | $/SF residential/commercial by quality class; free calculator | ZIP/region modifiers | Annual | Free calculator (HTML); book paid | Proprietary; ToS ⚠️ | ⚠️ |
| Marshall & Swift SwiftEstimator | cotality.com | Segregated-cost & SF methods, 220+ occupancies | National w/ local multipliers | Quarterly | Paid | Proprietary | ⚠️ |
| BNi, Building Journal, Cumming, RLB, Compass, JLL/CBRE fit-out guides | vendor sites | $/SF by type/city; JLL & CBRE fit-out guides free PDFs by metro ⚠️ | Metro | Annual | PDF | Proprietary (free PDFs) | ⚠️ |
| **DoD UFC/UFS 3-701-01** | `https://www.wbdg.org/ffc/dod/unified-facilities-criteria-ufc/ufc-3-701-01` ✅ (cited in FRPP replacement-value guidance) | $/SF by Facility Analysis Category + ACFs | DoD installations + US cities | Annual | PDF + Excel | PD | ✅/⚠️ |
| VA Cost Estimating Service | cfm.va.gov/cost | Cost limits, unit costs, ACFs | VA locations | Periodic | PDF/Excel ⚠️ | PD | ⚠️ |
| GSA P100 / cost guides | gsa.gov | Benchmarks | National | Periodic | PDF | Public | ⚠️ |
| NAHB Cost of Constructing a Home | nahb.org | % and $ by stage | National | Biennial | Free | Cite | ⚠️ |
| Census SOC Characteristics of New Housing | census.gov/construction/chars | Median $/SF sale price & construction cost | US + 4 regions | Annual | XLS/CSV | PD | ⚠️ |
| NCES, state school reports, ASHE/Vizient (healthcare), Gordian/Sightlines (higher-ed), Uptime/T&T (data centers) | various | $/SF benchmarks | State/national | Annual | PDF | Mixed | ⚠️ |
| Whitestone MARS, AECOM PACES | whitestoneresearch.com; PACES (DoD) | Parametric | National | Annual | Paid; PACES Gov-restricted | Proprietary | ⚠️ |

## 3. Specialty trades

| Trade | Source | Unit / coverage | Geo | Cadence | Access / license | Status |
|---|---|---|---|---|---|---|
| Electrical | **NECA Manual of Labor Units** ✅ (used by ConEst/Accubid) | Labor hours per item, condition factors | National | ~3-yr | Paid | ✅ exists |
| Electrical / Mech | **Trade Service (TRA-SER)** — now Trimble ⚠️ | Manufacturer list prices, millions of SKUs | National | Weekly/daily | Paid feed | ⚠️ |
| Mech/Plumbing | MCAA Labor Estimating Manual, PHCC, Harrison Publishing | Labor units; material prices | National | Annual | Paid | ⚠️ |
| HVAC | Xactimate, AHRI, ACCA Manual J/D | Line-item $ by ZIP (Xactimate) | ZIP | Monthly | Paid | ⚠️ |
| Roofing | NRCA, Roofing Contractor, ABC/Beacon | $/square | National | Annual | Paid/free | ⚠️ |
| Glazing / Elevators / Fire protection | Glass Magazine; elevator studies; NFSA | Benchmarks | National | Irregular | Mixed | ⚠️ |
| Site/earthwork | Caterpillar Performance Handbook; Means Heavy; **state DOT bid tabs** | Productivity; bid unit prices | State/district | Per letting | Public (DOT) | ⚠️/✅ |
| Paving | State DOT asphalt/fuel indexes; NAPA | $/ton index | State | Monthly | Public | ⚠️ |
| Concrete / Masonry / Steel | NRMCA, PCA, ACI; MCAA/IMI, BIA; AISC, SteelBenchmarker, Ryerson | $/CY, $/ton | National/regional | Monthly–annual | Mixed; SteelBenchmarker free ⚠️ | ⚠️ |
| Wood | Random Lengths (Fastmarkets), NAHB, APA, WWPA | $/MBF | Regional | Weekly | Paid | ⚠️ |
| **Solar** | **LBNL Tracking the Sun** ✅ — public CSV `TTS_LBNL_public_file_DD-MMM-YYYY_all.csv` (~1.9 GB; latest 29-Sep-2025 ✅), fields `total_installed_price`, `PV_system_size_DC`, `customer_segment`, state; visualizer `emp-lbnl.shinyapps.io/tts_visualization` ✅ | $/W installed per system (>1.5M systems) | State (county/ZIP present ⚠️) | **Annual, mid-October** ✅ | CSV/XLSX free | ✅ |
| Solar | NREL PV Cost Benchmark (annual xlsx ✅), NREL ATB ⚠️, EnergySage quotes ⚠️, **NREL Solar TRACE** xlsx v9-9-2025 (permit/inspection timelines & fees by AHJ) ✅ | $/W; fees | National/state/AHJ | Annual | Free | ✅/⚠️ |
| EV chargers | DOE AFDC ⚠️ | $/port | National | Periodic | Public | ⚠️ |

## 4. Open / public-domain cost databases & taxonomies

### 4a. Open cost databases on GitHub ✅
| Name | URL | Coverage | Geo | Format | License | Caveats |
|---|---|---|---|---|---|---|
| **OpenConstructionEstimate DDC-CWICR** | `github.com/datadrivenconstruction/OpenConstructionEstimate-DDC-CWICR` (231★) | **55,719 work items, 27,672 resources**, labor/machine hours + resource quantities; price min/median/max | 30 countries incl. USA (`ddc_usa_usd`); 11 city tracks | XLSX (150–400 MB), Parquet (~55 MB), CSV (~1.3 GB) | **Data CC BY-NC 4.0 + DDC commercial licence; code Apache-2.0** | Norms are a single non-US norm base; US prices **repriced via World Bank PPP** — synthetic, not US-observed. Non-commercial licence blocks commercial use without a DDC deal. |
| **OpenConstructionERP** | `github.com/datadrivenconstruction/OpenConstructionERP` (762★); `pip install openconstructionerp` | 120k+ items across 9 bases (CWICR + CN, TR, BR, ES, IT, GR, VN, ID); 7k+ priced resources; 30+ standards incl. CSI MasterFormat | Global | App + Excel/CSV | AGPL-3.0; data inherits CWICR | No native US-surveyed base |
| **Open Built Environment Datasets (OBED)** | `github.com/vdubya/Open-Built-Environment-Datasets` | Frictionless data packages; 2019 UFGS spec package | US | CSV + datapackage.json | CC BY-SA 4.0 | Framework, stale (2022) |
| **cm_tools** Caltrans mirror | `github.com/bulklc/cm_tools` | Full Caltrans equipment rate book, 8 editions | CA | JSON | None stated | See §1 |
| aec-platform/qto | `github.com/aec-platform/qto` | IFC takeoff with TOML mappings: UniFormat II, MasterFormat, NRM1, OmniClass Table 21 | n/a | Python/TOML/CSV | (check) | Mappings only |
| Kentucky-ai/opentakeoff | `github.com/Kentucky-ai/opentakeoff` (112★) | Browser PDF takeoff w/ MCP | n/a | Apache-2.0 | No cost data |
| GitHub searches with **zero** hits ✅: "RSMeans alternative", "unit price bid tabulation DOT", "1build api", "OpenCostDB", "NAHB cost codes" | — | No community US unit-cost DB exists beyond CWICR. |

### 4b. Taxonomies
| Taxonomy | Status / access | Machine-readable sources | License / caveat |
|---|---|---|---|
| **CSI MasterFormat** (2020) | Numbers & titles © CSI/CSC; licensed for software ⚠️ | `github.com/outer-labs/masterformat-json` — full **2016** codes/titles JSON ✅; `Takeoff-and-Estimating-Pty-Ltd/masterformat` ✅ | Redistribution of titles is a licensing risk; 2020 changes absent |
| **UniFormat II** (ASTM E1557) / CSI UniFormat | ASTM paid; CSI UniFormat 2010 paid ⚠️ | qto `uniformat.toml`; `Takeoff-and-Estimating-Pty-Ltd/uniformat` ✅ | Structure safe to use |
| **OmniClass** | Free download from CSI ⚠️; Table 21 elements, 22 work results, 23 products | `csi-net/OmniClass` (2015) ✅ | Free but © CSI |
| **Uniclass 2015** (UK, NBS) | Free; **public API** (`theNBS/UniclassApiClient` — client ID via info@thenbs.com) ✅ | `buildig/uniclass-2015` CSV (CC BY-SA 3.0) ✅; `thomascorrie/uniclass-2015-json` ✅; `BIMsense/uniclass_ss_nrm_mapping` ✅ | Best-licensed open taxonomy; UK-centric |
| NRM (RICS) | Free PDF ⚠️ | qto `nrm.toml` ✅ | © RICS |
| ICMS (3rd ed.) | Free PDF ⚠️ | none on GitHub ✅ | Reporting structure, not items |
| UNSPSC | Free w/ registration ⚠️ | — | Product taxonomy |
| NAHB residential cost codes | Free chart of accounts ⚠️ | 0 GitHub hits ✅ | |
| buildingSMART IFC / bSDD | Open ⚠️ | many | Not a cost taxonomy |

### 4c. Government unit-price / bid data (equipment agent's view)
| Source | URL | Coverage | Geo | Cadence | Format | Status |
|---|---|---|---|---|---|---|
| **TxDOT Average Low Bid Unit Prices** | `txdot.gov/business/letting-bids/average-low-bid-unit-prices.html` ✅ | Avg low-bid $/unit per pay item, 3- and 12-month moving | Statewide + district | Monthly | Text & **Excel** ✅ | ✅ |
| **WSDOT Unit Bid Analysis** | wsdot.wa.gov | Per-item bid history | WA | Per letting | Database/HTML | ✅/⚠️ |
| **ODOT (Oregon) bid tabs** | oregon.gov/odot | Spreadsheets with bid date, contract, region, item, qty, price | OR | Per letting | XLSX | ⚠️ |
| Caltrans Contract Cost Data | dot.ca.gov | Item-level bid prices | CA by district | Per letting | PDF/HTML | ⚠️ |
| USACE MII / MCACES | usace.army.mil/Cost-Engineering | Unit price book | National | Annual | Licensed via Project Time & Cost | ⚠️ |
| data.gov "construction cost" | catalog.data.gov | Only FEMA Schedule of Equipment Rates surfaced ✅ | | | | ✅ |
| UK BCIS, Canada Altus Cost Guide (free annual PDF ⚠️) | comparison | | | | | ⚠️ |

## 5. AI/LLM-era entrants and data strategies
| Company | URL | What | Data strategy | Public API w/ pricing? | Status |
|---|---|---|---|---|---|
| **Handoff (formerly 1build)** | handoff.ai ✅ (YC W20, `former_names: ["1build"]`) | AI estimator for remodelers | 1build marketed a Cost Data API (`developer.1build.com`; REST `api.1build.com/v1/costs` ✅ cited) with "68M+ live costs, every US county, daily updates, big-box + LBM sources, all CSI divisions" ✅ (tiers ~$50–500/mo ⚠️) | **Unclear post-rebrand** — likely deprecated ⚠️. Do not build on it without confirmation. | ✅/⚠️ |
| **Bolster (formerly CostCertified)** | bolsterbuilt.com ✅ (YC S21) | Residential estimating/sales | Own price book + contractor data | No | ✅ |
| Togal.ai | togal.ai | AI takeoff | Not pricing | No | ⚠️ |
| Kreo | kreo.net | AI takeoff (UK) | UK pricing | No | ⚠️ |
| Buildxact | buildxact.com | Residential estimating w/ supplier feeds | Dealer catalog integrations | No | ⚠️ |
| EstimateOne | estimateone.com | Tender marketplace (AU/NZ) | Not cost | No | ⚠️ |
| **Cotality** | cotality.com | Owns Marshall & Swift | Proprietary surveys | Paid API ⚠️ | ⚠️ |
| Trunk Tools, Document Crunch, Slate | — | Doc/schedule/contract AI | Not cost | No | ⚠️ |
| Beam AI, Bidmii (CA), BuildCentral, PlanHub | — | Estimating AI; marketplaces; leads | Not unit cost | No | ⚠️ |
| Other YC construction cos ✅ (`yc-oss/api`): **Fresco** (F24, "AI copilot for estimators"), **Bild AI** (W25, Div. 8), **Bidflow** (W26, electrical takeoffs), **Rudus** (S26, concrete), Downtobid (acquired), UpCodes, Constructable, PermitFlow, Concord Materials/DigiBuild (procurement price data) | yc-oss | | Most rely on user data + retailer scraping (Home Depot/Lowe's via SerpApi/Apify ✅) | None publish cost-data APIs | ✅ |

**Market read:** no entrant exposes an open or affordably-licensed US unit-cost API; the one that did (1build) pivoted to Handoff. Third-party build docs consistently fall back to RSMeans + BLS + retailer scrapers.

## 6. Takeaways
1. **Public-domain equipment backbone exists today**: FEMA schedule (national hourly), Caltrans book (2,176 models, 8-yr history, JSON-parsed in `bulklc/cm_tools`), USACE EP 1110-1-8 (regional O&O), EIA fuel API.
2. **Public $/SF backbone**: UFC 3-701-01 + Census SOC + NAHB.
3. **Public unit-price backbone for civil**: TxDOT, WSDOT, ODOT.
4. **Only sizeable open item database is CWICR** — CC BY-NC with PPP-repriced US prices; usable as a *structure/norm* seed, not as US pricing.
5. **Taxonomy**: Uniclass 2015 (CC BY-SA CSV + API) is the only fully open classification; MasterFormat/UniFormat/OmniClass are CSI-copyrighted.
6. **Solar** is the best-instrumented specialty trade (LBNL TTS per-system $/W).
