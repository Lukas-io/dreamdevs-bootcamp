"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TagInput } from "@/components/ui/TagInput";
import { awardsApi } from "@/lib/api";
import { useToast } from "@/components/ui/ToastProvider";
import { Tooltip } from "@/components/ui/Tooltip";
import { Info } from "lucide-react";

interface CreateAwardModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateAwardModal({ open, onClose, onCreated }: CreateAwardModalProps) {
  const { addToast } = useToast();
  const [title, setTitle] = useState("");
  const [nominees, setNominees] = useState<string[]>([]);
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; nominees?: string }>({});

  const reset = () => {
    setTitle("");
    setNominees([]);
    setAnonymous(false);
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    const errs: typeof errors = {};
    if (!title.trim()) errs.title = "Title is required.";
    if (nominees.length === 0) errs.nominees = "Add at least one nominee.";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await awardsApi.create({ title: title.trim(), nominees, anonymous });
      addToast(`"${title}" created!`, "success");
      reset();
      onCreated();
      onClose();
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Failed to create award", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create Award"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>Create Award</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Award Title"
          placeholder='e.g. "Most Likely to Get Married"'
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })); }}
          error={errors.title}
        />
        <TagInput
          label="Nominees"
          value={nominees}
          onChange={(tags) => { setNominees(tags); setErrors((p) => ({ ...p, nominees: undefined })); }}
          error={errors.nominees}
          placeholder="Type a name, press Enter"
        />
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setAnonymous((p) => !p)}
            className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${anonymous ? "bg-violet-500" : "bg-neutral-200 dark:bg-neutral-700"}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${anonymous ? "translate-x-4" : ""}`}
            />
          </div>
          <span className="flex items-center gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
            Anonymous voting
            <Tooltip content="Votes are recorded without attaching voter names — nobody can see who voted for whom." position="top">
              <Info size={13} className="text-neutral-400 cursor-help" />
            </Tooltip>
          </span>
        </label>
        {anonymous && (
          <p className="text-xs text-neutral-400 -mt-2">Voter identities will be hidden in the results.</p>
        )}
      </div>
    </Modal>
  );
}
