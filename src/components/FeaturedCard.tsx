"use client";

import { motion } from "framer-motion";

interface FeaturedCardProps {
  category: string;
  title: string;
  summary: string;
  gradient: string;
  timeAgo: string;
}

export function FeaturedCard({
  category,
  title,
  summary,
  gradient,
  timeAgo,
}: FeaturedCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-2xl p-6 cursor-pointer min-h-[200px] flex flex-col justify-end"
      style={{ background: gradient }}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
            {category}
          </span>
          <span className="text-xs text-white/70">{timeAgo}</span>
        </div>
        <h2 className="text-lg font-bold leading-snug text-white mb-2">
          {title}
        </h2>
        <p className="text-sm text-white/80 leading-relaxed line-clamp-2">
          {summary}
        </p>
      </div>
    </motion.article>
  );
}
