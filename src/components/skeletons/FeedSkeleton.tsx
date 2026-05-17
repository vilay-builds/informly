import { Skeleton } from "@/components/ui";

export function FeedSkeleton() {
  return (
    <div className="max-w-lg mx-auto px-5 pt-5 space-y-10">
      <div>
        <Skeleton width={120} height={14} className="mb-2" />
        <Skeleton width={180} height={28} />
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <Skeleton width={60} height={14} />
          <div className="flex gap-1">
            <Skeleton width={20} height={4} rounded="full" />
            <Skeleton width={4} height={4} rounded="full" />
            <Skeleton width={4} height={4} rounded="full" />
          </div>
        </div>
        <Skeleton height={280} rounded="2xl" />
      </section>

      <section>
        <Skeleton width={100} height={14} className="mb-3" />
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-surface rounded-2xl border border-border p-4 flex gap-3"
            >
              <div className="flex-1 space-y-2">
                <Skeleton width={80} height={16} rounded="full" />
                <Skeleton height={16} />
                <Skeleton height={14} width="80%" />
                <Skeleton width={120} height={10} />
              </div>
              <Skeleton width={96} height={96} rounded="xl" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
