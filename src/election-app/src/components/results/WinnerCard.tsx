"use client";

import { WinnerResult } from "@/lib/types";
import { Trophy, Zap } from "lucide-react";

interface WinnerCardProps {
  result: WinnerResult;
}

export function WinnerCard({ result }: WinnerCardProps) {
  if (result.tie) {
    return (
      <div className="flex flex-col gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <Zap size={16} />
          <span className="text-sm font-semibold">It&apos;s a tie!</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.tiedNominees?.map((name) => (
            <span key={name} className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-lg text-sm font-medium">
              {name}
            </span>
          ))}
        </div>
        <p className="text-xs text-amber-500">{result.votes} vote{result.votes !== 1 ? "s" : ""} each</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl">
      <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center shrink-0">
        <Trophy size={20} className="text-violet-600 dark:text-violet-400" />
      </div>
      <div>
        <p className="text-lg font-bold text-violet-700 dark:text-violet-300">{result.winner}</p>
        <p className="text-xs text-violet-500">{result.votes} vote{result.votes !== 1 ? "s" : ""}</p>
      </div>
    </div>
  );
}
