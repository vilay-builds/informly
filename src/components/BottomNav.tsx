"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavItem {
  label: string;
  href: string;
  key: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
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

const ROUTE_TO_KEY: Record<string, string> = {
  "/": "markets",
  "/search": "search",
  "/settings": "you",
  "/stock": "markets",
  "/onboarding": "markets",
};

function activeKeyFor(pathname: string): string {
  // Exact match first
  if (ROUTE_TO_KEY[pathname]) return ROUTE_TO_KEY[pathname];
  // Prefix match for nested routes
  for (const [prefix, key] of Object.entries(ROUTE_TO_KEY)) {
    if (prefix !== "/" && pathname.startsWith(prefix)) return key;
  }
  return "markets";
}

export function BottomNav() {
  const pathname = usePathname();
  const active = activeKeyFor(pathname);

  return (
    <nav
      aria-label="Primary"
      className="fixed left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      style={{
        // Lift above safe-area on iPhone; on desktop browsers the value
        // resolves to 0 so the nav still floats 16px from the bottom.
        bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div
        className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full border border-white/40"
        style={{
          background: "rgba(255, 255, 255, 0.72)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          boxShadow:
            "0 18px 48px -12px rgba(20, 25, 60, 0.18), 0 6px 18px -6px rgba(20, 25, 60, 0.10), 0 0 0 1px rgba(255,255,255,0.5) inset",
        }}
      >
        {navItems.map((item) => {
          const isActive = item.key === active;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className="relative flex flex-col items-center justify-center min-w-[68px] h-11 px-3 rounded-full transition-colors"
            >
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-primary-500"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  style={{ zIndex: 0 }}
                />
              )}
              <span
                className={`relative z-10 flex items-center justify-center transition-colors ${
                  isActive ? "text-white" : "text-text-tertiary"
                }`}
              >
                {item.icon}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
