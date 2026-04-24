"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageInput } from "@/components/ui/ImageInput";
import { awardsApi } from "@/lib/api";
import { Nominee } from "@/lib/types";
import { useToast } from "@/components/ui/ToastProvider";
import { Tooltip } from "@/components/ui/Tooltip";
import { Info, Plus, X } from "lucide-react";

interface CreateAwardModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const emptyNominee = (): Nominee => ({ name: "", imageUrl: undefined });

export function CreateAwardModal({ open, onClose, onCreated }: CreateAwardModalProps) {
  const { addToast } = useToast();
  const [title, setTitle] = useState("");
  const [nominees, setNominees] = useState<Nominee[]>([emptyNominee(), emptyNominee()]);
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; nominees?: string }>({});

  const reset = () => {
    setTitle("");
    setNominees([emptyNominee(), emptyNominee()]);
    setAnonymous(false);
    setErrors({});
  };

  const handleClose = () => { reset(); onClose(); };

  const updateNominee = (i: number, field: keyof Nominee, value: string) => {
    setNominees((prev) => prev.map((n, idx) => idx === i ? { ...n, [field]: value } : n));
    setErrors((p) => ({ ...p, nominees: undefined }));
  };

  const removeNominee = (i: number) => {
    setNominees((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    const errs: typeof errors = {};
    if (!title.trim()) errs.title = "Title is required.";
    const validNominees = nominees.filter((n) => n.name.trim());
    if (validNominees.length === 0) errs.nominees = "Add at least one nominee.";
    const names = validNominees.map((n) => n.name.trim());
    if (new Set(names).size < names.length) errs.nominees = "Nominee names must be unique.";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await awardsApi.create({
        title: title.trim(),
        nominees: validNominees.map((n) => ({ name: n.name.trim(), imageUrl: n.imageUrl || undefined })),
        anonymous,
      });
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
      size="lg"
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

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Nominees</span>
            <button
              type="button"
              onClick={() => setNominees((p) => [...p, emptyNominee()])}
              className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
            >
              <Plus size={12} /> Add Nominee
            </button>
          </div>
          {nominees.map((nominee, i) => (
            <div key={i} className="flex flex-col gap-1.5 p-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl">
              <div className="flex items-center gap-2">
                <input
                  value={nominee.name}
                  onChange={(e) => updateNominee(i, "name", e.target.value)}
                  placeholder={`Nominee ${i + 1} name`}
                  className="flex-1 px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                />
                {nominees.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeNominee(i)}
                    className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              <ImageInput
                value={nominee.imageUrl}
                onChange={(url) => updateNominee(i, "imageUrl", url)}
                prompt={nominee.name.trim() ? `${nominee.name.trim()} student portrait` : undefined}
              />
            </div>
          ))}
          {errors.nominees && <p className="text-xs text-red-500">{errors.nominees}</p>}
        </div>

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
