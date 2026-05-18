import { NextRequest, NextResponse } from "next/server";
import { fetchManyQuotes } from "@/lib/api/stocks";

// The most-watched tickers per region for the ticker bar. These rotate fast
// in the marquee so 8-10 each is plenty.
const US_TICKER = [
  "^GSPC", "^IXIC", "^DJI",
  "AAPL", "NVDA", "MSFT", "GOOGL", "AMZN",
  "META", "TSLA", "SPY",
];
const INDIA_TICKER = [
  "^NSEI", "^BSESN",
  "RELIANCE", "TCS", "HDFCBANK", "INFY", "BHARTIARTL",
  "ICICIBANK", "ITC", "SBIN",
];

export const revalidate = 60;

export async function GET(req: NextRequest) {
  const region = (req.nextUrl.searchParams.get("region") || "india") as
    | "us"
    | "india";
  const tickers = region === "india" ? INDIA_TICKER : US_TICKER;

  // For indices (^... symbols) we need raw passthrough so they're still routed
  // to NSE etc.; fetchManyQuotes adds .NS automatically but skips dots already
  // present.
  const quotes = await fetchManyQuotes(tickers, region);
  const items = quotes
    .filter((q) => q.price > 0)
    .map((q) => ({
      ticker: q.ticker.replace(/^\^/, ""),
      price: q.price,
      changePercent: q.changePercent,
    }));
  return NextResponse.json({ items });
}
