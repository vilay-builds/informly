"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { easing, tap } from "@/lib/motion";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
  variant?: Variant;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary-500 text-white shadow-[0_4px_14px_-2px_rgba(91,110,242,0.4)] hover:bg-primary-600",
  secondary:
    "bg-surface text-text-primary border border-border hover:border-border-hover",
  ghost: "bg-transparent text-text-secondary hover:bg-surface-secondary",
  outline:
    "bg-transparent text-primary-500 border border-primary-300 hover:bg-primary-50",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-3.5 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base",
};

const MotionButton = motion.button;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      leadingIcon,
      trailingIcon,
      fullWidth,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <MotionButton
        ref={ref}
        whileTap={tap}
        transition={easing.springSnappy}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        {...(props as React.ComponentProps<typeof MotionButton>)}
      >
        {leadingIcon}
        <span>{children}</span>
        {trailingIcon}
      </MotionButton>
    );
  }
);

Button.displayName = "Button";
