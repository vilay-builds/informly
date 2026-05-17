"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

interface StockChartProps {
  data: number[];
  isPositive: boolean;
  height?: number;
  currency?: string;
}

export function StockChart({
  data,
  isPositive,
  height = 200,
  currency = "$",
}: StockChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { pathD, fillD, min, max, points } = useMemo(() => {
    if (data.length === 0) {
      return { pathD: "", fillD: "", min: 0, max: 0, points: [] as const };
    }
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal || 1;
    const padding = 4;
    const w = 100;
    const h = 100;

    const pts = data.map((val, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((val - minVal) / range) * (h - padding * 2) - padding;
      return [x, y] as [number, number];
    });

    // Catmull-Rom → cubic Bezier for smooth, natural curves
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;

      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
    }

    const fill = `${d} L ${w} ${h} L 0 ${h} Z`;

    return {
      pathD: d,
      fillD: fill,
      min: minVal,
      max: maxVal,
      points: pts,
    };
  }, [data]);

  const color = isPositive ? "#22c55e" : "#ef4444";
  const gradientId = `chart-gradient-${isPositive ? "up" : "down"}`;

  const formatPrice = (p: number) =>
    currency === "₹"
      ? p.toLocaleString("en-IN", { maximumFractionDigits: 2 })
      : p.toLocaleString("en-US", { maximumFractionDigits: 2 });

  const handlePointer = (e: React.PointerEvent) => {
    if (!containerRef.current || data.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const idx = Math.round(xPct * (data.length - 1));
    setHoverIndex(idx);
  };

  const hover = hoverIndex !== null ? points[hoverIndex] : null;
  const hoverPrice = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full touch-none select-none"
      style={{ height }}
      onPointerDown={handlePointer}
      onPointerMove={(e) => {
        if (e.buttons > 0 || e.pointerType === "touch") handlePointer(e);
      }}
      onPointerUp={() => setHoverIndex(null)}
      onPointerLeave={() => setHoverIndex(null)}
      onPointerCancel={() => setHoverIndex(null)}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          d={fillD}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ strokeWidth: "2px" }}
        />

        {/* Crosshair */}
        {hover && (
          <>
            <line
              x1={hover[0]}
              y1={0}
              x2={hover[0]}
              y2={100}
              stroke={color}
              strokeOpacity="0.3"
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke"
              style={{ strokeWidth: "1px" }}
            />
            <circle
              cx={hover[0]}
              cy={hover[1]}
              r="4"
              fill="white"
              stroke={color}
              vectorEffect="non-scaling-stroke"
              style={{ strokeWidth: "2px" }}
            />
          </>
        )}
      </svg>

      {/* Hover price label */}
      {hover && hoverPrice !== null && containerRef.current && (
        <div
          className="absolute -top-1 pointer-events-none"
          style={{
            left: `${hover[0]}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-text-primary text-white text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap shadow-lg">
            {currency}
            {formatPrice(hoverPrice)}
          </div>
        </div>
      )}

      {/* Min/max labels — fade out during scrub */}
      <div
        className="absolute right-0 top-0 text-[10px] text-text-tertiary font-medium transition-opacity"
        style={{ opacity: hover ? 0 : 1 }}
      >
        {currency}
        {formatPrice(max)}
      </div>
      <div
        className="absolute right-0 bottom-0 text-[10px] text-text-tertiary font-medium transition-opacity"
        style={{ opacity: hover ? 0 : 1 }}
      >
        {currency}
        {formatPrice(min)}
      </div>
    </div>
  );
}

// Smooth, realistic mock data: drifted sine modulation + tiny noise, then smoothed
export function generateChartData(
  startPrice: number,
  endPrice: number,
  points: number,
  noise: number = 0.003
): number[] {
  const raw: number[] = [];

  // Pick a few harmonics for natural-looking oscillation
  const wave1Amp = 0.015 + Math.random() * 0.01;
  const wave1Freq = 1 + Math.random() * 1.5;
  const wave1Phase = Math.random() * Math.PI * 2;

  const wave2Amp = 0.008 + Math.random() * 0.008;
  const wave2Freq = 3 + Math.random() * 3;
  const wave2Phase = Math.random() * Math.PI * 2;

  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    // Linear drift between start and end
    const base = startPrice + (endPrice - startPrice) * t;
    // Multi-harmonic oscillation around the trend
    const osc =
      base *
      (wave1Amp * Math.sin(t * Math.PI * 2 * wave1Freq + wave1Phase) +
        wave2Amp * Math.sin(t * Math.PI * 2 * wave2Freq + wave2Phase));
    // Tiny noise
    const jitter = (Math.random() - 0.5) * 2 * noise * base;
    raw.push(base + osc + jitter);
  }

  // 3-point moving average to kill any remaining jaggedness
  const smoothed = raw.map((_, i) => {
    const prev = raw[i - 1] ?? raw[i];
    const next = raw[i + 1] ?? raw[i];
    return (prev + raw[i] * 2 + next) / 4;
  });

  // Anchor endpoints
  smoothed[0] = startPrice;
  smoothed[smoothed.length - 1] = endPrice;

  return smoothed;
}
