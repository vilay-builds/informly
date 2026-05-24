import { Skeleton } from "@/components/ui";

export default function StockLoading() {
  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-white/30">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton width={36} height={36} rounded="full" />
            <Skeleton width={84} height={24} rounded="full" />
          </div>
          <Skeleton width={36} height={36} rounded="full" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-8 space-y-8">
        {/* Title + price */}
        <div>
          <Skeleton width={60} height={10} className="mb-2" />
          <Skeleton width={180} height={16} className="mb-3" />
          <Skeleton width={240} height={44} className="mb-2" />
          <Skeleton width={140} height={14} />
        </div>

        {/* Chart */}
        <div>
          <Skeleton height={260} rounded="2xl" />
          <div className="flex items-center justify-center gap-1 mt-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} width={42} height={28} rounded="full" />
            ))}
          </div>
        </div>

        {/* Range stats */}
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={68} rounded="xl" />
          ))}
        </div>

        {/* Market stats */}
        <Skeleton height={170} rounded="2xl" />

        {/* Signal */}
        <Skeleton height={120} rounded="2xl" />

        {/* Term Fit + Beginner Verdict */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Skeleton height={150} rounded="2xl" />
          <Skeleton height={150} rounded="2xl" />
        </div>

        {/* About */}
        <Skeleton height={120} rounded="2xl" />
      </main>
    </div>
  );
}
