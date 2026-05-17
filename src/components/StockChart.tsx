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

  const { pathD, fillD, min, max, normalizedPoints } = useMemo(() => {
    if (data.length === 0) {
      return {
        pathD: "",
        fillD: "",
        min: 0,
        max: 0,
        normalizedPoints: [] as { xPct: number; yPct: number }[],
      };
    }
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal || 1;
    const padding = 6; // % of viewBox
    const w = 100;
    const h = 100;

    const pts = data.map((val, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((val - minVal) / range) * (h - padding * 2) - padding;
      return [x, y] as [number, number];
    });

    // Catmull-Rom → cubic Bezier
    let d = `M ${pts[0][0].toFixed(3)} ${pts[0][1].toFixed(3)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;

      d += ` C ${c1x.toFixed(3)} ${c1y.toFixed(3)}, ${c2x.toFixed(3)} ${c2y.toFixed(3)}, ${p2[0].toFixed(3)} ${p2[1].toFixed(3)}`;
    }

    const fill = `${d} L 100 100 L 0 100 Z`;

    return {
      pathD: d,
      fillD: fill,
      min: minVal,
      max: maxVal,
      normalizedPoints: pts.map(([x, y]) => ({ xPct: x, yPct: y })),
    };
  }, [data]);

  const color = isPositive ? "#16a34a" : "#dc2626";
  const colorRing = isPositive
    ? "rgba(22, 163, 74, 0.22)"
    : "rgba(220, 38, 38, 0.22)";
  const gradientId = `chart-grad-${isPositive ? "up" : "down"}`;

  const formatPrice = (p: number) =>
    currency === "₹"
      ? p.toLocaleString("en-IN", { maximumFractionDigits: 2 })
      : p.toLocaleString("en-US", { maximumFractionDigits: 2 });

  const updateHover = (clientX: number) => {
    if (!containerRef.current || data.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const idx = Math.round(xPct * (data.length - 1));
    setHoverIndex(idx);
  };

  const clearHover = () => setHoverIndex(null);

  const hover = hoverIndex !== null ? normalizedPoints[hoverIndex] : null;
  const hoverPrice = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full touch-none select-none"
      style={{ height }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        updateHover(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons > 0 || e.pointerType === "touch") {
          updateHover(e.clientX);
        }
      }}
      onPointerUp={clearHover}
      onPointerCancel={clearHover}
      onPointerLeave={clearHover}
    >
      {/* The line + fill (stretched is fine — it's a path, not a circle) */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
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
          style={{ strokeWidth: "1.75px" }}
        />
      </svg>

      {/* HTML overlay — guarantees pixel-perfect circles and lines */}
      {hover && (
        <>
          {/* Crosshair */}
          <div
            className="absolute top-0 bottom-0 w-px pointer-events-none"
            style={{
              left: `${hover.xPct}%`,
              background: `linear-gradient(to bottom, transparent, ${color}40 8%, ${color}40 92%, transparent)`,
            }}
          />
          {/* Marker dot — fixed pixel size */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${hover.xPct}%`,
              top: `${hover.yPct}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: 18,
                height: 18,
                background: colorRing,
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 rounded-full bg-white"
              style={{
                width: 9,
                height: 9,
                transform: "translate(-50%, -50%)",
                boxShadow: `0 0 0 2px ${color}, 0 2px 4px rgba(0,0,0,0.12)`,
              }}
            />
          </div>
        </>
      )}

      {/* Floating price label */}
      {hover && hoverPrice !== null && (
        <div
          className="absolute pointer-events-none z-10"
          style={{
            left: `${hover.xPct}%`,
            top: 0,
            transform: "translate(-50%, -8px)",
          }}
        >
          <div className="bg-text-primary text-white text-[11px] font-semibold px-2 py-1 rounded-md whitespace-nowrap shadow-md">
            {currency}
            {formatPrice(hoverPrice)}
          </div>
        </div>
      )}

      {/* Min/max corner labels */}
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

export function generateChartData(
  startPrice: number,
  endPrice: number,
  points: number,
  noise: number = 0.003
): number[] {
  const raw: number[] = [];

  const wave1Amp = 0.012 + Math.random() * 0.01;
  const wave1Freq = 1 + Math.random() * 1.5;
  const wave1Phase = Math.random() * Math.PI * 2;

  const wave2Amp = 0.006 + Math.random() * 0.006;
  const wave2Freq = 3 + Math.random() * 3;
  const wave2Phase = Math.random() * Math.PI * 2;

  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const base = startPrice + (endPrice - startPrice) * t;
    const osc =
      base *
      (wave1Amp * Math.sin(t * Math.PI * 2 * wave1Freq + wave1Phase) +
        wave2Amp * Math.sin(t * Math.PI * 2 * wave2Freq + wave2Phase));
    const jitter = (Math.random() - 0.5) * 2 * noise * base;
    raw.push(base + osc + jitter);
  }

  const smoothed = raw.map((_, i) => {
    const prev = raw[i - 1] ?? raw[i];
    const next = raw[i + 1] ?? raw[i];
    return (prev + raw[i] * 2 + next) / 4;
  });

  smoothed[0] = startPrice;
  smoothed[smoothed.length - 1] = endPrice;

  return smoothed;
}
