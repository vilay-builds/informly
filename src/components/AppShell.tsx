"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserPreferences } from "@/lib/userPreferences";
import { Sidebar } from "@/components/Sidebar";

const PUBLIC_ROUTES = ["/onboarding"];

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
    if (PUBLIC_ROUTES.includes(pathname)) return;
    if (!prefs.onboardedAt) {
      router.replace("/onboarding");
    }
  }, [hydrated, prefs.onboardedAt, pathname, router]);

  const activeKey = ROUTE_KEY[pathname] || "feed";

  // Onboarding renders standalone (no shell)
  if (PUBLIC_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="lg:pl-64">
      <Sidebar active={activeKey} />
      {children}
    </div>
  );
}
