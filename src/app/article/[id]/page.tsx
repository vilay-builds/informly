"use client";

import { use, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UnderstandingSlider } from "@/components/UnderstandingSlider";
import { useSavedArticles } from "@/lib/savedArticles";
import { useUserPreferences } from "@/lib/userPreferences";
import { useReadingHistory } from "@/lib/persistence";
import { useToast } from "@/components/Toast";
import {
  getArticleById,
  getArticleReadTime,
  getRelatedArticles,
} from "@/lib/content/articles";
import { Pill } from "@/components/ui";

export default function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const article = getArticleById(id);
  if (!article) notFound();

  const { prefs } = useUserPreferences();
  const { isSaved, toggle } = useSavedArticles();
  const { record } = useReadingHistory();
  const toast = useToast();

  const [level, setLevel] = useState<0 | 1 | 2 | 3>(1);
  const [activeTab, setActiveTab] = useState<"article" | "explained">("article");
  const recordedRef = useRef(false);

  // Reading progress bar
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    setLevel(prefs.readingMode);
  }, [prefs.readingMode]);

  // Record reading history once per visit, after a small delay (signals genuine engagement)
  useEffect(() => {
    if (recordedRef.current) return;
    const t = setTimeout(() => {
      record({
        id: article.id,
        title: article.title,
        category: article.category,
        categoryColor: article.categoryColor,
        image: article.image,
        progress: 0.2,
      });
      recordedRef.current = true;
    }, 2500);
    return () => clearTimeout(t);
  }, [article, record]);

  const content = article.explained[level];
  const saved = isSaved(article.id);
  const readTime = getArticleReadTime(article);
  const related = getRelatedArticles(article);

  const handleToggleSave = () => {
    toggle({
      id: article.id,
      title: article.title,
      summary: article.aiSummary,
      category: article.category,
      categoryColor: article.categoryColor,
      source: article.source,
      image: article.image,
    });
    toast.show({
      message: saved ? "Removed from saved" : "Saved to your library",
      variant: "success",
    });
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: article.title,
      text: article.aiSummary,
      url,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast.show({ message: "Link copied to clipboard", variant: "info" });
      }
    } catch {
      // User canceled share — silent
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen pb-12">
      {/* Reading progress bar */}
      <motion.div
        style={{ scaleX: progressX }}
        className="fixed top-0 left-0 right-0 h-0.5 bg-primary-500 origin-left z-[60] lg:left-64"
      />

      {/* Hero */}
      <div
        className="relative h-[320px] flex items-end p-6 bg-cover bg-center"
        style={{ backgroundImage: `url(${article.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

        <Link
          href="/"
          aria-label="Back"
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            aria-label="Share article"
            className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
          >
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleSave}
            aria-label={saved ? "Remove from saved" : "Save article"}
            className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
          >
            <svg
              width="18"
              height="18"
              fill={saved ? "white" : "none"}
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </motion.button>
        </div>

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full text-white border"
              style={{
                background: article.categoryColor + "40",
                borderColor: article.categoryColor + "60",
              }}
            >
              {article.category}
            </span>
            <span className="text-xs text-white/60">{article.timeAgo}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white leading-snug">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-white/60">
            <span>{article.source}</span>
            <span>·</span>
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-4 space-y-5">
        {/* AI Summary */}
        <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
              <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h3 className="text-xs font-semibold text-primary-700">
              AI Summary
            </h3>
          </div>
          <p className="text-sm text-primary-800 leading-relaxed">
            {article.aiSummary}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-surface-secondary rounded-xl p-1">
          <button
            onClick={() => setActiveTab("article")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "article"
                ? "bg-surface text-text-primary shadow-sm"
                : "text-text-tertiary"
            }`}
          >
            Article
          </button>
          <button
            onClick={() => setActiveTab("explained")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "explained"
                ? "bg-surface text-text-primary shadow-sm"
                : "text-text-tertiary"
            }`}
          >
            Explained
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "article" ? (
            <motion.div
              key="article"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <article className="prose prose-sm max-w-none">
                {article.body.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[15px] text-text-secondary leading-[1.8] mb-4"
                  >
                    {paragraph}
                  </p>
                ))}
              </article>

              {article.relatedTopics.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">
                    Related topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.relatedTopics.map((topic) => (
                      <Pill key={topic} size="sm">
                        {topic}
                      </Pill>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="explained"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <UnderstandingSlider
                value={level}
                onChange={(v) => setLevel(v as 0 | 1 | 2 | 3)}
              />

              <motion.section
                key={`meaning-${level}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface rounded-2xl p-5 border border-border"
              >
                <h3 className="text-sm font-semibold text-text-primary mb-2">
                  What This Actually Means
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {content.meaning}
                </p>
              </motion.section>

              <motion.section
                key={`context-${level}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-surface rounded-2xl p-5 border border-border"
              >
                <h3 className="text-sm font-semibold text-text-primary mb-2">
                  Background & Context
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {content.context}
                </p>
              </motion.section>

              <motion.section
                key={`impact-${level}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-accent-50 rounded-2xl p-5 border border-accent-100"
              >
                <h3 className="text-sm font-semibold text-accent-700 mb-2">
                  Why It Matters To You
                </h3>
                <p className="text-sm text-accent-800 leading-relaxed">
                  {content.impact}
                </p>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Read next */}
        {related.length > 0 && (
          <section className="pt-4 pb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Read next
            </h3>
            <div className="space-y-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/article/${r.id}`}
                  className="block bg-surface border border-border rounded-2xl p-4 hover:border-border-hover transition-colors"
                >
                  <div className="flex gap-3 items-center">
                    <div
                      className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${r.image})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <Pill
                        size="xs"
                        className="mb-1.5"
                        style={{
                          backgroundColor: r.categoryColor + "18",
                          color: r.categoryColor,
                        }}
                      >
                        {r.category}
                      </Pill>
                      <p className="text-sm font-semibold text-text-primary line-clamp-2 leading-snug">
                        {r.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
