import { fetchManyQuotes, fetchIndices } from "@/lib/api/stocks";
import { explainMarketState } from "@/lib/api/gemini";
import { POPULAR_INDIA_POOL } from "@/lib/india";
import HomeView from "./HomeView";

export const dynamic = "force-dynamic";
export const revalidate = 120;

export default async function HomePage() {
  const [quotes, indices] = await Promise.all([
    fetchManyQuotes(POPULAR_INDIA_POOL, "india"),
    fetchIndices("india"),
  ]);

  const lite = quotes.map((q) => ({
    ticker: q.ticker,
    name: q.name,
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

  const marketSummary = await explainMarketState(
    indices.map((i) => ({ name: i.name, changePercent: i.changePercent }))
  );

  return (
    <HomeView
      stocks={lite}
      marketSummary={marketSummary}
      indices={indices.map((i) => ({
        symbol: i.symbol,
        name: i.name,
        value: i.value,
        changePercent: i.changePercent,
      }))}
    />
  );
}
