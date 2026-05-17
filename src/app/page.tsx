"use client";

import { motion } from "framer-motion";
import { NewsCard } from "@/components/NewsCard";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { StockTicker } from "@/components/StockTicker";
import { BottomNav } from "@/components/BottomNav";

const newsStories = [
  {
    category: "Climate",
    categoryColor: "#22c55e",
    title: "EU passes landmark carbon reduction law affecting global supply chains",
    summary:
      "New regulations will require companies to track and reduce emissions across their entire production process.",
    timeAgo: "3h ago",
    readTime: "4 min",
    source: "Reuters",
    image: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400&q=80",
  },
  {
    category: "Economy",
    categoryColor: "#5b6ef2",
    title: "Federal Reserve signals pause on interest rate changes through summer",
    summary:
      "Borrowing costs for homes, cars, and credit cards are likely to stay where they are for the next few months.",
    timeAgo: "5h ago",
    readTime: "3 min",
    source: "AP News",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80",
  },
  {
    category: "Health",
    categoryColor: "#f04e1a",
    title: "Breakthrough weight-loss medication shows promise in treating sleep apnea",
    summary:
      "Patients using GLP-1 drugs experienced significant improvements in breathing during sleep.",
    timeAgo: "6h ago",
    readTime: "5 min",
    source: "Nature",
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&q=80",
  },
  {
    category: "World",
    categoryColor: "#8b5cf6",
    title: "Japan introduces four-day work week pilot for government employees",
    summary:
      "The initiative aims to boost declining birth rates by giving workers more time for family.",
    timeAgo: "8h ago",
    readTime: "3 min",
    source: "BBC",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80",
  },
];

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-white/30">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight font-[family-name:var(--font-display)]">
              Nova
            </h1>
            <p className="text-xs text-text-tertiary">Saturday, May 17</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full bg-surface-secondary flex items-center justify-center"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.button>
        </div>
      </header>

      {/* Stock Ticker */}
      <StockTicker />

      <motion.main
        variants={stagger}
        initial="initial"
        animate="animate"
        className="max-w-lg mx-auto px-5 pt-5 space-y-10"
      >
        {/* Greeting */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-text-tertiary">
            Good afternoon, Vilay
          </p>
          <h2 className="text-2xl font-bold text-text-primary font-[family-name:var(--font-display)]">
            Your News Feed
          </h2>
        </motion.section>

        {/* Featured Carousel */}
        <FeaturedCarousel />

        {/* Today's Stories */}
        <section>
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Today&apos;s Stories
          </h3>
          <div className="space-y-3">
            {newsStories.map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                <NewsCard {...story} />
              </motion.div>
            ))}
          </div>
        </section>
      </motion.main>

      <BottomNav active="feed" />
    </div>
  );
}
