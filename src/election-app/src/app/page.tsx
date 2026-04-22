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
              <div className="flex flex-col gap-4 py-8 px-6 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Trophy size={20} className="text-violet-400 shrink-0" />
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Getting started</p>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { n: 1, label: "Create awards", href: "/awards", hint: "Add nominees and configure each superlative" },
                    { n: 2, label: "Register voters", href: "/voters", hint: "Add students who will cast votes" },
                    { n: 3, label: "Open voting", href: "/awards", hint: "Activate awards so voters can participate" },
                    { n: 4, label: "Cast votes", href: "/vote", hint: "Each voter picks their nominee per award" },
                    { n: 5, label: "Reveal results", href: "/awards", hint: "Close awards and reveal winners publicly" },
                  ].map((step) => (
                    <Link key={step.n} href={step.href} className="flex items-start gap-3 group">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-xs font-bold flex items-center justify-center mt-0.5 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 group-hover:text-violet-600 transition-colors">{step.n}</span>
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{step.label}</p>
                        <p className="text-xs text-neutral-400">{step.hint}</p>
                      </div>
                    </Link>
                  ))}
                </div>
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
