"use client";

interface SummaryBlockProps {
  summary: string;
}

export function SummaryBlock({ summary }: SummaryBlockProps) {
  return (
    <pre className="whitespace-pre-wrap font-mono text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 overflow-x-auto max-h-80 overflow-y-auto border border-neutral-200 dark:border-neutral-800">
      {summary}
    </pre>
  );
}
