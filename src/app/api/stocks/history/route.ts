import { NextRequest, NextResponse } from "next/server";
import { fetchPriceHistory, resolveQuote } from "@/lib/api/stocks";

type Range = "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "5y";

const VALID: Range[] = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "5y"];

export const revalidate = 60;

export async function GET(req: NextRequest) {
  const ticker = req.nextUrl.searchParams.get("ticker");
  const rangeParam = req.nextUrl.searchParams.get("range") as Range | null;
  if (!ticker) {
    return NextResponse.json({ error: "ticker required" }, { status: 400 });
  }
  const range: Range = rangeParam && VALID.includes(rangeParam) ? rangeParam : "1mo";

  // Resolve which exchange the ticker lives on
  const resolved = await resolveQuote(ticker);
  if (!resolved) {
    return NextResponse.json({ data: [] });
  }

  const history = await fetchPriceHistory(resolved.quote.ticker, resolved.region, range);
  return NextResponse.json({
    data: history.map((p) => p.close),
    timestamps: history.map((p) => p.date),
    region: resolved.region,
  });
}
