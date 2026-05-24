"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { easing } from "@/lib/motion";
import { useTheme } from "@/components/ThemeProvider";
import { themeList } from "@/lib/themes";
import { STARTER_STOCKS } from "@/lib/india";

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  group: "Navigate" | "Stocks" | "Themes";
  action: () => void;
  keywords?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { setThemeKey } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => {
    const close = () => setOpen(false);
    const navigate = (href: string) => () => {
      router.push(href);
      close();
    };
    return [
      { id: "nav-home", group: "Navigate", title: "Go to Markets", action: navigate("/") },
      { id: "nav-search", group: "Navigate", title: "Open Search", action: navigate("/search") },
      { id: "nav-settings", group: "Navigate", title: "Settings", action: navigate("/settings") },
      ...themeList.map((t) => ({
        id: `theme-${t.key}`,
        group: "Themes" as const,
        title: `Theme: ${t.name}`,
        subtitle: t.subtitle,
        action: () => {
          setThemeKey(t.key);
          close();
        },
      })),
      ...STARTER_STOCKS.map((s) => ({
        id: `stock-${s.ticker}`,
        group: "Stocks" as const,
        title: `${s.ticker} — ${s.name}`,
        subtitle: s.sector,
        action: navigate(`/stock/${s.ticker}`),
        keywords: `${s.name} ${s.sector}`,
      })),
    ];
  }, [router, setThemeKey]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands.slice(0, 12);
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle?.toLowerCase().includes(q) ||
        c.keywords?.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIndex]?.action();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={easing.spring}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Jump anywhere…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-tertiary"
              />
              <kbd className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-secondary text-text-tertiary">
                ESC
              </kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-text-tertiary">
                  No matches for &quot;{query}&quot;
                </div>
              ) : (
                Array.from(new Set(filtered.map((f) => f.group))).map((group) => (
                  <div key={group}>
                    <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-1.5">
                      {group}
                    </p>
                    {filtered
                      .filter((c) => c.group === group)
                      .map((cmd) => {
                        const idx = filtered.indexOf(cmd);
                        const active = idx === activeIndex;
                        return (
                          <button
                            key={cmd.id}
                            onClick={cmd.action}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-left ${
                              active
                                ? "bg-primary-50 text-primary-700"
                                : "hover:bg-surface-secondary"
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {cmd.title}
                              </p>
                              {cmd.subtitle && (
                                <p className="text-xs text-text-tertiary truncate">
                                  {cmd.subtitle}
                                </p>
                              )}
                            </div>
                            {active && (
                              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-primary-500 flex-shrink-0 ml-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                  </div>
                ))
              )}
            </div>

            <div className="px-4 py-2 border-t border-border flex items-center justify-between text-[10px] text-text-tertiary">
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface-secondary">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-surface-secondary">↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface-secondary">↵</kbd>
                  open
                </span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-secondary">⌘K</kbd>
                toggle
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
