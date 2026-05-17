"use client";

import { useRef, useState, useMemo } from "react";
import { motion, PanInfo, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Stock } from "@/lib/content/types";
import { Sparkline } from "@/components/Sparkline";
import { generateChartData } from "@/components/StockChart";
import { easing } from "@/lib/motion";

interface WatchlistCarouselProps {
  stocks: Stock[];
  region: "us" | "india";
}

const signalLabel = {
  bullish: "Bullish",
  bearish: "Bearish",
  neutral: "Neutral",
};

export function WatchlistCarousel({ stocks, region }: WatchlistCarouselProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const wasDragging = useRef(false);

  // Pre-compute sparkline data once for each stock
  const chartData = useMemo(
    () =>
      stocks.map((s) => {
        const totalChange = (s.change / 100) * 3.2; // ~1 month drift
        const startPrice = s.price / (1 + totalChange);
        return generateChartData(startPrice, s.price, 30, 0.012);
      }),
    [stocks]
  );

  const handleDragStart = () => {
    wasDragging.current = true;
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 60;
    if (info.offset.x < -threshold && index < stocks.length - 1) {
      setIndex(index + 1);
    } else if (info.offset.x > threshold && index > 0) {
      setIndex(index - 1);
    }
    setTimeout(() => {
      wasDragging.current = false;
    }, 100);
  };

  const formatPrice = (p: number, currency: "$" | "₹") =>
    currency === "₹"
      ? p.toLocaleString("en-IN", { maximumFractionDigits: 2 })
      : p.toLocaleString("en-US", { maximumFractionDigits: 2 });

  if (stocks.length === 0) return null;

  return (
    <section>
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

      <div
        className="relative h-[320px]"
        style={{ perspective: "1200px" }}
      >
        <AnimatePresence initial={false}>
          {stocks.map((stock, i) => {
            const offset = i - index;
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            const isPositive = stock.change >= 0;
            const data = chartData[i];

            return (
              <motion.div
                key={stock.ticker}
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.55}
                onDragStart={isActive ? handleDragStart : undefined}
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
                  if (wasDragging.current) return;
                  router.push(`/stock/${stock.ticker}`);
                }}
                className="absolute inset-0 cursor-pointer"
              >
                <div
                  className="h-full rounded-3xl bg-surface border border-border overflow-hidden flex flex-col"
                  style={{
                    boxShadow:
                      "0 24px 56px -16px rgba(0,0,0,0.18), 0 6px 16px -6px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* Header */}
                  <div className="px-5 pt-5 pb-3 flex items-start justify-between">
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
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        stock.signal === "bullish"
                          ? "bg-success-400/15 text-success-500"
                          : stock.signal === "bearish"
                            ? "bg-red-100 text-red-500"
                            : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {signalLabel[stock.signal]}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="px-5 pb-2 flex items-baseline justify-between">
                    <div>
                      <p className="text-3xl font-bold text-text-primary tracking-tight tabular-nums">
                        <span className="text-lg text-text-tertiary mr-0.5">
                          {stock.currency}
                        </span>
                        {formatPrice(stock.price, stock.currency)}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm font-semibold tabular-nums ${
                        isPositive ? "text-success-500" : "text-red-500"
                      }`}
                    >
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        {isPositive ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                          />
                        )}
                      </svg>
                      {isPositive ? "+" : ""}
                      {stock.change}%
                    </div>
                  </div>

                  {/* Sparkline */}
                  <div className="flex-1 px-2 pb-2 pt-1 relative">
                    <Sparkline data={data} isPositive={isPositive} height={100} />
                    <span className="absolute right-5 top-2 text-[10px] text-text-tertiary font-medium">
                      30 days
                    </span>
                  </div>

                  {/* Stats grid */}
                  <div className="px-5 py-3 border-t border-border grid grid-cols-3 gap-3">
                    {stock.stats.slice(0, 3).map((stat) => (
                      <div key={stat.label} className="min-w-0">
                        <p className="text-[10px] text-text-tertiary truncate mb-0.5">
                          {stat.label}
                        </p>
                        <p className="text-xs font-semibold text-text-primary tabular-nums truncate">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* CTA hint */}
                  <div className="px-5 py-3 bg-surface-secondary/60 flex items-center justify-between">
                    <span className="text-[11px] text-text-tertiary">
                      Tap for full details
                    </span>
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-text-tertiary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Swipe hint — only on first card */}
        {index === 0 && stocks.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: 0.6 }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] text-text-tertiary pointer-events-none"
          >
            <svg
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Swipe to browse your watchlist
            <svg
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </motion.div>
        )}
      </div>
    </section>
  );
}
