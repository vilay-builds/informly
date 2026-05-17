"use client";

import { useState } from "react";
import { motion, PanInfo } from "framer-motion";
import Link from "next/link";

interface FeaturedStory {
  category: string;
  title: string;
  summary: string;
  image: string;
  timeAgo: string;
  source: string;
}

const stories: FeaturedStory[] = [
  {
    category: "AI & Technology",
    title: "OpenAI announces new reasoning model that solves PhD-level problems",
    summary:
      "The latest advancement could transform how scientists approach complex research challenges.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80",
    timeAgo: "2h ago",
    source: "The Verge",
  },
  {
    category: "Climate",
    title: "EU passes landmark carbon reduction law for global supply chains",
    summary:
      "New regulations will require companies to track and reduce emissions across their entire production process.",
    image:
      "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=900&q=80",
    timeAgo: "3h ago",
    source: "Reuters",
  },
  {
    category: "Markets",
    title: "Federal Reserve signals pause on interest rate changes through summer",
    summary:
      "Borrowing costs for homes, cars, and credit cards are likely to stay where they are for the next few months.",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=80",
    timeAgo: "5h ago",
    source: "Bloomberg",
  },
  {
    category: "World",
    title: "Japan introduces four-day work week pilot for government employees",
    summary:
      "The initiative aims to boost declining birth rates by giving workers more time for family.",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=80",
    timeAgo: "8h ago",
    source: "BBC",
  },
];

export function FeaturedCarousel() {
  const [index, setIndex] = useState(0);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 60;
    if (info.offset.x < -threshold && index < stories.length - 1) {
      setIndex(index + 1);
    } else if (info.offset.x > threshold && index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">For You</h3>
        <div className="flex items-center gap-1">
          {stories.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === index
                  ? "w-5 bg-primary-500"
                  : "w-1 bg-text-tertiary/40"
              }`}
            />
          ))}
        </div>
      </div>

      <div
        className="relative h-[280px]"
        style={{ perspective: "1200px" }}
      >
        {stories.map((story, i) => {
          const offset = i - index;
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
                x: offset * 18,
                y: Math.abs(offset) * 10,
                scale: 1 - Math.abs(offset) * 0.05,
                rotate: offset * -2,
                opacity: Math.abs(offset) > 1 ? 0.4 : 1,
                zIndex: stories.length - Math.abs(offset),
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              whileDrag={{ rotate: 0, scale: 1.02 }}
              className="absolute inset-0 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing shadow-xl"
            >
              <Link href="/article" className="block h-full">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-zinc-900"
                  style={{ backgroundImage: `url(${story.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {isActive && (
                  <div className="relative h-full flex flex-col justify-end p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20">
                        {story.category}
                      </span>
                      <span className="text-[10px] text-white/70">
                        {story.timeAgo}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold leading-tight text-white mb-2">
                      {story.title}
                    </h2>
                    <p className="text-sm text-white/80 leading-relaxed line-clamp-2 mb-3">
                      {story.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-white/60">{story.source}</span>
                      <div className="flex items-center gap-1 text-[11px] text-white/80 font-medium">
                        Read more
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
