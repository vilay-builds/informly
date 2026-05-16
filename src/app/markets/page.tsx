"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import Link from "next/link";

type Region = "us" | "india" | "both";

const usIndices = [
  { name: "S&P 500", value: "5,342.18", change: 0.6, points: "+32.01" },
  { name: "NASDAQ", value: "16,891.45", change: 1.2, points: "+200.14" },
  { name: "DOW", value: "39,456.78", change: 0.3, points: "+118.33" },
];

const indiaIndices = [
  { name: "NIFTY 50", value: "23,465.70", change: 0.8, points: "+186.20" },
  { name: "SENSEX", value: "76,892.45", change: 0.7, points: "+532.18" },
  { name: "NIFTY Bank", value: "50,234.10", change: -0.3, points: "-148.55" },
];

const usStocks = [
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
];

const indiaStocks = [
  {
    ticker: "RELIANCE",
    name: "Reliance Industries",
    price: "2,945.30",
    currency: "INR",
    change: 1.4,
    signal: "bullish" as const,
    reason: "Jio subscriber additions beat estimates, retail expansion on track",
    pe: "28.6",
    marketCap: "19.9L Cr",
  },
  {
    ticker: "TCS",
    name: "Tata Consultancy",
    price: "3,712.80",
    currency: "INR",
    change: 0.9,
    signal: "neutral" as const,
    reason: "Steady deal pipeline but slower discretionary spending from US clients",
    pe: "31.2",
    marketCap: "13.4L Cr",
  },
  {
    ticker: "INFY",
    name: "Infosys Ltd.",
    price: "1,456.25",
    currency: "INR",
    change: -0.6,
    signal: "neutral" as const,
    reason: "Guidance maintained but margin pressure from wage hikes expected",
    pe: "25.4",
    marketCap: "6.0L Cr",
  },
  {
    ticker: "HDFCBANK",
    name: "HDFC Bank",
    price: "1,678.90",
    currency: "INR",
    change: 2.1,
    signal: "bullish" as const,
    reason: "Strong credit growth and improving deposit mix post-merger",
    pe: "19.8",
    marketCap: "12.8L Cr",
  },
  {
    ticker: "BHARTIARTL",
    name: "Bharti Airtel",
    price: "1,534.60",
    currency: "INR",
    change: 1.7,
    signal: "bullish" as const,
    reason: "ARPU growth continues after tariff hikes, 5G rollout boosting data usage",
    pe: "76.3",
    marketCap: "9.1L Cr",
  },
  {
    ticker: "ITC",
    name: "ITC Ltd.",
    price: "442.15",
    currency: "INR",
    change: 0.3,
    signal: "neutral" as const,
    reason: "FMCG business improving but cigarette volume growth remains flat",
    pe: "26.1",
    marketCap: "5.5L Cr",
  },
];

const signalConfig = {
  bullish: {
    label: "Bullish",
    color: "text-success-500",
    bg: "bg-success-400/15",
    icon: (
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  bearish: {
    label: "Bearish",
    color: "text-red-500",
    bg: "bg-red-100",
    icon: (
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
  },
  neutral: {
    label: "Neutral",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    icon: (
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      </svg>
    ),
  },
};

const marketSummaries = {
  us: {
    title: "US markets are cautiously optimistic today",
    explanation:
      "Investors are feeling more confident because inflation data came in lower than expected. This means prices aren't rising as fast, which is good news for the economy.",
  },
  india: {
    title: "Indian markets rallied on strong FII inflows",
    explanation:
      "Foreign investors are putting more money into Indian stocks, driven by positive earnings results from banking and IT sectors. The rupee also strengthened slightly against the dollar.",
  },
};

export default function MarketsPage() {
  const [region, setRegion] = useState<Region>("both");

  const showUS = region === "us" || region === "both";
  const showIndia = region === "india" || region === "both";

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-5 py-4">
          <h1 className="text-xl font-bold text-text-primary font-[family-name:var(--font-display)]">
            Markets
          </h1>
          <p className="text-xs text-text-tertiary">Saturday, May 17</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pt-5 space-y-6">
        {/* Region Selector */}
        <div className="flex bg-surface-secondary rounded-xl p-1">
          {[
            { key: "us" as Region, label: "US" },
            { key: "both" as Region, label: "All Markets" },
            { key: "india" as Region, label: "India" },
          ].map((r) => (
            <button
              key={r.key}
              onClick={() => setRegion(r.key)}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                region === r.key
                  ? "bg-surface text-text-primary shadow-sm"
                  : "text-text-tertiary"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Market Summaries */}
        {showUS && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-5 border border-primary-200/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-primary-200 flex items-center justify-center">
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-primary-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h2 className="text-sm font-semibold text-primary-800">
                {marketSummaries.us.title}
              </h2>
            </div>
            <p className="text-sm text-primary-700 leading-relaxed">
              {marketSummaries.us.explanation}
            </p>
          </motion.section>
        )}

        {showIndia && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-accent-50 to-accent-100/50 rounded-2xl p-5 border border-accent-200/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-accent-200 flex items-center justify-center">
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-accent-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h2 className="text-sm font-semibold text-accent-800">
                {marketSummaries.india.title}
              </h2>
            </div>
            <p className="text-sm text-accent-700 leading-relaxed">
              {marketSummaries.india.explanation}
            </p>
          </motion.section>
        )}

        {/* Indices */}
        {showUS && (
          <section>
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              US Indices
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {usIndices.map((index, i) => (
                <motion.div
                  key={index.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-surface rounded-xl p-3 border border-border text-center"
                >
                  <p className="text-[10px] text-text-tertiary mb-1">{index.name}</p>
                  <p className="text-sm font-bold text-text-primary">{index.value}</p>
                  <p className={`text-xs font-medium mt-0.5 ${index.change >= 0 ? "text-success-500" : "text-red-500"}`}>
                    {index.change >= 0 ? "+" : ""}{index.change}%
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {showIndia && (
          <section>
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Indian Indices
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {indiaIndices.map((index, i) => (
                <motion.div
                  key={index.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-surface rounded-xl p-3 border border-border text-center"
                >
                  <p className="text-[10px] text-text-tertiary mb-1">{index.name}</p>
                  <p className="text-sm font-bold text-text-primary">{index.value}</p>
                  <p className={`text-xs font-medium mt-0.5 ${index.change >= 0 ? "text-success-500" : "text-red-500"}`}>
                    {index.change >= 0 ? "+" : ""}{index.change}%
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Watchlists */}
        {showUS && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary">US Watchlist</h3>
              <button className="text-xs font-medium text-primary-500">Edit</button>
            </div>
            <div className="space-y-3">
              {usStocks.map((stock, i) => {
                const signal = signalConfig[stock.signal];
                return (
                  <Link key={stock.ticker} href={`/stock?t=${stock.ticker}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="bg-surface rounded-2xl p-4 border border-border cursor-pointer transition-shadow hover:shadow-md mb-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-sm font-bold text-text-primary">{stock.ticker}</span>
                          <p className="text-xs text-text-tertiary">{stock.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-text-primary">${stock.price}</p>
                          <p className={`text-xs font-medium ${stock.change >= 0 ? "text-success-500" : "text-red-500"}`}>
                            {stock.change >= 0 ? "+" : ""}{stock.change}%
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed mb-2">{stock.reason}</p>
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${signal.bg} ${signal.color}`}>
                          {signal.icon} {signal.label}
                        </span>
                        <span className="text-[10px] text-text-tertiary">P/E {stock.pe}</span>
                        <span className="text-[10px] text-text-tertiary">Cap {stock.marketCap}</span>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {showIndia && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary">India Watchlist</h3>
              <button className="text-xs font-medium text-primary-500">Edit</button>
            </div>
            <div className="space-y-3">
              {indiaStocks.map((stock, i) => {
                const signal = signalConfig[stock.signal];
                return (
                  <motion.div
                    key={stock.ticker}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className="bg-surface rounded-2xl p-4 border border-border cursor-pointer transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm font-bold text-text-primary">{stock.ticker}</span>
                        <p className="text-xs text-text-tertiary">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-text-primary">
                          <span className="text-text-tertiary text-xs mr-0.5">INR</span>
                          {stock.price}
                        </p>
                        <p className={`text-xs font-medium ${stock.change >= 0 ? "text-success-500" : "text-red-500"}`}>
                          {stock.change >= 0 ? "+" : ""}{stock.change}%
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed mb-2">{stock.reason}</p>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${signal.bg} ${signal.color}`}>
                        {signal.icon} {signal.label}
                      </span>
                      <span className="text-[10px] text-text-tertiary">P/E {stock.pe}</span>
                      <span className="text-[10px] text-text-tertiary">Cap {stock.marketCap}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <BottomNav active="markets" />
    </div>
  );
}
