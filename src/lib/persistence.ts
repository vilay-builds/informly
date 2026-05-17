"use client";

import { useEffect, useState, useCallback } from "react";

// Generic localStorage-backed state with cross-component event sync
function makeStore<T>(key: string, defaults: T) {
  const eventName = `nova-store-${key}`;

  function read(): T {
    if (typeof window === "undefined") return defaults;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      return Array.isArray(defaults) ? parsed : { ...defaults, ...parsed };
    } catch {
      return defaults;
    }
  }

  function write(value: T) {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(eventName));
  }

  function useStore(): [T, (next: T | ((prev: T) => T)) => void, boolean] {
    const [state, setState] = useState<T>(defaults);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
      setState(read());
      setHydrated(true);
      const handler = () => setState(read());
      window.addEventListener(eventName, handler);
      window.addEventListener("storage", handler);
      return () => {
        window.removeEventListener(eventName, handler);
        window.removeEventListener("storage", handler);
      };
    }, []);

    const update = useCallback((next: T | ((prev: T) => T)) => {
      const current = read();
      const value =
        typeof next === "function" ? (next as (p: T) => T)(current) : next;
      write(value);
    }, []);

    return [state, update, hydrated];
  }

  return { read, write, useStore };
}

// ============ WATCHLIST ============
const defaultWatchlistUS = ["AAPL", "NVDA", "TSLA", "MSFT", "GOOGL"];
const defaultWatchlistIN = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "BHARTIARTL"];

const watchlistStore = makeStore<{ us: string[]; india: string[] }>(
  "nova-watchlist",
  { us: defaultWatchlistUS, india: defaultWatchlistIN }
);

export function useWatchlist(region: "us" | "india") {
  const [state, update] = watchlistStore.useStore();
  const list = state[region];

  const isWatched = useCallback(
    (ticker: string) => list.includes(ticker.toUpperCase()),
    [list]
  );

  const add = useCallback(
    (ticker: string) => {
      const t = ticker.toUpperCase();
      update((prev) => ({
        ...prev,
        [region]: prev[region].includes(t) ? prev[region] : [...prev[region], t],
      }));
    },
    [region, update]
  );

  const remove = useCallback(
    (ticker: string) => {
      const t = ticker.toUpperCase();
      update((prev) => ({
        ...prev,
        [region]: prev[region].filter((x) => x !== t),
      }));
    },
    [region, update]
  );

  const toggle = useCallback(
    (ticker: string) => {
      const t = ticker.toUpperCase();
      update((prev) => ({
        ...prev,
        [region]: prev[region].includes(t)
          ? prev[region].filter((x) => x !== t)
          : [...prev[region], t],
      }));
    },
    [region, update]
  );

  return { list, isWatched, add, remove, toggle };
}

// ============ NOTIFICATIONS ============
export interface NotificationPrefs {
  dailyBrief: boolean;
  marketAlerts: boolean;
  breakingNews: boolean;
  weeklyDigest: boolean;
}

const notifStore = makeStore<NotificationPrefs>("nova-notif-prefs", {
  dailyBrief: true,
  marketAlerts: true,
  breakingNews: false,
  weeklyDigest: true,
});

export function useNotificationPrefs() {
  const [state, update] = notifStore.useStore();

  const setPref = useCallback(
    (key: keyof NotificationPrefs, value: boolean) => {
      update((prev) => ({ ...prev, [key]: value }));
    },
    [update]
  );

  return { prefs: state, setPref };
}

// ============ INTERESTS ============
const interestsStore = makeStore<string[]>("nova-interests", [
  "technology",
  "world",
  "economy",
]);

export function useInterests() {
  const [state, update] = interestsStore.useStore();

  const toggle = useCallback(
    (key: string) => {
      update((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
    },
    [update]
  );

  return { interests: state, toggle, setAll: update };
}

// ============ READING HISTORY ============
export interface ReadingEntry {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  image?: string;
  readAt: number;
  progress: number; // 0..1
}

const historyStore = makeStore<ReadingEntry[]>("nova-reading-history", []);

export function useReadingHistory() {
  const [state, update] = historyStore.useStore();

  const record = useCallback(
    (entry: Omit<ReadingEntry, "readAt">) => {
      update((prev) => {
        const filtered = prev.filter((e) => e.id !== entry.id);
        return [{ ...entry, readAt: Date.now() }, ...filtered].slice(0, 50);
      });
    },
    [update]
  );

  const clear = useCallback(() => update([]), [update]);

  return { history: state, record, clear };
}

// ============ STREAK ============
// Computed from reading history — counts consecutive days with at least one article opened.
export function computeStreak(history: ReadingEntry[]): number {
  if (history.length === 0) return 0;
  const days = new Set(
    history.map((e) => new Date(e.readAt).toDateString())
  );
  let streak = 0;
  const cursor = new Date();
  while (days.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
