// Curated list of well-known Indian stocks for the onboarding starter
// picker and the empty-watchlist suggestions. Order matters — top items
// are shown first.
export interface SuggestedStock {
  ticker: string;
  name: string;
  sector: string;
  blurb: string;
}

export const STARTER_STOCKS: SuggestedStock[] = [
  { ticker: "RELIANCE", name: "Reliance Industries", sector: "Conglomerate", blurb: "India's largest private company. Jio, retail, energy." },
  { ticker: "TCS", name: "Tata Consultancy Services", sector: "IT Services", blurb: "Global IT services giant. Part of the Tata Group." },
  { ticker: "HDFCBANK", name: "HDFC Bank", sector: "Banking", blurb: "India's largest private bank by market cap." },
  { ticker: "INFY", name: "Infosys", sector: "IT Services", blurb: "Software services to enterprises worldwide." },
  { ticker: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom", blurb: "Telecom and broadband across India and Africa." },
  { ticker: "ICICIBANK", name: "ICICI Bank", sector: "Banking", blurb: "Top private bank, strong retail credit." },
  { ticker: "ITC", name: "ITC Ltd.", sector: "FMCG", blurb: "Cigarettes, FMCG, hotels, paperboards." },
  { ticker: "SBIN", name: "State Bank of India", sector: "Banking", blurb: "India's largest public-sector bank." },
  { ticker: "MARUTI", name: "Maruti Suzuki", sector: "Auto", blurb: "India's largest carmaker by volume." },
  { ticker: "TITAN", name: "Titan Company", sector: "Consumer", blurb: "Tanishq jewelry, watches, eyewear. Tata Group." },
  { ticker: "ASIANPAINT", name: "Asian Paints", sector: "Paints", blurb: "India's largest paint and home-coatings company." },
  { ticker: "BAJFINANCE", name: "Bajaj Finance", sector: "NBFC", blurb: "Consumer and commercial lending leader." },
];

export const POPULAR_INDIA_POOL: string[] = [
  // Top 30 NSE by market cap-ish for the Movers section pool
  "RELIANCE", "TCS", "HDFCBANK", "ICICIBANK", "BHARTIARTL",
  "INFY", "ITC", "SBIN", "MARUTI", "ASIANPAINT",
  "TITAN", "BAJFINANCE", "LT", "AXISBANK", "HCLTECH",
  "WIPRO", "SUNPHARMA", "KOTAKBANK", "ULTRACEMCO", "NESTLEIND",
  "TATAMOTORS", "M&M", "POWERGRID", "NTPC", "ADANIENT",
  "JSWSTEEL", "TATASTEEL", "TECHM", "ADANIPORTS", "GRASIM",
];

export const INDIA_INDICES = [
  { symbol: "^NSEI", name: "NIFTY 50" },
  { symbol: "^BSESN", name: "SENSEX" },
  { symbol: "^NSEBANK", name: "NIFTY Bank" },
  { symbol: "^CNXIT", name: "NIFTY IT" },
  { symbol: "^CNXAUTO", name: "NIFTY Auto" },
  { symbol: "^CNXFMCG", name: "NIFTY FMCG" },
];
