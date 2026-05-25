"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserPreferences } from "@/lib/userPreferences";
import { CommandPalette } from "@/components/CommandPalette";
import { StockTicker } from "@/components/StockTicker";

const STANDALONE_ROUTES = ["/onboarding"];
// Routes where the rolling ticker fits naturally above content.
const TICKER_ROUTES = ["/", "/stock"];

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

  if (STANDALONE_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  const showTicker = TICKER_ROUTES.some((r) =>
    r === "/" ? pathname === "/" : pathname.startsWith(r)
  );

  return (
    <>
      {showTicker && <StockTicker />}
      {children}
      <CommandPalette />
    </>
  );
}
