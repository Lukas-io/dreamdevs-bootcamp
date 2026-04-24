"use client";

import { useState } from "react";
import { Award } from "@/lib/types";
import { awardsApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { Lock, Eye, Play, Square, Trash2 } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

interface AwardActionsProps {
  award: Award;
  onMutate: () => void;
  compact?: boolean;
}

export function AwardActions({ award, onMutate, compact = false }: AwardActionsProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const act = async (action: string, fn: () => Promise<void>, successMsg: string) => {
    setLoading(action);
    try {
      await fn();
      addToast(successMsg, "success");
      onMutate();
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Something went wrong", "error");
    } finally {
      setLoading(null);
    }
  };

  const { status, revealed } = award;
  const size = compact ? "sm" : "md";

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {status === "PENDING" && (
          <>
            <Button
              size={size}
              variant="primary"
              icon={<Play size={13} />}
              loading={loading === "open"}
              onClick={() => act("open", () => awardsApi.open(award.id), "Voting is now open!")}
            >
              Open Voting
            </Button>
            <Button
              size={size}
              variant="ghost"
              icon={<Trash2 size={13} />}
              loading={loading === "delete"}
              onClick={() => setConfirmDelete(true)}
            >
              {!compact && "Delete"}
            </Button>
          </>
        )}

        {status === "OPEN" && (
          <Button
            size={size}
            variant="secondary"
            icon={<Square size={13} />}
            loading={loading === "close"}
            onClick={() => act("close", () => awardsApi.close(award.id), "Voting closed.")}
          >
            Close Voting
          </Button>
        )}

        {status === "CLOSED" && !revealed && (
          <Tooltip content="Permanently reveals the winner to everyone. This cannot be undone." position="top">
            <Button
              size={size}
              variant="primary"
              icon={<Eye size={13} />}
              loading={loading === "reveal"}
              onClick={() => act("reveal", () => awardsApi.reveal(award.id), "Results revealed! 🎉")}
            >
              Reveal Results
            </Button>
          </Tooltip>
        )}

        {status === "CLOSED" && revealed && (
          <span className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400">
            <Lock size={12} />
            Results revealed
          </span>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          act("delete", () => awardsApi.delete(award.id), "Award deleted.");
        }}
        title="Delete Award"
        message={`Are you sure you want to delete "${award.title}"? This cannot be undone.`}
        danger
      />
    </>
  );
}
