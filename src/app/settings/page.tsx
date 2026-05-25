"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { useTheme } from "@/components/ThemeProvider";
import { themeList } from "@/lib/themes";
import { useUserPreferences } from "@/lib/userPreferences";
import {
  useNotificationPrefs,
  useWatchlist,
  NotificationPrefs,
} from "@/lib/persistence";
import { useToast } from "@/components/Toast";

const NOTIFICATION_OPTIONS: {
  key: keyof NotificationPrefs;
  label: string;
  desc: string;
}[] = [
  { key: "marketAlerts", label: "Market alerts", desc: "When your stocks move significantly" },
  { key: "weeklyDigest", label: "Weekly digest", desc: "What moved on your watchlist this week" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { themeKey, setThemeKey } = useTheme();
  const { prefs, reset } = useUserPreferences();
  const { prefs: notifPrefs, setPref } = useNotificationPrefs();
  const { list: watchlist, remove } = useWatchlist("india");
  const toast = useToast();

  const handleResetOnboarding = () => {
    if (
      window.confirm(
        "Reset onboarding and pick everything again? Your theme and watchlist will stay."
      )
    ) {
      reset();
      router.push("/onboarding");
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <main className="max-w-md mx-auto px-5 pt-8 space-y-8">
        <header className="pb-1">
          <p className="text-xs text-text-tertiary mb-1.5">
            {prefs.name ? `Hi, ${prefs.name.split(" ")[0]}` : "Welcome"}
          </p>
          <h1 className="text-[28px] leading-none font-bold text-text-primary font-[family-name:var(--font-display)]">
            Settings
          </h1>
        </header>

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
                  Following since{" "}
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
                <p className="text-xs text-text-tertiary">Watchlist</p>
                <p className="text-lg font-bold text-text-primary">{watchlist.length}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-text-tertiary">Market</p>
                <p className="text-lg font-bold text-text-primary">India</p>
              </div>
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
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* WATCHLIST */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Your Watchlist
          </h3>
          <div className="bg-surface rounded-2xl p-4 border border-border">
            <p className="text-xs text-text-secondary mb-4">
              Stocks you&apos;re following. Tap the chip to remove.
            </p>
            {watchlist.length === 0 ? (
              <Link
                href="/search"
                className="block text-center py-4 text-xs text-primary-600 font-medium"
              >
                Search and star any stock to add it
              </Link>
            ) : (
              <div className="flex flex-wrap gap-2">
                {watchlist.map((ticker) => (
                  <button
                    key={ticker}
                    onClick={() => {
                      remove(ticker);
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
              <span className="text-xs text-text-tertiary">Nova 0.3.0</span>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
