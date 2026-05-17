import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 py-12 ${className}`}
    >
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-surface-secondary flex items-center justify-center text-text-tertiary mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-text-primary mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-tertiary leading-relaxed max-w-xs mb-5">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
