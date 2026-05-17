"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserPreferences } from "@/lib/userPreferences";
import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";
import { StockTicker } from "@/components/StockTicker";

const STANDALONE_ROUTES = ["/onboarding"];
const NO_TICKER_ROUTES = ["/settings", "/onboarding"];

const ROUTE_KEY: Record<string, string> = {
  "/": "feed",
  "/discover": "discover",
  "/markets": "markets",
  "/saved": "saved",
  "/search": "search",
  "/settings": "you",
  "/stock": "markets",
  "/article": "feed",
};

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { prefs, hydrated } = useUserPreferences();

  useEffect(() => {
    if (!hydrated) return;
    if (STANDALONE_ROUTES.includes(pathname)) return;
    if (!prefs.onboardedAt) {
      router.replace("/onboarding");
    }
  }, [hydrated, prefs.onboardedAt, pathname, router]);

  const activeKey = ROUTE_KEY[pathname] || "feed";
  const showTicker = !NO_TICKER_ROUTES.some((r) => pathname.startsWith(r));

  if (STANDALONE_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="lg:pl-64">
      <Sidebar active={activeKey} />
      {showTicker && <StockTicker region={prefs.marketRegion} />}
      {children}
      <CommandPalette />
    </div>
  );
}
