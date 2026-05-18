import { notFound } from "next/navigation";
import {
  resolveQuote,
  fetchBusinessSummary,
  fetchStockNews,
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

  const [businessSummary, news] = await Promise.all([
    fetchBusinessSummary(quote.ticker, region),
    fetchStockNews(quote.ticker, region),
  ]);

  const commentary = await explainStock({
    ticker: quote.ticker,
    name: quote.name,
    longBusinessSummary: businessSummary ?? undefined,
    price: quote.price,
    changePercent: quote.changePercent,
    marketCap: quote.marketCap,
    peRatio: quote.peRatio,
    weekHigh: quote.weekHigh,
    weekLow: quote.weekLow,
    recentNewsTitles: news.slice(0, 3).map((n) => n.title),
  });

  const stats = [
    {
      label: "Market Cap",
      value: formatCompact(quote.marketCap, quote.currency),
    },
    {
      label: "Volume",
      value:
        quote.volume != null
          ? quote.volume >= 1e6
            ? `${(quote.volume / 1e6).toFixed(1)}M`
            : quote.volume.toLocaleString()
          : "—",
    },
    {
      label: "Day Range",
      value:
        quote.dayLow && quote.dayHigh
          ? `${quote.dayLow.toFixed(2)} – ${quote.dayHigh.toFixed(2)}`
          : "—",
    },
    {
      label: "52W Range",
      value:
        quote.weekLow && quote.weekHigh
          ? `${quote.weekLow.toFixed(2)} – ${quote.weekHigh.toFixed(2)}`
          : "—",
    },
  ];

  const metricList = [
    { label: "P/E Ratio", value: quote.peRatio?.toFixed(2) ?? "—" },
    {
      label: "Market Cap",
      value: formatCompact(quote.marketCap, quote.currency),
    },
    {
      label: "52-Week Range",
      value:
        quote.weekLow && quote.weekHigh
          ? `${quote.weekLow.toFixed(2)} – ${quote.weekHigh.toFixed(2)}`
          : "—",
    },
    {
      label: "Day Change",
      value: `${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%`,
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
    stats,
    metrics,
    signal: commentary.signal,
    signalReason: commentary.signalReason,
    about: commentary.about,
    analystSummary: commentary.analystSummary,
    news,
  };

  return <StockView stock={viewData} />;
}
