"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PremiumChart, ChartPoint } from "@/components/PremiumChart";
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
  initialChartPoints: ChartPoint[];
  initialChartRange: Range;
}

function formatPriceFull(p: number, currency: "$" | "₹"): string {
  return p.toLocaleString(currency === "₹" ? "en-IN" : "en-US", {
    maximumFractionDigits: 2,
  });
}

function formatChartTime(time: number, range: Range): string {
  const d = new Date(time * 1000);
  if (range === "1D" || range === "1W") {
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  if (range === "1M" || range === "3M") {
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }
  return d.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}

export default function StockView({ stock }: { stock: StockViewData }) {
  const [expandedMetric, setExpandedMetric] = useState<number | null>(null);
  const [range, setRange] = useState<Range>(stock.initialChartRange);
  const [points, setPoints] = useState<ChartPoint[]>(stock.initialChartPoints);
  const [chartLoading, setChartLoading] = useState(false);
  const [hover, setHover] = useState<{ value: number; time: number } | null>(null);
  const { isWatched, toggle: toggleWatch } = useWatchlist(stock.region);
  const toast = useToast();

  const isPositive = stock.changePercent >= 0;
  const watching = isWatched(stock.ticker);
  const signal = signalStyles[stock.signal];

  // Range-derived label
  const rangeLabel = useMemo(
    () => ({
      "1D": "today",
      "1W": "this week",
      "1M": "this month",
      "3M": "past 3 months",
      "1Y": "past year",
      "5Y": "past 5 years",
    })[range],
    [range]
  );

  // Fetch real chart data on range change
  useEffect(() => {
    if (range === stock.initialChartRange) {
      setPoints(stock.initialChartPoints);
      return;
    }
    let cancelled = false;
    setChartLoading(true);
    (async () => {
      try {
        const res = await fetch(
          `/api/stocks/history?ticker=${encodeURIComponent(stock.ticker)}&range=${rangeApiMap[range]}`
        );
        if (!res.ok) throw new Error("history fetch failed");
        const json = (await res.json()) as {
          data: number[];
          timestamps: string[];
        };
        if (cancelled) return;
        const next: ChartPoint[] = json.data.map((value, i) => ({
          value,
          time: Math.floor(new Date(json.timestamps[i]).getTime() / 1000),
        }));
        setPoints(next);
      } catch {
        // silent — keep last
      } finally {
        if (!cancelled) setChartLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [range, stock.ticker, stock.initialChartRange, stock.initialChartPoints]);

  // Range stats (high/low/change over the displayed range)
  const rangeStats = useMemo(() => {
    if (points.length === 0) return null;
    const first = points[0].value;
    const last = points[points.length - 1].value;
    const high = Math.max(...points.map((p) => p.value));
    const low = Math.min(...points.map((p) => p.value));
    const chgPct = ((last - first) / first) * 100;
    return { first, last, high, low, chgPct };
  }, [points]);

  const displayPrice = hover ? hover.value : stock.price;
  const displayChangePct = hover && rangeStats
    ? ((hover.value - rangeStats.first) / rangeStats.first) * 100
    : (rangeStats ? rangeStats.chgPct : stock.changePercent);
  const displayPositive = displayChangePct >= 0;

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

      <main className="max-w-2xl mx-auto px-5 pt-8 space-y-8">
        {/* Title + price */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">
            {stock.exchange}
          </p>
          <p className="text-sm text-text-secondary mb-1.5">{stock.name}</p>

          <div className="flex items-baseline gap-3 mb-1">
            <p className="text-[2.5rem] font-bold text-text-primary tracking-tight tabular-nums leading-none">
              <span className="text-xl text-text-tertiary mr-1.5">
                {stock.currency}
              </span>
              {formatPriceFull(displayPrice, stock.currency)}
            </p>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-sm">
            <span
              className={`font-semibold tabular-nums ${
                displayPositive ? "text-success-500" : "text-red-500"
              }`}
            >
              {displayPositive ? "+" : ""}
              {displayChangePct.toFixed(2)}%
            </span>
            <span className="text-text-tertiary">
              {hover
                ? formatChartTime(hover.time, range)
                : `${rangeLabel}`}
            </span>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div
            className={`relative transition-opacity duration-200 ${
              chartLoading ? "opacity-40" : "opacity-100"
            }`}
          >
            {points.length > 0 ? (
              <PremiumChart
                data={points}
                isPositive={(rangeStats?.chgPct ?? stock.changePercent) >= 0}
                currency={stock.currency}
                height={260}
                onCrosshairMove={setHover}
              />
            ) : (
              <div className="h-[260px] flex items-center justify-center text-xs text-text-tertiary">
                No chart data available
              </div>
            )}
          </div>

          {/* Range pills */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                  range === r
                    ? "text-white"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                {range === r && (
                  <motion.div
                    layoutId="range-pill"
                    className="absolute inset-0 rounded-full bg-text-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{r}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Range summary chips */}
        {rangeStats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3"
          >
            <RangeStat
              label="Range High"
              value={formatPriceFull(rangeStats.high, stock.currency)}
              currency={stock.currency}
            />
            <RangeStat
              label="Range Low"
              value={formatPriceFull(rangeStats.low, stock.currency)}
              currency={stock.currency}
            />
            <RangeStat
              label="Range Change"
              value={`${rangeStats.chgPct >= 0 ? "+" : ""}${rangeStats.chgPct.toFixed(2)}%`}
              tone={rangeStats.chgPct >= 0 ? "up" : "down"}
            />
          </motion.div>
        )}

        {/* Market stats */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface rounded-2xl p-5 border border-border"
        >
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-4">
            Market Stats
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
            {stock.stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between">
                <span className="text-xs text-text-tertiary">{stat.label}</span>
                <span className="text-xs font-semibold text-text-primary tabular-nums">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Signal */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-5 border ${signal.bg} ${signal.border}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className={signal.color}>{signal.icon}</span>
            <h3 className={`text-sm font-bold ${signal.color}`}>{signal.label}</h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {stock.signalReason}
          </p>
        </motion.section>

        {/* About */}
        <section className="bg-surface rounded-2xl p-5 border border-border">
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            What does {stock.name} do?
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {stock.about}
          </p>
        </section>

        {/* Metrics */}
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
                  onClick={() => setExpandedMetric(expandedMetric === i ? null : i)}
                >
                  <div className="flex items-center justify-between p-4">
                    <span className="text-sm text-text-secondary">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-text-primary tabular-nums">
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
                  <AnimatePresence initial={false}>
                    {expandedMetric === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
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
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Analyst */}
        <section className="bg-primary-50 rounded-2xl p-5 border border-primary-100">
          <h3 className="text-sm font-semibold text-primary-700 mb-2">
            What Analysts Are Saying
          </h3>
          <p className="text-sm text-primary-800 leading-relaxed">
            {stock.analystSummary}
          </p>
        </section>

        {/* News */}
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
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-tertiary flex-shrink-0">
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

function RangeStat({
  label,
  value,
  tone,
  currency,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
  currency?: "$" | "₹";
}) {
  return (
    <div className="bg-surface rounded-xl p-3.5 border border-border">
      <p className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1.5">
        {label}
      </p>
      <p
        className={`text-sm font-bold tabular-nums ${
          tone === "up" ? "text-success-500" : tone === "down" ? "text-red-500" : "text-text-primary"
        }`}
      >
        {currency && tone === undefined && (
          <span className="text-text-tertiary mr-0.5">{currency}</span>
        )}
        {value}
      </p>
    </div>
  );
}
