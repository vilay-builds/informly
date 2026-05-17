"use client";

import { Sector } from "@/lib/content/sectors";

interface SectorGridProps {
  sectors: Sector[];
}

// Build a heat-style background based on magnitude. Caps at ±2.5%.
function sectorStyle(change: number) {
  const intensity = Math.min(1, Math.abs(change) / 2.5);
  if (change >= 0) {
    return {
      background: `linear-gradient(135deg, rgba(34, 197, 94, ${0.08 + intensity * 0.18}) 0%, rgba(34, 197, 94, ${0.04 + intensity * 0.12}) 100%)`,
      borderColor: `rgba(34, 197, 94, ${0.15 + intensity * 0.25})`,
      textClass: "text-success-500",
    };
  }
  return {
    background: `linear-gradient(135deg, rgba(220, 38, 38, ${0.08 + intensity * 0.18}) 0%, rgba(220, 38, 38, ${0.04 + intensity * 0.12}) 100%)`,
    borderColor: `rgba(220, 38, 38, ${0.15 + intensity * 0.25})`,
    textClass: "text-red-500",
  };
}

export function SectorGrid({ sectors }: SectorGridProps) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-text-primary mb-3">
        Sectors at a glance
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {sectors.map((sector) => {
          const style = sectorStyle(sector.change);
          return (
            <div
              key={sector.name}
              className="rounded-xl p-3 border transition-transform hover:scale-[1.02]"
              style={{
                background: style.background,
                borderColor: style.borderColor,
              }}
            >
              <p className="text-[10px] font-medium text-text-secondary truncate mb-1">
                {sector.name}
              </p>
              <p
                className={`text-sm font-bold tabular-nums ${style.textClass}`}
              >
                {sector.change >= 0 ? "+" : ""}
                {sector.change}%
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
