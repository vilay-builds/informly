"use client";

import { useEffect, useState, useCallback } from "react";

export interface SavedArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  categoryColor: string;
  source: string;
  image?: string;
  savedAt: number;
}

const KEY = "nova-saved-articles";

function readAll(): SavedArticle[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAll(items: SavedArticle[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("nova-saved-changed"));
}

export function useSavedArticles() {
  const [items, setItems] = useState<SavedArticle[]>([]);

  useEffect(() => {
    setItems(readAll());
    const handler = () => setItems(readAll());
    window.addEventListener("nova-saved-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("nova-saved-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const isSaved = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const toggle = useCallback(
    (article: Omit<SavedArticle, "savedAt">) => {
      const current = readAll();
      const idx = current.findIndex((i) => i.id === article.id);
      if (idx >= 0) {
        const next = current.filter((i) => i.id !== article.id);
        writeAll(next);
      } else {
        writeAll([{ ...article, savedAt: Date.now() }, ...current]);
      }
    },
    []
  );

  const remove = useCallback((id: string) => {
    writeAll(readAll().filter((i) => i.id !== id));
  }, []);

  return { items, isSaved, toggle, remove };
}
