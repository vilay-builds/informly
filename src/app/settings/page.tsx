"use client";

import { motion, Reorder } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { useTheme } from "@/components/ThemeProvider";
import { themeList } from "@/lib/themes";
import { useUserPreferences } from "@/lib/userPreferences";
import { useWatchlist } from "@/lib/persistence";
import { useToast } from "@/components/Toast";
import { useTickerPreference } from "@/lib/persistence";

export default function SettingsPage() {
  const router = useRouter();
  const { themeKey, setThemeKey } = useTheme();
  const { prefs, reset } = useUserPreferences();
  const { list: watchlist, remove, reorder } = useWatchlist("india");
  const toast = useToast();
  const { enabled: tickerEnabled, setEnabled: setTickerEnabled } = useTickerPreference();

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
                  {(prefs.name?.[0] || "V").toUpperCase()}
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

        {/* PREFERENCES */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Preferences
          </h3>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <button
              onClick={() => setTickerEnabled(!tickerEnabled)}
              className="w-full flex items-center justify-between p-4 hover:bg-surface-secondary/40 transition-colors"
            >
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">
                  Rolling price ticker
                </p>
                <p className="text-xs text-text-tertiary">
                  Scrolling stock prices at the top of the screen
                </p>
              </div>
              <div
                className={`w-11 h-6 rounded-full relative transition-colors ${
                  tickerEnabled ? "bg-primary-500" : "bg-surface-secondary"
                }`}
              >
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm ${
                    tickerEnabled ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </section>

        {/* WATCHLIST */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Your Watchlist
          </h3>
          <div className="bg-surface rounded-2xl p-2 border border-border">
            {watchlist.length === 0 ? (
              <Link
                href="/search"
                className="block text-center py-4 px-3 text-xs text-primary-600 font-medium"
              >
                Search and star any stock to add it
              </Link>
            ) : (
              <>
                <p className="text-[11px] text-text-secondary px-3 pt-2 pb-2">
                  Drag to reorder. Tap x to remove.
                </p>
                <Reorder.Group
                  axis="y"
                  values={watchlist}
                  onReorder={reorder}
                  className="space-y-1"
                >
                  {watchlist.map((ticker, idx) => (
                    <Reorder.Item
                      key={ticker}
                      value={ticker}
                      whileDrag={{
                        scale: 1.02,
                        boxShadow: "0 10px 30px -8px rgba(0,0,0,0.15)",
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-secondary border border-border cursor-grab active:cursor-grabbing select-none"
                    >
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-text-tertiary flex-shrink-0"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      <span className="text-[10px] text-text-tertiary tabular-nums w-4 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-text-primary flex-1 truncate">
                        {ticker}
                      </span>
                      <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => {
                          remove(ticker);
                          toast.show({
                            message: `${ticker} removed from watchlist`,
                            variant: "success",
                          });
                        }}
                        aria-label={`Remove ${ticker}`}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-text-tertiary hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </>
            )}
          </div>
        </section>

        {/* ABOUT */}
        <section className="pb-6">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            About
          </h3>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
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
              <span className="text-xs text-text-tertiary">Vero 1.0.0</span>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
