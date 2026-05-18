"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { useUserPreferences } from "@/lib/userPreferences";
import { useWatchlist } from "@/lib/persistence";
import { WatchlistCarousel } from "@/components/WatchlistCarousel";
import { MoversGrid } from "@/components/MoversGrid";
import { SectorGrid } from "@/components/SectorGrid";
import { getSectors } from "@/lib/content/sectors";
import { fadeInUp, stagger } from "@/lib/motion";
import { Stock as CatalogStock } from "@/lib/content/types";

type Region = "us" | "india";

interface LiveStockLite {
  ticker: string;
  name: string;
  region: Region;
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

interface MarketsViewProps {
  region: Region;
  stocks: LiveStockLite[];
  marketSummary: { title: string; explanation: string };
}

const regions = {
  us: { label: "US", flag: "USD" },
  india: { label: "IN", flag: "INR" },
};

function liveToCatalog(s: LiveStockLite): CatalogStock {
  const fmtCap = (n: number | null): string => {
    if (n == null) return "—";
    if (s.region === "india") {
      if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
      return `₹${n.toLocaleString()}`;
    }
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    return `$${n.toLocaleString()}`;
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
    region: s.region,
    currency: s.currency,
    price: s.price,
    change: Number(s.changePercent.toFixed(2)),
    signal: s.changePercent > 1 ? "bullish" : s.changePercent < -1 ? "bearish" : "neutral",
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

export default function MarketsView({
  region: initialRegion,
  stocks: serverStocks,
  marketSummary,
}: MarketsViewProps) {
  const { prefs, update } = useUserPreferences();
  const [region, setRegion] = useState<Region>(initialRegion);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [stocks, setStocks] = useState<LiveStockLite[]>(serverStocks);
  const [loading, setLoading] = useState(false);

  const { list: watchlist } = useWatchlist(region);

  // Sync to user's preferred region if it differs
  useEffect(() => {
    if (prefs.marketRegion !== region) {
      setRegion(prefs.marketRegion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs.marketRegion]);

  // Re-fetch live data when region changes client-side
  useEffect(() => {
    if (region === initialRegion) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/stocks?region=${region}`);
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as { stocks: LiveStockLite[] };
        if (!cancelled) setStocks(data.stocks);
      } catch {
        // keep existing
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [region, initialRegion]);

  const currentRegion = regions[region];
  const watched = stocks.filter((s) => watchlist.includes(s.ticker));
  const carouselStocks = watched.map(liveToCatalog);

  const gainers = [...stocks]
    .filter((s) => s.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 4)
    .map(liveToCatalog);

  const losers = [...stocks]
    .filter((s) => s.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 4)
    .map(liveToCatalog);

  const toggleRegion = (r: Region) => {
    setRegion(r);
    update({ marketRegion: r });
    setPickerOpen(false);
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-12">
      <header className="sticky top-0 z-40 glass-strong border-b border-white/30">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary font-[family-name:var(--font-display)]">
              Markets
            </h1>
            <p className="text-xs text-text-tertiary">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setPickerOpen(!pickerOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border text-sm font-medium text-text-primary shadow-sm transition-colors hover:border-border-hover"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {currentRegion.flag}
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {pickerOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setPickerOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 bg-surface rounded-xl border border-border shadow-lg z-50 overflow-hidden min-w-[140px]"
                  >
                    {(Object.entries(regions) as [Region, typeof regions.us][]).map(
                      ([key, r]) => (
                        <button
                          key={key}
                          onClick={() => toggleRegion(key)}
                          className={`flex items-center gap-2 w-full px-4 py-3 text-sm text-left transition-colors ${
                            region === key
                              ? "bg-primary-50 text-primary-700 font-medium"
                              : "text-text-secondary hover:bg-surface-secondary"
                          }`}
                        >
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {r.label} — {r.flag}
                          {region === key && (
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="ml-auto text-primary-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      )
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <motion.main
        variants={stagger(0.06)}
        initial="hidden"
        animate="visible"
        className={`max-w-2xl mx-auto px-5 pt-5 space-y-6 ${loading ? "opacity-60" : ""} transition-opacity`}
      >
        <motion.section
          key={`summary-${region}`}
          variants={fadeInUp}
          className={`rounded-2xl p-5 border ${
            region === "us"
              ? "bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200/50"
              : "bg-gradient-to-br from-accent-50 to-accent-100/50 border-accent-200/50"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                region === "us"
                  ? "bg-primary-200/60 text-primary-800"
                  : "bg-accent-200/60 text-accent-800"
              }`}
            >
              <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Market Summary
            </div>
            <span
              className={`text-[10px] ${
                region === "us" ? "text-primary-700/60" : "text-accent-700/60"
              }`}
            >
              AI · refreshed every 15 min
            </span>
          </div>
          <h2
            className={`text-base font-bold leading-snug mb-2 ${
              region === "us" ? "text-primary-900" : "text-accent-900"
            }`}
          >
            {marketSummary.title}
          </h2>
          <p
            className={`text-sm leading-relaxed ${
              region === "us" ? "text-primary-800" : "text-accent-800"
            }`}
          >
            {marketSummary.explanation}
          </p>
        </motion.section>

        <motion.div variants={fadeInUp}>
          {watched.length === 0 ? (
            <section>
              <h3 className="text-sm font-semibold text-text-primary mb-3">
                Your Watchlist
              </h3>
              <div className="bg-surface rounded-2xl border border-border p-6 text-center">
                <p className="text-sm text-text-secondary mb-3">
                  No stocks in your {region === "us" ? "US" : "India"} watchlist
                </p>
                <p className="text-xs text-text-tertiary">
                  Open any stock and tap the star to add it.
                </p>
              </div>
            </section>
          ) : (
            <WatchlistCarousel stocks={carouselStocks} region={region} />
          )}
        </motion.div>

        <motion.div variants={fadeInUp} className="pt-2">
          <MoversGrid gainers={gainers} losers={losers} />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <SectorGrid sectors={getSectors(region)} />
        </motion.div>
      </motion.main>

      <BottomNav active="markets" />
    </div>
  );
}
