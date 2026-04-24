"use client";

import { useEffect, useState } from "react";

interface StatsChartProps {
  stats: Record<string, number>;
}

const colors = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-teal-500",
];

export function StatsChart({ stats }: StatsChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const entries = Object.entries(stats).sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-3">
      {entries.map(([name, pct], i) => (
        <div key={name} className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[60%]">
              {name}
            </span>
            <span className="text-xs text-neutral-500 tabular-nums">{pct}%</span>
          </div>
          <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${colors[i % colors.length]}`}
              style={{ width: mounted ? `${pct}%` : "0%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
