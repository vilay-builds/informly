"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface NewsCardProps {
  articleId?: string;
  category: string;
  categoryColor: string;
  title: string;
  summary: string;
  timeAgo: string;
  readTime: string;
  source: string;
  image?: string;
}

export function NewsCard({
  articleId,
  category,
  categoryColor,
  title,
  summary,
  timeAgo,
  readTime,
  source,
  image,
}: NewsCardProps) {
  const href = articleId ? `/article/${articleId}` : "/";
  return (
    <Link href={href}>
      <motion.article
        whileTap={{ scale: 0.99 }}
        className="bg-surface rounded-2xl border border-border cursor-pointer
                   transition-shadow hover:shadow-md overflow-hidden h-full"
      >
        <div className="flex gap-3 p-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: categoryColor + "18",
                  color: categoryColor,
                }}
              >
                {category}
              </span>
              <span className="text-[10px] text-text-tertiary">{timeAgo}</span>
            </div>

            <h3 className="text-[15px] font-semibold leading-snug text-text-primary mb-2 line-clamp-2">
              {title}
            </h3>

            <p className="text-xs text-text-secondary leading-relaxed mb-2 line-clamp-2">
              {summary}
            </p>

            <div className="flex items-center gap-2 text-[10px] text-text-tertiary">
              <span>{source}</span>
              <span>·</span>
              <span>{readTime} read</span>
            </div>
          </div>

          {image && (
            <div
              className="w-24 h-24 rounded-xl bg-cover bg-center flex-shrink-0"
              style={{ backgroundImage: `url(${image})` }}
            />
          )}
        </div>
      </motion.article>
    </Link>
  );
}
