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
  const stopCount = levels.length - 1;

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

      <div>
        {/* Track with dots */}
        <div className="relative h-5 flex items-center">
          <div className="absolute inset-x-0 h-1.5 bg-surface-secondary rounded-full" />
          <motion.div
            className="absolute left-0 h-1.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
            initial={false}
            animate={{ width: `${(value / stopCount) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          {levels.map((_, i) => (
            <button
              key={i}
              onClick={() => onChange(i)}
              className="absolute -translate-x-1/2"
              style={{ left: `${(i / stopCount) * 100}%` }}
            >
              {i === value ? (
                <motion.div
                  layoutId="slider-thumb"
                  className="w-5 h-5 bg-white rounded-full shadow-md border-2 border-primary-500"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-surface-secondary" />
              )}
            </button>
          ))}
        </div>

        {/* Labels — first left-aligned, last right-aligned, middle centered */}
        <div className="flex justify-between mt-2">
          {levels.map((level, i) => (
            <button
              key={level}
              onClick={() => onChange(i)}
              className={`text-[11px] font-medium transition-colors ${
                i === value ? "text-primary-600" : "text-text-tertiary"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
