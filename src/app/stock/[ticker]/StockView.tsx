"use client";

import { useState, useEffect, useMemo } from "react";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PremiumChart, ChartPoint } from "@/components/PremiumChart";
import { Pill } from "@/components/ui";
import { useWatchlist } from "@/lib/persistence";
import { useToast } from "@/components/Toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ViewTransition = (React as any).ViewTransition as React.ComponentType<{
  name?: string;
  children: React.ReactNode;
}>;

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
  termFit: "short" | "mid" | "long" | "any";
  termFitReason: string;
  beginnerVerdict: "yes" | "maybe" | "wait" | "avoid";
  beginnerVerdictReason: string;
  whyBuying: string[];
  whyAvoiding: string[];
  news: { title: string; link: string; publisher: string; publishedAt: string }[];
  initialChartPoints: ChartPoint[];
  initialChartRange: Range;
}

const TERM_FIT_META = {
  short: {
    label: "Short term",
    range: "Weeks to a few months",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  mid: {
    label: "Mid term",
    range: "6 months to about 2 years",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  long: {
    label: "Long term",
    range: "3 years or more",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  any: {
    label: "Flexible",
    range: "Works across timeframes",
    color: "text-text-secondary",
    bg: "bg-surface-secondary",
    border: "border-border",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
  },
};

const BEGINNER_META = {
  yes: {
    label: "Good starting point",
    sublabel: "This stock is approachable for a new investor",
    color: "text-success-500",
    bg: "bg-success-400/15",
    border: "border-success-400/30",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  maybe: {
    label: "Worth exploring, with homework",
    sublabel: "Do some reading before you commit",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
  },
  wait: {
    label: "Not the right time",
    sublabel: "Better to watch and learn before entering",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  avoid: {
    label: "Skip this one for now",
    sublabel: "Too risky or complex for a new investor",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  },
};

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

  // Stitch the live current price as the trailing point so the chart's
  // last value matches the displayed price exactly (history closes lag
  // by minutes during market hours).
  const stitchedPoints = useMemo(() => {
    if (points.length === 0) return points;
    const last = points[points.length - 1];
    // Only stitch if the live price differs meaningfully from the last close
    if (Math.abs(last.value - stock.price) < 0.005) return points;
    const nowSec = Math.floor(Date.now() / 1000);
    // Ensure the new timestamp is after the previous one
    const ts = Math.max(last.time + 60, nowSec);
    return [...points, { value: stock.price, time: ts }];
  }, [points, stock.price]);

  // Range stats (high/low/change over the displayed range)
  const rangeStats = useMemo(() => {
    if (stitchedPoints.length === 0) return null;
    const first = stitchedPoints[0].value;
    const last = stitchedPoints[stitchedPoints.length - 1].value;
    const high = Math.max(...stitchedPoints.map((p) => p.value));
    const low = Math.min(...stitchedPoints.map((p) => p.value));
    const chgPct = ((last - first) / first) * 100;
    return { first, last, high, low, chgPct };
  }, [stitchedPoints]);

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
              href="/"
              aria-label="Back"
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
        {/* Title + price — wrapped in ViewTransition to morph from the watchlist card */}
        <ViewTransition name={`stock-card-${stock.ticker}`}>
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
        </ViewTransition>

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
            {stitchedPoints.length > 0 ? (
              <PremiumChart
                data={stitchedPoints}
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

        {/* ─── GUIDED NARRATIVE: "Should I invest?" ─── */}

        {/* Section 1: The Signal — what's the vibe right now? */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`rounded-2xl overflow-hidden border ${signal.border}`}
        >
          <div className={`px-5 py-4 ${signal.bg}`}>
            <div className="flex items-center gap-2.5">
              <span className={signal.color}>{signal.icon}</span>
              <div>
                <h3 className={`text-sm font-bold ${signal.color}`}>
                  {signal.label}
                </h3>
                <p className="text-[11px] text-text-tertiary mt-0.5">
                  Current momentum based on price, fundamentals, and news
                </p>
              </div>
            </div>
          </div>
          <div className="px-5 py-4 bg-surface">
            <p className="text-sm text-text-secondary leading-relaxed">
              {stock.signalReason}
            </p>
          </div>
        </motion.section>

        {/* Section 2: Is this stock right for you? (Beginner verdict — the key question) */}
        {(() => {
          const bm = BEGINNER_META[stock.beginnerVerdict];
          return (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`rounded-2xl overflow-hidden border ${bm.border}`}
            >
              <div className={`px-5 py-4 ${bm.bg}`}>
                <div className="flex items-center gap-2.5">
                  <span className={bm.color}>{bm.icon}</span>
                  <div>
                    <h3 className={`text-sm font-bold ${bm.color}`}>
                      {bm.label}
                    </h3>
                    <p className="text-[11px] text-text-tertiary mt-0.5">
                      {bm.sublabel}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-5 py-4 bg-surface">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {stock.beginnerVerdictReason}
                </p>
              </div>
            </motion.section>
          );
        })()}

        {/* Section 3: How long should you hold? (Term fit) */}
        {(() => {
          const tm = TERM_FIT_META[stock.termFit];
          return (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="bg-surface rounded-2xl p-5 border border-border"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary mb-3">
                How long should you hold?
              </p>
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`w-8 h-8 rounded-lg ${tm.bg} ${tm.border} border flex items-center justify-center ${tm.color}`}>
                  {tm.icon}
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${tm.color}`}>
                    {tm.label}
                  </h3>
                  <p className="text-[11px] text-text-tertiary">
                    {tm.range}
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {stock.termFitReason}
              </p>
            </motion.section>
          );
        })()}

        {/* Section 4: What's working + What to watch (side by side) */}
        {(stock.whyBuying.length > 0 || stock.whyAvoiding.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="space-y-3"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
              Both sides of the story
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stock.whyBuying.length > 0 && (
                <div className="bg-surface rounded-2xl p-5 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-success-400/15 flex items-center justify-center text-success-500">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      {"What's working"}
                    </h3>
                  </div>
                  <ul className="space-y-2.5">
                    {stock.whyBuying.map((reason, i) => (
                      <li
                        key={i}
                        className="text-[13px] text-text-secondary leading-relaxed pl-3 border-l-2 border-success-400/40"
                      >
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {stock.whyAvoiding.length > 0 && (
                <div className="bg-surface rounded-2xl p-5 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      What to watch out for
                    </h3>
                  </div>
                  <ul className="space-y-2.5">
                    {stock.whyAvoiding.map((reason, i) => (
                      <li
                        key={i}
                        className="text-[13px] text-text-secondary leading-relaxed pl-3 border-l-2 border-red-300/50"
                      >
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Section 5: Understanding the numbers (Key Metrics — teaching section) */}
        {stock.metrics.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-text-primary">
                Understanding the numbers
              </h3>
              <p className="text-[11px] text-text-tertiary mt-0.5">
                Tap any metric to learn what it means and how to use it
              </p>
            </div>
            <div className="space-y-2">
              {stock.metrics.map((metric, i) => {
                const isNA = metric.value === "N/A" || metric.value === "—";
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.34 + i * 0.03 }}
                    className="bg-surface rounded-xl border border-border overflow-hidden cursor-pointer active:scale-[0.995] transition-transform"
                    onClick={() => setExpandedMetric(expandedMetric === i ? null : i)}
                  >
                    <div className="flex items-center justify-between p-4">
                      <span className="text-sm text-text-secondary">{metric.label}</span>
                      <div className="flex items-center gap-2.5">
                        <span className={`text-sm font-bold tabular-nums ${isNA ? "text-text-tertiary" : "text-text-primary"}`}>
                          {metric.value}
                        </span>
                        <motion.div
                          animate={{ rotate: expandedMetric === i ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="w-5 h-5 rounded-full bg-surface-secondary flex items-center justify-center"
                        >
                          <svg
                            width="12"
                            height="12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="text-text-tertiary"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>
                    </div>
                    <AnimatePresence initial={false}>
                      {expandedMetric === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4">
                            <div className="pt-3 border-t border-border">
                              <p className="text-[13px] text-text-secondary leading-relaxed">
                                {metric.explanation}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Section 6: Market stats (quick reference grid) */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="bg-surface rounded-2xl p-5 border border-border"
        >
          <h3 className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-4">
            Market snapshot
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

        {/* Section 7: About the company */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface rounded-2xl p-5 border border-border"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            What does {stock.name} do?
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {stock.about}
          </p>
        </motion.section>

        {/* Section 8: What analysts think */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="bg-primary-50 rounded-2xl p-5 border border-primary-100"
        >
          <h3 className="text-sm font-semibold text-primary-700 mb-2">
            What analysts think
          </h3>
          <p className="text-sm text-primary-800 leading-relaxed">
            {stock.analystSummary}
          </p>
        </motion.section>

        {/* Section 9: Latest news */}
        {stock.news.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44 }}
            className="pb-6"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              In the news
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
          </motion.section>
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
