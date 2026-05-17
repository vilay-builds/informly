import { Skeleton } from "@/components/ui";

export function MarketsSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-5 pt-5 space-y-6">
      <Skeleton height={120} rounded="2xl" />
      <div>
        <Skeleton width={120} height={14} className="mb-3" />
        <div className="flex gap-3 overflow-hidden -mx-5 px-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              width={130}
              height={92}
              rounded="2xl"
              className="flex-shrink-0"
            />
          ))}
        </div>
      </div>
      <div>
        <Skeleton width={140} height={14} className="mb-3" />
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height={108} rounded="2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
