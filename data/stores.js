// Regional store data with pricing tiers and links
const STORE_DATABASE = {
  // North America
  US: {
    region: "United States",
    currency: "USD",
    stores: [
      { name: "Amazon", icon: "amazon", cheapest: true, note: "Best prices + Subscribe & Save discounts", searchUrl: "https://www.amazon.com/s?k=" },
      { name: "iHerb", icon: "iherb", cheapest: false, note: "Great for The Ordinary & K-beauty", searchUrl: "https://www.iherb.com/search?kw=" },
      { name: "Target", icon: "target", cheapest: false, note: "Good sales + RedCard 5% off", searchUrl: "https://www.target.com/s?searchTerm=" },
      { name: "Ulta Beauty", icon: "ulta", cheapest: false, note: "Points rewards + frequent coupons", searchUrl: "https://www.ulta.com/search?search=" },
      { name: "CVS", icon: "cvs", cheapest: false, note: "Drugstore picks, ExtraBucks rewards", searchUrl: "https://www.cvs.com/search?searchTerm=" },
    ],
  },
  CA: {
    region: "Canada",
    currency: "CAD",
    stores: [
      { name: "Amazon Canada", icon: "amazon", cheapest: true, note: "Usually cheapest with Prime shipping", searchUrl: "https://www.amazon.ca/s?k=" },
      { name: "Shoppers Drug Mart", icon: "shoppers", cheapest: false, note: "PC Optimum points, frequent 20x events", searchUrl: "https://shop.shoppersdrugmart.ca/search?q=" },
      { name: "Well.ca", icon: "well", cheapest: false, note: "Great selection of natural brands", searchUrl: "https://well.ca/searchresult.html?keyword=" },
      { name: "The Ordinary (Direct)", icon: "ordinary", cheapest: false, note: "Best price for The Ordinary products", searchUrl: "https://theordinary.com/en-ca/search?q=" },
    ],
  },
  // Europe
  GB: {
    region: "United Kingdom",
    currency: "GBP",
    stores: [
      { name: "Boots", icon: "boots", cheapest: true, note: "Advantage Card points + 3 for 2 deals", searchUrl: "https://www.boots.com/search?q=" },
      { name: "Amazon UK", icon: "amazon", cheapest: false, note: "Fast delivery, competitive prices", searchUrl: "https://www.amazon.co.uk/s?k=" },
      { name: "Superdrug", icon: "superdrug", cheapest: false, note: "Budget-friendly, Health & Beautycard", searchUrl: "https://www.superdrug.com/search?q=" },
      { name: "LookFantastic", icon: "lookfantastic", cheapest: false, note: "Wide premium range + discount codes", searchUrl: "https://www.lookfantastic.com/search?q=" },
    ],
  },
  DE: {
    region: "Germany",
    currency: "EUR",
    stores: [
      { name: "dm-drogerie", icon: "dm", cheapest: true, note: "Best drugstore prices in Germany", searchUrl: "https://www.dm.de/search?query=" },
      { name: "Douglas", icon: "douglas", cheapest: false, note: "Premium brands + beauty card rewards", searchUrl: "https://www.douglas.de/de/search?q=" },
      { name: "Amazon.de", icon: "amazon", cheapest: false, note: "Wide selection, fast Prime delivery", searchUrl: "https://www.amazon.de/s?k=" },
      { name: "Rossmann", icon: "rossmann", cheapest: false, note: "Affordable everyday skincare", searchUrl: "https://www.rossmann.de/de/search/?text=" },
    ],
  },
  FR: {
    region: "France",
    currency: "EUR",
    stores: [
      { name: "Parapharmacie Leclerc", icon: "leclerc", cheapest: true, note: "Cheapest for La Roche-Posay, CeraVe", searchUrl: "https://www.e.leclerc/recherche?q=" },
      { name: "Sephora France", icon: "sephora", cheapest: false, note: "Premium range + loyalty rewards", searchUrl: "https://www.sephora.fr/search?q=" },
      { name: "Amazon.fr", icon: "amazon", cheapest: false, note: "Competitive prices + Prime delivery", searchUrl: "https://www.amazon.fr/s?k=" },
      { name: "Pharmacie en ligne", icon: "pharmacy", cheapest: false, note: "Discount French pharmacy brands", searchUrl: "https://www.1001pharmacies.com/recherche?q=" },
    ],
  },
  // Asia
  IN: {
    region: "India",
    currency: "INR",
    stores: [
      { name: "Nykaa", icon: "nykaa", cheapest: true, note: "Best prices during sales + wide range", searchUrl: "https://www.nykaa.com/search/result/?q=" },
      { name: "Amazon India", icon: "amazon", cheapest: false, note: "Fast delivery, authentic products", searchUrl: "https://www.amazon.in/s?k=" },
      { name: "Flipkart", icon: "flipkart", cheapest: false, note: "Good deals during Big Billion Days", searchUrl: "https://www.flipkart.com/search?q=" },
      { name: "Dermaco", icon: "dermaco", cheapest: false, note: "Dermatologist-approved brands", searchUrl: "https://thedermaco.com/search?q=" },
    ],
  },
  JP: {
    region: "Japan",
    currency: "JPY",
    stores: [
      { name: "Amazon Japan", icon: "amazon", cheapest: true, note: "Widest selection + fast delivery", searchUrl: "https://www.amazon.co.jp/s?k=" },
      { name: "@cosme Shopping", icon: "cosme", cheapest: false, note: "Top-rated J-beauty products", searchUrl: "https://www.cosme.com/search/?keyword=" },
      { name: "Matsumoto Kiyoshi", icon: "matsukiyo", cheapest: false, note: "Best drugstore prices in Japan", searchUrl: "https://www.matsukiyo.co.jp/store/search?q=" },
      { name: "Rakuten", icon: "rakuten", cheapest: false, note: "Points rewards + wide selection", searchUrl: "https://search.rakuten.co.jp/search/mall/" },
    ],
  },
  KR: {
    region: "South Korea",
    currency: "KRW",
    stores: [
      { name: "Olive Young", icon: "oliveyoung", cheapest: true, note: "Best K-beauty prices + exclusive deals", searchUrl: "https://global.oliveyoung.com/search?query=" },
      { name: "Coupang", icon: "coupang", cheapest: false, note: "Rocket delivery + competitive prices", searchUrl: "https://www.coupang.com/np/search?q=" },
      { name: "Amazon (Global)", icon: "amazon", cheapest: false, note: "For western brands not sold locally", searchUrl: "https://www.amazon.com/s?k=" },
    ],
  },
  // Australia / NZ
  AU: {
    region: "Australia",
    currency: "AUD",
    stores: [
      { name: "Chemist Warehouse", icon: "chemist", cheapest: true, note: "Consistently lowest prices in AU", searchUrl: "https://www.chemistwarehouse.com.au/search?searchtext=" },
      { name: "Amazon Australia", icon: "amazon", cheapest: false, note: "Growing range + Prime delivery", searchUrl: "https://www.amazon.com.au/s?k=" },
      { name: "Priceline Pharmacy", icon: "priceline", cheapest: false, note: "Sister Club rewards + 40% off sales", searchUrl: "https://www.priceline.com.au/search/?q=" },
      { name: "Adore Beauty", icon: "adore", cheapest: false, note: "Free shipping + GWP offers", searchUrl: "https://www.adorebeauty.com.au/search?q=" },
    ],
  },
  NZ: {
    region: "New Zealand",
    currency: "NZD",
    stores: [
      { name: "Chemist Warehouse NZ", icon: "chemist", cheapest: true, note: "Lowest prices in New Zealand", searchUrl: "https://www.chemistwarehouse.co.nz/search?searchtext=" },
      { name: "Life Pharmacy", icon: "life", cheapest: false, note: "Good range + Airpoints", searchUrl: "https://www.lifepharmacy.co.nz/search?q=" },
      { name: "Amazon (Global)", icon: "amazon", cheapest: false, note: "For products not available locally", searchUrl: "https://www.amazon.com/s?k=" },
    ],
  },
  // Middle East
  AE: {
    region: "UAE",
    currency: "AED",
    stores: [
      { name: "Noon", icon: "noon", cheapest: true, note: "Best prices + fast delivery in UAE", searchUrl: "https://www.noon.com/uae-en/search/?q=" },
      { name: "Amazon.ae", icon: "amazon", cheapest: false, note: "Wide range + Prime benefits", searchUrl: "https://www.amazon.ae/s?k=" },
      { name: "Faces", icon: "faces", cheapest: false, note: "Premium beauty + loyalty points", searchUrl: "https://www.faces.com/search?q=" },
    ],
  },
  SA: {
    region: "Saudi Arabia",
    currency: "SAR",
    stores: [
      { name: "Noon", icon: "noon", cheapest: true, note: "Competitive prices + fast shipping", searchUrl: "https://www.noon.com/saudi-en/search/?q=" },
      { name: "Amazon.sa", icon: "amazon", cheapest: false, note: "Growing beauty selection", searchUrl: "https://www.amazon.sa/s?k=" },
      { name: "Nahdi Pharmacy", icon: "nahdi", cheapest: false, note: "Trusted pharmacy chain", searchUrl: "https://www.nahdionline.com/en/search?q=" },
    ],
  },
  // Southeast Asia
  PH: {
    region: "Philippines",
    currency: "PHP",
    stores: [
      { name: "Shopee", icon: "shopee", cheapest: true, note: "Lowest prices + free shipping vouchers", searchUrl: "https://shopee.ph/search?keyword=" },
      { name: "Lazada", icon: "lazada", cheapest: false, note: "LazMall for authentic products", searchUrl: "https://www.lazada.com.ph/catalog/?q=" },
      { name: "Watsons", icon: "watsons", cheapest: false, note: "Trusted pharmacy + member discounts", searchUrl: "https://www.watsons.com.ph/search?q=" },
      { name: "BeautyMNL", icon: "beautymnl", cheapest: false, note: "Curated beauty marketplace", searchUrl: "https://beautymnl.com/search?q=" },
    ],
  },
  SG: {
    region: "Singapore",
    currency: "SGD",
    stores: [
      { name: "Shopee Singapore", icon: "shopee", cheapest: true, note: "Best deals + coin cashback", searchUrl: "https://shopee.sg/search?keyword=" },
      { name: "Guardian", icon: "guardian", cheapest: false, note: "Reliable pharmacy chain", searchUrl: "https://www.guardian.com.sg/search?q=" },
      { name: "Sephora SG", icon: "sephora", cheapest: false, note: "Premium range + Beauty Pass", searchUrl: "https://www.sephora.sg/search?q=" },
      { name: "iHerb", icon: "iherb", cheapest: false, note: "Cheap international shipping", searchUrl: "https://www.iherb.com/search?kw=" },
    ],
  },
  // Africa
  NG: {
    region: "Nigeria",
    currency: "NGN",
    stores: [
      { name: "Jumia", icon: "jumia", cheapest: true, note: "Largest online marketplace in Nigeria", searchUrl: "https://www.jumia.com.ng/catalog/?q=" },
      { name: "Konga", icon: "konga", cheapest: false, note: "Competitive prices + KongaPay", searchUrl: "https://www.konga.com/search?search=" },
      { name: "iHerb", icon: "iherb", cheapest: false, note: "Ships internationally, wide selection", searchUrl: "https://www.iherb.com/search?kw=" },
    ],
  },
  ZA: {
    region: "South Africa",
    currency: "ZAR",
    stores: [
      { name: "Clicks", icon: "clicks", cheapest: true, note: "ClubCard rewards + frequent promos", searchUrl: "https://clicks.co.za/search?q=" },
      { name: "Dis-Chem", icon: "dischem", cheapest: false, note: "Good prices on skincare brands", searchUrl: "https://www.dischem.co.za/search?q=" },
      { name: "Takealot", icon: "takealot", cheapest: false, note: "Online marketplace + fast delivery", searchUrl: "https://www.takealot.com/all?qsearch=" },
    ],
  },
  // South America
  BR: {
    region: "Brazil",
    currency: "BRL",
    stores: [
      { name: "Beleza na Web", icon: "beleza", cheapest: true, note: "Best beauty e-commerce in Brazil", searchUrl: "https://www.belezanaweb.com.br/busca?q=" },
      { name: "Amazon Brazil", icon: "amazon", cheapest: false, note: "Growing beauty selection", searchUrl: "https://www.amazon.com.br/s?k=" },
      { name: "Drogaria Sao Paulo", icon: "drogaria", cheapest: false, note: "Trusted pharmacy chain", searchUrl: "https://www.drogariasaopaulo.com.br/search?q=" },
    ],
  },
};

// Map common countries to their region data
const COUNTRY_ALIASES = {
  // Europe
  IE: "GB", AT: "DE", CH: "DE", NL: "DE", BE: "FR", ES: "FR", IT: "FR", PT: "FR",
  // Asia
  MY: "SG", TH: "SG", ID: "SG", VN: "SG", TW: "JP", HK: "SG",
  // Middle East
  KW: "AE", BH: "AE", QA: "AE", OM: "AE",
  // Africa
  KE: "NG", GH: "NG", EG: "AE",
  // Americas
  MX: "US", CO: "BR", AR: "BR", CL: "BR",
};

function getStoresForRegion(countryCode) {
  const code = countryCode.toUpperCase();

  // Direct match
  if (STORE_DATABASE[code]) {
    return STORE_DATABASE[code];
  }

  // Alias match
  if (COUNTRY_ALIASES[code] && STORE_DATABASE[COUNTRY_ALIASES[code]]) {
    const base = STORE_DATABASE[COUNTRY_ALIASES[code]];
    return { ...base, detectedCountry: code };
  }

  // Fallback: international stores
  return {
    region: "International",
    currency: "USD",
    detectedCountry: code,
    stores: [
      { name: "iHerb", icon: "iherb", cheapest: true, note: "Ships to 180+ countries, great prices", searchUrl: "https://www.iherb.com/search?kw=" },
      { name: "Amazon (US)", icon: "amazon", cheapest: false, note: "Global shipping available", searchUrl: "https://www.amazon.com/s?k=" },
      { name: "YesStyle", icon: "yesstyle", cheapest: false, note: "K-beauty & J-beauty worldwide shipping", searchUrl: "https://www.yesstyle.com/en/search?q=" },
      { name: "The Ordinary (Direct)", icon: "ordinary", cheapest: false, note: "Ships globally, best for TO products", searchUrl: "https://theordinary.com/search?q=" },
    ],
  };
}

module.exports = { getStoresForRegion };
