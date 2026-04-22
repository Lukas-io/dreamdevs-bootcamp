"use client";

type BadgeVariant = "PENDING" | "OPEN" | "CLOSED" | "REVEALED" | "active" | "inactive";

const styles: Record<BadgeVariant, string> = {
  PENDING:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  OPEN: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CLOSED:
    "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
  REVEALED:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  active:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  inactive:
    "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
};

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

export function Badge({ variant, label }: BadgeProps) {
  const displayLabel = label ?? variant;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[variant]}`}
    >
      {displayLabel}
    </span>
  );
}
