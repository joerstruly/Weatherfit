# US Construction Material Price Sources: Retailer / Distributor / Commodity Scrape & API Feasibility

Legend: [V] verified from public GitHub source code / captured API responses / mirrored vendor docs; [S] from search-result summaries; [K] prior knowledge, not re-verified. robots.txt and ToS texts could not be fetched for any site (proxy-blocked) — every robots/ToS statement is [K].

## 1. Executive summary
| Tier | Source | Why |
|---|---|---|
| Best store-level coverage | **Home Depot federation GraphQL** [V] | Batch price+inventory per store (`mediaPriceInventory`, 25–50 items/call), 4-digit `storeId`, ZIP-aware fulfillment, rich IDs (Internet#, Store SKU, Model#, UPC). Akamai-protected; TLS/UA coherence required. |
| Second | **Lowe's `/wpd/…/productdetail/{store}/Guest/{zip}`** [V] | One GET per product×store returns `finalPrice` + on-hand qty. Akamai; store cookie can be overridden by proxy geo. |
| Official/partner APIs | Lowe's `apis.lowes.com` (Products/Inventory/Stores) [V-listing]; McMaster-Carr Product Information API [V]; Ferguson Trade Partner API (OAuth2) [V-in-code, program unverified]; Walmart Affiliate API [K]; Amazon PA-API/Keepa [K] | Legal, stable; B2B-gated |
| Cheapest legal shortcut for HD/Lowe's | SerpApi (`store_id`, `delivery_zip`), BigBox/Traject Data (ZIP-localized), Unwrangle (`store_no`,`zipcode`), Apify actors (`storeId`) [S] | $10–15/1k products typical |
| Public-price distributors (no login) | Platt, City Electric Supply, Elliott Electric, Fastenal, Grainger (list), Zoro, MSC, SupplyHouse, Ryerson, Metals Depot, OnlineMetals, Ace (Kibo API) [V for Ace/Zoro/Grainger/TSC; K for others] | Branch/ZIP localization varies |
| Upstream indices (free) | SteelBenchmarker history.pdf, USGS MCS/Minerals Yearbook, EIA API, FRED PPI, state DOT asphalt indices, NAHB lumber tracker | Regional adjustment factors and commodity drift |

## 2. Big-box retailers

### 2.1 The Home Depot
| Item | Finding |
|---|---|
| Price localization | Per store. GraphQL `pricing(storeId:)`, `fulfillment(storeId:, zipCode:, quantity:)`, `badges(storeId:)`. **Default store when omitted = 2414 (Bangor, ME)** [V]. Store IDs 4-digit zero-padded (`0121`, `2414`, `6672`). |
| Primary endpoint [V] | `POST https://apionline.homedepot.com/federation-gateway/graphql?opname=<op>` (also `www.homedepot.com/federation-gateway/graphql`). Akamai edge. |
| Operations [V] | `searchModel` (vars: `keyword`, `navParam` e.g. `N-5yc1vZc1xy`, `storeId`, `zipCode`/`deliveryZip`, `pageSize` clamped to 24, `startIndex` max 720, `storefilter: ALL`, `filter`); `productClientOnlyProduct` (`itemId`, `storeId`, `zipCode`, `quantity`); `mediaPriceInventory` (`itemIds[]` 25–50, `storeId`, `excludeInventory`) → `productDetailsList[].pricing.value`, `.storeInventory.totalQuantity`, `.onlineInventory.totalQuantity`; `AisleBayInformationModel` (`storeSkuIds[]`, `storeId`); `storeSearch` / `storeDirectoryByState`. REST store locator `GET https://www.homedepot.com/StoreSearchServices/v2/storesearch?address={zip}&radius={mi}&pagesize=15`. |
| Required headers [V] | `content-type: application/json`, `x-experience-name` (`general-merchandise` / `hd-home` / `store-finder` / `cart`), `x-hd-dc: origin`, `x-debug: false`; optional `x-current-url`, `X-Api-Cookies`, `x-thd-customer-token`, `x-customer-type: B2B`. No API key. |
| Price fields [V] | `pricing{ value, original, unitOfMeasure, alternatePriceDisplay, alternate{ bulk{pricePerUnit, thresholdQuantity, value}, unit{caseUnitOfMeasure, unitsPerCase, value} }, promotion{…}, mapAboveOriginalPrice, preferredPriceFlag, specialBuy }`; `info{ hidePrice, unitOfMeasureCoverage, minimumOrderQuantity }`. |
| Inventory [V] | `fulfillment.fulfillmentOptions[].services[].locations[]{ locationId, isAnchor, distance, inventory{ quantity, isInStock, isLimitedQuantity, maxAllowedBopisQty } }`, `backordered`. |
| Product IDs [V] | `itemId` = **Internet #** (9-digit, in `/p/<slug>/<itemId>`); `storeSkuNumber` = **Store SKU** (6-digit); `modelNumber`; `upc` / `upcGtin13`; `omsIDs`; `parentId`/`isSuperSku`; `productDepartment`/`classNumber`/`subClassNumber`. |
| Store cookies [V] | `THD_LOCSTORE`, `THD_USER_PREFERENCES` (`{"zip":…}`), `THD_ZIPCODE`, `THD_PERSIST`, `THD_CUSTOMER`. Page global `__EXPERIENCE_CONTEXT__.store.storeId`. Passing `storeId` in GraphQL variables is sufficient. |
| Structured data [V] | JSON-LD `Product` with `offers.price` on PDP/search HTML (localized to session store). |
| Anti-bot [V] | **Akamai Bot Manager** (`_abck`, `bm_sz`, press-and-hold). Gateway returns **HTTP 206 "GenericError"** when declared Chrome version (UA + `sec-ch-ua`) mismatches TLS fingerprint → use `curl_cffi`/browser impersonation. 403/429 on IP throttling. Community rate ≈ ≤1 rps with jitter. |
| Update frequency | Real-time per request; prices change daily. |
| Public/partner API | No public consumer price API. Pro Xtra login-gated. "Pro Integrations" = punchout/EDI (Procore etc.), not a price feed [S/K]. HD Supply (2020), SRS Distribution (2024), GMS (2025 via SRS) — login-gated B2B pricing [K]. |
| robots/ToS [K] | Disallows facet-explosion paths, cart/account, lists AI crawlers; PDP `/p/` generally crawlable. ToS prohibit robots/scrapers/data mining. Verify. |
| Third-party | SerpApi (`engine=home_depot`, `store_id`, `delivery_zip`); BigBox/Traject ($15/mo start; ZIP-localized; returns Store SKU, aisle/bay); Unwrangle (`store_no`, `zipcode`); Apify actors (~$10/1k); Bright Data dataset (**no store/zip**) [V]; Omkar Cloud. |

### 2.2 Lowe's
| Item | Finding |
|---|---|
| Price localization | Per store; prices/inventory absent until store context resolved [S]. Store numbers 4-digit. |
| Endpoints [V] | `GET https://www.lowes.com/wpd/{productId}/productdetail/{storeNumber}/Guest/{zip}?nearByStore={storeNumber}&zipState={ST}`. Response: `productDetails[{pid}].location.price.pricingDataList[].finalPrice`; `.location.itemInventory.itemAvailList[]{fulfillmentType, onhandQty, physicalInvQty}`; `.mfePrice.price.additionalData.sellingPrice`; `.mfePrice.price.mapPriceMessage` ("View Lower Price In Cart" = MAP-hidden); `.product{ modelId, brand, omniItemId }`. Category/search pages embed `__PRELOADED_STATE__` and `__NEXT_DATA__` (`props.pageProps.searchResults.products` with `sellingPrice`). JSON-LD `offers.price`. Cart API `POST /purchase/api/cart/cartitems` reveals MAP prices. PLP `/pl/<cat>/<id>?store={id}`. |
| Store cookies [V] | `sn` (store number), `sd` (JSON `{id, zip, city, state, name, region}`), `zipcode`, `zipstate`, `nearbyid`, `nearestStoreId`, `region`, `p13n`, `audience` (`DIY`/`PRO`), `dbidv2` (device UUID — required to avoid 403). |
| Product IDs | `productId`/`omniItemId` = 10-digit; PDP shows **Item #** and **Model #** [K on labeling]. |
| Anti-bot [V] | **Akamai** (`_abck`, `bm_sz`, `ak_bmsc`, `bm_sv`, `akavpau_*`, `sbsd`). Nimble (June 2026) observed hand-set store cookie **overridden by proxy geolocation** [S]. |
| Official API [V-listing] | `https://portal.apim.lowes.com/` (Azure APIM) exposes **Products, Inventory, Stores** at `https://apis.lowes.com`; sign-up + key; B2B partner/supplier oriented; consumer pricing reach unknown; **Pro pricing not exposed**. Punchout: Ariba, JAGGAER, Coupa. |
| Corporate | ADG (2025), FBM (2025) — login-only [K]. |
| Third-party | Apify (`studio-amba/lowes-scraper` with `storeId`), Oxylabs (geo_location), Bright Data, Nimble, Scrapfly, Piloterr. SerpApi has **no** Lowe's engine. |

### 2.3 Menards
Midwest (~330 stores). PDP `/main/<cat>/<subcat>/<slug>/<model>/p-<13-digit id>-c-<cat id>.htm` [V]; price in `span.price`. Prices and 11% rebate vary by store; store cookie name unverified [K]. 7-digit SKU # and Model # [K]. Anti-bot vendor unknown; Oxylabs notes 403s needing residential proxies [S]. Third-party: Oxylabs, Apify `getdataforme/menards-*`. No official API.

## 3. Other retail
| Retailer | Localized? / how | API / structured data | Anti-bot | Notes |
|---|---|---|---|---|
| **Ace Hardware** | Online price national; store inventory per location. Kibo API [V]: `GET /api/commerce/storefront/locationUsageTypes/SP/locations?pageSize=25&filter=geo near(lat,lng,m)`; `GET /api/commerce/catalog/storefront/products/?filter=productCode eq {item}` → `items[0].price.price`; `GET .../products/{item}/locationinventory?locationCodes=a,b,c` | Public JSON (no key); microdata | Light [V] | Co-op; in-store prices may differ [K] |
| **Tractor Supply** | Per store [V]: `/gtwy/SiteSearch/catalogSearch` (NDJSON); WebSphere `…/store/10151/productview/getItemPrice?productId={catentry}&stlocId={store}` → `offer_price_min_{store}` | JSON-LD | **Akamai** [V]; blocks HTTP/1.1 | IDs: `partNumber`, `catentry_id` |
| Harbor Freight | National pricing; store stock [K] | JSON-LD [K] | Rate limiting/CAPTCHA | |
| **Walmart** | Store pricing via cookies `assortmentStoreId`, `locGuestData` [V]; persisted GraphQL with URL hashes | Walmart Affiliate API (no store-level) [K] | PerimeterX/HUMAN [K] | |
| Amazon / Business | National | PA-API 5.0; Keepa [K] | Heavy | Not ZIP-localized |
| Floor & Decor | Store-specific after select [K] | Bright Data scraper | ? | |
| Build.com / Ferguson Home | National [K] | ? | ? | |

## 4. Third-party scraper APIs / datasets
SerpApi (HD only; `store_id` default 2414, `delivery_zip`) [S]; BigBox/Traject (HD; ZIP → store price; from $15/mo; 100 free) [S]; Unwrangle (HD, Lowe's) [S]; Apify actors (HD, Lowe's, Menards, Ace) [S]; Oxylabs (Lowe's, Menards) [S]; Bright Data (datasets not store-level) [V]; Nimble, Scrapfly, Piloterr, Omkar Cloud (25 free/mo) [V-listing]; Datafiniti, PriceAPI (not store-level) [K]; Keepa (Amazon) [K]; Crawl Feeds HD 500K CSV (undated) [V]; Kaggle HD Product Search Relevance (2016, **no prices**) [V].

## 5. Pro distributors and manufacturers
| Segment | Company | Public price? | Localization | Access | Evidence |
|---|---|---|---|---|---|
| Plumbing/HVAC | **Ferguson** | Partial [K] | branch | "Ferguson Trade Partner API" in code: OAuth2 `https://api.ferguson.com/oauth2/token`, `GET /pricing/products?skus=` (≤50/req) — program **unverified** | [V-code]/[K] |
| | Winsupply, Hajoca, Core & Main, Fortiline, RE Michel, Johnstone, Watsco | No (login/quote) | branch | Punchout/EDI | [K] |
| | **SupplyHouse.com**, PlumbingSupply.com, PexUniverse, HVACDirect, eComfort, AC Wholesalers, Alpine Home Air | Yes | national | JSON-LD [K] | [K] |
| Electrical | **Platt** (Rexel) | Yes | branch | `platt.com/Order.aspx?itemid=` patterns | [V-URL]/[K] |
| | **City Electric Supply**, **Elliott Electric** | Yes | branch | HTML | [K] |
| | Graybar | List price; account pricing login | branch | | [K] |
| | CED, Crescent, State Electric, Kirby Risk, WESCO/Anixter, Border States | Login | branch | Punchout | [K] |
| MRO | **Fastenal** | Yes; branch stock | branch | `fastenal.com/products/details/{sku}`; curl_cffi Chrome impersonation used | [V-code] |
| | **Grainger** | List price, no login | national | `grainger.com/product/{item}`; `data-testid="pricing-component-{ID}"`, `product:price:amount`, JSON-LD; CAPTCHA after volume | [V] |
| | **Zoro** | Yes | national | JSON-LD; internal JSON API with public `apikey` header; **DataDome** | [V] |
| | MSC, Global Industrial, Uline | Yes | national | JSON-LD [K] | [K] |
| | **McMaster-Carr** | Yes (web) | national | Official **Product Information API** (`api.mcmaster.com/v1`): approved customers only, client certificate + password, 24h token, must **subscribe** to each part; endpoints for product, price, images, CAD; contact eprocurement@mcmaster.com. Web: JS-heavy, aggressive blocking | [V] |
| Concrete accessories | White Cap | Partial [K] | branch | ? | [K] |
| Lumber | Builders FirstSource, US LBM, Boise, Weyerhaeuser | No | — | — | [K] |
| | 84 Lumber, Carter Lumber | Partial by store [K] | store | | [K] |
| Roofing | ABC Supply, Beacon PRO+, SRS | Login | branch | ABC login scraper exists | [V-listing]/[K] |
| Gypsum | GMS, L&W, FBM, Kenseal | Login | branch | | [K] |
| Landscape | **SiteOne**, Ewing | After branch select; some login [K] | branch | | [K] |
| Paint | Sherwin-Williams (store-select; pro login), PPG, Benjamin Moore (dealer), Kelly-Moore (ceased 2024) | Partial | store | | [K] |
| Metals | **Ryerson** (instant quotes by location), Metals Depot, OnlineMetals (national); Metal Supermarkets/Alro/Kloeckner (quote); Nucor Skyline, Vulcraft, Insteel, CMC, Gerdau (no public) | Ryerson/MD/OM yes | Ryerson by location | | [K] |
| Masonry/concrete mfrs | Oldcastle APG, Quikrete, Sakrete, Belgard, General Shale, Glen-Gery, Westlake Royal | No (via retailers) | — | Use HD/Lowe's | [K] |
| Roofing/window/door mfrs | GAF, OC, CertainTeed, Andersen, Pella, Marvin, Milgard, Jeld-Wen, Masonite, Therma-Tru | No | — | Use stocked SKUs | [K] |
| HVAC OEMs | Carrier, Trane, Lennox, Goodman (via online dealers) | No | — | | [K] |

## 6. Commodity / wholesale price series
| Series | Access | Frequency |
|---|---|---|
| Random Lengths (Fastmarkets) FLC, panel composite | Paid; NAHB republishes FLC chart weekly [K] | weekly |
| Forest Economic Advisors | Paid | weekly/monthly |
| CME Lumber (LBR), Copper (HG), HRC futures | Delayed free; history paid [K] | daily |
| LME | Paid; delayed [K] | daily |
| **SteelBenchmarker** | Free `http://steelbenchmarker.com/history.pdf` (USA HRC, CRC, plate, rebar) | twice monthly |
| Fastmarkets AMM, CRU, Platts, SMU | Paid | daily/weekly |
| Nucor / SDI price announcements | Free [K] | ad hoc |
| PCA cement, Gypsum Association | Member/paid [K] | monthly/annual |
| **USGS MCS** + **Minerals Yearbook** (state-level cement/aggregate values) | Free; ScienceBase DOI per year | annual |
| NRMCA ready-mix survey | Members [K] | annual/quarterly |
| PVC resin: ICIS, Plastics Exchange | Paid; TPE free weekly commentary [K] | weekly |
| DAT trucking | Paid; free monthly trendlines [K] | weekly |
| EIA API v2 diesel by PADD/state | Free | weekly |
| FRED PPI series | Free | monthly |

## 7. Aggregates, asphalt, ready-mix, DOT indices
Vulcan, Martin Marietta, Knife River, Summit (now Quikrete): no systematic public lists; occasional per-quarry PDF price sheets [K]. Ready-mix (Cemex, Holcim, CalPortland, Titan): no public pricing. **State DOT asphalt binder / fuel price indices** — Caltrans (monthly Paving Asphalt Price Index by region), FDOT, TxDOT, NCDOT, GDOT, PennDOT, NYSDOT, VDOT, SCDOT, ODOT, INDOT, WSDOT — free monthly web/PDF/XLS [K]; best free regional asphalt signal. Argus/Poten asphalt paid.

## 8. Construction-tech aggregators
1build (Bolster uses it; commercial API) [K]; Kojo (no public API) [K]; Handoff, Materials.ai, BuildBook, Toolbx, Bidmii, Yardzen (no open price API) [K]; BuildZoom, Houzz, Building Journal (aggregated $/sf) [K].

## 9. Legal / ToS summary (not legal advice)
- **CFAA**: *hiQ v. LinkedIn* (9th Cir. 2022): scraping public pages without login likely not "without authorization." *Ryanair v. Booking.com* (D. Del. 2024): credentialed access can violate CFAA. → Stay logged out; never use Pro Xtra/Lowe's Pro/distributor accounts for bulk pulls.
- **Contract**: *Meta v. Bright Data* (N.D. Cal. 2024) held logged-out scraping did not breach Meta's terms. Browsewrap ToS prohibiting scrapers create cease-and-desist/IP-ban risk.
- **Copyright**: *Feist* — prices, SKUs, model numbers are facts; "thin" compilation protection only. Do not copy descriptions, images, reviews. Index values (Random Lengths, CRU, Platts) are licensed compilations.
- **Other**: trespass-to-chattels if load is material (eBay v. Bidder's Edge) → rate-limit; DMCA §1201 anti-circumvention arguments against defeating Akamai/DataDome untested.
- Practical: respect robots.txt (fetch and diff monthly), ≤1 rps/host with jitter, identify UA, cache, no login, no captcha-solving services.

## 10. Recommended localization architecture
1. **Store graph**: HD `StoreSearchServices/v2/storesearch?address={zip}` → ~2,000 stores; Lowe's Stores API or locator; Ace `locations?filter=geo near(...)`; TSC locator. Map every ZIP → nearest N store IDs.
2. **HD price pull**: `mediaPriceInventory` (`itemIds[]` 25–50 × `storeId`) → price + `storeInventory.totalQuantity`; enrich with `productClientOnlyProduct`. ~1 rps; 40 stores × 5k SKUs ≈ 200k pairs ≈ 4–8k batch calls/day.
3. **Lowe's**: one `/wpd/{pid}/productdetail/{sn}/Guest/{zip}` per SKU×store; set `dbidv2`, `sn`, `sd`, `zipcode`, `zipstate`; egress IP must match region.
4. **Normalize IDs** via UPC/GTIN and model number; keep retailer-native IDs.
5. **Regional adjustment** where no store data: FRED PPI + DOT asphalt + USGS state cement/aggregate + SteelBenchmarker.

## 11. Key source repos (GitHub, public)
`aubreybailey/bigbox-stock-mcp/FINDINGS-API.md` and `extension/core/retailers/{homedepot,lowes,acehardware,walmart}.mjs`; `fruvs/hd-clearance-bot/API_REFERENCE.md`; `jasonwho321/Guangxin/scrapy_file/HomeDepot.py`; `opentabs-dev/opentabs/plugins/homedepot/src/homedepot-api.ts`; `imoonkey/openweb/src/sites/homedepot/DOC.md`; `My-kal/lowes-crawler`; `damarcuslett/clearance-iq/workers/lowes_sync.py`; `XSmeets/mep-data/eu_data/lowes.com/lowes.com.withdraw.json` (full Lowe's cookie set); `ericboehs/tractor-supply-cli/DESIGN.md`; `winston-bosan/mcmaster-carr/.../help/api.html`; `DDBCAAAA/SimReady/simready/acquisition/mcmaster_api.py`; `djscrew1738/plumbprice/api/app/services/data_sources/suppliers/ferguson.py`; `api-evangelist/lowes/apis.yml`; `scrapfly/scrapfly-scrapers/zoro-scraper/zoro.py`; `yasiraquil/scraping-work/scripts/price_scraper.py` (Grainger); `luminati-io/Home-Depot-dataset-sample`.

Search sources: Unwrangle HD API docs; SerpApi Home Depot; BigBox API + pricing; Apify studio-amba Lowe's; Nimble Lowe's store context; Scrapfly Lowe's; Oxylabs Lowe's/Menards; Bright Data Lowe's; api-evangelist/lowes; Home Depot Pro Integrations; Scrapfly Akamai.
