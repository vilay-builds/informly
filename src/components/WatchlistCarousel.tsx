"use client";

import { useRef, useState, useMemo, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import * as React from "react";
import { motion, PanInfo, AnimatePresence } from "framer-motion";

// React 19.2 ships ViewTransition under the experimental flag in Next 16.
// It's exported as `ViewTransition` from React but not yet in the typed API.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ViewTransition = (React as any).ViewTransition as React.ComponentType<{
  name?: string;
  children: React.ReactNode;
}>;
import { useRouter } from "next/navigation";
import { Stock } from "@/lib/content/types";
import { Sparkline } from "@/components/Sparkline";
import { easing } from "@/lib/motion";
import { useTheme } from "@/components/ThemeProvider";
import { themes } from "@/lib/themes";

interface WatchlistCarouselProps {
  stocks: Stock[];
  region: "us" | "india";
}

const signalLabel = {
  bullish: "Looking strong",
  bearish: "Use caution",
  neutral: "Steady",
};

// Friendly Indian numbering. Yahoo gives raw market cap in rupees.
function friendlyMarketCap(value: string): string {
  if (!value || value === "—") return "Unknown";
  const m = value.match(/^[₹$]([\d,.]+)\s*([A-Za-z]+)?\s*([A-Za-z]+)?$/);
  if (!m) return value;
  const num = parseFloat(m[1].replace(/,/g, ""));
  const suffix = `${m[2] ?? ""} ${m[3] ?? ""}`.trim().toUpperCase();
  if (suffix.includes("L CR") || suffix === "LCR") {
    return `₹${num.toFixed(1)} Lakh Cr`;
  }
  if (suffix === "CR") {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)} Lakh Cr`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)} Th Cr`;
    return `₹${num.toFixed(0)} Cr`;
  }
  if (suffix === "T") return `₹${num.toFixed(1)} Trillion`;
  if (suffix === "B") return `₹${num.toFixed(1)} Billion`;
  if (suffix === "M") return `₹${num.toFixed(0)} Million`;
  return value;
}

// Beginner-friendly "company size" tier from market cap value.
function sizeTier(value: string): { label: string; tone: "lg" | "md" | "sm" } {
  if (!value || value === "—" || value === "Unknown")
    return { label: "Listed", tone: "sm" };
  if (/lakh\s*cr/i.test(value)) {
    const m = value.match(/([\d.]+)/);
    const lkhCr = m ? parseFloat(m[1]) : 0;
    if (lkhCr >= 5) return { label: "Mega cap", tone: "lg" };
    if (lkhCr >= 1) return { label: "Large cap", tone: "lg" };
  }
  if (/cr/i.test(value)) {
    const m = value.match(/([\d.]+)/);
    const cr = m ? parseFloat(m[1]) : 0;
    if (cr >= 20000) return { label: "Large cap", tone: "lg" };
    if (cr >= 5000) return { label: "Mid cap", tone: "md" };
    return { label: "Small cap", tone: "sm" };
  }
  return { label: "Listed", tone: "sm" };
}

// Fetch real 30-day history for sparklines
function useSparklineData(tickers: string[]) {
  const [data, setData] = useState<Record<string, number[]>>({});
  const tickerKey = tickers.join(",");

  useEffect(() => {
    if (tickers.length === 0) return;
    let cancelled = false;

    // Fetch history for each ticker in parallel
    Promise.all(
      tickers.map(async (ticker) => {
        try {
          const res = await fetch(
            `/api/stocks/history?ticker=${encodeURIComponent(ticker)}&range=1mo`
          );
          if (!res.ok) return { ticker, points: [] };
          const json = (await res.json()) as { data: number[] };
          return { ticker, points: json.data || [] };
        } catch {
          return { ticker, points: [] };
        }
      })
    ).then((results) => {
      if (cancelled) return;
      const map: Record<string, number[]> = {};
      for (const r of results) {
        if (r.points.length > 0) map[r.ticker] = r.points;
      }
      setData(map);
    });

    return () => { cancelled = true; };
  }, [tickerKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return data;
}

export function WatchlistCarousel({ stocks, region }: WatchlistCarouselProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const dragDistance = useRef(0);
  const { themeKey } = useTheme();
  const themeColor = themes[themeKey].primary[600];

  // Fetch real sparkline data for all watchlist tickers
  const sparklineData = useSparklineData(stocks.map((s) => s.ticker));

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    dragDistance.current = Math.abs(info.offset.x);
    const threshold = 60;
    if (info.offset.x < -threshold && index < stocks.length - 1) {
      setIndex(index + 1);
    } else if (info.offset.x > threshold && index > 0) {
      setIndex(index - 1);
    }
    setTimeout(() => {
      dragDistance.current = 0;
    }, 50);
  };

  const formatPrice = (p: number) =>
    p.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  if (stocks.length === 0) return null;

  return (
    <section className="pb-16">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">
          Your Watchlist
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {stocks.slice(0, 8).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === index ? "w-5 bg-primary-500" : "w-1 bg-text-tertiary/40"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-text-tertiary tabular-nums">
            {index + 1}/{stocks.length}
          </span>
        </div>
      </div>

      <div className="relative h-[320px]" style={{ perspective: "1200px" }}>
        <AnimatePresence initial={false}>
          {stocks.map((stock, i) => {
            const offset = i - index;
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            const isPositive = stock.change >= 0;
            const realData = sparklineData[stock.ticker];
            const marketCapStat = stock.stats.find((s) => s.label === "Market Cap");
            const friendlyCap = marketCapStat
              ? friendlyMarketCap(marketCapStat.value)
              : "—";
            const tier = sizeTier(friendlyCap);
            const dayRange = stock.stats.find((s) => s.label === "Day Range");

            return (
              <motion.div
                key={stock.ticker}
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.55}
                onDragEnd={isActive ? handleDragEnd : undefined}
                initial={false}
                animate={{
                  x: offset * 20,
                  y: Math.abs(offset) * 12,
                  scale: 1 - Math.abs(offset) * 0.05,
                  rotate: offset * -2.2,
                  opacity: Math.abs(offset) > 1 ? 0.45 : 1,
                  zIndex: stocks.length - Math.abs(offset),
                }}
                transition={easing.spring}
                whileDrag={{ rotate: 0, scale: 1.02 }}
                onClick={() => {
                  if (!isActive) return;
                  if (dragDistance.current > 8) return;
                  router.push(`/stock/${stock.ticker}`);
                }}
                className="absolute inset-0 cursor-pointer"
              >
                <ViewTransition
                  name={isActive ? `stock-card-${stock.ticker}` : undefined}
                >
                  <div
                    className="h-full rounded-3xl overflow-hidden flex flex-col relative bg-surface border border-border"
                    style={{
                      backgroundImage: `
                        linear-gradient(135deg, color-mix(in srgb, var(--color-primary-500) 5%, transparent), transparent 55%),
                        linear-gradient(315deg, ${
                          isPositive
                            ? "color-mix(in srgb, #22c55e 6%, transparent)"
                            : "color-mix(in srgb, #ef4444 5%, transparent)"
                        }, transparent 60%)
                      `,
                      boxShadow:
                        "0 24px 56px -16px rgba(0,0,0,0.18), 0 6px 16px -6px rgba(0,0,0,0.08)",
                    }}
                  >
                  {/* Header — ticker + name left, signal & fact pills right */}
                  <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-base font-bold text-text-primary tracking-tight">
                          {stock.ticker}
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-secondary text-text-tertiary">
                          {region === "india" ? "NSE" : "NASDAQ"}
                        </span>
                      </div>
                      <p className="text-xs text-text-tertiary truncate">
                        {stock.name}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                          stock.signal === "bullish"
                            ? "bg-success-400/15 text-success-500"
                            : stock.signal === "bearish"
                              ? "bg-red-100 text-red-500"
                              : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {signalLabel[stock.signal]}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-secondary text-text-secondary whitespace-nowrap">
                        {tier.label}
                      </span>
                      {dayRange && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-secondary text-text-secondary whitespace-nowrap tabular-nums">
                          {dayRange.value}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price + change */}
                  <div className="px-5 pb-2">
                    <p className="text-[34px] leading-none font-bold text-text-primary tracking-tight tabular-nums">
                      <span className="text-base text-text-tertiary mr-1 align-baseline">
                        {stock.currency}
                      </span>
                      {formatPrice(stock.price)}
                    </p>
                    <p
                      className={`text-sm font-semibold tabular-nums mt-1.5 ${
                        isPositive ? "text-success-500" : "text-red-500"
                      }`}
                    >
                      {isPositive ? "+" : ""}{stock.change}% today
                    </p>
                  </div>

                  {/* Sparkline fills the rest of the card */}
                  <div className="flex-1 px-5 pt-3 pb-5 flex flex-col justify-end">
                    <div className="flex items-center justify-end mb-1.5">
                      <span className="text-[9px] text-text-tertiary uppercase tracking-wider">
                        Last 30 days
                      </span>
                    </div>
                    <div className="-mx-2">
                      {realData && realData.length > 2 ? (
                        <Sparkline data={realData} isPositive={isPositive} height={110} themeColor={themeColor} />
                      ) : (
                        <div className="h-[110px] flex items-center justify-center">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((j) => (
                              <div
                                key={j}
                                className="w-1.5 h-1.5 rounded-full bg-text-tertiary/30 animate-pulse"
                                style={{ animationDelay: `${j * 150}ms` }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
                </ViewTransition>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {index === 0 && stocks.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: 0.6 }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] text-text-tertiary pointer-events-none whitespace-nowrap"
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Swipe to browse your watchlist
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.div>
        )}
      </div>
    </section>
  );
}
