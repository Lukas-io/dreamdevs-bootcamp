"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageInput } from "@/components/ui/ImageInput";
import { votersApi } from "@/lib/api";
import { useToast } from "@/components/ui/ToastProvider";

interface RegisterVoterModalProps {
  open: boolean;
  onClose: () => void;
  onRegistered: () => void;
}

export function RegisterVoterModal({ open, onClose, onRegistered }: RegisterVoterModalProps) {
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; studentId?: string }>({});

  const reset = () => { setName(""); setStudentId(""); setImageUrl(""); setErrors({}); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Name is required.";
    if (!studentId.trim()) errs.studentId = "Student ID is required.";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await votersApi.register({ name: name.trim(), studentId: studentId.trim(), imageUrl: imageUrl.trim() || undefined });
      addToast(`${name} registered!`, "success");
      reset();
      onRegistered();
      onClose();
    } catch (e) {
      addToast(e instanceof Error ? e.message : "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Register Voter"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>Register</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Full Name"
          placeholder="e.g. Tunde Bello"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
          error={errors.name}
        />
        <Input
          label="Student ID"
          placeholder="e.g. STU2024001"
          value={studentId}
          onChange={(e) => { setStudentId(e.target.value); setErrors((p) => ({ ...p, studentId: undefined })); }}
          error={errors.studentId}
        />
        <div>
          <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Profile Photo (optional)</p>
          <ImageInput
            value={imageUrl}
            onChange={setImageUrl}
            prompt={name.trim() ? `${name.trim()} student portrait` : undefined}
          />
        </div>
      </div>
    </Modal>
  );
}
