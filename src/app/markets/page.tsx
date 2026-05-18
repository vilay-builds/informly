import { fetchManyQuotes, fetchIndices } from "@/lib/api/stocks";
import { explainMarketState } from "@/lib/api/gemini";
import MarketsView from "./MarketsView";

const US_POOL = [
  "AAPL", "NVDA", "MSFT", "GOOGL", "AMZN",
  "META", "TSLA", "AMD", "NFLX", "BAC",
];

const INDIA_POOL = [
  "RELIANCE", "TCS", "HDFCBANK", "INFY", "BHARTIARTL",
  "ICICIBANK", "MARUTI", "ASIANPAINT", "TITAN", "SUNPHARMA",
];

export const dynamic = "force-dynamic";
export const revalidate = 120;

export default async function MarketsPage() {
  // Default to India server-side; client will re-fetch if user's pref differs.
  const region: "us" | "india" = "india";
  const tickers = region === "india" ? INDIA_POOL : US_POOL;

  const [quotes, indices] = await Promise.all([
    fetchManyQuotes(tickers, region),
    fetchIndices(region),
  ]);

  const lite = quotes.map((q) => ({
    ticker: q.ticker,
    name: q.name,
    region: q.region,
    currency: q.currency,
    price: q.price,
    change: q.change,
    changePercent: q.changePercent,
    dayHigh: q.dayHigh,
    dayLow: q.dayLow,
    weekHigh: q.weekHigh,
    weekLow: q.weekLow,
    marketCap: q.marketCap,
    peRatio: q.peRatio,
    volume: q.volume,
  }));

  const marketSummary = await explainMarketState(region, indices);

  return (
    <MarketsView
      region={region}
      stocks={lite}
      marketSummary={marketSummary}
    />
  );
}
