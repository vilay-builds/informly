import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-surface-secondary flex items-center justify-center text-text-tertiary mx-auto mb-5">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-text-primary font-[family-name:var(--font-display)] mb-2">
          Lost in the news
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed mb-6">
          We couldn&apos;t find what you were looking for. Let&apos;s get you
          back to today&apos;s stories.
        </p>
        <Link href="/">
          <Button variant="primary">Back to your feed</Button>
        </Link>
      </div>
    </div>
  );
}
