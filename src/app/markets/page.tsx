"use client";

import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import Link from "next/link";

const marketSummary = {
  title: "Markets are cautiously optimistic today",
  explanation:
    "Investors are feeling more confident because inflation data came in lower than expected. This means prices aren't rising as fast, which is good news for the economy.",
  sentiment: "positive" as const,
};

const indices = [
  { name: "S&P 500", value: "5,342.18", change: 0.6, points: "+32.01" },
  { name: "NASDAQ", value: "16,891.45", change: 1.2, points: "+200.14" },
  { name: "DOW", value: "39,456.78", change: 0.3, points: "+118.33" },
];

const watchlist = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: "198.45",
    change: 2.3,
    signal: "bullish" as const,
    reason: "Strong iPhone sales in emerging markets driving revenue growth",
    pe: "32.4",
    marketCap: "3.05T",
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    price: "1,245.80",
    change: 4.1,
    signal: "bullish" as const,
    reason: "AI chip demand continues to exceed supply, pricing power remains strong",
    pe: "68.2",
    marketCap: "3.07T",
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    price: "178.20",
    change: -1.8,
    signal: "bearish" as const,
    reason: "Production delays at Berlin factory and increased competition in China",
    pe: "45.1",
    marketCap: "567B",
  },
  {
    ticker: "MSFT",
    name: "Microsoft",
    price: "442.15",
    change: 1.2,
    signal: "bullish" as const,
    reason: "Azure cloud revenue beat estimates, Copilot AI adoption accelerating",
    pe: "36.8",
    marketCap: "3.29T",
  },
  {
    ticker: "AMZN",
    name: "Amazon",
    price: "189.30",
    change: 0.8,
    signal: "neutral" as const,
    reason: "AWS growth steady but retail margins under pressure from logistics costs",
    pe: "58.3",
    marketCap: "1.97T",
  },
  {
    ticker: "META",
    name: "Meta Platforms",
    price: "512.70",
    change: 3.2,
    signal: "bullish" as const,
    reason: "Ad revenue surging as Reels monetization improves across Instagram and Facebook",
    pe: "27.1",
    marketCap: "1.30T",
  },
];

const signalConfig = {
  bullish: { label: "Bullish", color: "text-success-500", bg: "bg-success-400/15", emoji: "📈" },
  bearish: { label: "Bearish", color: "text-red-500", bg: "bg-red-100", emoji: "📉" },
  neutral: { label: "Neutral", color: "text-yellow-600", bg: "bg-yellow-100", emoji: "➡️" },
};

export default function MarketsPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-5 py-4">
          <h1 className="text-xl font-bold text-text-primary font-[family-name:var(--font-display)]">
            Markets
          </h1>
          <p className="text-xs text-text-tertiary">
            Saturday, May 17
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pt-5 space-y-6">
        {/* Market Summary */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-5 border border-primary-200/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">
              {marketSummary.sentiment === "positive" ? "😊" : "😟"}
            </span>
            <h2 className="text-sm font-semibold text-primary-800">
              {marketSummary.title}
            </h2>
          </div>
          <p className="text-sm text-primary-700 leading-relaxed">
            {marketSummary.explanation}
          </p>
        </motion.section>

        {/* Indices */}
        <section>
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Major Indices
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {indices.map((index, i) => (
              <motion.div
                key={index.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface rounded-xl p-3 border border-border text-center"
              >
                <p className="text-[10px] text-text-tertiary mb-1">
                  {index.name}
                </p>
                <p className="text-sm font-bold text-text-primary">
                  {index.value}
                </p>
                <p
                  className={`text-xs font-medium mt-0.5 ${
                    index.change >= 0 ? "text-success-500" : "text-red-500"
                  }`}
                >
                  {index.change >= 0 ? "+" : ""}
                  {index.change}%
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Watchlist */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary">
              Your Watchlist
            </h3>
            <button className="text-xs font-medium text-primary-500">
              Edit
            </button>
          </div>
          <div className="space-y-3">
            {watchlist.map((stock, i) => {
              const signal = signalConfig[stock.signal];
              return (
                <Link key={stock.ticker} href={`/stock?t=${stock.ticker}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className="bg-surface rounded-2xl p-4 border border-border cursor-pointer
                               transition-shadow hover:shadow-md mb-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="text-sm font-bold text-text-primary">
                            {stock.ticker}
                          </span>
                          <p className="text-xs text-text-tertiary">
                            {stock.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-text-primary">
                          ${stock.price}
                        </p>
                        <p
                          className={`text-xs font-medium ${
                            stock.change >= 0
                              ? "text-success-500"
                              : "text-red-500"
                          }`}
                        >
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change}%
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed mb-2">
                      {stock.reason}
                    </p>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${signal.bg} ${signal.color}`}
                      >
                        {signal.emoji} {signal.label}
                      </span>
                      <span className="text-[10px] text-text-tertiary">
                        P/E {stock.pe}
                      </span>
                      <span className="text-[10px] text-text-tertiary">
                        Cap {stock.marketCap}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <BottomNav active="markets" />
    </div>
  );
}
