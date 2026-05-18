"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  wrap,
} from "framer-motion";

interface TickerItem {
  ticker: string;
  price: number;
  changePercent: number;
}

interface StockTickerProps {
  region?: "us" | "india";
  speed?: number;
}

function formatPrice(n: number, region: "us" | "india"): string {
  return n.toLocaleString(region === "india" ? "en-IN" : "en-US", {
    maximumFractionDigits: 2,
  });
}

export function StockTicker({
  region = "india",
  speed = 60,
}: StockTickerProps) {
  const [items, setItems] = useState<TickerItem[]>([]);

  const x = useMotionValue(0);
  const draggingRef = useRef(false);
  const trackWidthRef = useRef(0);
  const trackEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/ticker?region=${region}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as { items: TickerItem[] };
        if (!cancelled && data.items?.length) setItems(data.items);
      } catch {
        // silent
      }
    }
    load();
    // Refresh every 2 minutes
    const interval = setInterval(load, 120_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [region]);

  useEffect(() => {
    if (trackEl.current && items.length > 0) {
      trackWidthRef.current = trackEl.current.scrollWidth / 3;
    }
  }, [items, region]);

  useAnimationFrame((_, delta) => {
    if (draggingRef.current || trackWidthRef.current === 0) return;
    const moveBy = (-speed * delta) / 1000;
    const next = wrap(-trackWidthRef.current, 0, x.get() + moveBy);
    x.set(next);
  });

  if (items.length === 0) {
    return (
      <div className="relative overflow-hidden glass border-b border-white/30 py-2.5">
        <div className="text-xs text-text-tertiary text-center">Loading prices…</div>
      </div>
    );
  }

  // Triple-loop so wrap is seamless
  const loop = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden glass border-b border-white/30 py-2.5">
      <motion.div
        ref={trackEl}
        className="flex gap-6 whitespace-nowrap cursor-grab active:cursor-grabbing"
        style={{ x }}
        drag="x"
        dragMomentum={false}
        onDragStart={() => {
          draggingRef.current = true;
        }}
        onDragEnd={() => {
          const wrapped = wrap(-trackWidthRef.current, 0, x.get());
          x.set(wrapped);
          draggingRef.current = false;
        }}
      >
        {loop.map((stock, i) => (
          <div
            key={`${region}-${i}-${stock.ticker}`}
            className="flex items-center gap-1.5 flex-shrink-0 pointer-events-none select-none"
          >
            <span className="text-xs font-semibold text-text-primary">
              {stock.ticker}
            </span>
            <span className="text-xs text-text-secondary tabular-nums">
              {formatPrice(stock.price, region)}
            </span>
            <span
              className={`text-xs font-medium tabular-nums ${
                stock.changePercent >= 0 ? "text-success-500" : "text-red-500"
              }`}
            >
              {stock.changePercent >= 0 ? "+" : ""}
              {stock.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </motion.div>

      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/60 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/60 to-transparent pointer-events-none" />
    </div>
  );
}
