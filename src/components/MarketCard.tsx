"use client";

import { motion } from "framer-motion";

interface MarketCardProps {
  ticker: string;
  name: string;
  change: number;
  reason: string;
}

export function MarketCard({ ticker, name, change, reason }: MarketCardProps) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.97 }}
      className="bg-surface rounded-xl p-4 border border-border min-w-[160px] cursor-pointer
                 transition-shadow hover:shadow-md flex-shrink-0"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-text-primary">{ticker}</span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            isPositive
              ? "bg-success-400/15 text-success-500"
              : "bg-red-100 text-red-500"
          }`}
        >
          {isPositive ? "+" : ""}
          {change.toFixed(1)}%
        </span>
      </div>
      <p className="text-xs text-text-tertiary mb-2 truncate">{name}</p>
      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
        {reason}
      </p>
    </motion.div>
  );
}
