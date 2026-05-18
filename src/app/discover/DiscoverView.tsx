"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { easing } from "@/lib/motion";

export interface DiscoverCard {
  id: string;
  title: string;
  category: string;
  aiSummary: string;
  source: string;
  timeAgo: string;
  image: string;
}

interface DiscoverViewProps {
  cards: DiscoverCard[];
}

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

export default function DiscoverView({ cards }: DiscoverViewProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const constraintsRef = useRef(null);
  const wasDragging = useRef(false);

  const paginate = (delta: number) => {
    const next = Math.max(0, Math.min(cards.length - 1, index + delta));
    setIndex(next);
  };

  const handleDragStart = () => {
    wasDragging.current = true;
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 60;
    if (info.offset.x < -threshold) paginate(1);
    else if (info.offset.x > threshold) paginate(-1);
    setTimeout(() => {
      wasDragging.current = false;
    }, 100);
  };

  if (cards.length === 0) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center px-6">
        <p className="text-sm text-text-tertiary">No stories to discover right now.</p>
        <BottomNav active="discover" />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <header className="relative z-30 px-5 pt-4 pb-3 flex items-center justify-between glass-strong border-b border-white/30">
        <div>
          <p className="text-xs text-text-tertiary">Swipe through what&apos;s happening</p>
          <h1 className="text-xl font-bold text-text-primary font-[family-name:var(--font-display)]">
            Discover
          </h1>
        </div>
        <div className="flex items-center gap-1.5 max-w-[200px] overflow-hidden">
          {cards.slice(0, 10).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === index ? "w-6 bg-text-primary" : "w-1 bg-text-tertiary/40"
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
            const offset = i - index;
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            const palette = PALETTES[i % PALETTES.length];

            return (
              <motion.div
                key={card.id}
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.55}
                onDragStart={isActive ? handleDragStart : undefined}
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
                transition={easing.spring}
                whileDrag={{ rotate: 0, scale: 1.02 }}
                onClick={() => {
                  if (!isActive) return;
                  if (wasDragging.current) return;
                  router.push(`/article/${encodeURIComponent(card.id)}`);
                }}
                className="absolute w-[88%] max-w-md h-[72%] rounded-3xl overflow-hidden cursor-pointer select-none"
                style={{
                  background: palette.bg,
                  boxShadow:
                    "0 30px 60px -15px rgba(0, 0, 0, 0.25), 0 8px 20px -8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="h-full flex flex-col p-6 pointer-events-none">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: palette.accentColor }}
                    >
                      {card.category}
                    </span>
                    <span
                      className="text-[11px]"
                      style={{ color: palette.accentColor, opacity: 0.7 }}
                    >
                      {card.timeAgo}
                    </span>
                  </div>

                  <div
                    className="rounded-2xl mb-5 h-32 bg-cover bg-center"
                    style={{ backgroundImage: `url(${card.image})` }}
                  />

                  <h2
                    className="text-[1.45rem] leading-[1.15] font-bold font-[family-name:var(--font-display)] mb-3"
                    style={{ color: palette.textColor }}
                  >
                    {card.title}
                  </h2>

                  <p
                    className="text-sm leading-relaxed flex-1 overflow-hidden line-clamp-4"
                    style={{ color: palette.textColor, opacity: 0.85 }}
                  >
                    {card.aiSummary}
                  </p>

                  <div
                    className="flex items-center justify-between mt-4 pt-3 border-t"
                    style={{ borderColor: palette.textColor + "20" }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: palette.accentColor }}
                    >
                      {card.source}
                    </span>
                    <div
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold"
                      style={{
                        background: palette.textColor,
                        color: palette.bg,
                      }}
                    >
                      Read more
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {index === 0 && cards.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[11px] text-text-tertiary pointer-events-none"
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Swipe to explore
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.div>
        )}
      </div>

      <BottomNav active="discover" />
    </div>
  );
}
