"use client";

import { useState, useEffect } from "react";
import { Item, Status } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";

interface ItemModalProps {
  open: boolean;
  onClose: () => void;
  item?: Item;
  onSave: (item: Item) => void;
}

export function ItemModal({ open, onClose, item, onSave }: ItemModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("ACTIVE");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(item?.title ?? "");
      setDescription(item?.description ?? "");
      setStatus(item?.status ?? "ACTIVE");
      setError("");
    }
  }, [open, item]);

  const handleSave = () => {
    if (!title.trim()) { setError("Title is required."); return; }
    const now = new Date().toISOString();
    onSave({
      id: item?.id ?? String(Date.now()),
      title: title.trim(),
      description: description.trim(),
      status,
      createdAt: item?.createdAt ?? now,
      updatedAt: now,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item ? "Edit Item" : "New Item"}
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            {item ? "Save changes" : "Create"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Title</label>
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(""); }}
            placeholder="Enter a title…"
            className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description…"
            rows={3}
            className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 cursor-pointer"
          >
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </Modal>
  );
}
