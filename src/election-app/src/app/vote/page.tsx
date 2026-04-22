"use client";

import { useEffect, useState } from "react";
import { awardsApi, votersApi, votesApi, resultsApi } from "@/lib/api";
import { Award, Voter } from "@/lib/types";
import { VoterSelect } from "@/components/vote/VoterSelect";
import { AwardSelect } from "@/components/vote/AwardSelect";
import { NomineeSelect } from "@/components/vote/NomineeSelect";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/ToastProvider";
import { CheckCircle, ChevronRight, ArrowLeft } from "lucide-react";

type Step = 1 | 2 | 3 | 4;

export default function VotePage() {
  const { addToast } = useToast();
  const [voters, setVoters] = useState<Voter[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>(1);
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [votedAwardIds, setVotedAwardIds] = useState<string[]>([]);
  const [votingLoading, setVotingLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const [v, a] = await Promise.all([
      votersApi.list().catch(() => [] as Voter[]),
      awardsApi.list().catch(() => [] as Award[]),
    ]);
    setVoters(v);
    setAwards(a);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleVoterSelect = async (voter: Voter) => {
    setSelectedVoter(voter);
    setStep(2);
    const open = awards.filter((a) => a.status === "OPEN" && !a.anonymous);
    const results = await Promise.allSettled(
      open.map(async (award) => {
        const res = await resultsApi.forAward(award.id);
        return res.votes?.some((v) => v.voterId === voter.id) ? award.id : null;
      })
    );
    setVotedAwardIds(
      results.flatMap((r) => (r.status === "fulfilled" && r.value ? [r.value] : []))
    );
  };

  const handleVote = async (nomineeName: string) => {
    if (!selectedVoter || !selectedAward) return;
    setVotingLoading(true);
    try {
      await votesApi.cast({
        voterId: selectedVoter.id,
        awardId: selectedAward.id,
        nomineeName,
      });
      setStep(4);
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Vote failed", "error");
    } finally {
      setVotingLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setSelectedVoter(null);
    setSelectedAward(null);
    setVotedAwardIds([]);
    load();
  };

  const steps = [
    { num: 1, label: "Who are you?" },
    { num: 2, label: "Choose award" },
    { num: 3, label: "Cast vote" },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Vote</h1>
        <p className="text-sm text-neutral-500 mt-1">Cast your vote for a superlative award</p>
      </div>

      {step !== 4 && (
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
      ) : step === 4 ? (
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
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">Select your name</p>
                <p className="text-xs text-neutral-400 mt-0.5">Find yourself in the voter registry</p>
              </div>
              <VoterSelect
                voters={voters}
                onSelect={handleVoterSelect}
              />
            </div>
          )}

          {step === 2 && selectedVoter && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">Choose an award</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Voting as <span className="font-medium">{selectedVoter.name}</span></p>
                </div>
                <button onClick={() => setStep(1)} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer">
                  Change
                </button>
              </div>
              <AwardSelect
                awards={awards}
                onSelect={(award) => {
                  setSelectedAward(award);
                  setStep(3);
                }}
                votedAwardIds={votedAwardIds}
              />
            </div>
          )}

          {step === 3 && selectedVoter && selectedAward && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">{selectedAward.title}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Voting as <span className="font-medium">{selectedVoter.name}</span></p>
                </div>
                <button onClick={() => setStep(2)} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer">
                  Back
                </button>
              </div>
              <NomineeSelect
                award={selectedAward}
                onVote={handleVote}
                loading={votingLoading}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
