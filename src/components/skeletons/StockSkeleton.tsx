import { Skeleton } from "@/components/ui";

export function StockSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-5 pt-6 space-y-6">
      <div className="space-y-2">
        <Skeleton width={100} height={12} />
        <Skeleton width={200} height={40} />
        <Skeleton width={160} height={14} />
      </div>
      <div className="bg-surface rounded-3xl p-5 border border-border space-y-4">
        <Skeleton height={200} rounded="lg" />
        <Skeleton height={36} rounded="full" />
      </div>
      <Skeleton height={120} rounded="2xl" />
      <Skeleton height={140} rounded="2xl" />
      <Skeleton height={180} rounded="2xl" />
    </div>
  );
}
