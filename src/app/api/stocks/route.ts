import { NextRequest, NextResponse } from "next/server";
import { fetchManyQuotes } from "@/lib/api/stocks";

const US_POOL = [
  "AAPL", "NVDA", "MSFT", "GOOGL", "AMZN",
  "META", "TSLA", "AMD", "NFLX", "BAC",
];
const INDIA_POOL = [
  "RELIANCE", "TCS", "HDFCBANK", "INFY", "BHARTIARTL",
  "ICICIBANK", "MARUTI", "ASIANPAINT", "TITAN", "SUNPHARMA",
];

export const revalidate = 60;

export async function GET(req: NextRequest) {
  const region = (req.nextUrl.searchParams.get("region") || "india") as
    | "us"
    | "india";
  const tickers = region === "india" ? INDIA_POOL : US_POOL;
  const quotes = await fetchManyQuotes(tickers, region);
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
