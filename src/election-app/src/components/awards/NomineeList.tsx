"use client";

interface NomineeListProps {
  nominees: string[];
}

export function NomineeList({ nominees }: NomineeListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {nominees.map((name) => (
        <span
          key={name}
          className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium"
        >
          {name}
        </span>
      ))}
    </div>
  );
}
