"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";

const themes = [
  {
    name: "Dusk",
    subtitle: "Twilight & calm",
    colors: ["#5b6ef2", "#7b93f8", "#a4b8fc"],
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    name: "Papaya",
    subtitle: "Warm & bold",
    colors: ["#ff6b35", "#ff8a5c", "#ffb08a"],
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    name: "Forest",
    subtitle: "Fresh & natural",
    colors: ["#059669", "#34d399", "#6ee7b7"],
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "Rose",
    subtitle: "Soft & vivid",
    colors: ["#e11d48", "#fb7185", "#fda4af"],
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    name: "Aurum",
    subtitle: "Rich & golden",
    colors: ["#d97706", "#fbbf24", "#fde68a"],
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    name: "Midnight",
    subtitle: "Dark & dramatic",
    colors: ["#1e1b4b", "#312e81", "#4338ca"],
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
  },
];

const categories = [
  { name: "Technology", icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, selected: true },
  { name: "Business", icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, selected: true },
  { name: "Climate", icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, selected: true },
  { name: "Health", icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>, selected: false },
  { name: "Politics", icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>, selected: false },
  { name: "Science", icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>, selected: true },
  { name: "Sports", icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, selected: false },
  { name: "Entertainment", icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>, selected: false },
  { name: "World", icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, selected: true },
  { name: "Economy", icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, selected: true },
];

export default function SettingsPage() {
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState(
    categories.map((c) => c.selected)
  );

  const toggleCategory = (index: number) => {
    setSelectedCategories((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-5 py-4">
          <p className="text-sm text-text-tertiary">Good afternoon, Vilay</p>
          <h1 className="text-xl font-bold text-text-primary font-[family-name:var(--font-display)]">
            Settings
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pt-5 space-y-8">
        {/* Profile Section */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Profile
          </h3>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">V</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">Vilay</p>
                <p className="text-xs text-text-tertiary">Reading since May 2026</p>
              </div>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="border-t border-border px-4 py-3 flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-xs text-text-tertiary">Articles read</p>
                <p className="text-lg font-bold text-text-primary">47</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-text-tertiary">Day streak</p>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-lg font-bold text-text-primary">12</p>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-accent-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-text-tertiary">Stocks watched</p>
                <p className="text-lg font-bold text-text-primary">6</p>
              </div>
            </div>
          </div>
        </section>

        {/* Appearance / Themes */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Appearance
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme, i) => (
              <motion.button
                key={theme.name}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedTheme(i)}
                className={`rounded-2xl overflow-hidden border-2 transition-colors ${
                  selectedTheme === i
                    ? "border-primary-500"
                    : "border-border hover:border-border-hover"
                }`}
              >
                <div
                  className="h-20 p-3 flex flex-col justify-between"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]}, ${theme.colors[2]})`,
                  }}
                >
                  <div className="flex gap-1.5">
                    <div className="h-2 w-10 rounded-full bg-white/40" />
                    <div className="h-2 w-6 rounded-full bg-white/25" />
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-2 w-14 rounded-full bg-white/30" />
                    <div className="h-2 w-8 rounded-full bg-white/20" />
                  </div>
                </div>
                <div className="bg-surface px-3 py-2.5 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-text-primary">{theme.name}</p>
                    <p className="text-[10px] text-text-tertiary">{theme.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-text-tertiary">{theme.icon}</span>
                    {selectedTheme === i && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center"
                      >
                        <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>


        {/* News Categories */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Your Interests
          </h3>
          <div className="bg-surface rounded-2xl p-4 border border-border">
            <p className="text-xs text-text-secondary mb-4">
              Choose the topics you care about. Your feed and discover cards will
              prioritize these.
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, i) => (
                <motion.button
                  key={cat.name}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleCategory(i)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all border ${
                    selectedCategories[i]
                      ? "bg-primary-50 text-primary-700 border-primary-200"
                      : "bg-surface-secondary text-text-tertiary border-transparent hover:border-border"
                  }`}
                >
                  <span className={selectedCategories[i] ? "text-primary-500" : "text-text-tertiary"}>{cat.icon}</span>
                  {cat.name}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Stock Watchlist */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Ticker Watchlist
          </h3>
          <div className="bg-surface rounded-2xl p-4 border border-border">
            <p className="text-xs text-text-secondary mb-4">
              These stocks appear in your ticker bar and watchlist.
            </p>
            <div className="flex flex-wrap gap-2">
              {["AAPL", "NVDA", "TSLA", "MSFT", "RELIANCE", "TCS", "HDFCBANK", "INFY"].map(
                (ticker) => (
                  <span
                    key={ticker}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-surface-secondary text-text-primary border border-border"
                  >
                    {ticker}
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                )
              )}
              <button className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium text-primary-500 border border-dashed border-primary-300 hover:bg-primary-50 transition-colors">
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add stock
              </button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="pb-6">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Notifications
          </h3>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            {[
              { label: "Daily brief", desc: "Morning summary of top stories", on: true },
              { label: "Market alerts", desc: "When your stocks move significantly", on: true },
              { label: "Breaking news", desc: "Major world events only", on: false },
              { label: "Weekly digest", desc: "What you missed this week", on: true },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center justify-between p-4 ${i > 0 ? "border-t border-border" : ""}`}
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">{item.label}</p>
                  <p className="text-xs text-text-tertiary">{item.desc}</p>
                </div>
                <div
                  className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                    item.on ? "bg-primary-500" : "bg-surface-secondary"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      item.on ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav active="you" />
    </div>
  );
}
