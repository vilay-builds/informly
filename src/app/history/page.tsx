"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReadingHistory, computeStreak } from "@/lib/persistence";
import { EmptyState, Button, IconButton, Pill } from "@/components/ui";
import { fadeInUp, stagger } from "@/lib/motion";
import { useState } from "react";

function isSameDay(a: number, b: number): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function dayLabel(ts: number): string {
  const date = new Date(ts);
  const today = new Date();
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  if (isSameDay(ts, today.getTime())) return "Today";
  if (isSameDay(ts, yest.getTime())) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function HistoryPage() {
  const router = useRouter();
  const { history, clear } = useReadingHistory();
  const streak = computeStreak(history);
  const [confirming, setConfirming] = useState(false);

  // Group by day
  const grouped: { day: string; items: typeof history }[] = [];
  history.forEach((item) => {
    const label = dayLabel(item.readAt);
    const last = grouped[grouped.length - 1];
    if (last && last.day === label) {
      last.items.push(item);
    } else {
      grouped.push({ day: label, items: [item] });
    }
  });

  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-40 glass-strong border-b border-white/30">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
          <IconButton
            variant="ghost"
            size="md"
            label="Back"
            onClick={() => router.back()}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </IconButton>
          <span className="text-xs font-medium text-text-tertiary">
            Reading History
          </span>
          {history.length > 0 ? (
            <button
              onClick={() => setConfirming(true)}
              className="text-xs font-medium text-text-tertiary hover:text-red-500"
            >
              Clear
            </button>
          ) : (
            <div className="w-9" />
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-6 pb-12">
        {history.length === 0 ? (
          <EmptyState
            icon={
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="No reading history yet"
            description="Articles you read will appear here, organized by day. Your reading habits also build your streak."
            action={
              <Link href="/">
                <Button variant="primary">Start reading</Button>
              </Link>
            }
          />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center gap-6"
            >
              <div>
                <p className="text-3xl font-bold text-text-primary tabular-nums">
                  {history.length}
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">
                  articles read
                </p>
              </div>
              {streak > 0 && (
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-3xl font-bold text-text-primary tabular-nums">
                      {streak}
                    </p>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-accent-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </div>
                  <p className="text-xs text-text-tertiary mt-0.5">day streak</p>
                </div>
              )}
            </motion.div>

            <motion.div
              variants={stagger(0.04)}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {grouped.map((group) => (
                <motion.section key={group.day} variants={fadeInUp}>
                  <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                    {group.day}
                  </h3>
                  <div className="space-y-2">
                    {group.items.map((entry) => (
                      <Link
                        key={`${entry.id}-${entry.readAt}`}
                        href={`/article/${entry.id}`}
                        className="flex gap-3 p-3 rounded-xl bg-surface border border-border hover:border-border-hover transition-colors"
                      >
                        {entry.image && (
                          <div
                            className="w-14 h-14 rounded-lg bg-cover bg-center flex-shrink-0"
                            style={{ backgroundImage: `url(${entry.image})` }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <Pill
                            size="xs"
                            className="mb-1"
                            style={{
                              backgroundColor: entry.categoryColor + "18",
                              color: entry.categoryColor,
                            }}
                          >
                            {entry.category}
                          </Pill>
                          <p className="text-sm font-medium text-text-primary line-clamp-2 leading-snug">
                            {entry.title}
                          </p>
                          <p className="text-[10px] text-text-tertiary mt-1">
                            {new Date(entry.readAt).toLocaleTimeString(
                              undefined,
                              { hour: "numeric", minute: "2-digit" }
                            )}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.section>
              ))}
            </motion.div>
          </>
        )}
      </main>

      {confirming && (
        <div
          className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={() => setConfirming(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface rounded-2xl max-w-sm w-full p-5 shadow-2xl"
          >
            <h3 className="text-base font-semibold text-text-primary mb-2">
              Clear all reading history?
            </h3>
            <p className="text-sm text-text-secondary mb-5 leading-relaxed">
              This removes every article from your history and resets your day
              streak. You can&apos;t undo this.
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setConfirming(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  clear();
                  setConfirming(false);
                }}
                fullWidth
              >
                Clear all
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
