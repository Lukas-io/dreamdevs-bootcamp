"use client";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      {icon && (
        <div className="text-neutral-300 dark:text-neutral-700">{icon}</div>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {title}
        </p>
        {description && (
          <p className="text-xs text-neutral-400 dark:text-neutral-600">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
