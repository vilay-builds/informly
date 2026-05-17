"use client";

import { useEffect, useState, useCallback } from "react";

export type NotificationKind =
  | "brief"
  | "market"
  | "breaking"
  | "digest"
  | "milestone";

export interface NovaNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  href?: string;
  read: boolean;
  receivedAt: number;
}

const KEY = "nova-notifications";
const EVENT = "nova-notifications-changed";

const SEED: NovaNotification[] = [
  {
    id: "seed-1",
    kind: "brief",
    title: "Your daily brief is ready",
    body: "5 hand-picked stories worth your morning coffee.",
    href: "/brief",
    read: false,
    receivedAt: Date.now() - 1000 * 60 * 22,
  },
  {
    id: "seed-2",
    kind: "market",
    title: "NVDA up 4.1%",
    body: "Blackwell chips shipping ahead of schedule. Demand exceeds supply through 2027.",
    href: "/stock/NVDA",
    read: false,
    receivedAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: "seed-3",
    kind: "breaking",
    title: "EU climate law passes",
    body: "New regulations will affect global supply chains. Quick read inside.",
    href: "/article/eu-carbon-law",
    read: true,
    receivedAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: "seed-4",
    kind: "milestone",
    title: "3-day streak unlocked",
    body: "You're building a great habit. Keep it going!",
    read: true,
    receivedAt: Date.now() - 1000 * 60 * 60 * 24,
  },
];

function read(): NovaNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) {
      localStorage.setItem(KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw);
  } catch {
    return SEED;
  }
}

function write(items: NovaNotification[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useNotifications() {
  const [items, setItems] = useState<NovaNotification[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(read());
    setHydrated(true);
    const handler = () => setItems(read());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const markRead = useCallback((id: string) => {
    const curr = read();
    write(curr.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    write(read().map((n) => ({ ...n, read: true })));
  }, []);

  const clear = useCallback(() => {
    write([]);
  }, []);

  const unreadCount = items.filter((i) => !i.read).length;

  return { items, hydrated, unreadCount, markRead, markAllRead, clear };
}
