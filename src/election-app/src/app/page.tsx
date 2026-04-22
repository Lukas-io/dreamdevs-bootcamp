"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { awardsApi, votersApi, resultsApi } from "@/lib/api";
import { Award, Voter } from "@/lib/types";
import { AwardCard } from "@/components/awards/AwardCard";
import { Spinner } from "@/components/ui/Spinner";
import { Trophy, Users, Vote, BarChart, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [mvp, setMvp] = useState<string | null>(null);
  const [mostNominated, setMostNominated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [aw, vo] = await Promise.all([
      awardsApi.list().catch(() => [] as Award[]),
      votersApi.list().catch(() => [] as Voter[]),
    ]);
    setAwards(aw);
    setVoters(vo);
    const [mvpRes, mnRes] = await Promise.allSettled([
      resultsApi.mvp(),
      resultsApi.mostNominated(),
    ]);
    if (mvpRes.status === "fulfilled") setMvp(mvpRes.value.mvp);
    if (mnRes.status === "fulfilled") setMostNominated(mnRes.value.mostNominated);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAwards = awards.filter((a) => a.status === "OPEN");
  const revealedAwards = awards.filter((a) => a.revealed);
  const activeVoters = voters.filter((v) => v.active);

  const stats = [
    { label: "Total Awards", value: awards.length, icon: <Trophy size={18} />, color: "text-violet-500" },
    { label: "Open for Voting", value: openAwards.length, icon: <Vote size={18} />, color: "text-green-500" },
    { label: "Total Voters", value: voters.length, icon: <Users size={18} />, color: "text-blue-500" },
    { label: "Results Revealed", value: revealedAwards.length, icon: <BarChart size={18} />, color: "text-amber-500" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Graduating Class Awards — Election Platform</p>
      </div>

      {loading ? (
        <div className="py-20"><Spinner size={28} /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col gap-2">
                <div className={s.color}>{s.icon}</div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-neutral-400">{s.label}</p>
              </div>
            ))}
          </div>

          {(mvp || mostNominated) && (
            <div className="grid md:grid-cols-2 gap-4">
              {mvp && (
                <div className="flex items-center gap-4 p-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center shrink-0">
                    <Trophy size={18} className="text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs text-violet-500 uppercase tracking-wider font-medium">Class MVP</p>
                    <p className="text-base font-bold text-violet-700 dark:text-violet-300">{mvp}</p>
                  </div>
                </div>
              )}
              {mostNominated && (
                <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                    <Users size={18} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-500 uppercase tracking-wider font-medium">Most Nominated</p>
                    <p className="text-base font-bold text-amber-700 dark:text-amber-300">{mostNominated}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Recent Awards</h2>
              <Link href="/awards" className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {awards.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                <Trophy size={32} className="text-neutral-300 dark:text-neutral-700" />
                <div>
                  <p className="text-sm text-neutral-500">No awards yet</p>
                  <p className="text-xs text-neutral-400">Create your first award to get started</p>
                </div>
                <Link href="/awards" className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors">
                  Go to Awards
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {awards.slice(-6).reverse().map((award) => (
                  <AwardCard key={award.id} award={award} onMutate={load} />
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: "/awards", label: "Manage Awards", icon: <Trophy size={15} />, desc: "Create & control awards" },
              { href: "/voters", label: "Voters", icon: <Users size={15} />, desc: `${activeVoters.length} active` },
              { href: "/vote", label: "Vote Now", icon: <Vote size={15} />, desc: `${openAwards.length} open` },
              { href: "/results", label: "View Results", icon: <BarChart size={15} />, desc: "Analytics & winners" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex flex-col gap-1.5 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:shadow-md transition-shadow group">
                <div className="text-neutral-400 group-hover:text-violet-500 transition-colors">{item.icon}</div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-neutral-400">{item.desc}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
