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
      className="flex items-center justify-between px-3 py-2.5 hover:bg-surface-secondary/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-text-primary truncate">
          {stock.ticker}
        </p>
        <p className="text-[10px] text-text-tertiary truncate">{stock.name}</p>
      </div>
      <div className="text-right ml-2">
        <p className="text-xs font-semibold text-text-primary tabular-nums">
          {stock.currency}
          {stock.price.toLocaleString(
            stock.region === "india" ? "en-IN" : "en-US",
            { maximumFractionDigits: 0 }
          )}
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
          <div className="flex items-center gap-1.5 px-3 py-2 bg-success-400/8 border-b border-border">
            <svg
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-success-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-success-500">
              Gainers
            </span>
          </div>
          <div className="divide-y divide-border">
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
          <div className="flex items-center gap-1.5 px-3 py-2 bg-red-50 border-b border-border">
            <svg
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
              />
            </svg>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-red-500">
              Losers
            </span>
          </div>
          <div className="divide-y divide-border">
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
