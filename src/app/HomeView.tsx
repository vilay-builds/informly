"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUserPreferences } from "@/lib/userPreferences";
import { useWatchlist } from "@/lib/persistence";
import { WatchlistCarousel } from "@/components/WatchlistCarousel";
import { MoversGrid } from "@/components/MoversGrid";
import { BottomNav } from "@/components/BottomNav";
import { IconButton } from "@/components/ui";
import { Stock as CatalogStock } from "@/lib/content/types";
import { STARTER_STOCKS } from "@/lib/india";
import { fadeInUp, stagger } from "@/lib/motion";

interface LiteStock {
  ticker: string;
  name: string;
  currency: "$" | "₹";
  price: number;
  change: number;
  changePercent: number;
  dayHigh: number | null;
  dayLow: number | null;
  weekHigh: number | null;
  weekLow: number | null;
  marketCap: number | null;
  peRatio: number | null;
  volume: number | null;
}

interface IndexPoint {
  symbol: string;
  name: string;
  value: number;
  changePercent: number;
}

interface HomeViewProps {
  stocks: LiteStock[];
  marketSummary: { title: string; explanation: string };
  indices: IndexPoint[];
}

function liteToCatalog(s: LiteStock): CatalogStock {
  const fmtCap = (n: number | null): string => {
    if (n == null) return "—";
    if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
    return `₹${n.toLocaleString()}`;
  };
  const fmtVolume = (n: number | null): string => {
    if (n == null) return "—";
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
    return n.toLocaleString();
  };
  return {
    ticker: s.ticker,
    name: s.name,
    region: "india",
    currency: s.currency,
    price: s.price,
    change: Number(s.changePercent.toFixed(2)),
    signal:
      s.changePercent > 1 ? "bullish" : s.changePercent < -1 ? "bearish" : "neutral",
    signalReason: "",
    about: "",
    stats: [
      { label: "Market Cap", value: fmtCap(s.marketCap) },
      { label: "Volume", value: fmtVolume(s.volume) },
      {
        label: "Day Range",
        value: s.dayLow && s.dayHigh
          ? `${s.dayLow.toFixed(2)} – ${s.dayHigh.toFixed(2)}`
          : "—",
      },
      {
        label: "52W Range",
        value: s.weekLow && s.weekHigh
          ? `${s.weekLow.toFixed(2)} – ${s.weekHigh.toFixed(2)}`
          : "—",
      },
    ],
    metrics: [],
    news: [],
    analystSummary: "",
  };
}

function greeting() {
  const hr = new Date().getHours();
  if (hr < 12) return "Good morning";
  if (hr < 17) return "Good afternoon";
  return "Good evening";
}

function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function HomeView({
  stocks,
  marketSummary,
  indices,
}: HomeViewProps) {
  const { prefs } = useUserPreferences();
  const { list: watchlist, toggle } = useWatchlist("india");
  const userName = prefs.name?.split(" ")[0] || "";

  const watched = useMemo(
    () => stocks.filter((s) => watchlist.includes(s.ticker)),
    [stocks, watchlist]
  );
  const carouselStocks = watched.map(liteToCatalog);

  const gainers = useMemo(
    () =>
      [...stocks]
        .filter((s) => s.changePercent > 0)
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, 4)
        .map(liteToCatalog),
    [stocks]
  );
  const losers = useMemo(
    () =>
      [...stocks]
        .filter((s) => s.changePercent < 0)
        .sort((a, b) => a.changePercent - b.changePercent)
        .slice(0, 4)
        .map(liteToCatalog),
    [stocks]
  );

  const isEmpty = watched.length === 0;

  return (
    <div className="min-h-screen pb-24 lg:pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-white/30">
        <div className="max-w-2xl lg:max-w-3xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-text-tertiary truncate">
              {greeting()}
              {userName && `, ${userName}`} · {todayLabel()}
            </p>
            <h1 className="text-xl font-bold text-text-primary font-[family-name:var(--font-display)] leading-tight mt-0.5">
              Markets
            </h1>
          </div>
          <Link href="/search">
            <IconButton variant="surface" label="Search stocks">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </IconButton>
          </Link>
        </div>
      </header>

      <motion.main
        variants={stagger(0.06)}
        initial="hidden"
        animate="visible"
        className="max-w-2xl lg:max-w-3xl mx-auto px-5 pt-6 space-y-8"
      >
        {/* Market mood — calm, branded */}
        <motion.section
          variants={fadeInUp}
          className="rounded-2xl p-5 border bg-gradient-to-br from-primary-50 to-accent-50 border-primary-100/50"
        >
          <div className="flex items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary-200/60 text-primary-800">
              <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Market Pulse
            </span>
            <span className="text-[10px] text-text-tertiary">
              AI · refreshed every 15 min
            </span>
          </div>
          <h2 className="text-base font-bold text-text-primary leading-snug mb-2">
            {marketSummary.title}
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {marketSummary.explanation}
          </p>

          {/* Inline NIFTY + SENSEX strip */}
          {indices.length > 0 && (
            <div className="mt-4 pt-4 border-t border-primary-100/60 flex gap-5 overflow-x-auto hide-scrollbar">
              {indices.slice(0, 4).map((i) => (
                <div key={i.symbol} className="flex-shrink-0">
                  <p className="text-[10px] text-text-tertiary mb-0.5">{i.name}</p>
                  <p className="text-sm font-bold text-text-primary tabular-nums">
                    {i.value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </p>
                  <p
                    className={`text-[11px] font-semibold tabular-nums ${
                      i.changePercent >= 0 ? "text-success-500" : "text-red-500"
                    }`}
                  >
                    {i.changePercent >= 0 ? "+" : ""}
                    {i.changePercent.toFixed(2)}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* WATCHLIST HERO */}
        {isEmpty ? (
          <motion.section variants={fadeInUp}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary">
                Start your watchlist
              </h3>
              <span className="text-[11px] text-text-tertiary">
                Tap to add
              </span>
            </div>
            <div className="bg-surface rounded-2xl border border-border p-5">
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                Pick a few stocks to follow. We&apos;ll show you live prices,
                charts and beginner-friendly insights for each one — right here
                on your home screen.
              </p>
              <div className="space-y-2">
                {STARTER_STOCKS.slice(0, 6).map((s) => {
                  const watching = watchlist.includes(s.ticker);
                  return (
                    <button
                      key={s.ticker}
                      onClick={() => toggle(s.ticker)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors border ${
                        watching
                          ? "border-primary-300 bg-primary-50"
                          : "border-border bg-surface-secondary/50 hover:border-border-hover"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-text-primary">
                            {s.ticker}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-text-tertiary">
                            {s.sector}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary truncate mt-0.5">
                          {s.blurb}
                        </p>
                      </div>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          watching
                            ? "bg-primary-500 text-white"
                            : "bg-surface text-text-tertiary border border-border"
                        }`}
                      >
                        {watching ? (
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <Link
                href="/search"
                className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                Search for any other stock
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.section>
        ) : (
          <motion.div variants={fadeInUp}>
            <WatchlistCarousel stocks={carouselStocks} region="india" />
          </motion.div>
        )}

        {/* Today's movers */}
        <motion.div variants={fadeInUp}>
          <MoversGrid gainers={gainers} losers={losers} />
        </motion.div>
      </motion.main>

      <BottomNav active="markets" />
    </div>
  );
}
