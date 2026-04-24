"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { awardsApi, resultsApi } from "@/lib/api";
import { Award, AwardResults, WinnerResult } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { AwardActions } from "@/components/awards/AwardActions";
import { NomineeList } from "@/components/awards/NomineeList";
import { WinnerCard } from "@/components/results/WinnerCard";
import { StatsChart } from "@/components/results/StatsChart";
import { VoteLog } from "@/components/results/VoteLog";
import { Spinner } from "@/components/ui/Spinner";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

type BadgeVariant = "PENDING" | "OPEN" | "CLOSED" | "REVEALED";

function getVariant(award: Award): BadgeVariant {
  if (award.status === "CLOSED" && award.revealed) return "REVEALED";
  return award.status as BadgeVariant;
}

export default function AwardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToast } = useToast();
  const [award, setAward] = useState<Award | null>(null);
  const [results, setResults] = useState<AwardResults | null>(null);
  const [winner, setWinner] = useState<WinnerResult | null>(null);
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const aw = await awardsApi.get(id);
      setAward(aw);
      const res = await resultsApi.forAward(id);
      setResults(res);

      if (aw.revealed) {
        const [w, s] = await Promise.allSettled([
          resultsApi.winner(id),
          resultsApi.stats(id),
        ]);
        if (w.status === "fulfilled") setWinner(w.value);
        if (s.status === "fulfilled") setStats(s.value);
      }
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Failed to load award", "error");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <div className="flex justify-center py-32"><Spinner size={28} /></div>;
  if (!award) return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <p className="text-neutral-500">Award not found.</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/awards" className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">{award.title}</h1>
            <Badge variant={getVariant(award)} />
            {award.anonymous && (
              <span className="flex items-center gap-1 text-xs text-neutral-400">
                <Lock size={10} /> Anonymous
              </span>
            )}
          </div>
        </div>
      </div>

      <AwardActions award={award} onMutate={load} />

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Nominees</h2>
        <NomineeList nominees={award.nominees} />
      </div>

      {award.status === "CLOSED" && !award.revealed && (
        <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <EyeOff size={18} className="text-neutral-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Results are hidden</p>
            <p className="text-xs text-neutral-400">Click &quot;Reveal Results&quot; to make them public.</p>
          </div>
        </div>
      )}

      {award.revealed && winner && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Eye size={15} className="text-violet-500" />
            <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Winner</h2>
          </div>
          <WinnerCard result={winner} />
        </div>
      )}

      {award.revealed && stats && Object.keys(stats).length > 0 && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Vote Breakdown</h2>
          <StatsChart stats={stats} />
        </div>
      )}

      {award.revealed && results && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Vote Log</h2>
          <VoteLog results={results} />
        </div>
      )}

      {award.status === "PENDING" && (
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl text-center">
          <p className="text-xs text-neutral-400">Open voting to allow classmates to cast their votes.</p>
        </div>
      )}

      {award.status === "OPEN" && (
        <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900 rounded-xl">
          <p className="text-xs text-green-600 dark:text-green-400 text-center">Voting is live! Share the Vote page with classmates.</p>
        </div>
      )}
    </div>
  );
}
