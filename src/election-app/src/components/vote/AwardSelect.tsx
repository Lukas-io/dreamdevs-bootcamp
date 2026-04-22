"use client";

import { Award } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Vote, Users, ChevronRight } from "lucide-react";

interface AwardSelectProps {
  awards: Award[];
  onSelect: (award: Award) => void;
}

export function AwardSelect({ awards, onSelect }: AwardSelectProps) {
  const open = awards.filter((a) => a.status === "OPEN");

  if (open.length === 0) {
    return (
      <EmptyState
        icon={<Vote size={32} />}
        title="No awards are open for voting"
        description="Check back when an organizer opens an award."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {open.map((award) => (
        <button
          key={award.id}
          onClick={() => onSelect(award)}
          className="flex items-center justify-between px-4 py-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-left hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors cursor-pointer group"
        >
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400">
              {award.title}
            </p>
            <p className="flex items-center gap-1 text-xs text-neutral-400">
              <Users size={11} />
              {award.nominees.length} nominee{award.nominees.length !== 1 ? "s" : ""}
            </p>
          </div>
          <ChevronRight size={16} className="text-neutral-300 group-hover:text-violet-400 shrink-0" />
        </button>
      ))}
    </div>
  );
}
