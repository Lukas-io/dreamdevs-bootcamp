"use client";

import { useEffect, useState } from "react";
import { awardsApi } from "@/lib/api";
import { Award } from "@/lib/types";
import { AwardCard } from "@/components/awards/AwardCard";
import { CreateAwardModal } from "@/components/awards/CreateAwardModal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, Trophy, ChevronRight as Chevron } from "lucide-react";

type Filter = "ALL" | "PENDING" | "OPEN" | "CLOSED" | "REVEALED";

export default function AwardsPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [showCreate, setShowCreate] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await awardsApi.list().catch(() => [] as Award[]);
    setAwards(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = awards.filter((a) => {
    if (filter === "ALL") return true;
    if (filter === "REVEALED") return a.status === "CLOSED" && a.revealed;
    return a.status === filter;
  });

  const tabs: { key: Filter; label: string }[] = [
    { key: "ALL", label: `All (${awards.length})` },
    { key: "PENDING", label: `Pending (${awards.filter((a) => a.status === "PENDING").length})` },
    { key: "OPEN", label: `Open (${awards.filter((a) => a.status === "OPEN").length})` },
    { key: "CLOSED", label: `Closed (${awards.filter((a) => a.status === "CLOSED" && !a.revealed).length})` },
    { key: "REVEALED", label: `Revealed (${awards.filter((a) => a.revealed).length})` },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Awards</h1>
          <p className="text-sm text-neutral-500 mt-1">Create and manage superlative awards</p>
        </div>
        <Button icon={<Plus size={14} />} onClick={() => setShowCreate(true)}>
          Create Award
        </Button>
      </div>

      <div className="flex items-center gap-1 text-xs text-neutral-400 flex-wrap">
        {(["Pending", "Open", "Closed", "Revealed"] as const).map((s, i, arr) => (
          <span key={s} className="flex items-center gap-1">
            <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">{s}</span>
            {i < arr.length - 1 && <Chevron size={10} className="text-neutral-300 dark:text-neutral-600" />}
          </span>
        ))}
        <span className="text-neutral-300 dark:text-neutral-600 ml-1">← award lifecycle</span>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer
              ${filter === tab.key
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20"><Spinner size={28} /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Trophy size={32} />}
          title={filter === "ALL" ? "No awards yet" : `No ${filter.toLowerCase()} awards`}
          description={filter === "ALL" ? "Create your first award to get started." : undefined}
          action={
            filter === "ALL" ? (
              <Button icon={<Plus size={14} />} onClick={() => setShowCreate(true)}>
                Create Award
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((award) => (
            <AwardCard key={award.id} award={award} onMutate={load} />
          ))}
        </div>
      )}

      <CreateAwardModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={load}
      />
    </div>
  );
}
