"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button, IconButton } from "@/components/ui";
import { useUserPreferences } from "@/lib/userPreferences";
import { useTheme } from "@/components/ThemeProvider";
import { themeList } from "@/lib/themes";
import { easing } from "@/lib/motion";

const STEPS = ["welcome", "name", "region", "interests", "theme", "reading", "done"] as const;
type Step = (typeof STEPS)[number];

const CATEGORIES = [
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

const READING_MODES = [
  {
    value: 0,
    title: "Beginner",
    desc: "Everyday language, no jargon. Like a friend explaining the news.",
  },
  {
    value: 1,
    title: "Simple",
    desc: "Clear and approachable with a bit more depth.",
  },
  {
    value: 2,
    title: "Standard",
    desc: "Standard news language with terms explained where needed.",
  },
  {
    value: 3,
    title: "Expert",
    desc: "Detailed analysis with full financial and political terminology.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { prefs, update, completeOnboarding, hydrated } = useUserPreferences();
  const { themeKey, setThemeKey } = useTheme();
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [region, setRegion] = useState<"us" | "india">("india");
  const [interests, setInterests] = useState<string[]>([
    "technology",
    "world",
    "economy",
  ]);
  const [reading, setReading] = useState<0 | 1 | 2 | 3>(1);

  // If already onboarded, skip
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
      marketRegion: region,
      interests,
      readingMode: reading,
    });
    completeOnboarding();
    router.replace("/");
  };

  const toggleInterest = (key: string) => {
    setInterests((curr) =>
      curr.includes(key) ? curr.filter((c) => c !== key) : [...curr, key]
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Top bar */}
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
                Welcome to Nova
              </h1>
              <p className="text-base text-text-secondary leading-relaxed mb-10">
                A calmer way to follow the news and the markets — designed to
                help you understand the world without feeling overwhelmed.
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
                We&apos;ll use your name to make Nova feel a bit more personal.
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

          {step === "region" && (
            <motion.div
              key="region"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={easing.spring}
              className="flex-1 flex flex-col max-w-md mx-auto w-full pt-8"
            >
              <h2 className="text-2xl font-bold text-text-primary font-[family-name:var(--font-display)] mb-2">
                Which market do you follow?
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-8">
                Choose your default — you can switch anytime from the Markets
                tab.
              </p>
              <div className="space-y-3">
                {[
                  {
                    key: "india" as const,
                    title: "Indian markets",
                    sub: "NIFTY 50, SENSEX, NSE & BSE listings",
                  },
                  {
                    key: "us" as const,
                    title: "US markets",
                    sub: "S&P 500, NASDAQ, NYSE listings",
                  },
                ].map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setRegion(r.key)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                      region === r.key
                        ? "border-primary-500 bg-primary-50"
                        : "border-border bg-surface hover:border-border-hover"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-semibold text-text-primary">
                          {r.title}
                        </p>
                        <p className="text-xs text-text-tertiary mt-0.5">
                          {r.sub}
                        </p>
                      </div>
                      {region === r.key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center"
                        >
                          <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-auto pb-6 pt-8">
                <Button size="lg" fullWidth onClick={next}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === "interests" && (
            <motion.div
              key="interests"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={easing.spring}
              className="flex-1 flex flex-col max-w-md mx-auto w-full pt-8"
            >
              <h2 className="text-2xl font-bold text-text-primary font-[family-name:var(--font-display)] mb-2">
                What interests you?
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                Pick at least three. Your feed will prioritize these topics.
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const active = interests.includes(cat.key);
                  return (
                    <motion.button
                      key={cat.key}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleInterest(cat.key)}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all border-2 ${
                        active
                          ? "bg-primary-500 text-white border-primary-500"
                          : "bg-surface text-text-secondary border-border hover:border-border-hover"
                      }`}
                    >
                      {cat.label}
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-auto pb-6 pt-8">
                <Button
                  size="lg"
                  fullWidth
                  disabled={interests.length < 3}
                  onClick={next}
                >
                  Continue
                  {interests.length < 3 && (
                    <span className="text-xs opacity-70 ml-2">
                      ({interests.length}/3)
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
                The theme sets the colors and subtle background hue of Nova.
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

          {step === "reading" && (
            <motion.div
              key="reading"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={easing.spring}
              className="flex-1 flex flex-col max-w-md mx-auto w-full pt-8"
            >
              <h2 className="text-2xl font-bold text-text-primary font-[family-name:var(--font-display)] mb-2">
                Default reading mode
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                How should we explain articles to you? You can change this on
                each article.
              </p>
              <div className="space-y-2.5">
                {READING_MODES.map((mode) => {
                  const active = reading === mode.value;
                  return (
                    <button
                      key={mode.value}
                      onClick={() => setReading(mode.value as 0 | 1 | 2 | 3)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                        active
                          ? "border-primary-500 bg-primary-50"
                          : "border-border bg-surface hover:border-border-hover"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-text-primary">
                            {mode.title}
                          </p>
                          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                            {mode.desc}
                          </p>
                        </div>
                        {active && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5"
                          >
                            <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </button>
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
                Your personalized feed is ready. Take a deep breath and dive in
                — we&apos;ll meet you where you are.
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
