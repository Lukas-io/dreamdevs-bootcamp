"use client";

type BadgeVariant = "ACTIVE" | "ARCHIVED" | "PENDING" | "SUCCESS" | "WARNING" | "DANGER";

const styles: Record<BadgeVariant, string> = {
  ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  ARCHIVED: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  SUCCESS: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  WARNING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  DANGER: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

export function Badge({ variant, label }: BadgeProps) {
  const displayLabel = label ?? variant.charAt(0) + variant.slice(1).toLowerCase();
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[variant]}`}
    >
      {displayLabel}
    </span>
  );
}
