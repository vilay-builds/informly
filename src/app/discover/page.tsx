"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import Link from "next/link";
import { getDiscoverArticles } from "@/lib/content/articles";

const PALETTES: { bg: string; textColor: string; accentColor: string }[] = [
  { bg: "#fef3c7", textColor: "#451a03", accentColor: "#a16207" },
  { bg: "#dcfce7", textColor: "#14532d", accentColor: "#15803d" },
  { bg: "#dbeafe", textColor: "#1e3a8a", accentColor: "#1d4ed8" },
  { bg: "#fce7f3", textColor: "#831843", accentColor: "#be185d" },
  { bg: "#e9d5ff", textColor: "#581c87", accentColor: "#7e22ce" },
  { bg: "#fed7aa", textColor: "#7c2d12", accentColor: "#c2410c" },
  { bg: "#ccfbf1", textColor: "#134e4a", accentColor: "#0f766e" },
  { bg: "#fecaca", textColor: "#7f1d1d", accentColor: "#b91c1c" },
  { bg: "#e0e7ff", textColor: "#312e81", accentColor: "#4338ca" },
  { bg: "#fef9c3", textColor: "#713f12", accentColor: "#a16207" },
];

export default function DiscoverPage() {
  const articles = getDiscoverArticles();
  const cards = articles.map((a, i) => ({
    ...a,
    ...PALETTES[i % PALETTES.length],
  }));

  const [activeIndex, setActiveIndex] = useState(0);
  const constraintsRef = useRef(null);

  const paginate = (delta: number) => {
    const next = Math.max(0, Math.min(cards.length - 1, activeIndex + delta));
    setActiveIndex(next);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 60;
    if (info.offset.x < -threshold) {
      paginate(1);
    } else if (info.offset.x > threshold) {
      paginate(-1);
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
        <div className="flex items-center gap-1.5 max-w-[200px] overflow-hidden">
          {cards.slice(0, 10).map((_, i) => (
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
        <AnimatePresence initial={false}>
          {cards.map((card, i) => {
            const offset = i - activeIndex;
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            return (
              <motion.div
                key={card.id}
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
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                whileDrag={{ rotate: 0, scale: 1.02 }}
                className="absolute w-[88%] max-w-md h-[72%] rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
                style={{
                  background: card.bg,
                  boxShadow:
                    "0 30px 60px -15px rgba(0, 0, 0, 0.25), 0 8px 20px -8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="h-full flex flex-col p-7">
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

                  <h2
                    className="text-[1.7rem] leading-[1.1] font-bold font-[family-name:var(--font-display)] mb-5"
                    style={{ color: card.textColor }}
                  >
                    {card.title}
                  </h2>

                  <p
                    className="text-[15px] leading-relaxed flex-1 overflow-hidden"
                    style={{ color: card.textColor, opacity: 0.85 }}
                  >
                    {card.aiSummary}
                  </p>

                  <div
                    className="flex items-center justify-between mt-6 pt-4 border-t"
                    style={{ borderColor: card.textColor + "20" }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: card.accentColor }}
                    >
                      {card.source}
                    </span>
                    <Link
                      href={`/article/${card.id}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-transform active:scale-95"
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
