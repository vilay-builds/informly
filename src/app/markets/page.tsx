"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { useUserPreferences } from "@/lib/userPreferences";
import { useWatchlist } from "@/lib/persistence";
import {
  getStocksByRegion,
  getTopGainers,
  getTopLosers,
} from "@/lib/content/stocks";
import { getSectors } from "@/lib/content/sectors";
import { MarketsSkeleton } from "@/components/skeletons/MarketsSkeleton";
import { WatchlistCarousel } from "@/components/WatchlistCarousel";
import { MoversGrid } from "@/components/MoversGrid";
import { SectorGrid } from "@/components/SectorGrid";
import { fadeInUp, stagger } from "@/lib/motion";

type Region = "us" | "india";

const regions = {
  us: { label: "US", flag: "USD" },
  india: { label: "IN", flag: "INR" },
};

const summaries = {
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
  const { prefs, update, hydrated } = useUserPreferences();
  const [region, setRegion] = useState<Region>("india");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { list: watchlist } = useWatchlist(region);

  useEffect(() => {
    setRegion(prefs.marketRegion);
  }, [prefs.marketRegion]);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  const currentRegion = regions[region];
  const currentSummary = summaries[region];
  const allRegionStocks = getStocksByRegion(region);
  const currentStocks = allRegionStocks.filter((s) =>
    watchlist.includes(s.ticker)
  );

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

      {!hydrated || !loaded ? (
        <MarketsSkeleton />
      ) : (
        <motion.main
          variants={stagger(0.06)}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto px-5 pt-5 space-y-6"
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
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  region === "us" ? "bg-primary-200" : "bg-accent-200"
                }`}
              >
                <svg
                  width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                  className={region === "us" ? "text-primary-700" : "text-accent-700"}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h2
                className={`text-sm font-semibold ${
                  region === "us" ? "text-primary-800" : "text-accent-800"
                }`}
              >
                {currentSummary.title}
              </h2>
            </div>
            <p
              className={`text-sm leading-relaxed ${
                region === "us" ? "text-primary-700" : "text-accent-700"
              }`}
            >
              {currentSummary.explanation}
            </p>
          </motion.section>

          <motion.div variants={fadeInUp}>
            {currentStocks.length === 0 ? (
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
              <WatchlistCarousel stocks={currentStocks} region={region} />
            )}
          </motion.div>

          <motion.div variants={fadeInUp} className="pt-2">
            <MoversGrid
              gainers={getTopGainers(region, 4)}
              losers={getTopLosers(region, 4)}
            />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <SectorGrid sectors={getSectors(region)} />
          </motion.div>
        </motion.main>
      )}

      <BottomNav active="markets" />
    </div>
  );
}
