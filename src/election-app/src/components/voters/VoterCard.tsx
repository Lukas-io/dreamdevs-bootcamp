"use client";

import { useState } from "react";
import { Voter } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { votersApi } from "@/lib/api";
import { useToast } from "@/components/ui/ToastProvider";
import { UserX } from "lucide-react";

interface VoterCardProps {
  voter: Voter;
  onMutate: () => void;
}

export function VoterCard({ voter, onMutate }: VoterCardProps) {
  const { addToast } = useToast();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      await votersApi.deactivate(voter.id);
      addToast(`${voter.name} has been deactivated.`, "info");
      onMutate();
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Failed to deactivate", "error");
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between py-3 px-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
        <div className="flex flex-col gap-0.5">
          <span className={`text-sm font-medium ${voter.active ? "text-neutral-900 dark:text-white" : "text-neutral-400 line-through"}`}>
            {voter.name}
          </span>
          <span className="text-xs text-neutral-400">{voter.studentId}</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={voter.active ? "active" : "inactive"} label={voter.active ? "Active" : "Inactive"} />
          {voter.active && (
            <Button
              size="sm"
              variant="ghost"
              icon={<UserX size={13} />}
              onClick={() => setConfirm(true)}
              className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            />
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={handleDeactivate}
        title="Deactivate Voter"
        message={`Deactivate ${voter.name}? They will no longer be able to vote.`}
        danger
        loading={loading}
      />
    </>
  );
}
