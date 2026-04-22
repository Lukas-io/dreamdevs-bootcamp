"use client";

import { Sparkles } from "lucide-react";

interface SweepPanelProps {
  sweep: Record<string, string[]>;
}

export function SweepPanel({ sweep }: SweepPanelProps) {
  const entries = Object.entries(sweep);

  if (entries.length === 0) {
    return (
      <p className="text-sm text-neutral-400 italic">No one has won multiple awards yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {entries.map(([name, awards]) => (
        <div key={name} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">{name}</span>
            <span className="text-xs text-neutral-400">· {awards.length} awards</span>
          </div>
          <div className="flex flex-wrap gap-2 pl-5">
            {awards.map((title) => (
              <span
                key={title}
                className="px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 rounded-lg text-xs"
              >
                {title}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
