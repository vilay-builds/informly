"use client";

import { motion } from "framer-motion";

interface DiscoverCardProps {
  category: string;
  categoryColor: string;
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  gradient: string;
  index: number;
}

export function DiscoverCard({
  category,
  categoryColor,
  title,
  summary,
  source,
  timeAgo,
  gradient,
}: DiscoverCardProps) {
  return (
    <div
      className="h-full w-full rounded-3xl overflow-hidden relative flex flex-col justify-end p-6"
      style={{ background: gradient }}
    >
      {/* Darkened bottom area for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm"
            style={{
              backgroundColor: categoryColor + "30",
              color: "#ffffff",
              border: `1px solid ${categoryColor}50`,
            }}
          >
            {category}
          </span>
          <span className="text-xs text-white/60">{timeAgo}</span>
        </div>

        <h2 className="text-2xl font-bold text-white leading-tight">
          {title}
        </h2>

        <p className="text-sm text-white/80 leading-relaxed">{summary}</p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-white/50">{source}</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="text-xs font-medium text-white/90 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20"
          >
            Read more
          </motion.button>
        </div>
      </div>

      {/* Swipe hint */}
      <div className="absolute top-6 right-6 z-10">
        <div className="flex flex-col items-center gap-1 text-white/40">
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
          <span className="text-[10px]">Swipe</span>
        </div>
      </div>
    </div>
  );
}
