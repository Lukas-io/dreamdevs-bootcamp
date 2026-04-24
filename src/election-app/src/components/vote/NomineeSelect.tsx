"use client";

import { useState } from "react";
import { Award } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

interface NomineeSelectProps {
  award: Award;
  onVote: (nomineeName: string) => void;
  loading?: boolean;
}

export function NomineeSelect({ award, onVote, loading = false }: NomineeSelectProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {award.nominees.map((name) => {
          const isSelected = selected === name;
          return (
            <button
              key={name}
              onClick={() => setSelected(name)}
              className={`flex items-center justify-between px-4 py-3 border rounded-xl text-left transition-all duration-150 cursor-pointer
                ${isSelected
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 dark:border-violet-500"
                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
            >
              <span className={`text-sm font-medium ${isSelected ? "text-violet-700 dark:text-violet-300" : "text-neutral-800 dark:text-neutral-200"}`}>
                {name}
              </span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-violet-500 bg-violet-500" : "border-neutral-300 dark:border-neutral-600"}`}>
                {isSelected && <Check size={11} className="text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      <Button
        onClick={() => selected && onVote(selected)}
        disabled={!selected}
        loading={loading}
        className="w-full justify-center"
      >
        Cast Vote{selected ? ` for ${selected}` : ""}
      </Button>
    </div>
  );
}
