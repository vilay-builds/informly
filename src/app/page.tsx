"use client";

import { motion } from "framer-motion";
import { NewsCard } from "@/components/NewsCard";
import { FeaturedCard } from "@/components/FeaturedCard";
import { MarketCard } from "@/components/MarketCard";
import { BottomNav } from "@/components/BottomNav";

const featuredStory = {
  category: "AI & Technology",
  title: "OpenAI announces new reasoning model that can solve PhD-level problems",
  summary:
    "The latest advancement in AI reasoning could transform how scientists approach complex research challenges.",
  gradient: "linear-gradient(135deg, #5b6ef2 0%, #7b93f8 50%, #a4b8fc 100%)",
  timeAgo: "2h ago",
};

const marketData = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    change: 2.3,
    reason: "Strong iPhone sales in emerging markets",
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    change: 4.1,
    reason: "New AI chip demand exceeds expectations",
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    change: -1.8,
    reason: "Production delays at new factory",
  },
  {
    ticker: "MSFT",
    name: "Microsoft",
    change: 1.2,
    reason: "Cloud revenue growth beats estimates",
  },
];

const newsStories = [
  {
    category: "Climate",
    categoryColor: "#22c55e",
    title: "EU passes landmark carbon reduction law affecting global supply chains",
    summary:
      "New regulations will require companies to track and reduce emissions across their entire production process, impacting how everyday products are made and shipped.",
    timeAgo: "3h ago",
    readTime: "4 min",
    source: "Reuters",
  },
  {
    category: "Economy",
    categoryColor: "#5b6ef2",
    title: "Federal Reserve signals pause on interest rate changes through summer",
    summary:
      "This means borrowing costs for homes, cars, and credit cards are likely to stay where they are for the next few months.",
    timeAgo: "5h ago",
    readTime: "3 min",
    source: "AP News",
  },
  {
    category: "Health",
    categoryColor: "#f04e1a",
    title: "Breakthrough weight-loss medication shows promise in treating sleep apnea",
    summary:
      "Researchers found that patients using GLP-1 drugs experienced significant improvements in breathing during sleep, opening new treatment possibilities.",
    timeAgo: "6h ago",
    readTime: "5 min",
    source: "Nature",
  },
  {
    category: "World",
    categoryColor: "#8b5cf6",
    title: "Japan introduces four-day work week pilot for government employees",
    summary:
      "The initiative aims to boost declining birth rates by giving workers more time for family, and could reshape work culture across Asia.",
    timeAgo: "8h ago",
    readTime: "3 min",
    source: "BBC",
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
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              informly
            </h1>
            <p className="text-xs text-text-tertiary">
              Friday, May 16
            </p>
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

      <motion.main
        variants={stagger}
        initial="initial"
        animate="animate"
        className="max-w-lg mx-auto px-5 pt-5 space-y-6"
      >
        {/* Greeting */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-text-primary">
            Good afternoon ☀️
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Here&apos;s what&apos;s happening in the world today
          </p>
        </motion.section>

        {/* Featured Story */}
        <section>
          <FeaturedCard {...featuredStory} />
        </section>

        {/* Market Movers */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary">
              Market Movers
            </h3>
            <button className="text-xs font-medium text-primary-500">
              See all
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5">
            {marketData.map((stock, i) => (
              <motion.div
                key={stock.ticker}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <MarketCard {...stock} />
              </motion.div>
            ))}
          </div>
        </section>

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

      <BottomNav />
    </div>
  );
}
