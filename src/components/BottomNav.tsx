"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { tap } from "@/lib/motion";

const navItems = [
  {
    label: "Markets",
    href: "/",
    key: "markets",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    label: "Search",
    href: "/search",
    key: "search",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    label: "You",
    href: "/settings",
    key: "you",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

interface BottomNavProps {
  active?: string;
}

export function BottomNav({ active = "markets" }: BottomNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-strong border-t border-white/30 z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around py-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const isActive = item.key === active;
          return (
            <Link key={item.key} href={item.href}>
              <motion.div
                whileTap={tap}
                className={`relative flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-colors ${
                  isActive
                    ? "text-primary-600"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-active"
                    className="absolute -top-1.5 w-1 h-1 rounded-full bg-primary-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
