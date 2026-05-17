import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "subtle" | "tinted";
  padding?: "none" | "sm" | "md" | "lg";
}

const variants = {
  default: "bg-surface border border-border",
  elevated: "bg-surface border border-border shadow-md",
  subtle: "bg-surface-secondary border border-transparent",
  tinted: "bg-primary-50 border border-primary-100",
};

const paddings = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = "default", padding = "md", className = "", children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`rounded-2xl ${variants[variant]} ${paddings[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
