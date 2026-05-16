"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";

const themes = [
  {
    name: "Dusk",
    subtitle: "Twilight & calm",
    colors: ["#5b6ef2", "#7b93f8", "#a4b8fc"],
    icon: "✨",
  },
  {
    name: "Papaya",
    subtitle: "Warm & bold",
    colors: ["#ff6b35", "#ff8a5c", "#ffb08a"],
    icon: "🍊",
  },
  {
    name: "Forest",
    subtitle: "Fresh & natural",
    colors: ["#059669", "#34d399", "#6ee7b7"],
    icon: "🌿",
  },
  {
    name: "Rose",
    subtitle: "Soft & vivid",
    colors: ["#e11d48", "#fb7185", "#fda4af"],
    icon: "🌸",
  },
  {
    name: "Aurum",
    subtitle: "Rich & golden",
    colors: ["#d97706", "#fbbf24", "#fde68a"],
    icon: "☀️",
  },
  {
    name: "Midnight",
    subtitle: "Dark & dramatic",
    colors: ["#1e1b4b", "#312e81", "#4338ca"],
    icon: "🌙",
  },
];

const categories = [
  { name: "Technology", emoji: "💻", selected: true },
  { name: "Business", emoji: "💼", selected: true },
  { name: "Climate", emoji: "🌍", selected: true },
  { name: "Health", emoji: "🏥", selected: false },
  { name: "Politics", emoji: "🏛️", selected: false },
  { name: "Science", emoji: "🔬", selected: true },
  { name: "Sports", emoji: "⚽", selected: false },
  { name: "Entertainment", emoji: "🎬", selected: false },
  { name: "World", emoji: "🌏", selected: true },
  { name: "Economy", emoji: "📊", selected: true },
];

export default function SettingsPage() {
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState(
    categories.map((c) => c.selected)
  );
  const [understandingLevel, setUnderstandingLevel] = useState(1);

  const toggleCategory = (index: number) => {
    setSelectedCategories((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const levels = ["Beginner", "Simple", "Standard", "Expert"];

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
                <p className="text-xs text-text-tertiary">
                  Reading since May 2026
                </p>
              </div>
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                className="text-text-tertiary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <div className="border-t border-border px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-text-tertiary">Articles read</p>
                <p className="text-lg font-bold text-text-primary">47</p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Day streak</p>
                <p className="text-lg font-bold text-text-primary">12 🔥</p>
              </div>
              <div>
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
                {/* Theme preview */}
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
                    <p className="text-sm font-semibold text-text-primary">
                      {theme.name}
                    </p>
                    <p className="text-[10px] text-text-tertiary">
                      {theme.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{theme.icon}</span>
                    {selectedTheme === i && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center"
                      >
                        <svg
                          width="12"
                          height="12"
                          fill="white"
                          viewBox="0 0 24 24"
                        >
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

        {/* Default Understanding Level */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Default Understanding Level
          </h3>
          <div className="bg-surface rounded-2xl p-4 border border-border">
            <p className="text-xs text-text-secondary mb-4">
              Choose how articles are explained to you by default. You can always
              adjust this per article.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {levels.map((level, i) => (
                <button
                  key={level}
                  onClick={() => setUnderstandingLevel(i)}
                  className={`py-2 px-1 rounded-xl text-xs font-medium transition-all ${
                    understandingLevel === i
                      ? "bg-primary-500 text-white shadow-sm"
                      : "bg-surface-secondary text-text-secondary hover:bg-surface-secondary/80"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
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
                  <span>{cat.emoji}</span>
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
              {["AAPL", "NVDA", "TSLA", "MSFT", "AMZN", "GOOGL", "META", "SPY"].map(
                (ticker) => (
                  <span
                    key={ticker}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-surface-secondary text-text-primary border border-border"
                  >
                    {ticker}
                    <svg
                      width="12"
                      height="12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-text-tertiary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </span>
                )
              )}
              <button className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium text-primary-500 border border-dashed border-primary-300 hover:bg-primary-50 transition-colors">
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add stock
              </button>
            </div>
          </div>
        </section>

        {/* Notification Preferences */}
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
                className={`flex items-center justify-between p-4 ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {item.label}
                  </p>
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
