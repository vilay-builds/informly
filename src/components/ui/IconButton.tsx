"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { easing, tap } from "@/lib/motion";

interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
  variant?: "surface" | "glass" | "ghost" | "filled";
  size?: "sm" | "md" | "lg";
  label: string;
  children: ReactNode;
}

const variants = {
  surface:
    "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-hover",
  glass:
    "glass text-text-secondary hover:text-text-primary border border-white/30",
  ghost:
    "bg-transparent text-text-tertiary hover:text-text-primary hover:bg-surface-secondary",
  filled: "bg-primary-500 text-white shadow-md hover:bg-primary-600",
};

const sizes = {
  sm: "w-8 h-8",
  md: "w-9 h-9",
  lg: "w-11 h-11",
};

const MotionButton = motion.button;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { variant = "surface", size = "md", label, children, className = "", ...props },
    ref
  ) => {
    return (
      <MotionButton
        ref={ref}
        whileTap={tap}
        transition={easing.springSnappy}
        aria-label={label}
        className={`inline-flex items-center justify-center rounded-full transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
        {...(props as React.ComponentProps<typeof MotionButton>)}
      >
        {children}
      </MotionButton>
    );
  }
);

IconButton.displayName = "IconButton";
