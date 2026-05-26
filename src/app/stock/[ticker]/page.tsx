import { notFound } from "next/navigation";
import {
  resolveQuote,
  fetchBusinessSummary,
  fetchStockNews,
  fetchPriceHistory,
  formatCompact,
} from "@/lib/api/stocks";
import { explainStock } from "@/lib/api/gemini";
import StockView, { StockViewData } from "./StockView";

export const dynamic = "force-dynamic";

export default async function StockPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker: rawTicker } = await params;
  const ticker = decodeURIComponent(rawTicker).toUpperCase();

  const resolved = await resolveQuote(ticker);
  if (!resolved) notFound();

  const { quote, region } = resolved;

  const [businessSummary, news, history] = await Promise.all([
    fetchBusinessSummary(quote.ticker, region),
    fetchStockNews(quote.ticker, region),
    fetchPriceHistory(quote.ticker, region, "1mo"),
  ]);

  const commentary = await explainStock({
    ticker: quote.ticker,
    name: quote.name,
    longBusinessSummary: businessSummary ?? undefined,
    price: quote.price,
    changePercent: quote.changePercent,
    marketCap: quote.marketCap,
    peRatio: quote.peRatio,
    dividendYield: quote.dividendYield,
    weekHigh: quote.weekHigh,
    weekLow: quote.weekLow,
    volume: quote.volume,
    recentNewsTitles: news.slice(0, 3).map((n) => n.title),
  });

  const metricList = [
    { label: "P/E Ratio", value: quote.peRatio?.toFixed(2) ?? "N/A" },
    {
      label: "Market Cap",
      value: formatCompact(quote.marketCap, quote.currency),
    },
    {
      label: "52-Week Range",
      value:
        quote.weekLow && quote.weekHigh
          ? `${quote.weekLow.toFixed(2)} – ${quote.weekHigh.toFixed(2)}`
          : "N/A",
    },
    {
      label: "Day Change",
      value: `${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%`,
    },
    {
      label: "Dividend Yield",
      value: quote.dividendYield != null
        ? `${(quote.dividendYield * 100).toFixed(2)}%`
        : "N/A",
    },
    {
      label: "Volume",
      value: quote.volume != null
        ? quote.volume >= 1e7
          ? `${(quote.volume / 1e7).toFixed(2)} Cr`
          : quote.volume >= 1e5
            ? `${(quote.volume / 1e5).toFixed(2)} L`
            : quote.volume.toLocaleString("en-IN")
        : "N/A",
    },
  ];

  const metrics = metricList.map((m) => ({
    label: m.label,
    value: m.value,
    explanation:
      commentary.metricExplanations?.[m.label] ?? "Explanation unavailable.",
  }));

  const viewData: StockViewData = {
    ticker: quote.ticker,
    name: quote.name,
    exchange: quote.exchange,
    region,
    currency: quote.currency,
    price: quote.price,
    changePercent: quote.changePercent,
    metrics,
    signal: commentary.signal,
    signalReason: commentary.signalReason,
    about: commentary.about,
    analystSummary: commentary.analystSummary,
    termFit: commentary.termFit,
    termFitReason: commentary.termFitReason,
    beginnerVerdict: commentary.beginnerVerdict,
    beginnerVerdictReason: commentary.beginnerVerdictReason,
    whyBuying: commentary.whyBuying,
    whyAvoiding: commentary.whyAvoiding,
    news,
    initialChartPoints: history.map((p) => ({
      value: p.close,
      time: Math.floor(new Date(p.date).getTime() / 1000),
    })),
    initialChartRange: "1M",
  };

  return <StockView stock={viewData} />;
}
