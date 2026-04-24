"use client";

import { useState } from "react";
import { Voter } from "@/lib/types";
import { Search, UserCheck } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

interface VoterSelectProps {
  voters: Voter[];
  onSelect: (voter: Voter) => void;
}

export function VoterSelect({ voters, onSelect }: VoterSelectProps) {
  const [query, setQuery] = useState("");
  const active = voters.filter((v) => v.active);
  const filtered = active.filter(
    (v) =>
      v.name.toLowerCase().includes(query.toLowerCase()) ||
      v.studentId.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or student ID…"
          aria-label="Search voters"
          className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<UserCheck size={32} />}
          title={active.length === 0 ? "No active voters registered" : "No voters match your search"}
          description={active.length === 0 ? "Register voters first before voting." : undefined}
        />
      ) : (
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
          {filtered.map((voter) => (
            <button
              key={voter.id}
              onClick={() => onSelect(voter)}
              className="flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-left hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors cursor-pointer group"
            >
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400">
                  {voter.name}
                </p>
                <p className="text-xs text-neutral-400">{voter.studentId}</p>
              </div>
              <UserCheck size={14} className="text-neutral-300 group-hover:text-violet-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
