"use client";

import { useMemo } from "react";

interface SparklineProps {
  data: number[];
  isPositive: boolean;
  height?: number;
  className?: string;
  /** Override the positive color with the theme primary */
  themeColor?: string;
}

/**
 * Lightweight non-interactive sparkline. Uses monotone cubic Hermite
 * interpolation for the same smooth, no-overshoot curves as the full
 * stock chart, but with no scrubber, labels, or interaction.
 */
export function Sparkline({
  data,
  isPositive,
  height = 64,
  className = "",
  themeColor,
}: SparklineProps) {
  const { pathD, fillD } = useMemo(() => {
    if (data.length === 0) return { pathD: "", fillD: "" };

    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal || 1;
    const padding = 8;
    const w = 100;
    const h = 100;

    const pts: [number, number][] = data.map((val, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((val - minVal) / range) * (h - padding * 2) - padding;
      return [x, y];
    });

    // Monotone cubic Hermite
    const n = pts.length;
    const dxs: number[] = [];
    const slopes: number[] = [];
    for (let i = 0; i < n - 1; i++) {
      const dx = pts[i + 1][0] - pts[i][0];
      const dy = pts[i + 1][1] - pts[i][1];
      dxs.push(dx);
      slopes.push(dx === 0 ? 0 : dy / dx);
    }
    const tangents: number[] = new Array(n);
    tangents[0] = slopes[0] ?? 0;
    tangents[n - 1] = slopes[n - 2] ?? 0;
    for (let i = 1; i < n - 1; i++) {
      const m0 = slopes[i - 1];
      const m1 = slopes[i];
      if (m0 * m1 <= 0) {
        tangents[i] = 0;
      } else {
        const w1 = 2 * dxs[i] + dxs[i - 1];
        const w2 = dxs[i] + 2 * dxs[i - 1];
        tangents[i] = (w1 + w2) / (w1 / m0 + w2 / m1);
      }
    }

    let d = `M ${pts[0][0].toFixed(3)} ${pts[0][1].toFixed(3)}`;
    for (let i = 0; i < n - 1; i++) {
      const dx = dxs[i] / 3;
      const c1x = pts[i][0] + dx;
      const c1y = pts[i][1] + tangents[i] * dx;
      const c2x = pts[i + 1][0] - dx;
      const c2y = pts[i + 1][1] - tangents[i + 1] * dx;
      d += ` C ${c1x.toFixed(3)} ${c1y.toFixed(3)}, ${c2x.toFixed(3)} ${c2y.toFixed(3)}, ${pts[i + 1][0].toFixed(3)} ${pts[i + 1][1].toFixed(3)}`;
    }

    return { pathD: d, fillD: `${d} L 100 100 L 0 100 Z` };
  }, [data]);

  const color = isPositive ? (themeColor || "#16a34a") : "#dc2626";
  const gradId = `spark-${isPositive ? "u" : "d"}-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`w-full ${className}`}
      style={{ height }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#${gradId})`} />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ strokeWidth: "1.75px" }}
      />
    </svg>
  );
}
