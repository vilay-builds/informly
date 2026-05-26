"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  AreaSeries,
  CrosshairMode,
  ColorType,
  LineStyle,
  Time,
} from "lightweight-charts";

export interface ChartPoint {
  time: number; // Unix seconds
  value: number;
}

interface PremiumChartProps {
  data: ChartPoint[];
  isPositive: boolean;
  currency: "$" | "₹";
  height?: number;
  onCrosshairMove?: (point: { value: number; time: number } | null) => void;
}

export function PremiumChart({
  data,
  isPositive,
  currency,
  height = 240,
  onCrosshairMove,
}: PremiumChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const [resolved, setResolved] = useState(false);

  // Read theme colors from CSS variables so the chart matches Vero's palette
  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const styles = getComputedStyle(document.documentElement);
    const primary600 = styles.getPropertyValue("--color-primary-600").trim();
    const primary500 = styles.getPropertyValue("--color-primary-500").trim();
    const textTertiary = styles.getPropertyValue("--color-text-tertiary").trim();
    const surface = styles.getPropertyValue("--color-surface").trim();

    // Use the theme's primary color for positive charts, red for negative
    const upColor = primary600 || "#16a34a";
    const downColor = "#dc2626";
    const lineColor = isPositive ? upColor : downColor;

    // Parse the color for alpha variants
    function hexToRgba(hex: string, alpha: number): string {
      const clean = hex.replace("#", "");
      if (clean.length !== 6) return `rgba(128, 128, 128, ${alpha})`;
      const r = parseInt(clean.slice(0, 2), 16);
      const g = parseInt(clean.slice(2, 4), 16);
      const b = parseInt(clean.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    const topFill = isPositive
      ? hexToRgba(upColor, 0.22)
      : "rgba(220, 38, 38, 0.22)";
    const bottomFill = isPositive
      ? hexToRgba(upColor, 0)
      : "rgba(220, 38, 38, 0)";

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: textTertiary || "#9ca3bf",
        fontFamily:
          "var(--font-inter), -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        fontSize: 11,
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: {
          color: "rgba(0,0,0,0.04)",
          style: LineStyle.Solid,
        },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.12, bottom: 0.08 },
        textColor: textTertiary || "#9ca3bf",
      },
      timeScale: {
        borderVisible: false,
        timeVisible: false,
        secondsVisible: false,
        rightOffset: 2,
        barSpacing: 8,
        minBarSpacing: 1,
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: {
          width: 1,
          color: lineColor + "60",
          style: LineStyle.Solid,
          labelVisible: false,
        },
        horzLine: {
          width: 1,
          color: lineColor + "30",
          style: LineStyle.Dotted,
          labelBackgroundColor: surface || "#ffffff",
          labelVisible: true,
        },
      },
      handleScroll: false,
      handleScale: false,
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor,
      topColor: topFill,
      bottomColor: bottomFill,
      lineWidth: 2,
      priceFormat: {
        type: "price",
        precision: 2,
        minMove: 0.01,
      },
      priceLineVisible: false,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 5,
      crosshairMarkerBorderColor: surface || "#ffffff",
      crosshairMarkerBorderWidth: 2,
      crosshairMarkerBackgroundColor: lineColor,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    series.setData(
      data.map((p) => ({
        time: p.time as Time,
        value: p.value,
      }))
    );

    chart.timeScale().fitContent();

    if (onCrosshairMove) {
      chart.subscribeCrosshairMove((param) => {
        if (!param.point || !param.time || !param.seriesData.size) {
          onCrosshairMove(null);
          return;
        }
        const seriesData = param.seriesData.get(series);
        if (!seriesData) {
          onCrosshairMove(null);
          return;
        }
        const value =
          "value" in seriesData
            ? (seriesData.value as number)
            : (seriesData as { close: number }).close;
        onCrosshairMove({ value, time: param.time as number });
      });
    }

    // Mark as resolved after first render so we can fade in
    requestAnimationFrame(() => setResolved(true));

    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [data, isPositive, height, currency, onCrosshairMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-full transition-opacity duration-300"
      style={{
        height,
        opacity: resolved ? 1 : 0,
      }}
    />
  );
}
