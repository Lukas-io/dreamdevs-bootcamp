"use client";

import { Loader2 } from "lucide-react";

export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <Loader2 size={size} className="animate-spin text-neutral-400" />
    </div>
  );
}
