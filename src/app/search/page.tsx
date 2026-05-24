"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmptyState, IconButton } from "@/components/ui";
import { fadeInUp, stagger, easing } from "@/lib/motion";
import { STARTER_STOCKS } from "@/lib/india";

interface YahooSearchHit {
  symbol: string;
  ticker: string;
  name: string;
  exchange: string;
  type: string;
  isIndia: boolean;
}

const RECENT_KEY = "nova-recent-searches";

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function pushRecent(q: string) {
  const cur = readRecent();
  const next = [q, ...cur.filter((x) => x !== q)].slice(0, 6);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [hits, setHits] = useState<YahooSearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecent(readRecent());
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 1) {
      setHits([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) return;
        const data = (await res.json()) as { results: YahooSearchHit[] };
        // India-first ordering
        const sorted = [...data.results].sort((a, b) => {
          if (a.isIndia && !b.isIndia) return -1;
          if (!a.isIndia && b.isIndia) return 1;
          return 0;
        });
        setHits(sorted);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => clearTimeout(handle);
  }, [query]);

  const handleQuickSearch = (q: string) => {
    pushRecent(q);
    setRecent(readRecent());
    setQuery(q);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <header className="sticky top-0 z-40 glass-strong border-b border-white/30">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center gap-3">
          <IconButton variant="ghost" size="md" label="Back" onClick={() => router.back()}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </IconButton>
          <div className="flex-1 relative">
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  pushRecent(query.trim());
                  setRecent(readRecent());
                }
              }}
              placeholder="Search any Indian stock…"
              className="w-full bg-surface border border-border rounded-full pl-10 pr-10 py-2.5 text-sm placeholder:text-text-tertiary focus:border-primary-400 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-5 py-6 pb-20">
        <AnimatePresence mode="wait">
          {!query.trim() ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={easing.ease}
              className="space-y-8"
            >
              {recent.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                      Recent
                    </h3>
                    <button
                      onClick={() => {
                        localStorage.removeItem(RECENT_KEY);
                        setRecent([]);
                      }}
                      className="text-xs font-medium text-text-tertiary hover:text-text-secondary"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button
                        key={r}
                        onClick={() => handleQuickSearch(r)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium bg-surface border border-border text-text-secondary hover:border-border-hover"
                      >
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {r}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                  Popular Indian stocks
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {STARTER_STOCKS.slice(0, 8).map((s) => (
                    <Link
                      key={s.ticker}
                      href={`/stock/${s.ticker}`}
                      className="bg-surface border border-border rounded-xl p-3 flex items-center justify-between hover:border-border-hover transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-text-primary">
                          {s.ticker}
                        </p>
                        <p className="text-[11px] text-text-tertiary truncate">
                          {s.name}
                        </p>
                      </div>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-tertiary flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </section>

              <p className="text-[11px] text-text-tertiary text-center leading-relaxed pt-4">
                Type a company name or NSE ticker to find any stock listed
                in India.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial="hidden"
              animate="visible"
              variants={stagger(0.04)}
              className="space-y-3"
            >
              {hits.length === 0 && !loading ? (
                <EmptyState
                  icon={
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                  title="No matches"
                  description={`We couldn't find a stock for "${query}". Try a different name or ticker.`}
                />
              ) : (
                hits.map((h) => (
                  <motion.div key={h.symbol} variants={fadeInUp}>
                    <Link
                      href={`/stock/${h.ticker}`}
                      className="block bg-surface border border-border rounded-2xl p-4 flex items-center justify-between hover:border-border-hover transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-bold text-text-primary">
                            {h.ticker}
                          </p>
                          <span className="text-[10px] uppercase tracking-wider text-text-tertiary px-1.5 py-0.5 rounded bg-surface-secondary">
                            {h.isIndia ? "NSE/BSE" : h.exchange}
                          </span>
                        </div>
                        <p className="text-xs text-text-tertiary truncate">
                          {h.name}
                        </p>
                      </div>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-tertiary flex-shrink-0 ml-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
