"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSavedArticles } from "@/lib/savedArticles";
import { EmptyState, Pill, IconButton, Button } from "@/components/ui";
import { fadeInUp, stagger } from "@/lib/motion";
import { BottomNav } from "@/components/BottomNav";

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default function SavedPage() {
  const { items, remove } = useSavedArticles();

  return (
    <div className="min-h-[100dvh] pb-24">
      <header className="sticky top-0 z-40 glass-strong border-b border-white/30">
        <div className="max-w-2xl mx-auto px-5 py-4">
          <p className="text-sm text-text-tertiary">Your library</p>
          <h1 className="text-xl font-bold text-text-primary font-[family-name:var(--font-display)]">
            Saved Stories
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-5">
        {items.length === 0 ? (
          <EmptyState
            icon={
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            }
            title="Nothing saved yet"
            description="Tap the bookmark on any article to keep it here for later. Your saved stories sync across your devices."
            action={
              <Link href="/">
                <Button variant="primary" size="md">
                  Browse stories
                </Button>
              </Link>
            }
          />
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger(0.05)}
            className="space-y-3"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-text-tertiary">
                {items.length} saved
              </p>
            </div>
            {items.map((article) => (
              <motion.article
                key={article.id}
                variants={fadeInUp}
                className="bg-surface border border-border rounded-2xl overflow-hidden"
              >
                <Link href={`/article/${article.id}`} className="flex gap-3 p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill
                        size="xs"
                        style={{
                          backgroundColor: article.categoryColor + "18",
                          color: article.categoryColor,
                        }}
                      >
                        {article.category}
                      </Pill>
                      <span className="text-[10px] text-text-tertiary">
                        Saved {relativeTime(article.savedAt)}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold leading-snug text-text-primary mb-1.5 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                      {article.summary}
                    </p>
                    <p className="text-[10px] text-text-tertiary mt-2">
                      {article.source}
                    </p>
                  </div>
                  {article.image && (
                    <div
                      className="w-20 h-20 rounded-xl bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${article.image})` }}
                    />
                  )}
                </Link>
                <div className="border-t border-border px-4 py-2 flex items-center justify-end">
                  <button
                    onClick={() => remove(article.id)}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-text-tertiary hover:text-red-500"
                  >
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                    </svg>
                    Remove
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </main>

      <BottomNav active="saved" />
    </div>
  );
}
