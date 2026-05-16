"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface NewsCardProps {
  category: string;
  categoryColor: string;
  title: string;
  summary: string;
  timeAgo: string;
  readTime: string;
  source: string;
}

export function NewsCard({
  category,
  categoryColor,
  title,
  summary,
  timeAgo,
  readTime,
  source,
}: NewsCardProps) {
  return (
    <Link href="/article">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.98 }}
        className="bg-surface rounded-2xl p-5 shadow-sm border border-border cursor-pointer
                   transition-shadow hover:shadow-md"
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: categoryColor + "18", color: categoryColor }}
          >
            {category}
          </span>
          <span className="text-xs text-text-tertiary">{timeAgo}</span>
        </div>

        <h3 className="text-[1.05rem] font-semibold leading-snug text-text-primary mb-2">
          {title}
        </h3>

        <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
          {summary}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-text-tertiary">{source}</span>
          <span className="text-xs text-text-tertiary">{readTime} read</span>
        </div>
      </motion.article>
    </Link>
  );
}
