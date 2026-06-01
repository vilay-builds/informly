// Yahoo Finance wrapper — no API key needed. Free, unlimited.

import "server-only";
import YahooFinance from "yahoo-finance2";

// v3 requires explicit instantiation per app.
const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

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
// Indices (start with ^), crypto (contains -), and forex (=X) are passed through.
function toYahooSymbol(ticker: string, region: "us" | "india"): string {
  const t = ticker.toUpperCase();
  if (t.startsWith("^") || t.includes(".") || t.includes("-") || t.includes("=")) {
    return t;
  }
  if (region === "india") return `${t}.NS`;
  return t;
}

function inferRegion(symbol: string): "us" | "india" {
  return symbol.endsWith(".NS") || symbol.endsWith(".BO") ? "india" : "us";
}

function formatCompactNumber(n: number | null | undefined): number | null {
  if (n == null || !Number.isFinite(n)) return null;
  return n;
}

/**
 * Resolve a free-form ticker to a live quote, India-first.
 *
 * The platform is India-focused, so plain tickers like INFY / TCS /
 * RELIANCE are resolved against NSE first. Without this, Yahoo would
 * happily return a US listing with the same root ticker (Reliance Steel,
 * etc.), causing the wrong currency and price to appear.
 *
 * Indices (^-prefixed) and explicitly suffixed symbols (.NS / .BO) keep
 * their semantics.
 */
export async function resolveQuote(
  ticker: string
): Promise<{ quote: LiveStock; region: "us" | "india" } | null> {
  const t = ticker.toUpperCase();

  // Explicit India suffix
  if (t.endsWith(".NS") || t.endsWith(".BO")) {
    const q = await fetchStockQuote(t.replace(/\.(NS|BO)$/, ""), "india");
    return q ? { quote: q, region: "india" } : null;
  }

  // Index symbols (^...) — try Yahoo directly first; the result usually
  // has no INR/USD currency since indices are unitless. We normalise the
  // currency to ₹ when the symbol looks Indian.
  if (t.startsWith("^")) {
    const q = await fetchStockQuote(t, "us"); // toYahooSymbol passes ^ through unchanged
    if (q) {
      const isIndianIndex = /^\^(NSE|BSE|CNX|INDIA)/.test(t);
      return {
        quote: { ...q, currency: isIndianIndex ? "₹" : q.currency, region: isIndianIndex ? "india" : q.region },
        region: isIndianIndex ? "india" : q.region,
      };
    }
    return null;
  }

  // India-first for plain tickers
  const india = await fetchStockQuote(t, "india");
  if (india) return { quote: india, region: "india" };

  // Fallback: US listing
  const us = await fetchStockQuote(t, "us");
  if (us) return { quote: us, region: "us" };

  return null;
}

export async function fetchBusinessSummary(
  ticker: string,
  region: "us" | "india"
): Promise<string | null> {
  const symbol = toYahooSymbol(ticker, region);
  try {
    const result = (await yahooFinance.quoteSummary(
      symbol,
      { modules: ["assetProfile"] },
      { validateResult: false }
    )) as unknown as {
      assetProfile?: { longBusinessSummary?: string };
    };
    return result?.assetProfile?.longBusinessSummary ?? null;
  } catch {
    return null;
  }
}

export async function fetchStockNews(
  ticker: string,
  region: "us" | "india"
): Promise<{ title: string; link: string; publisher: string; publishedAt: string }[]> {
  const symbol = toYahooSymbol(ticker, region);
  try {
    const result = (await yahooFinance.search(
      symbol,
      { newsCount: 5, quotesCount: 0 },
      { validateResult: false }
    )) as unknown as {
      news?: Array<{
        title?: string;
        link?: string;
        publisher?: string;
        providerPublishTime?: number;
      }>;
    };
    return (result.news ?? [])
      .filter((n) => n.title && n.link)
      .map((n) => ({
        title: n.title!,
        link: n.link!,
        publisher: n.publisher ?? "Yahoo Finance",
        publishedAt: n.providerPublishTime
          ? new Date(n.providerPublishTime * 1000).toISOString()
          : new Date().toISOString(),
      }));
  } catch (err) {
    console.error(`Yahoo news failed for ${symbol}`, err);
    return [];
  }
}

export async function fetchStockQuote(
  ticker: string,
  region: "us" | "india"
): Promise<LiveStock | null> {
  const symbol = toYahooSymbol(ticker, region);
  try {
    const raw = (await yahooFinance.quote(
      symbol,
      {},
      { validateResult: false }
    )) as unknown as YQuote | YQuote[];
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

  // We pull a slightly wider window than the user asked for so that
  // weekends/holidays still produce a curve from the most recent
  // trading session.
  const periodMap: Record<typeof range, () => Date> = {
    "1d": () => new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    "5d": () => new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    "1mo": () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    "3mo": () => new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    "6mo": () => new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    "1y": () => new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    "5y": () => new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
  };

  try {
    const result = (await yahooFinance.chart(
      symbol,
      {
        period1: periodMap[range](),
        period2: new Date(),
        interval: intervalMap[range],
      },
      { validateResult: false }
    )) as unknown as { quotes?: Array<{ date: Date | string; close: number | null }> };
    if (!result.quotes) return [];

    const all = result.quotes
      .filter((q) => q.close != null)
      .map((q) => ({
        date: q.date instanceof Date ? q.date.toISOString() : String(q.date),
        close: q.close as number,
      }));

    // For 1D, slice to JUST the most-recent trading day's points.
    // We bucket by IST day boundary (NSE local time).
    if (range === "1d" && all.length > 0) {
      const istDayKey = (iso: string) => {
        // Convert UTC ISO to IST (UTC+5:30) day key
        const utc = new Date(iso);
        const ist = new Date(utc.getTime() + 5.5 * 60 * 60 * 1000);
        return `${ist.getUTCFullYear()}-${ist.getUTCMonth()}-${ist.getUTCDate()}`;
      };
      const lastDay = istDayKey(all[all.length - 1].date);
      return all.filter((p) => istDayKey(p.date) === lastDay);
    }

    return all;
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
    const raw = (await yahooFinance.quote(
      symbols,
      {},
      { validateResult: false }
    )) as unknown as YQuote[];
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
    const raw = (await yahooFinance.quote(
      symbols,
      {},
      { validateResult: false }
    )) as unknown as YQuote[];
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
