"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button, IconButton } from "@/components/ui";
import { useUserPreferences } from "@/lib/userPreferences";
import { useWatchlist } from "@/lib/persistence";
import { useTheme } from "@/components/ThemeProvider";
import { themeList } from "@/lib/themes";
import { STARTER_STOCKS } from "@/lib/india";
import { easing } from "@/lib/motion";

const STEPS = ["welcome", "name", "watchlist", "theme", "done"] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingPage() {
  const router = useRouter();
  const { prefs, update, completeOnboarding, hydrated } = useUserPreferences();
  const { themeKey, setThemeKey } = useTheme();
  const { list: watchlist, toggle } = useWatchlist("india");

  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");

  useEffect(() => {
    if (hydrated && prefs.onboardedAt) {
      router.replace("/");
    }
  }, [hydrated, prefs.onboardedAt, router]);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const next = () => {
    const i = STEPS.indexOf(step);
    if (i < STEPS.length - 1) setStep(STEPS[i + 1]);
  };
  const back = () => {
    const i = STEPS.indexOf(step);
    if (i > 0) setStep(STEPS[i - 1]);
  };

  const finish = () => {
    update({
      name: name.trim() || "there",
      marketRegion: "india",
    });
    completeOnboarding();
    router.replace("/");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        {step !== "welcome" && step !== "done" && (
          <IconButton variant="ghost" size="sm" label="Back" onClick={back}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </IconButton>
        )}
        {step !== "welcome" && step !== "done" && (
          <div className="flex-1 h-1 bg-surface-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={easing.spring}
            />
          </div>
        )}
      </div>

      <div className="flex-1 px-5 flex flex-col">
        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={easing.spring}
              className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-8 shadow-lg">
                <span className="text-3xl font-bold text-white font-[family-name:var(--font-display)]">
                  N
                </span>
              </div>
              <h1 className="text-4xl font-bold text-text-primary font-[family-name:var(--font-display)] mb-4 leading-tight">
                The calm way to follow stocks.
              </h1>
              <p className="text-base text-text-secondary leading-relaxed mb-10">
                Build a watchlist of Indian stocks you care about. Tap any one
                to see live charts, plain-language insights, and what really
                matters for a new investor.
              </p>
              <Button size="lg" fullWidth onClick={next}>
                Get started
              </Button>
              <button
                onClick={finish}
                className="mt-4 text-xs font-medium text-text-tertiary hover:text-text-secondary"
              >
                Skip for now
              </button>
            </motion.div>
          )}

          {step === "name" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={easing.spring}
              className="flex-1 flex flex-col max-w-md mx-auto w-full pt-8"
            >
              <h2 className="text-2xl font-bold text-text-primary font-[family-name:var(--font-display)] mb-2">
                What should we call you?
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-8">
                We&apos;ll greet you on the home screen.
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name"
                autoFocus
                className="w-full text-lg font-medium bg-surface border border-border rounded-2xl px-5 py-4 placeholder:text-text-tertiary focus:border-primary-400 outline-none"
              />
              <div className="mt-auto pb-6 pt-8">
                <Button size="lg" fullWidth onClick={next}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === "watchlist" && (
            <motion.div
              key="watchlist"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={easing.spring}
              className="flex-1 flex flex-col max-w-md mx-auto w-full pt-4"
            >
              <h2 className="text-2xl font-bold text-text-primary font-[family-name:var(--font-display)] mb-2">
                Pick your first stocks
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                Tap at least 3 to get started. You can always add more later
                from Search.
              </p>
              <div className="space-y-2 overflow-y-auto -mx-2 px-2">
                {STARTER_STOCKS.map((s) => {
                  const watching = watchlist.includes(s.ticker);
                  return (
                    <button
                      key={s.ticker}
                      onClick={() => toggle(s.ticker)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-xl transition-colors border ${
                        watching
                          ? "border-primary-300 bg-primary-50"
                          : "border-border bg-surface hover:border-border-hover"
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
                            : "bg-surface-secondary text-text-tertiary border border-border"
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
              <div className="mt-auto pb-6 pt-6 bg-gradient-to-t from-background via-background to-transparent">
                <Button
                  size="lg"
                  fullWidth
                  disabled={watchlist.length < 3}
                  onClick={next}
                >
                  Continue
                  {watchlist.length < 3 && (
                    <span className="text-xs opacity-70 ml-2">
                      ({watchlist.length}/3)
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "theme" && (
            <motion.div
              key="theme"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={easing.spring}
              className="flex-1 flex flex-col max-w-md mx-auto w-full pt-8"
            >
              <h2 className="text-2xl font-bold text-text-primary font-[family-name:var(--font-display)] mb-2">
                Pick your mood
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                The theme sets the colors and subtle background hue. Change it
                anytime in Settings.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {themeList.map((t) => {
                  const active = t.key === themeKey;
                  return (
                    <motion.button
                      key={t.key}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setThemeKey(t.key)}
                      className={`rounded-2xl overflow-hidden border-2 ${
                        active ? "border-primary-500" : "border-border"
                      }`}
                    >
                      <div
                        className="h-16"
                        style={{
                          background: `linear-gradient(135deg, ${t.preview[0]}, ${t.preview[1]}, ${t.preview[2]})`,
                        }}
                      />
                      <div className="bg-surface px-3 py-2.5 text-left">
                        <p className="text-sm font-semibold text-text-primary">
                          {t.name}
                        </p>
                        <p className="text-[10px] text-text-tertiary">
                          {t.subtitle}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-auto pb-6 pt-8">
                <Button size="lg" fullWidth onClick={next}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={easing.spring}
              className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto"
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ ...easing.spring, delay: 0.1 }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-8 shadow-lg"
              >
                <svg width="36" height="36" fill="white" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </motion.div>
              <h1 className="text-3xl font-bold text-text-primary font-[family-name:var(--font-display)] mb-4">
                You&apos;re all set{name && `, ${name.split(" ")[0]}`}
              </h1>
              <p className="text-base text-text-secondary leading-relaxed mb-10">
                Your watchlist is ready. Tap any stock to see live charts,
                what the company does, and what to watch out for.
              </p>
              <Button size="lg" fullWidth onClick={finish}>
                Open Nova
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
