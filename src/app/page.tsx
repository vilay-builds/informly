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

const newsStories = [
  {
    id: "story-1",
    category: "Climate",
    categoryColor: "#22c55e",
    title: "EU passes landmark carbon reduction law affecting global supply chains",
    summary:
      "New regulations will require companies to track and reduce emissions across their entire production process.",
    timeAgo: "3h ago",
    readTime: "4 min",
    source: "Reuters",
    image:
      "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400&q=80",
  },
  {
    id: "story-2",
    category: "Economy",
    categoryColor: "#5b6ef2",
    title:
      "Federal Reserve signals pause on interest rate changes through summer",
    summary:
      "Borrowing costs for homes, cars, and credit cards are likely to stay where they are for the next few months.",
    timeAgo: "5h ago",
    readTime: "3 min",
    source: "AP News",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80",
  },
  {
    id: "story-3",
    category: "Health",
    categoryColor: "#f04e1a",
    title:
      "Breakthrough weight-loss medication shows promise in treating sleep apnea",
    summary:
      "Patients using GLP-1 drugs experienced significant improvements in breathing during sleep.",
    timeAgo: "6h ago",
    readTime: "5 min",
    source: "Nature",
    image:
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&q=80",
  },
  {
    id: "story-4",
    category: "World",
    categoryColor: "#8b5cf6",
    title: "Japan introduces four-day work week pilot for government employees",
    summary:
      "The initiative aims to boost declining birth rates by giving workers more time for family.",
    timeAgo: "8h ago",
    readTime: "3 min",
    source: "BBC",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80",
  },
];

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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Tiny artificial delay so skeleton is visible on first paint
    const t = setTimeout(() => setLoaded(true), 280);
    return () => clearTimeout(t);
  }, []);

  const userName = prefs.name?.split(" ")[0] || "";

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

          <motion.section variants={fadeInUp}>
            <SectionHeader title="Today's Stories" />
            <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
              {newsStories.map((story) => (
                <NewsCard key={story.id} {...story} articleId={story.id} />
              ))}
            </div>
          </motion.section>
        </motion.main>
      )}

      <BottomNav active="feed" />
    </div>
  );
}
