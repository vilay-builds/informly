"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { NewsCard } from "@/components/NewsCard";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { StockTicker } from "@/components/StockTicker";
import { BottomNav } from "@/components/BottomNav";
import { IconButton, SectionHeader } from "@/components/ui";
import { FeedSkeleton } from "@/components/skeletons/FeedSkeleton";
import { fadeInUp, stagger } from "@/lib/motion";
import { useUserPreferences } from "@/lib/userPreferences";
import { getAllArticles, getArticleReadTime } from "@/lib/content/articles";
import { useReadingHistory } from "@/lib/persistence";

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
          <Link href="/search">
            <IconButton variant="surface" label="Search">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </IconButton>
          </Link>
        </div>
      </header>

      <StockTicker region={prefs.marketRegion} />

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
