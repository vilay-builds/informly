import { NextRequest, NextResponse } from "next/server";
import { fetchManyQuotes } from "@/lib/api/stocks";
import { POPULAR_INDIA_POOL } from "@/lib/india";

export const revalidate = 60;

export async function GET(req: NextRequest) {
  const tickersParam = req.nextUrl.searchParams.get("tickers");

  // If caller passes specific tickers, fetch those. Otherwise return the
  // curated popular pool (default home behavior).
  const tickers = tickersParam
    ? tickersParam
        .split(",")
        .map((t) => t.trim().toUpperCase())
        .filter(Boolean)
        .slice(0, 50) // safety cap
    : POPULAR_INDIA_POOL;

  const quotes = await fetchManyQuotes(tickers, "india");
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
  return NextResponse.json({ stocks: lite });
}
