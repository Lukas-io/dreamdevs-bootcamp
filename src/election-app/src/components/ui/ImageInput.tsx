"use client";

import { useState } from "react";
import { imageGenApi } from "@/lib/api";
import { Loader2, Wand2 } from "lucide-react";

interface ImageInputProps {
  value?: string;
  onChange: (url: string) => void;
  prompt?: string;
}

export function ImageInput({ value, onChange, prompt }: ImageInputProps) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setGenerating(true);
    try {
      const { imageUrl } = await imageGenApi.generate(prompt, "election-superlatives");
      onChange(imageUrl);
    } catch {
      // silently fail — user can type URL manually
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Photo URL (optional)"
          className="flex-1 px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
        />
        {prompt && (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            {generating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
            Generate
          </button>
        )}
      </div>
      {value && (
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      )}
    </div>
  );
}
