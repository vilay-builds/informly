"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { NewsCard } from "@/components/NewsCard";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { BottomNav } from "@/components/BottomNav";
import { IconButton, SectionHeader } from "@/components/ui";
import { FeedSkeleton } from "@/components/skeletons/FeedSkeleton";
import { fadeInUp, stagger } from "@/lib/motion";
import { useUserPreferences } from "@/lib/userPreferences";
import { getAllArticles, getArticleReadTime } from "@/lib/content/articles";
import { useReadingHistory } from "@/lib/persistence";
import { useNotifications } from "@/lib/notifications";

function greeting() {
  const hr = new Date().getHours();
  if (hr < 12) return "Good morning";
  if (hr < 17) return "Good afternoon";
  return "Good evening";
}

function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function Home() {
  const { prefs, hydrated } = useUserPreferences();
  const { history } = useReadingHistory();
  const { unreadCount } = useNotifications();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 320);
    return () => clearTimeout(t);
  }, []);

  const userName = prefs.name?.split(" ")[0] || "";

  const articles = getAllArticles();
  // Continue reading = articles in history not yet "completed"
  const continueReading = history
    .filter((h) => h.progress < 0.9)
    .slice(0, 2)
    .map((h) => articles.find((a) => a.id === h.id))
    .filter(Boolean);

  // Skip articles already in featured carousel (top 5)
  const todayStories = articles.slice(5);

  return (
    <div className="min-h-screen pb-24 lg:pb-12">
      <header className="sticky top-0 z-40 glass-strong border-b border-white/30">
        <div className="max-w-2xl lg:max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight font-[family-name:var(--font-display)] lg:hidden">
              Nova
            </h1>
            <p className="text-xs text-text-tertiary lg:hidden">
              {todayLabel()}
            </p>
            <div className="hidden lg:block">
              <p className="text-xs text-text-tertiary">{todayLabel()}</p>
              <h1 className="text-lg font-semibold text-text-primary">
                Your news today
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/notifications">
              <IconButton variant="surface" label="Notifications" className="relative">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[color:var(--color-surface)]" />
                )}
              </IconButton>
            </Link>
            <Link href="/search">
              <IconButton variant="surface" label="Search">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </IconButton>
            </Link>
          </div>
        </div>
      </header>

      {!hydrated || !loaded ? (
        <FeedSkeleton />
      ) : (
        <motion.main
          variants={stagger(0.08)}
          initial="hidden"
          animate="visible"
          className="max-w-2xl lg:max-w-3xl mx-auto px-5 pt-5 space-y-10"
        >
          <motion.section variants={fadeInUp}>
            <p className="text-sm text-text-tertiary">
              {greeting()}
              {userName && `, ${userName}`}
            </p>
            <h2 className="text-2xl font-bold text-text-primary font-[family-name:var(--font-display)]">
              Your News Feed
            </h2>
          </motion.section>

          {/* Daily Brief CTA */}
          <motion.section variants={fadeInUp}>
            <Link
              href="/brief"
              className="block rounded-2xl p-5 bg-gradient-to-br from-primary-500 to-primary-700 text-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white blur-3xl" />
                <div className="absolute -left-12 -bottom-16 w-44 h-44 rounded-full bg-primary-300 blur-3xl" />
              </div>
              <div className="relative">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 mb-1.5">
                  Daily Brief
                </p>
                <h3 className="text-xl font-bold leading-tight mb-1.5 font-[family-name:var(--font-display)]">
                  Today&apos;s 5 stories that matter
                </h3>
                <p className="text-sm text-white/80 leading-relaxed mb-3 max-w-md">
                  A small, calm window into the world — curated for the next 5
                  minutes of your day.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  Read the brief
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.section>

          <motion.div variants={fadeInUp}>
            <FeaturedCarousel />
          </motion.div>

          {continueReading.length > 0 && (
            <motion.section variants={fadeInUp}>
              <SectionHeader
                title="Continue reading"
                subtitle="Pick up where you left off"
              />
              <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
                {continueReading.map(
                  (story) =>
                    story && (
                      <NewsCard
                        key={story.id}
                        articleId={story.id}
                        category={story.category}
                        categoryColor={story.categoryColor}
                        title={story.title}
                        summary={story.aiSummary}
                        timeAgo={story.timeAgo}
                        readTime={`${getArticleReadTime(story)} min`}
                        source={story.source}
                        image={story.image}
                      />
                    )
                )}
              </div>
            </motion.section>
          )}

          <motion.section variants={fadeInUp}>
            <SectionHeader title="Today's Stories" />
            <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
              {todayStories.map((story) => (
                <NewsCard
                  key={story.id}
                  articleId={story.id}
                  category={story.category}
                  categoryColor={story.categoryColor}
                  title={story.title}
                  summary={story.aiSummary}
                  timeAgo={story.timeAgo}
                  readTime={`${getArticleReadTime(story)} min`}
                  source={story.source}
                  image={story.image}
                />
              ))}
            </div>
          </motion.section>
        </motion.main>
      )}

      <BottomNav active="feed" />
    </div>
  );
}
