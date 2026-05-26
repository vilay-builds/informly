import { Transition, Variants } from "framer-motion";

// Canonical motion language for Vero.
// Use these everywhere — don't hand-tune timings per component.

export const easing = {
  // Apple-style spring decay. Use for spatial transitions.
  spring: { type: "spring", stiffness: 320, damping: 32 } as const,
  springSoft: { type: "spring", stiffness: 220, damping: 28 } as const,
  springSnappy: { type: "spring", stiffness: 420, damping: 38 } as const,

  // For opacity / color crossfades use ease, not spring.
  ease: { duration: 0.24, ease: [0.32, 0.72, 0, 1] } as const, // emphasized-decel
  easeSlow: { duration: 0.36, ease: [0.32, 0.72, 0, 1] } as const,
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: easing.ease },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: easing.spring },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: easing.spring },
};

export const stagger = (delay = 0.06): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: delay, delayChildren: 0.04 },
  },
});

export const tap = { scale: 0.97 };
export const hover = { y: -2 };

export const pageTransition: Transition = {
  duration: 0.28,
  ease: [0.32, 0.72, 0, 1],
};
