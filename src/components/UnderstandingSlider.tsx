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
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-text-primary">
          Understanding Level
        </span>
        <span className="text-xs font-medium text-primary-500">
          {levels[value]}
        </span>
      </div>

      <div className="relative">
        <div className="flex justify-between mb-2">
          {levels.map((level, i) => (
            <button
              key={level}
              onClick={() => onChange(i)}
              className={`text-[10px] font-medium transition-colors ${
                i === value ? "text-primary-600" : "text-text-tertiary"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="relative h-2 bg-surface-secondary rounded-full">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
            initial={false}
            animate={{ width: `${(value / 3) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <input
            type="range"
            min="0"
            max="3"
            step="1"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-md border-2 border-primary-500"
            initial={false}
            animate={{ left: `calc(${(value / 3) * 100}% - 10px)` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>
    </div>
  );
}
