"use client";

import { motion } from "framer-motion";

interface TickerItem {
  ticker: string;
  price: string;
  change: number;
}

const defaultStocks: TickerItem[] = [
  { ticker: "AAPL", price: "198.45", change: 2.3 },
  { ticker: "NVDA", price: "1,245.80", change: 4.1 },
  { ticker: "TSLA", price: "178.20", change: -1.8 },
  { ticker: "MSFT", price: "442.15", change: 1.2 },
  { ticker: "AMZN", price: "189.30", change: 0.8 },
  { ticker: "GOOGL", price: "176.55", change: -0.4 },
  { ticker: "META", price: "512.70", change: 3.2 },
  { ticker: "SPY", price: "534.20", change: 0.6 },
];

export function StockTicker() {
  const items = [...defaultStocks, ...defaultStocks];

  return (
    <div className="relative overflow-hidden bg-surface border-b border-border/50 py-2.5">
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {items.map((stock, i) => (
          <div key={i} className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-xs font-semibold text-text-primary">
              {stock.ticker}
            </span>
            <span className="text-xs text-text-secondary">{stock.price}</span>
            <span
              className={`text-xs font-medium ${
                stock.change >= 0 ? "text-success-500" : "text-red-500"
              }`}
            >
              {stock.change >= 0 ? "+" : ""}
              {stock.change.toFixed(1)}%
            </span>
          </div>
        ))}
      </motion.div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-surface to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent pointer-events-none" />
    </div>
  );
}
