"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotifications, NotificationKind } from "@/lib/notifications";
import { EmptyState, Button, IconButton } from "@/components/ui";
import { fadeInUp, stagger } from "@/lib/motion";

const kindIcon: Record<NotificationKind, React.ReactNode> = {
  brief: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  market: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  breaking: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  digest: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  milestone: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
};

const kindAccent: Record<NotificationKind, string> = {
  brief: "text-primary-500 bg-primary-50",
  market: "text-success-500 bg-success-400/15",
  breaking: "text-red-500 bg-red-50",
  digest: "text-accent-500 bg-accent-50",
  milestone: "text-yellow-600 bg-yellow-50",
};

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

export default function NotificationsPage() {
  const router = useRouter();
  const { items, unreadCount, markRead, markAllRead, clear } =
    useNotifications();

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
            Notifications {unreadCount > 0 && `· ${unreadCount} new`}
          </span>
          {items.length > 0 ? (
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="text-xs font-medium text-primary-500 hover:text-primary-700 disabled:text-text-tertiary disabled:cursor-default"
            >
              Mark all read
            </button>
          ) : (
            <div className="w-9" />
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-6">
        {items.length === 0 ? (
          <EmptyState
            icon={
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            }
            title="Inbox zero"
            description="No notifications right now. We'll let you know when there's something worth your attention."
            action={
              <Link href="/">
                <Button variant="primary">Back to feed</Button>
              </Link>
            }
          />
        ) : (
          <motion.div
            variants={stagger(0.04)}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {items.map((n) => {
              const body = (
                <div className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-surface hover:border-border-hover transition-colors">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${kindAccent[n.kind]}`}
                  >
                    {kindIcon[n.kind]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                      {n.body}
                    </p>
                    <p className="text-[10px] text-text-tertiary mt-1.5">
                      {relativeTime(n.receivedAt)}
                    </p>
                  </div>
                </div>
              );

              return (
                <motion.div key={n.id} variants={fadeInUp}>
                  {n.href ? (
                    <Link
                      href={n.href}
                      onClick={() => markRead(n.id)}
                      className="block"
                    >
                      {body}
                    </Link>
                  ) : (
                    <button
                      onClick={() => markRead(n.id)}
                      className="w-full text-left"
                    >
                      {body}
                    </button>
                  )}
                </motion.div>
              );
            })}

            {items.length > 3 && (
              <div className="pt-4 text-center">
                <button
                  onClick={clear}
                  className="text-xs text-text-tertiary hover:text-red-500"
                >
                  Clear all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
