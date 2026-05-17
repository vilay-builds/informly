"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { useTheme } from "@/components/ThemeProvider";
import { themeList, ColorScheme } from "@/lib/themes";
import Link from "next/link";
import { useUserPreferences } from "@/lib/userPreferences";
import {
  useNotificationPrefs,
  useInterests,
  useWatchlist,
  useReadingHistory,
  computeStreak,
  NotificationPrefs,
} from "@/lib/persistence";
import { useSavedArticles } from "@/lib/savedArticles";
import { useToast } from "@/components/Toast";

const THEME_ICONS: Record<string, React.ReactNode> = {
  dusk: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  papaya: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  forest: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  rose: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  aurum: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  midnight: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
};

const CATEGORY_OPTIONS = [
  { key: "technology", label: "Technology" },
  { key: "business", label: "Business" },
  { key: "climate", label: "Climate" },
  { key: "health", label: "Health" },
  { key: "politics", label: "Politics" },
  { key: "science", label: "Science" },
  { key: "world", label: "World" },
  { key: "economy", label: "Economy" },
  { key: "sports", label: "Sports" },
  { key: "entertainment", label: "Culture" },
];

const NOTIFICATION_OPTIONS: {
  key: keyof NotificationPrefs;
  label: string;
  desc: string;
}[] = [
  { key: "dailyBrief", label: "Daily brief", desc: "Morning summary of top stories" },
  { key: "marketAlerts", label: "Market alerts", desc: "When your stocks move significantly" },
  { key: "breakingNews", label: "Breaking news", desc: "Major world events only" },
  { key: "weeklyDigest", label: "Weekly digest", desc: "What you missed this week" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { themeKey, setThemeKey, colorScheme, setColorScheme } = useTheme();
  const { prefs, reset } = useUserPreferences();
  const { interests, toggle: toggleInterest } = useInterests();
  const { prefs: notifPrefs, setPref } = useNotificationPrefs();
  const { list: usWatchlist, remove: removeUS } = useWatchlist("us");
  const { list: indiaWatchlist, remove: removeIN } = useWatchlist("india");
  const { history } = useReadingHistory();
  const { items: savedItems } = useSavedArticles();
  const toast = useToast();

  const streak = computeStreak(history);
  const allWatchlist = [
    ...usWatchlist.map((t) => ({ ticker: t, region: "us" as const })),
    ...indiaWatchlist.map((t) => ({ ticker: t, region: "india" as const })),
  ];

  const handleResetOnboarding = () => {
    if (
      window.confirm(
        "Reset Nova and run onboarding again? Your saved articles and theme will stay."
      )
    ) {
      reset();
      router.push("/onboarding");
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass-strong border-b border-white/30">
        <div className="max-w-2xl mx-auto px-5 py-4">
          <p className="text-sm text-text-tertiary">
            {prefs.name ? `Hi, ${prefs.name.split(" ")[0]}` : "Welcome"}
          </p>
          <h1 className="text-xl font-bold text-text-primary font-[family-name:var(--font-display)]">
            Settings
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-5 space-y-8">
        {/* PROFILE */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Profile
          </h3>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {(prefs.name?.[0] || "N").toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  {prefs.name || "Welcome"}
                </p>
                <p className="text-xs text-text-tertiary">
                  Reading since{" "}
                  {prefs.onboardedAt
                    ? new Date(prefs.onboardedAt).toLocaleDateString(undefined, {
                        month: "long",
                        year: "numeric",
                      })
                    : "today"}
                </p>
              </div>
            </div>
            <div className="border-t border-border px-4 py-3 flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-xs text-text-tertiary">Articles read</p>
                <p className="text-lg font-bold text-text-primary">{history.length}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-text-tertiary">Day streak</p>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-lg font-bold text-text-primary">{streak}</p>
                  {streak > 0 && (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-accent-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-text-tertiary">Saved</p>
                <p className="text-lg font-bold text-text-primary">{savedItems.length}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SHORTCUTS */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Quick Links
          </h3>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            {[
              { href: "/brief", label: "Daily Brief", desc: "Today's curated stories" },
              { href: "/history", label: "Reading History", desc: "Everything you've read" },
              { href: "/notifications", label: "Notifications", desc: "Inbox of alerts" },
            ].map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3.5 hover:bg-surface-secondary transition-colors ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {link.label}
                  </p>
                  <p className="text-xs text-text-tertiary">{link.desc}</p>
                </div>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        {/* COLOR SCHEME */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Display
          </h3>
          <div className="bg-surface rounded-2xl p-2 border border-border">
            <div className="grid grid-cols-3 gap-1">
              {([
                {
                  key: "light" as ColorScheme,
                  label: "Light",
                  icon: (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ),
                },
                {
                  key: "dark" as ColorScheme,
                  label: "Dark",
                  icon: (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ),
                },
                {
                  key: "system" as ColorScheme,
                  label: "System",
                  icon: (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                },
              ]).map((opt) => {
                const active = colorScheme === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setColorScheme(opt.key);
                      toast.show({
                        message: `Display set to ${opt.label}`,
                        variant: "info",
                      });
                    }}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${
                      active
                        ? "bg-primary-50 text-primary-700"
                        : "text-text-secondary hover:bg-surface-secondary"
                    }`}
                  >
                    {opt.icon}
                    <span className="text-xs font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* APPEARANCE */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Theme
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {themeList.map((theme) => {
              const isActive = theme.key === themeKey;
              return (
                <motion.button
                  key={theme.key}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setThemeKey(theme.key);
                    toast.show({ message: `Theme set to ${theme.name}`, variant: "info" });
                  }}
                  className={`rounded-2xl overflow-hidden border-2 transition-colors ${
                    isActive
                      ? "border-primary-500"
                      : "border-border hover:border-border-hover"
                  }`}
                >
                  <div
                    className="h-20 p-3 flex flex-col justify-between"
                    style={{
                      background: `linear-gradient(135deg, ${theme.preview[0]}, ${theme.preview[1]}, ${theme.preview[2]})`,
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
                      <span className="text-text-tertiary">{THEME_ICONS[theme.key]}</span>
                      {isActive && (
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
              );
            })}
          </div>
        </section>

        {/* INTERESTS */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Your Interests
          </h3>
          <div className="bg-surface rounded-2xl p-4 border border-border">
            <p className="text-xs text-text-secondary mb-4">
              Topics you care about — your feed prioritizes these.
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const active = interests.includes(cat.key);
                return (
                  <motion.button
                    key={cat.key}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleInterest(cat.key)}
                    className={`px-3 py-2 rounded-full text-xs font-medium transition-all border ${
                      active
                        ? "bg-primary-50 text-primary-700 border-primary-200"
                        : "bg-surface-secondary text-text-tertiary border-transparent hover:border-border"
                    }`}
                  >
                    {cat.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* WATCHLIST */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Stock Watchlist
          </h3>
          <div className="bg-surface rounded-2xl p-4 border border-border">
            <p className="text-xs text-text-secondary mb-4">
              These stocks appear in your watchlist and ticker bar.
            </p>
            {allWatchlist.length === 0 ? (
              <p className="text-xs text-text-tertiary text-center py-3">
                No stocks watched yet. Tap the star on any stock detail page.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allWatchlist.map(({ ticker, region }) => (
                  <button
                    key={`${region}-${ticker}`}
                    onClick={() => {
                      if (region === "us") removeUS(ticker);
                      else removeIN(ticker);
                      toast.show({
                        message: `${ticker} removed from watchlist`,
                        variant: "success",
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-surface-secondary text-text-primary border border-border hover:border-red-300 hover:text-red-600 transition-colors"
                  >
                    {ticker}
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* NOTIFICATIONS */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Notifications
          </h3>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            {NOTIFICATION_OPTIONS.map((item, i) => {
              const on = notifPrefs[item.key];
              return (
                <button
                  key={item.key}
                  onClick={() => setPref(item.key, !on)}
                  className={`w-full flex items-center justify-between p-4 hover:bg-surface-secondary/40 transition-colors ${
                    i > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <div className="text-left">
                    <p className="text-sm font-medium text-text-primary">
                      {item.label}
                    </p>
                    <p className="text-xs text-text-tertiary">{item.desc}</p>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full relative transition-colors ${
                      on ? "bg-primary-500" : "bg-surface-secondary"
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm ${
                        on ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ABOUT */}
        <section className="pb-6">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            About
          </h3>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <button className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-surface-secondary">
              <span className="text-sm text-text-primary">Privacy policy</span>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="border-t border-border" />
            <button className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-surface-secondary">
              <span className="text-sm text-text-primary">Terms of service</span>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="border-t border-border" />
            <button
              onClick={handleResetOnboarding}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-surface-secondary"
            >
              <span className="text-sm text-text-primary">Reset onboarding</span>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="border-t border-border" />
            <div className="px-4 py-3.5 flex items-center justify-between">
              <span className="text-sm text-text-tertiary">Version</span>
              <span className="text-xs text-text-tertiary">Nova 0.2.0</span>
            </div>
          </div>
          <p className="text-[11px] text-text-tertiary text-center mt-6 leading-relaxed">
            Made with care for everyone who wants to understand the world
            without feeling overwhelmed.
          </p>
        </section>
      </main>

      <BottomNav active="you" />
    </div>
  );
}
