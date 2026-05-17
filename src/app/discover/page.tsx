"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import Link from "next/link";

interface Card {
  category: string;
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  bg: string;
  textColor: string;
  accentColor: string;
}

const cards: Card[] = [
  {
    category: "AI & Technology",
    title: "OpenAI announces new reasoning model that can solve PhD-level problems",
    summary:
      "The latest advancement in AI reasoning could transform how scientists approach complex research challenges. This model can break down multi-step problems that previously stumped even the most advanced systems.",
    source: "The Verge",
    timeAgo: "2h ago",
    bg: "#fef3c7",
    textColor: "#451a03",
    accentColor: "#a16207",
  },
  {
    category: "Climate",
    title: "EU passes landmark carbon reduction law affecting global supply chains",
    summary:
      "New regulations will require companies to track and reduce emissions across their entire production process. This affects how everyday products are made and shipped worldwide.",
    source: "Reuters",
    timeAgo: "3h ago",
    bg: "#dcfce7",
    textColor: "#14532d",
    accentColor: "#15803d",
  },
  {
    category: "Markets",
    title: "Federal Reserve signals pause on interest rate changes through summer",
    summary:
      "This means borrowing costs for homes, cars, and credit cards are likely to stay where they are for the next few months. Markets are responding cautiously to the news.",
    source: "Bloomberg",
    timeAgo: "5h ago",
    bg: "#dbeafe",
    textColor: "#1e3a8a",
    accentColor: "#1d4ed8",
  },
  {
    category: "Health",
    title: "Breakthrough weight-loss medication shows promise in treating sleep apnea",
    summary:
      "Researchers found that patients using GLP-1 drugs experienced significant improvements in breathing during sleep, opening new treatment possibilities for millions.",
    source: "Nature",
    timeAgo: "6h ago",
    bg: "#fce7f3",
    textColor: "#831843",
    accentColor: "#be185d",
  },
  {
    category: "World",
    title: "Japan introduces four-day work week pilot for government employees",
    summary:
      "The initiative aims to boost declining birth rates by giving workers more time for family, and could reshape work culture across Asia.",
    source: "BBC",
    timeAgo: "8h ago",
    bg: "#e9d5ff",
    textColor: "#581c87",
    accentColor: "#7e22ce",
  },
  {
    category: "Business",
    title: "Tesla's robotaxi service launches in three US cities this summer",
    summary:
      "Riders in Austin, Phoenix, and Las Vegas will be the first to hail fully autonomous Tesla rides through the company's app.",
    source: "TechCrunch",
    timeAgo: "12h ago",
    bg: "#fed7aa",
    textColor: "#7c2d12",
    accentColor: "#c2410c",
  },
];

export default function DiscoverPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const constraintsRef = useRef(null);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 60;
    if (info.offset.x < -threshold && activeIndex < cards.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (info.offset.x > threshold && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <header className="relative z-30 px-5 pt-4 pb-3 flex items-center justify-between glass-strong border-b border-white/30">
        <div>
          <p className="text-xs text-text-tertiary">Swipe to explore</p>
          <h1 className="text-xl font-bold text-text-primary font-[family-name:var(--font-display)]">
            Discover
          </h1>
        </div>
        <div className="flex items-center gap-1.5">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === activeIndex
                  ? "w-6 bg-text-primary"
                  : "w-1 bg-text-tertiary/40"
              }`}
            />
          ))}
        </div>
      </header>

      <div
        ref={constraintsRef}
        className="flex-1 relative overflow-hidden flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        {/* Stacked Cards */}
        <AnimatePresence initial={false}>
          {cards.map((card, i) => {
            const offset = i - activeIndex;
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            return (
              <motion.div
                key={i}
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={isActive ? handleDragEnd : undefined}
                initial={false}
                animate={{
                  x: offset * 24,
                  y: Math.abs(offset) * 16,
                  scale: 1 - Math.abs(offset) * 0.06,
                  rotate: offset * -3,
                  opacity: Math.abs(offset) > 1 ? 0.5 : 1,
                  zIndex: cards.length - Math.abs(offset),
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                whileDrag={{ rotate: 0, scale: 1.02 }}
                className="absolute w-[88%] max-w-md h-[72%] rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
                style={{
                  background: card.bg,
                  boxShadow:
                    "0 30px 60px -15px rgba(0, 0, 0, 0.25), 0 8px 20px -8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="h-full flex flex-col p-7">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: card.accentColor }}
                    >
                      {card.category}
                    </span>
                    <span
                      className="text-[11px]"
                      style={{ color: card.accentColor, opacity: 0.7 }}
                    >
                      {card.timeAgo}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-[1.7rem] leading-[1.1] font-bold font-[family-name:var(--font-display)] mb-5"
                    style={{ color: card.textColor }}
                  >
                    {card.title}
                  </h2>

                  {/* Summary */}
                  <p
                    className="text-[15px] leading-relaxed flex-1 overflow-hidden"
                    style={{ color: card.textColor, opacity: 0.85 }}
                  >
                    {card.summary}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: card.textColor + "20" }}>
                    <span className="text-xs font-medium" style={{ color: card.accentColor }}>
                      {card.source}
                    </span>
                    <Link
                      href="/article"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md transition-transform active:scale-95"
                      style={{
                        background: card.textColor,
                        color: card.bg,
                      }}
                    >
                      Read more
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Swipe hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: activeIndex === 0 ? 1 : 0 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-text-tertiary pointer-events-none z-40"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Swipe
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.div>
      </div>

      <BottomNav active="discover" />
    </div>
  );
}
