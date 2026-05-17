"use client";

import { useEffect, useState, useCallback } from "react";

export interface UserPreferences {
  name: string;
  marketRegion: "us" | "india";
  interests: string[];
  readingMode: 0 | 1 | 2 | 3; // 0=Beginner, 3=Expert
  onboardedAt: number | null;
}

const KEY = "nova-user-prefs";

const defaults: UserPreferences = {
  name: "",
  marketRegion: "india",
  interests: [],
  readingMode: 1,
  onboardedAt: null,
};

function read(): UserPreferences {
  if (typeof window === "undefined") return defaults;
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return defaults;
  }
}

function write(prefs: UserPreferences) {
  localStorage.setItem(KEY, JSON.stringify(prefs));
  window.dispatchEvent(new CustomEvent("nova-prefs-changed"));
}

export function useUserPreferences() {
  const [prefs, setPrefs] = useState<UserPreferences>(defaults);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPrefs(read());
    setHydrated(true);
    const handler = () => setPrefs(read());
    window.addEventListener("nova-prefs-changed", handler);
    return () => window.removeEventListener("nova-prefs-changed", handler);
  }, []);

  const update = useCallback((patch: Partial<UserPreferences>) => {
    const current = read();
    const next = { ...current, ...patch };
    write(next);
  }, []);

  const completeOnboarding = useCallback(() => {
    const current = read();
    write({ ...current, onboardedAt: Date.now() });
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent("nova-prefs-changed"));
  }, []);

  return { prefs, update, completeOnboarding, reset, hydrated };
}
