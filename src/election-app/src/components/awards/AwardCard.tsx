"use client";

import Link from "next/link";
import { Award } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { AwardActions } from "./AwardActions";
import { Lock, Users } from "lucide-react";

type BadgeVariant = "PENDING" | "OPEN" | "CLOSED" | "REVEALED";

function getVariant(award: Award): BadgeVariant {
  if (award.status === "CLOSED" && award.revealed) return "REVEALED";
  return award.status as BadgeVariant;
}

interface AwardCardProps {
  award: Award;
  onMutate: () => void;
}

export function AwardCard({ award, onMutate }: AwardCardProps) {
  return (
    <div className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-150">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <Link
            href={`/awards/${award.id}`}
            className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2"
          >
            {award.title}
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant={getVariant(award)} />
            {award.anonymous && (
              <span className="flex items-center gap-1 text-xs text-neutral-400">
                <Lock size={10} />
                Anonymous
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs text-neutral-400">
        <Users size={12} />
        {award.nominees.length} nominee{award.nominees.length !== 1 ? "s" : ""}
      </div>

      <AwardActions award={award} onMutate={onMutate} compact />
    </div>
  );
}
