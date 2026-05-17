import { HTMLAttributes, ReactNode, forwardRef } from "react";

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "danger" | "warning" | "neutral";
  size?: "xs" | "sm" | "md";
  icon?: ReactNode;
}

const variants = {
  default: "bg-surface-secondary text-text-secondary",
  primary: "bg-primary-50 text-primary-700",
  success: "bg-success-400/15 text-success-500",
  danger: "bg-red-100 text-red-500",
  warning: "bg-yellow-100 text-yellow-600",
  neutral: "bg-white/20 text-white backdrop-blur-md border border-white/20",
};

const sizes = {
  xs: "text-[10px] px-2 py-0.5",
  sm: "text-xs px-2.5 py-1",
  md: "text-sm px-3 py-1.5",
};

export const Pill = forwardRef<HTMLSpanElement, PillProps>(
  ({ variant = "default", size = "sm", icon, children, className = "", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1 font-semibold rounded-full whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {icon}
        {children}
      </span>
    );
  }
);

Pill.displayName = "Pill";
