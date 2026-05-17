"use client";

import { motion } from "framer-motion";

const levels = ["Beginner", "Simple", "Standard", "Expert"];

interface UnderstandingSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function UnderstandingSlider({
  value,
  onChange,
}: UnderstandingSliderProps) {
  return (
    <div className="bg-surface rounded-2xl p-4 border border-border">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-semibold text-text-primary">
          Reading Mode
        </span>
        <span className="text-xs font-medium text-primary-500">
          {levels[value]}
        </span>
      </div>

      <div className="relative mx-2">
        {/* Track */}
        <div className="relative h-1.5 bg-surface-secondary rounded-full">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
            initial={false}
            animate={{ width: `${(value / (levels.length - 1)) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Dots + Thumb */}
        <div className="absolute inset-x-0 top-0 h-1.5 flex items-center">
          {levels.map((_, i) => {
            const pct = (i / (levels.length - 1)) * 100;
            const isActive = i === value;
            return (
              <motion.button
                key={i}
                onClick={() => onChange(i)}
                className="absolute -translate-x-1/2"
                style={{ left: `${pct}%` }}
              >
                {isActive ? (
                  <motion.div
                    layoutId="slider-thumb"
                    className="w-5 h-5 bg-white rounded-full shadow-md border-2 border-primary-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-surface-secondary border border-border" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Labels */}
        <div className="relative mt-4">
          {levels.map((level, i) => {
            const pct = (i / (levels.length - 1)) * 100;
            return (
              <button
                key={level}
                onClick={() => onChange(i)}
                className={`absolute -translate-x-1/2 text-[11px] font-medium transition-colors ${
                  i === value ? "text-primary-600" : "text-text-tertiary"
                }`}
                style={{ left: `${pct}%` }}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
