"use client";

import { useEffect, useState } from "react";
import { votersApi } from "@/lib/api";
import { Voter } from "@/lib/types";
import { VoterCard } from "@/components/voters/VoterCard";
import { RegisterVoterModal } from "@/components/voters/RegisterVoterModal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, Users, Search } from "lucide-react";

export default function VotersPage() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const load = async () => {
    setLoading(true);
    const data = await votersApi.list().catch(() => [] as Voter[]);
    setVoters(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = voters
    .filter((v) => {
      if (filter === "ACTIVE") return v.active;
      if (filter === "INACTIVE") return !v.active;
      return true;
    })
    .filter((v) =>
      v.name.toLowerCase().includes(query.toLowerCase()) ||
      v.studentId.toLowerCase().includes(query.toLowerCase())
    );

  const active = voters.filter((v) => v.active).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Voters</h1>
          <p className="text-sm text-neutral-500 mt-1">{active} active · {voters.length} total</p>
        </div>
        <Button icon={<Plus size={14} />} onClick={() => setShowRegister(true)}>
          Register Voter
        </Button>
      </div>

      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or student ID…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
          />
        </div>
        <div className="flex gap-1">
          {(["ALL", "ACTIVE", "INACTIVE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer
                ${filter === f ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20"><Spinner size={28} /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={32} />}
          title={voters.length === 0 ? "No voters registered" : "No voters match your search"}
          description={voters.length === 0 ? "Register students so they can vote." : undefined}
          action={voters.length === 0 ? (
            <Button icon={<Plus size={14} />} onClick={() => setShowRegister(true)}>
              Register Voter
            </Button>
          ) : undefined}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((voter) => (
            <VoterCard key={voter.id} voter={voter} onMutate={load} />
          ))}
        </div>
      )}

      <RegisterVoterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onRegistered={load}
      />
    </div>
  );
}
