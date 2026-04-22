"use client";

import { AwardResults } from "@/lib/types";

interface VoteLogProps {
  results: AwardResults;
}

export function VoteLog({ results }: VoteLogProps) {
  if (!results.votes || results.votes.length === 0) {
    return <p className="text-sm text-neutral-400 italic">No votes cast.</p>;
  }

  return (
    <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
      {results.votes.map((vote, i) => (
        <div
          key={`${vote.nomineeName}-${vote.voterId ?? i}`}
          className="flex items-center justify-between py-2 px-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg"
        >
          <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            {vote.nomineeName}
          </span>
          <span className="text-xs text-neutral-400 font-mono">
            {vote.voterId ? `${vote.voterId.slice(0, 8)}…` : "anonymous"}
          </span>
        </div>
      ))}
    </div>
  );
}
