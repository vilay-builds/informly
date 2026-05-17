"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getAllArticles, getArticleReadTime } from "@/lib/content/articles";
import { useUserPreferences } from "@/lib/userPreferences";
import { useReadingHistory, computeStreak } from "@/lib/persistence";
import { Pill, IconButton } from "@/components/ui";
import { useRouter } from "next/navigation";
import { fadeInUp, stagger } from "@/lib/motion";

function brandTimeOfDay(): string {
  const hr = new Date().getHours();
  if (hr < 12) return "Morning";
  if (hr < 17) return "Afternoon";
  return "Evening";
}

function todayLong(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function BriefPage() {
  const router = useRouter();
  const { prefs } = useUserPreferences();
  const { history } = useReadingHistory();

  const articles = getAllArticles();
  const headline = articles[0];
  const top = articles.slice(1, 4);
  const quickReads = articles.slice(4, 7);
  const streak = computeStreak(history);
  const userName = prefs.name?.split(" ")[0] || "";

  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-40 glass-strong border-b border-white/30">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
          <IconButton
            variant="ghost"
            size="md"
            label="Back"
            onClick={() => router.back()}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </IconButton>
          <span className="text-xs font-medium text-text-tertiary">
            Daily Brief
          </span>
          <div className="w-9" />
        </div>
      </header>

      <motion.main
        variants={stagger(0.07)}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto px-5 pt-8 space-y-10"
      >
        {/* Hero */}
        <motion.section variants={fadeInUp}>
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-primary-500 mb-2">
            {brandTimeOfDay()} Brief · {todayLong()}
          </p>
          <h1 className="text-[2.25rem] leading-[1.05] font-bold text-text-primary font-[family-name:var(--font-display)] mb-4">
            Here&apos;s what matters today
            {userName ? `, ${userName}` : ""}.
          </h1>
          <p className="text-base text-text-secondary leading-relaxed max-w-lg">
            A small, calm window into the world. Read with intention — we&apos;ve
            picked stories worth your time and skipped the noise.
          </p>
          {streak > 0 && (
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-50 border border-accent-100">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-accent-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              <span className="text-xs font-semibold text-accent-700">
                {streak}-day reading streak
              </span>
            </div>
          )}
        </motion.section>

        {/* Headline story */}
        <motion.section variants={fadeInUp}>
          <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-text-tertiary mb-3">
            The headline
          </p>
          <Link
            href={`/article/${headline.id}`}
            className="block group rounded-3xl overflow-hidden bg-surface border border-border transition-shadow hover:shadow-lg"
          >
            <div
              className="h-56 bg-cover bg-center"
              style={{ backgroundImage: `url(${headline.image})` }}
            />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Pill
                  size="xs"
                  style={{
                    backgroundColor: headline.categoryColor + "18",
                    color: headline.categoryColor,
                  }}
                >
                  {headline.category}
                </Pill>
                <span className="text-[11px] text-text-tertiary">
                  {headline.source} · {getArticleReadTime(headline)} min read
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-text-primary leading-snug mb-3 group-hover:text-primary-600 transition-colors">
                {headline.title}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                {headline.aiSummary}
              </p>
            </div>
          </Link>
        </motion.section>

        {/* Top stories */}
        <motion.section variants={fadeInUp}>
          <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-text-tertiary mb-3">
            What you should know
          </p>
          <div className="space-y-3">
            {top.map((article, i) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="flex gap-4 p-4 rounded-2xl bg-surface border border-border hover:border-border-hover transition-colors items-start"
              >
                <span className="text-2xl font-bold text-text-tertiary tabular-nums w-7 flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <Pill
                    size="xs"
                    className="mb-1.5"
                    style={{
                      backgroundColor: article.categoryColor + "18",
                      color: article.categoryColor,
                    }}
                  >
                    {article.category}
                  </Pill>
                  <h3 className="text-[15px] font-semibold leading-snug text-text-primary mb-1.5 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-text-tertiary line-clamp-2">
                    {article.aiSummary}
                  </p>
                </div>
                <div
                  className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${article.image})` }}
                />
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Market pulse line */}
        <motion.section variants={fadeInUp}>
          <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-text-tertiary mb-3">
            Markets in one line
          </p>
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-5 border border-primary-100">
            <p className="text-base text-text-primary leading-relaxed">
              {prefs.marketRegion === "india"
                ? "Indian markets rallied on strong FII inflows; banking and IT led the way. Nifty +0.8%, Sensex +0.7%."
                : "US markets opened cautiously optimistic on lower inflation prints. S&P +0.6%, NASDAQ +1.2%, DOW +0.3%."}
            </p>
            <Link
              href="/markets"
              className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              View full markets
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </motion.section>

        {/* Quick reads */}
        <motion.section variants={fadeInUp}>
          <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-text-tertiary mb-3">
            Quick reads · under 5 min each
          </p>
          <div className="space-y-2">
            {quickReads.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-surface border border-border hover:border-border-hover transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-1 h-10 rounded-full flex-shrink-0"
                    style={{ background: article.categoryColor }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary line-clamp-1">
                      {article.title}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {article.category} · {getArticleReadTime(article)} min
                    </p>
                  </div>
                </div>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-tertiary flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Closer */}
        <motion.section variants={fadeInUp} className="pt-4 text-center">
          <p className="text-xs text-text-tertiary leading-relaxed max-w-md mx-auto">
            That&apos;s your brief. Come back tomorrow — we&apos;ll have a new
            one ready for you.
          </p>
        </motion.section>
      </motion.main>
    </div>
  );
}
