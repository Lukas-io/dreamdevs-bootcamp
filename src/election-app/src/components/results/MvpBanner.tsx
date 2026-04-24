"use client";

import { Crown, Info } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

interface MvpBannerProps {
  mvp: string;
}

export function MvpBanner({ mvp }: MvpBannerProps) {
  return (
    <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl text-white">
      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
        <Crown size={24} />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Class MVP</p>
          <Tooltip content="Most Valuable Participant — the person with the most total votes across all revealed awards." position="bottom">
            <Info size={12} className="opacity-60 cursor-help" />
          </Tooltip>
        </div>
        <p className="text-2xl font-bold">{mvp}</p>
      </div>
    </div>
  );
}
