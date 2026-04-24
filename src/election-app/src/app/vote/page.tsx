"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { awardsApi, resultsApi, votesApi } from "@/lib/api";
import { Award } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { AwardSelect } from "@/components/vote/AwardSelect";
import { NomineeSelect } from "@/components/vote/NomineeSelect";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/ToastProvider";
import { CheckCircle, ChevronRight, ArrowLeft } from "lucide-react";

type Step = 1 | 2 | 3;

export default function VotePage() {
  const { voter, authLoading } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>(1);
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [votedAwardIds, setVotedAwardIds] = useState<string[]>([]);
  const [votingLoading, setVotingLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!voter) {
      router.replace("/login?redirect=/vote");
      return;
    }
    load();
  }, [authLoading, voter]);

  const load = async () => {
    if (!voter) return;
    setLoading(true);
    try {
      const allAwards = await awardsApi.list();
      setAwards(allAwards);

      const open = allAwards.filter((a) => a.status === "OPEN" && !a.anonymous);
      const results = await Promise.allSettled(
        open.map(async (award) => {
          const res = await resultsApi.forAward(award.id);
          return res.votes?.some((v) => v.voterId === voter.id) ? award.id : null;
        })
      );
      setVotedAwardIds(
        results.flatMap((r) => (r.status === "fulfilled" && r.value ? [r.value] : []))
      );
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Failed to load awards", "error");
    }
    setLoading(false);
  };

  const handleVote = async (nomineeName: string) => {
    if (!selectedAward) return;
    setVotingLoading(true);
    try {
      await votesApi.cast({ awardId: selectedAward.id, nomineeName });
      setStep(3);
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Vote failed", "error");
    } finally {
      setVotingLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setSelectedAward(null);
    setVotedAwardIds([]);
    load();
  };

  const steps = [
    { num: 1, label: "Choose award" },
    { num: 2, label: "Cast vote" },
  ];

  if (authLoading || (!voter && !authLoading)) {
    return <div className="flex justify-center py-32"><Spinner size={28} /></div>;
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Vote</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Voting as <span className="font-medium text-neutral-700 dark:text-neutral-300">{voter!.name}</span>
        </p>
      </div>

      {step !== 3 && (
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold transition-colors
                ${step === s.num ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900" :
                  step > s.num ? "bg-green-500 text-white" :
                  "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"}`}
              >
                {step > s.num ? <CheckCircle size={12} /> : s.num}
              </div>
              <span className={`text-xs hidden sm:block ${step === s.num ? "text-neutral-900 dark:text-white font-medium" : "text-neutral-400"}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && <ChevronRight size={12} className="text-neutral-300 ml-1" />}
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="py-20"><Spinner size={28} /></div>
      ) : step === 3 ? (
        <div className="flex flex-col items-center gap-5 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">Vote cast!</p>
            <p className="text-sm text-neutral-500 mt-1">
              Your vote for <span className="font-medium text-neutral-700 dark:text-neutral-300">{selectedAward?.title}</span> has been recorded.
            </p>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            Vote in another award
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">Choose an award</p>
              <AwardSelect
                awards={awards}
                onSelect={(award) => { setSelectedAward(award); setStep(2); }}
                votedAwardIds={votedAwardIds}
              />
            </div>
          )}

          {step === 2 && selectedAward && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">{selectedAward.title}</p>
                <button onClick={() => setStep(1)} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer">
                  Back
                </button>
              </div>
              <NomineeSelect award={selectedAward} onVote={handleVote} loading={votingLoading} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
