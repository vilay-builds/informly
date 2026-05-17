"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface StockChartProps {
  data: number[];
  isPositive: boolean;
  height?: number;
}

export function StockChart({ data, isPositive, height = 180 }: StockChartProps) {
  const { pathD, fillD, min, max } = useMemo(() => {
    if (data.length === 0) {
      return { pathD: "", fillD: "", min: 0, max: 0 };
    }
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal || 1;
    const padding = 4;
    const w = 100;
    const h = 100;

    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((val - minVal) / range) * (h - padding * 2) - padding;
      return [x, y] as const;
    });

    // Smooth path using catmull-rom-ish curves
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const [x1, y1] = points[i - 1];
      const [x2, y2] = points[i];
      const cx = (x1 + x2) / 2;
      d += ` Q ${cx} ${y1} ${cx} ${(y1 + y2) / 2} T ${x2} ${y2}`;
    }

    const fill = `${d} L ${w} ${h} L 0 ${h} Z`;

    return { pathD: d, fillD: fill, min: minVal, max: maxVal };
  }, [data]);

  const color = isPositive ? "#22c55e" : "#ef4444";
  const fillColor = isPositive ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)";
  const gradientId = isPositive ? "chart-gradient-up" : "chart-gradient-down";

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
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
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ strokeWidth: "2px" } as React.CSSProperties}
        />
      </svg>

      {/* Min/max labels */}
      <div className="absolute right-0 top-0 text-[10px] text-text-tertiary font-medium">
        {max.toFixed(2)}
      </div>
      <div className="absolute right-0 bottom-0 text-[10px] text-text-tertiary font-medium">
        {min.toFixed(2)}
      </div>
    </div>
  );
}

// Generate realistic mock data with a directional bias
export function generateChartData(
  startPrice: number,
  endPrice: number,
  points: number,
  volatility: number = 0.02
): number[] {
  const data: number[] = [];
  const drift = (endPrice - startPrice) / points;

  let current = startPrice;
  for (let i = 0; i < points; i++) {
    const noise = (Math.random() - 0.5) * 2 * volatility * current;
    current = current + drift + noise;
    data.push(current);
  }
  // Force final value to match endPrice
  data[data.length - 1] = endPrice;
  return data;
}
