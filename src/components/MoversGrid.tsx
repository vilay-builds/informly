"use client";

import Link from "next/link";
import { Stock } from "@/lib/content/types";

interface MoversGridProps {
  gainers: Stock[];
  losers: Stock[];
}

function MoverRow({ stock }: { stock: Stock }) {
  const isPositive = stock.change >= 0;
  return (
    <Link
      href={`/stock/${stock.ticker}`}
      className="flex items-center justify-between px-4 py-3 hover:bg-surface-secondary/60 transition-colors"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-text-primary truncate">
          {stock.ticker}
        </p>
        <p className="text-[10px] text-text-tertiary truncate mt-0.5">
          {stock.name}
        </p>
      </div>
      <div className="text-right ml-2">
        <p className="text-[12px] font-semibold text-text-primary tabular-nums">
          ₹{stock.price.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        </p>
        <p
          className={`text-[11px] font-semibold tabular-nums ${
            isPositive ? "text-success-500" : "text-red-500"
          }`}
        >
          {isPositive ? "+" : ""}
          {stock.change}%
        </p>
      </div>
    </Link>
  );
}

export function MoversGrid({ gainers, losers }: MoversGridProps) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-text-primary mb-3">
        Today&apos;s Movers
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border/40">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-success-500">
              Gainers
            </span>
          </div>
          <div className="divide-y divide-border/40">
            {gainers.length > 0 ? (
              gainers.map((s) => <MoverRow key={s.ticker} stock={s} />)
            ) : (
              <p className="text-xs text-text-tertiary p-4 text-center">
                Markets are quiet today
              </p>
            )}
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border/40">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-red-500">
              Losers
            </span>
          </div>
          <div className="divide-y divide-border/40">
            {losers.length > 0 ? (
              losers.map((s) => <MoverRow key={s.ticker} stock={s} />)
            ) : (
              <p className="text-xs text-text-tertiary p-4 text-center">
                No losers today
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
