"use client";

import { ReactNode } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";

export function MotionProvider({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion();

  return (
    <MotionConfig
      reducedMotion={prefersReduced ? "always" : "user"}
      transition={{
        duration: prefersReduced ? 0 : undefined,
      }}
    >
      {children}
    </MotionConfig>
  );
}
