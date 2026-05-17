"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pill, EmptyState, IconButton } from "@/components/ui";
import { fadeInUp, stagger, easing } from "@/lib/motion";

type ResultType = "article" | "stock" | "topic";

interface Result {
  type: ResultType;
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  href: string;
  image?: string;
}

const MOCK_ARTICLES: Result[] = [
  {
    type: "article",
    id: "a1",
    title: "EU passes landmark carbon reduction law affecting global supply chains",
    subtitle: "Companies must track emissions across their entire production pipeline.",
    meta: "Climate · 3h ago",
    href: "/article",
    image:
      "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=200&q=80",
  },
  {
    type: "article",
    id: "a2",
    title: "Federal Reserve signals pause on interest rate changes through summer",
    subtitle: "Borrowing costs likely to stay where they are for several months.",
    meta: "Economy · 5h ago",
    href: "/article",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&q=80",
  },
  {
    type: "article",
    id: "a3",
    title: "OpenAI announces new reasoning model that can solve PhD-level problems",
    subtitle: "The latest advancement could transform scientific research.",
    meta: "AI · 2h ago",
    href: "/article",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&q=80",
  },
  {
    type: "article",
    id: "a4",
    title: "Japan introduces four-day work week pilot for government employees",
    subtitle: "The initiative aims to boost declining birth rates.",
    meta: "World · 8h ago",
    href: "/article",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&q=80",
  },
];

const MOCK_STOCKS: Result[] = [
  { type: "stock", id: "AAPL", title: "AAPL", subtitle: "Apple Inc.", meta: "+2.3%", href: "/stock?t=AAPL" },
  { type: "stock", id: "NVDA", title: "NVDA", subtitle: "NVIDIA Corp.", meta: "+4.1%", href: "/stock?t=NVDA" },
  { type: "stock", id: "RELIANCE", title: "RELIANCE", subtitle: "Reliance Industries", meta: "+1.4%", href: "/stock?t=RELIANCE" },
  { type: "stock", id: "TSLA", title: "TSLA", subtitle: "Tesla Inc.", meta: "-1.8%", href: "/stock?t=TSLA" },
  { type: "stock", id: "TCS", title: "TCS", subtitle: "Tata Consultancy", meta: "+0.9%", href: "/stock?t=TCS" },
  { type: "stock", id: "MSFT", title: "MSFT", subtitle: "Microsoft", meta: "+1.2%", href: "/stock?t=MSFT" },
];

const MOCK_TOPICS: Result[] = [
  { type: "topic", id: "t1", title: "Artificial Intelligence", subtitle: "84 stories this week", href: "#" },
  { type: "topic", id: "t2", title: "Federal Reserve", subtitle: "32 stories this week", href: "#" },
  { type: "topic", id: "t3", title: "Climate Policy", subtitle: "57 stories this week", href: "#" },
  { type: "topic", id: "t4", title: "Indian Markets", subtitle: "118 stories this week", href: "#" },
];

const TRENDING = [
  "OpenAI",
  "Inflation",
  "Reliance",
  "Tesla",
  "EU climate law",
  "NVIDIA AI chips",
  "Interest rates",
];

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecent(readRecent());
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    const matchAll = [...MOCK_ARTICLES, ...MOCK_STOCKS, ...MOCK_TOPICS].filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle?.toLowerCase().includes(q)
    );
    return {
      articles: matchAll.filter((r) => r.type === "article"),
      stocks: matchAll.filter((r) => r.type === "stock"),
      topics: matchAll.filter((r) => r.type === "topic"),
    };
  }, [query]);

  const handleSearchClick = (q: string) => {
    pushRecent(q);
    setRecent(readRecent());
    setQuery(q);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Header */}
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
              placeholder="Search stories, stocks, topics…"
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
          {!results ? (
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
                    <h3 className="text-sm font-semibold text-text-primary">
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
                        onClick={() => handleSearchClick(r)}
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
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  Trending today
                </h3>
                <div className="flex flex-wrap gap-2">
                  {TRENDING.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleSearchClick(t)}
                      className="px-3 py-2 rounded-full text-xs font-medium bg-primary-50 text-primary-700 hover:bg-primary-100"
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  Popular stocks
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {MOCK_STOCKS.slice(0, 6).map((s) => {
                    const positive = s.meta?.startsWith("+");
                    return (
                      <Link
                        key={s.id}
                        href={s.href}
                        className="bg-surface border border-border rounded-xl p-3 flex items-center justify-between hover:border-border-hover"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-text-primary">
                            {s.title}
                          </p>
                          <p className="text-[11px] text-text-tertiary truncate">
                            {s.subtitle}
                          </p>
                        </div>
                        <Pill
                          variant={positive ? "success" : "danger"}
                          size="xs"
                        >
                          {s.meta}
                        </Pill>
                      </Link>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial="hidden"
              animate="visible"
              variants={stagger(0.04)}
              className="space-y-6"
            >
              {results.stocks.length === 0 &&
              results.articles.length === 0 &&
              results.topics.length === 0 ? (
                <EmptyState
                  icon={
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                  title="No matches"
                  description={`We couldn't find anything for "${query}". Try a different word.`}
                />
              ) : (
                <>
                  {results.stocks.length > 0 && (
                    <section>
                      <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                        Stocks
                      </h3>
                      <div className="space-y-2">
                        {results.stocks.map((s) => {
                          const positive = s.meta?.startsWith("+");
                          return (
                            <motion.div key={s.id} variants={fadeInUp}>
                              <Link
                                href={s.href}
                                className="block bg-surface border border-border rounded-2xl p-4 flex items-center justify-between hover:border-border-hover"
                              >
                                <div>
                                  <p className="text-sm font-bold text-text-primary">
                                    {s.title}
                                  </p>
                                  <p className="text-xs text-text-tertiary">
                                    {s.subtitle}
                                  </p>
                                </div>
                                <Pill
                                  variant={positive ? "success" : "danger"}
                                  size="sm"
                                >
                                  {s.meta}
                                </Pill>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {results.articles.length > 0 && (
                    <section>
                      <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                        Articles
                      </h3>
                      <div className="space-y-2">
                        {results.articles.map((a) => (
                          <motion.div key={a.id} variants={fadeInUp}>
                            <Link
                              href={a.href}
                              className="block bg-surface border border-border rounded-2xl p-4 hover:border-border-hover"
                            >
                              <div className="flex gap-3">
                                {a.image && (
                                  <div
                                    className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                                    style={{ backgroundImage: `url(${a.image})` }}
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-text-primary line-clamp-2 mb-1">
                                    {a.title}
                                  </p>
                                  <p className="text-xs text-text-tertiary line-clamp-1">
                                    {a.subtitle}
                                  </p>
                                  <p className="text-[10px] text-text-tertiary mt-1">
                                    {a.meta}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {results.topics.length > 0 && (
                    <section>
                      <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                        Topics
                      </h3>
                      <div className="space-y-2">
                        {results.topics.map((t) => (
                          <motion.div key={t.id} variants={fadeInUp}>
                            <div className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-text-primary">
                                  #{t.title}
                                </p>
                                <p className="text-xs text-text-tertiary">
                                  {t.subtitle}
                                </p>
                              </div>
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
