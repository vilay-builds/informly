import { Skeleton } from "@/components/ui";

export function ArticleSkeleton() {
  return (
    <div className="min-h-screen">
      <Skeleton height={320} rounded="sm" className="rounded-none" />
      <div className="max-w-2xl mx-auto px-5 pt-4 space-y-5">
        <Skeleton height={92} rounded="2xl" />
        <Skeleton height={44} rounded="xl" />
        <div className="space-y-3">
          <Skeleton height={14} />
          <Skeleton height={14} width="92%" />
          <Skeleton height={14} width="85%" />
          <Skeleton height={14} width="88%" />
          <Skeleton height={14} width="80%" />
        </div>
      </div>
    </div>
  );
}
