"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";
import { tap } from "@/lib/motion";

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    key: "feed",
    label: "Feed",
    href: "/",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
      </svg>
    ),
  },
  {
    key: "discover",
    label: "Discover",
    href: "/discover",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      </svg>
    ),
  },
  {
    key: "markets",
    label: "Markets",
    href: "/markets",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    key: "search",
    label: "Search",
    href: "/search",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
];

interface SidebarProps {
  active?: string;
}

export function Sidebar({ active = "feed" }: SidebarProps) {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 glass-strong border-r border-white/30 z-30 flex-col">
      <div className="px-6 pt-7 pb-5">
        <div className="flex items-center">
          <span className="text-3xl font-bold text-text-primary font-[family-name:var(--font-display)] tracking-tight">
            Nova
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.key === active;
          return (
            <Link key={item.key} href={item.href}>
              <motion.div
                whileTap={tap}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary-600 bg-primary-50"
                    : "text-text-secondary hover:bg-surface-secondary"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-5 rounded-r-full bg-primary-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.icon}
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <Link href="/settings">
          <motion.div
            whileTap={tap}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active === "you"
                ? "text-primary-600 bg-primary-50"
                : "text-text-secondary hover:bg-surface-secondary"
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">V</span>
            </div>
            <span>Settings</span>
          </motion.div>
        </Link>
      </div>
    </aside>
  );
}
