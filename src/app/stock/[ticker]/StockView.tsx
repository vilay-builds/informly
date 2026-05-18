"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { StockChart } from "@/components/StockChart";
import { Pill } from "@/components/ui";
import { useWatchlist } from "@/lib/persistence";
import { useToast } from "@/components/Toast";

const ranges = ["1D", "1W", "1M", "3M", "1Y", "5Y"] as const;
type Range = (typeof ranges)[number];

const rangeApiMap: Record<Range, string> = {
  "1D": "1d",
  "1W": "5d",
  "1M": "1mo",
  "3M": "3mo",
  "1Y": "1y",
  "5Y": "5y",
};

type Signal = "bullish" | "bearish" | "neutral";

const signalStyles = {
  bullish: {
    bg: "bg-success-400/15",
    color: "text-success-500",
    border: "border-success-400/30",
    label: "Bullish — Looking Good",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  bearish: {
    bg: "bg-red-50",
    color: "text-red-500",
    border: "border-red-200",
    label: "Bearish — Use Caution",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
  },
  neutral: {
    bg: "bg-yellow-50",
    color: "text-yellow-600",
    border: "border-yellow-200",
    label: "Neutral — Wait & Watch",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      </svg>
    ),
  },
};

export interface StockViewData {
  ticker: string;
  name: string;
  exchange: string;
  region: "us" | "india";
  currency: "$" | "₹";
  price: number;
  changePercent: number;
  stats: { label: string; value: string }[];
  metrics: { label: string; value: string; explanation: string }[];
  signal: Signal;
  signalReason: string;
  about: string;
  analystSummary: string;
  news: { title: string; link: string; publisher: string; publishedAt: string }[];
  initialChartData: number[];
  initialChartRange: Range;
}

export default function StockView({ stock }: { stock: StockViewData }) {
  const [expandedMetric, setExpandedMetric] = useState<number | null>(null);
  const [range, setRange] = useState<Range>(stock.initialChartRange);
  const [chartData, setChartData] = useState<number[]>(stock.initialChartData);
  const [chartLoading, setChartLoading] = useState(false);
  const { isWatched, toggle: toggleWatch } = useWatchlist(stock.region);
  const toast = useToast();

  const isPositive = stock.changePercent >= 0;
  const watching = isWatched(stock.ticker);
  const signal = signalStyles[stock.signal];

  // Fetch real chart data from Yahoo when range changes
  useEffect(() => {
    if (range === stock.initialChartRange) return;
    let cancelled = false;
    setChartLoading(true);
    (async () => {
      try {
        const res = await fetch(
          `/api/stocks/history?ticker=${encodeURIComponent(stock.ticker)}&range=${rangeApiMap[range]}`
        );
        if (!res.ok) throw new Error("history fetch failed");
        const json = (await res.json()) as { data: number[] };
        if (!cancelled && json.data.length) setChartData(json.data);
      } catch {
        // silent - keep last data
      } finally {
        if (!cancelled) setChartLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [range, stock.ticker, stock.initialChartRange]);

  const formatPrice = (p: number) =>
    stock.currency === "₹"
      ? p.toLocaleString("en-IN", { maximumFractionDigits: 2 })
      : p.toLocaleString("en-US", { maximumFractionDigits: 2 });

  const handleToggleWatch = () => {
    toggleWatch(stock.ticker);
    toast.show({
      message: watching
        ? `${stock.ticker} removed from watchlist`
        : `${stock.ticker} added to watchlist`,
      variant: "success",
    });
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="sticky top-0 z-40 glass-strong border-b border-white/30">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/markets"
              aria-label="Back to markets"
              className="w-9 h-9 rounded-full bg-surface flex items-center justify-center border border-border"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <Pill variant={isPositive ? "success" : "danger"} size="sm">
              {stock.ticker} {isPositive ? "+" : ""}
              {stock.changePercent.toFixed(2)}%
            </Pill>
          </div>

          <button
            onClick={handleToggleWatch}
            aria-label={watching ? "Remove from watchlist" : "Add to watchlist"}
            className="w-9 h-9 rounded-full bg-surface flex items-center justify-center border border-border"
          >
            <svg
              width="18"
              height="18"
              fill={watching ? "#f59e0b" : "none"}
              viewBox="0 0 24 24"
              stroke={watching ? "#f59e0b" : "currentColor"}
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs text-text-tertiary mb-1">
            Last traded price · {stock.exchange}
          </p>
          <p className="text-4xl font-bold text-text-primary tracking-tight">
            <span className="text-2xl text-text-tertiary mr-1">
              {stock.currency}
            </span>
            {formatPrice(stock.price)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-medium text-text-secondary">
              {stock.name}
            </span>
            <span className="w-1 h-1 rounded-full bg-text-tertiary" />
            <span
              className={`text-sm font-semibold ${
                isPositive ? "text-success-500" : "text-red-500"
              }`}
            >
              {isPositive ? "+" : ""}
              {stock.changePercent.toFixed(2)}% ({range})
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-3xl p-5 border border-border"
        >
          <div className={chartLoading ? "opacity-50 transition-opacity" : "transition-opacity"}>
            {chartData.length > 0 ? (
              <StockChart
                data={chartData}
                isPositive={isPositive}
                height={200}
                currency={stock.currency}
              />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-xs text-text-tertiary">
                No chart data available
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-4 bg-surface-secondary rounded-full p-1">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  range === r
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface rounded-2xl p-4 border border-border"
        >
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Market Stats
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {stock.stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between">
                <span className="text-xs text-text-tertiary">{stat.label}</span>
                <span className="text-xs font-semibold text-text-primary">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-5 border ${signal.bg} ${signal.border}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className={signal.color}>{signal.icon}</span>
            <h3 className={`text-sm font-bold ${signal.color}`}>
              {signal.label}
            </h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {stock.signalReason}
          </p>
        </motion.section>

        <section className="bg-surface rounded-2xl p-5 border border-border">
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            What does {stock.name} do?
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {stock.about}
          </p>
        </section>

        {stock.metrics.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Key Metrics — Tap to understand
            </h3>
            <div className="space-y-2">
              {stock.metrics.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.04 }}
                  className="bg-surface rounded-xl border border-border overflow-hidden cursor-pointer"
                  onClick={() =>
                    setExpandedMetric(expandedMetric === i ? null : i)
                  }
                >
                  <div className="flex items-center justify-between p-4">
                    <span className="text-sm text-text-secondary">
                      {metric.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-text-primary">
                        {metric.value}
                      </span>
                      <motion.svg
                        width="14"
                        height="14"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-text-tertiary"
                        animate={{ rotate: expandedMetric === i ? 180 : 0 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </div>
                  </div>
                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedMetric === i ? "auto" : 0,
                      opacity: expandedMetric === i ? 1 : 0,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <div className="pt-3 border-t border-border">
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {metric.explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <section className="bg-primary-50 rounded-2xl p-5 border border-primary-100">
          <h3 className="text-sm font-semibold text-primary-700 mb-2">
            What Analysts Are Saying
          </h3>
          <p className="text-sm text-primary-800 leading-relaxed">
            {stock.analystSummary}
          </p>
        </section>

        {stock.news.length > 0 && (
          <section className="pb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Latest News
            </h3>
            <div className="space-y-2">
              {stock.news.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-surface rounded-xl p-4 border border-border hover:border-border-hover transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-text-primary leading-snug flex-1">
                      {item.title}
                    </p>
                    <svg
                      width="12"
                      height="12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-text-tertiary flex-shrink-0"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-text-tertiary mt-1.5">
                    {item.publisher}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
