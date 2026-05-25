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
// Note: India-only platform. We keep the region parameter for future
// flexibility but everything routes to "india" today.
const defaultWatchlistIN: string[] = [];

const watchlistStore = makeStore<{ us: string[]; india: string[] }>(
  "nova-watchlist",
  { us: [], india: defaultWatchlistIN }
);

export function useWatchlist(region: "us" | "india" = "india") {
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

  const reorder = useCallback(
    (next: string[]) => {
      const cleaned = next.map((t) => t.toUpperCase());
      update((prev) => ({ ...prev, [region]: cleaned }));
    },
    [region, update]
  );

  return { list, isWatched, add, remove, toggle, reorder };
}

// ============ NOTIFICATIONS ============
export interface NotificationPrefs {
  marketAlerts: boolean;
  weeklyDigest: boolean;
}

const notifStore = makeStore<NotificationPrefs>("nova-notif-prefs", {
  marketAlerts: true,
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
