import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export const revalidate = 60;

interface YQuoteSearchHit {
  symbol?: string;
  shortname?: string;
  longname?: string;
  exchDisp?: string;
  typeDisp?: string;
  quoteType?: string;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q || q.trim().length < 1) {
    return NextResponse.json({ results: [] });
  }

  try {
    // validateResult:false — Yahoo's live response no longer matches the
    // library's strict schema (e.g. typeDisp "Equity" vs expected "equity"),
    // which otherwise throws and makes every search return empty.
    const result = (await yahooFinance.search(
      q,
      { quotesCount: 8, newsCount: 0 },
      { validateResult: false }
    )) as unknown as { quotes?: YQuoteSearchHit[] };

    const stocks = (result.quotes ?? [])
      .filter(
        (q) =>
          q.symbol && (q.quoteType === "EQUITY" || q.quoteType === "ETF" || q.quoteType === "INDEX")
      )
      .map((h) => ({
        symbol: h.symbol!,
        ticker: h.symbol!.replace(/\.(NS|BO)$/, ""),
        name: h.longname ?? h.shortname ?? h.symbol!,
        exchange: h.exchDisp ?? "—",
        type: h.typeDisp ?? h.quoteType ?? "",
        isIndia: !!h.symbol?.match(/\.(NS|BO)$/i),
      }));

    return NextResponse.json({ results: stocks });
  } catch (err) {
    console.error("Stock search failed", err);
    return NextResponse.json({ results: [] });
  }
}
