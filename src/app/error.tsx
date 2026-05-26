"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Vero error:", error);
  }, [error]);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mx-auto mb-5">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-text-primary font-[family-name:var(--font-display)] mb-2">
          Something went off course
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed mb-6">
          We hit an unexpected error. Try again, and if it keeps happening
          we&apos;ll look into it.
        </p>
        <div className="flex flex-col gap-2 items-stretch">
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
          <Link href="/">
            <Button variant="ghost" fullWidth>
              Back to your watchlist
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
