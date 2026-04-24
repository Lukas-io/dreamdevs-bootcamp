"use client";

import { Nominee } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";

interface NomineeListProps {
  nominees: Nominee[];
}

export function NomineeList({ nominees }: NomineeListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {nominees.map((nominee) => (
        <span
          key={nominee.name}
          className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium"
        >
          <Avatar name={nominee.name} imageUrl={nominee.imageUrl} size="sm" />
          {nominee.name}
        </span>
      ))}
    </div>
  );
}
