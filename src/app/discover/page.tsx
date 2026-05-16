"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { DiscoverCard } from "@/components/DiscoverCard";
import { BottomNav } from "@/components/BottomNav";

const discoverStories = [
  {
    category: "AI & Technology",
    categoryColor: "#7b93f8",
    title: "OpenAI announces new reasoning model that can solve PhD-level problems",
    summary:
      "The latest advancement in AI reasoning could transform how scientists approach complex research challenges. This model can break down multi-step problems that previously stumped even the most advanced systems.",
    source: "The Verge",
    timeAgo: "2h ago",
    gradient: "linear-gradient(160deg, #1a1a2e 0%, #3d42cb 50%, #5b6ef2 100%)",
  },
  {
    category: "Climate",
    categoryColor: "#4ade80",
    title: "EU passes landmark carbon reduction law affecting global supply chains",
    summary:
      "New regulations will require companies to track and reduce emissions across their entire production process. This affects how everyday products are made, shipped, and sold worldwide.",
    source: "Reuters",
    timeAgo: "3h ago",
    gradient: "linear-gradient(160deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  },
  {
    category: "Economy",
    categoryColor: "#fbbf24",
    title: "Federal Reserve signals pause on interest rate changes through summer",
    summary:
      "Borrowing costs for homes, cars, and credit cards are likely to stay where they are for the next few months. Here's what that means for your wallet and the broader economy.",
    source: "AP News",
    timeAgo: "5h ago",
    gradient: "linear-gradient(160deg, #1a1a2e 0%, #2d1b69 50%, #4a1d96 100%)",
  },
  {
    category: "Health",
    categoryColor: "#f87171",
    title: "Breakthrough medication shows promise in treating sleep apnea",
    summary:
      "Researchers found that patients using GLP-1 drugs experienced significant improvements in breathing during sleep, potentially helping millions who suffer from this condition.",
    source: "Nature",
    timeAgo: "6h ago",
    gradient: "linear-gradient(160deg, #1a1a2e 0%, #7f1d1d 50%, #b91c1c 100%)",
  },
  {
    category: "World",
    categoryColor: "#c084fc",
    title: "Japan introduces four-day work week pilot for government employees",
    summary:
      "The initiative aims to boost declining birth rates by giving workers more time for family. If successful, it could reshape work culture across Asia and inspire similar programs globally.",
    source: "BBC",
    timeAgo: "8h ago",
    gradient: "linear-gradient(160deg, #1a1a2e 0%, #312e81 50%, #4c1d95 100%)",
  },
  {
    category: "Business",
    categoryColor: "#fb923c",
    title: "Spotify reaches 700 million users as podcasting strategy pays off",
    summary:
      "The audio streaming giant credits its growth to exclusive podcast deals and AI-powered recommendations that keep users engaged longer than ever before.",
    source: "Bloomberg",
    timeAgo: "10h ago",
    gradient: "linear-gradient(160deg, #1a1a2e 0%, #064e3b 50%, #047857 100%)",
  },
];

export default function DiscoverPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const paginate = (newDirection: number) => {
    const nextIndex = currentIndex + newDirection;
    if (nextIndex >= 0 && nextIndex < discoverStories.length) {
      setDirection(newDirection);
      setCurrentIndex(nextIndex);
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y < -threshold && info.velocity.y < -100) {
      paginate(1);
    } else if (info.offset.y > threshold && info.velocity.y > 100) {
      paginate(-1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? "100%" : "-100%",
      opacity: 0.5,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      y: direction > 0 ? "-100%" : "100%",
      opacity: 0.5,
    }),
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="relative z-50 px-5 pt-4 pb-3 flex items-center justify-between bg-background">
        <h1 className="text-xl font-bold text-text-primary font-[family-name:var(--font-display)]">
          Discover
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-tertiary">
            {currentIndex + 1} / {discoverStories.length}
          </span>
        </div>
      </header>

      {/* Swipeable cards container */}
      <div
        ref={containerRef}
        className="flex-1 relative px-4 pb-20 overflow-hidden"
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragDirectionLock
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-x-4 top-0 bottom-20 touch-none select-none"
            style={{ touchAction: "pan-x" }}
          >
            <DiscoverCard
              {...discoverStories[currentIndex]}
              index={currentIndex}
            />
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {discoverStories.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-6 bg-primary-500"
                  : "w-1.5 bg-text-tertiary/30"
              }`}
            />
          ))}
        </div>
      </div>

      <BottomNav active="discover" />
    </div>
  );
}
