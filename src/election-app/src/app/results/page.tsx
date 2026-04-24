"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { awardsApi, resultsApi } from "@/lib/api";
import { Award, WinnerResult } from "@/lib/types";
import { MvpBanner } from "@/components/results/MvpBanner";
import { SweepPanel } from "@/components/results/SweepPanel";
import { StatsChart } from "@/components/results/StatsChart";
import { WinnerCard } from "@/components/results/WinnerCard";
import { SummaryBlock } from "@/components/results/SummaryBlock";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tooltip } from "@/components/ui/Tooltip";
import { BarChart, Users, ChevronRight, Shield, TrendingUp, Tag, Info } from "lucide-react";

interface AwardResultData {
  award: Award;
  winner: WinnerResult | null;
  stats: Record<string, number> | null;
}

export default function ResultsPage() {
  const [mvp, setMvp] = useState<string | null>(null);
  const [mostNominated, setMostNominated] = useState<string | null>(null);
  const [sweep, setSweep] = useState<Record<string, string[]>>({});
  const [underdogs, setUnderdogs] = useState<Record<string, string[]>>({});
  const [summary, setSummary] = useState<string | null>(null);
  const [awardResults, setAwardResults] = useState<AwardResultData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [
        mvpRes, mnRes, swRes, udRes, sumRes, awRes,
      ] = await Promise.allSettled([
        resultsApi.mvp(),
        resultsApi.mostNominated(),
        resultsApi.sweep(),
        resultsApi.underdogs(),
        resultsApi.summary(),
        awardsApi.list(),
      ]);

      if (mvpRes.status === "fulfilled") setMvp(mvpRes.value.mvp);
      if (mnRes.status === "fulfilled") setMostNominated(mnRes.value.mostNominated);
      if (swRes.status === "fulfilled") setSweep(swRes.value);
      if (udRes.status === "fulfilled") setUnderdogs(udRes.value);
      if (sumRes.status === "fulfilled") setSummary(sumRes.value.summary);

      if (awRes.status === "fulfilled") {
        const revealed = awRes.value.filter((a) => a.revealed);
        const results = await Promise.all(
          revealed.map(async (award) => {
            const [w, s] = await Promise.allSettled([
              resultsApi.winner(award.id),
              resultsApi.stats(award.id),
            ]);
            return {
              award,
              winner: w.status === "fulfilled" ? w.value : null,
              stats: s.status === "fulfilled" ? s.value : null,
            };
          })
        );
        setAwardResults(results);
      }
      setLoading(false);
    };
    load();
  }, []);

  const hasAnyData = mvp || awardResults.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Results</h1>
        <p className="text-sm text-neutral-500 mt-1">Analytics and winners across all awards</p>
      </div>

      {loading ? (
        <div className="py-20"><Spinner size={28} /></div>
      ) : !hasAnyData ? (
        <EmptyState
          icon={<BarChart size={32} />}
          title="No results yet"
          description="Results appear here once awards are closed and their results revealed. Head to Awards to manage the lifecycle."
          action={
            <Link href="/awards" className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors">
              Go to Awards <ChevronRight size={14} />
            </Link>
          }
        />
      ) : (
        <>
          {mvp && <MvpBanner mvp={mvp} />}

          <div className="grid md:grid-cols-2 gap-4">
            {mostNominated && (
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <Tag size={18} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs text-blue-500 uppercase tracking-wider font-medium">Most Nominated</p>
                    <Tooltip content="The person who appeared as a nominee in the most awards." position="top">
                      <Info size={11} className="text-neutral-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <p className="text-base font-bold text-neutral-900 dark:text-white">{mostNominated}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                <Shield size={15} className="text-rose-500" />
                Underdogs
                <Tooltip content="Nominees who received exactly one vote — the dark horses of the election." position="top">
                  <Info size={13} className="text-neutral-400 cursor-help" />
                </Tooltip>
              </div>
              {Object.entries(underdogs).filter(([, names]) => names.length > 0).length === 0 ? (
                <p className="text-xs text-neutral-400 italic">No underdogs found.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {Object.entries(underdogs)
                    .filter(([, names]) => names.length > 0)
                    .map(([title, names]) => (
                      <div key={title} className="flex flex-wrap gap-1 items-center">
                        <span className="text-xs text-neutral-500 shrink-0">{title}:</span>
                        {names.map((n) => (
                          <span key={n} className="text-xs px-2 py-0.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-md">{n}</span>
                        ))}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-amber-500" />
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Award Sweep</h2>
              <Tooltip content="A 'sweep' is when one person wins more than one award." position="top">
                <Info size={13} className="text-neutral-400 cursor-help" />
              </Tooltip>
            </div>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
              <SweepPanel sweep={sweep} />
            </div>
          </div>

          {awardResults.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Users size={15} className="text-violet-500" />
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Per-Award Results</h2>
              </div>
              {awardResults.map(({ award, winner, stats }) => (
                <div key={award.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{award.title}</h3>
                    <Link href={`/awards/${award.id}`} className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                      Details <ChevronRight size={12} />
                    </Link>
                  </div>
                  {winner && <WinnerCard result={winner} />}
                  {stats && Object.keys(stats).length > 0 && <StatsChart stats={stats} />}
                </div>
              ))}
            </div>
          )}

          {summary && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Full Summary</h2>
              <SummaryBlock summary={summary} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
