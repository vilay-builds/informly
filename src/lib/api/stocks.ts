// Yahoo Finance wrapper — no API key needed. Free, unlimited.

import "server-only";
import yahooFinance from "yahoo-finance2";

// Loose Yahoo quote shape — yahoo-finance2's union types fight TypeScript narrowing.
type YQuote = {
  symbol?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketPreviousClose?: number;
  regularMarketOpen?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  averageDailyVolume3Month?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  marketCap?: number;
  trailingPE?: number;
  forwardPE?: number;
  dividendYield?: number;
  marketState?: string;
  shortName?: string;
  longName?: string;
  fullExchangeName?: string;
};

export interface LiveStock {
  ticker: string;
  name: string;
  exchange: string;
  currency: "$" | "₹";
  region: "us" | "india";
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number | null;
  dayHigh: number | null;
  dayLow: number | null;
  weekHigh: number | null;
  weekLow: number | null;
  marketCap: number | null;
  peRatio: number | null;
  dividendYield: number | null;
  volume: number | null;
  avgVolume: number | null;
  beta: number | null;
  forwardPE: number | null;
  marketState: string;
  shortName: string;
  longName: string | null;
}

// Yahoo expects India tickers with .NS suffix for NSE listings.
function toYahooSymbol(ticker: string, region: "us" | "india"): string {
  const t = ticker.toUpperCase();
  if (region === "india" && !t.includes(".")) return `${t}.NS`;
  return t;
}

function inferRegion(symbol: string): "us" | "india" {
  return symbol.endsWith(".NS") || symbol.endsWith(".BO") ? "india" : "us";
}

function formatCompactNumber(n: number | null | undefined): number | null {
  if (n == null || !Number.isFinite(n)) return null;
  return n;
}

export async function fetchStockQuote(
  ticker: string,
  region: "us" | "india"
): Promise<LiveStock | null> {
  const symbol = toYahooSymbol(ticker, region);
  try {
    const raw = (await yahooFinance.quote(symbol)) as unknown as YQuote | YQuote[];
    const q = Array.isArray(raw) ? raw[0] : raw;
    if (!q || q.regularMarketPrice == null) return null;
    return {
      ticker,
      name: q.longName ?? q.shortName ?? ticker,
      exchange: q.fullExchangeName ?? "—",
      currency: region === "india" ? "₹" : "$",
      region,
      price: q.regularMarketPrice,
      change: q.regularMarketChange ?? 0,
      changePercent: q.regularMarketChangePercent ?? 0,
      previousClose: q.regularMarketPreviousClose ?? q.regularMarketPrice,
      open: q.regularMarketOpen ?? null,
      dayHigh: q.regularMarketDayHigh ?? null,
      dayLow: q.regularMarketDayLow ?? null,
      weekHigh: q.fiftyTwoWeekHigh ?? null,
      weekLow: q.fiftyTwoWeekLow ?? null,
      marketCap: formatCompactNumber(q.marketCap),
      peRatio: formatCompactNumber(q.trailingPE),
      dividendYield: q.dividendYield ?? null,
      volume: q.regularMarketVolume ?? null,
      avgVolume: q.averageDailyVolume3Month ?? null,
      beta: null,
      forwardPE: formatCompactNumber(q.forwardPE),
      marketState: q.marketState ?? "REGULAR",
      shortName: q.shortName ?? ticker,
      longName: q.longName ?? null,
    };
  } catch (err) {
    console.error(`Yahoo quote failed for ${symbol}`, err);
    return null;
  }
}

export interface PriceCandle {
  date: string;
  close: number;
}

export async function fetchPriceHistory(
  ticker: string,
  region: "us" | "india",
  range: "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "5y" = "1mo"
): Promise<PriceCandle[]> {
  const symbol = toYahooSymbol(ticker, region);

  // Yahoo uses different intervals per range
  const intervalMap: Record<typeof range, "5m" | "1h" | "1d" | "1wk"> = {
    "1d": "5m",
    "5d": "1h",
    "1mo": "1d",
    "3mo": "1d",
    "6mo": "1d",
    "1y": "1d",
    "5y": "1wk",
  };

  const periodMap: Record<typeof range, () => Date> = {
    "1d": () => new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    "5d": () => new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    "1mo": () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    "3mo": () => new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    "6mo": () => new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    "1y": () => new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    "5y": () => new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
  };

  try {
    const result = (await yahooFinance.chart(symbol, {
      period1: periodMap[range](),
      period2: new Date(),
      interval: intervalMap[range],
    })) as unknown as { quotes?: Array<{ date: Date | string; close: number | null }> };
    if (!result.quotes) return [];
    return result.quotes
      .filter((q) => q.close != null)
      .map((q) => ({
        date: q.date instanceof Date ? q.date.toISOString() : String(q.date),
        close: q.close as number,
      }));
  } catch (err) {
    console.error(`Yahoo chart failed for ${symbol}`, err);
    return [];
  }
}

interface IndexPoint {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

const US_INDICES = [
  { symbol: "^GSPC", name: "S&P 500" },
  { symbol: "^IXIC", name: "NASDAQ" },
  { symbol: "^DJI", name: "DOW" },
  { symbol: "^RUT", name: "Russell 2000" },
  { symbol: "^VIX", name: "VIX" },
  { symbol: "GC=F", name: "Gold" },
  { symbol: "BTC-USD", name: "Bitcoin" },
  { symbol: "^TNX", name: "10Y Yield" },
];

const INDIA_INDICES = [
  { symbol: "^NSEI", name: "NIFTY 50" },
  { symbol: "^BSESN", name: "SENSEX" },
  { symbol: "^NSEBANK", name: "NIFTY Bank" },
  { symbol: "^CNXIT", name: "NIFTY IT" },
  { symbol: "^CNXAUTO", name: "NIFTY Auto" },
  { symbol: "^CNXFMCG", name: "NIFTY FMCG" },
  { symbol: "INDIAVIX.NS", name: "India VIX" },
  { symbol: "BTC-INR", name: "Bitcoin (INR)" },
];

export async function fetchIndices(
  region: "us" | "india"
): Promise<IndexPoint[]> {
  const list = region === "india" ? INDIA_INDICES : US_INDICES;
  const symbols = list.map((i) => i.symbol);
  try {
    const raw = (await yahooFinance.quote(symbols)) as unknown as YQuote[];
    const arr = Array.isArray(raw) ? raw : [raw];
    const map = new Map<string, YQuote>();
    arr.forEach((q) => {
      if (q?.symbol) map.set(q.symbol, q);
    });
    return list
      .map(({ symbol, name }) => {
        const q = map.get(symbol);
        if (!q || q.regularMarketPrice == null) return null;
        return {
          symbol,
          name,
          value: q.regularMarketPrice,
          change: q.regularMarketChange ?? 0,
          changePercent: q.regularMarketChangePercent ?? 0,
        };
      })
      .filter((x): x is IndexPoint => x !== null);
  } catch (err) {
    console.error("Indices fetch failed", err);
    return [];
  }
}

/**
 * Fetch multiple stocks in one Yahoo call (much faster than N individual calls).
 */
export async function fetchManyQuotes(
  tickers: string[],
  region: "us" | "india"
): Promise<LiveStock[]> {
  if (tickers.length === 0) return [];
  const symbols = tickers.map((t) => toYahooSymbol(t, region));
  try {
    const raw = (await yahooFinance.quote(symbols)) as unknown as YQuote[];
    const arr = Array.isArray(raw) ? raw : [raw];
    return arr
      .map((q) => {
        if (!q || q.regularMarketPrice == null) return null;
        const rawSymbol = (q.symbol as string) ?? "";
        const r = inferRegion(rawSymbol);
        const ticker = rawSymbol.replace(/\.(NS|BO)$/, "");
        return {
          ticker,
          name: q.longName ?? q.shortName ?? ticker,
          exchange: q.fullExchangeName ?? "—",
          currency: (r === "india" ? "₹" : "$") as "$" | "₹",
          region: r,
          price: q.regularMarketPrice,
          change: q.regularMarketChange ?? 0,
          changePercent: q.regularMarketChangePercent ?? 0,
          previousClose: q.regularMarketPreviousClose ?? q.regularMarketPrice,
          open: q.regularMarketOpen ?? null,
          dayHigh: q.regularMarketDayHigh ?? null,
          dayLow: q.regularMarketDayLow ?? null,
          weekHigh: q.fiftyTwoWeekHigh ?? null,
          weekLow: q.fiftyTwoWeekLow ?? null,
          marketCap: formatCompactNumber(q.marketCap),
          peRatio: formatCompactNumber(q.trailingPE),
          dividendYield: q.dividendYield ?? null,
          volume: q.regularMarketVolume ?? null,
          avgVolume: q.averageDailyVolume3Month ?? null,
          beta: null,
          forwardPE: formatCompactNumber(q.forwardPE),
          marketState: q.marketState ?? "REGULAR",
          shortName: q.shortName ?? ticker,
          longName: q.longName ?? null,
        } as LiveStock;
      })
      .filter((q): q is LiveStock => q !== null);
  } catch (err) {
    console.error("Yahoo many-quotes failed", err);
    return [];
  }
}

export function formatPrice(n: number, currency: "$" | "₹"): string {
  return n.toLocaleString(currency === "₹" ? "en-IN" : "en-US", {
    maximumFractionDigits: 2,
  });
}

export function formatCompact(n: number | null | undefined, currency = "$"): string {
  if (n == null || !Number.isFinite(n)) return "—";
  if (n >= 1e12) return `${currency}${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${currency}${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e7) return `${currency}${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e6) return `${currency}${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${currency}${(n / 1e3).toFixed(2)}K`;
  return `${currency}${n.toFixed(2)}`;
}
