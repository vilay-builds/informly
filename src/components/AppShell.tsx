"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserPreferences } from "@/lib/userPreferences";
import { CommandPalette } from "@/components/CommandPalette";

const STANDALONE_ROUTES = ["/onboarding"];

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

  // Mobile-first: the entire experience is a single column, centered on
  // wider screens with generous margins — no sidebar, no scaled-up
  // dashboard. Desktop = same mobile column, comfortably centered.
  return (
    <>
      {children}
      <CommandPalette />
    </>
  );
}
