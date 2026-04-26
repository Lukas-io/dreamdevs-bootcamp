"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Box } from "lucide-react";
import { MOCK_ITEMS } from "@/lib/mock";
import { Item } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ItemModal } from "@/components/items/ItemModal";

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const initial = MOCK_ITEMS.find((i) => i.id === id);
  const [item, setItem] = useState<Item | undefined>(initial);
  const [modalOpen, setModalOpen] = useState(false);

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <EmptyState
          icon={<Box size={32} />}
          title="Item not found"
          description="This item doesn't exist or has been deleted."
          action={
            <button
              onClick={() => history.back()}
              className="mt-1 px-3 py-2 text-sm font-medium border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Back to Items
            </button>
          }
        />
      </div>
    );
  }

  const handleSave = (updated: Item) => {
    setItem(updated);
    setModalOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/items"
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          <ArrowLeft size={14} />
          Items
        </Link>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5 min-w-0">
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">{item.title}</h1>
            <Badge variant={item.status} />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
          >
            <Pencil size={13} />
            Edit
          </button>
        </div>

        {item.description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {item.description}
          </p>
        )}

        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-neutral-400 mb-1">Created</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              {new Date(item.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-400 mb-1">Last updated</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              {new Date(item.updatedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </p>
          </div>
        </div>
      </div>

      <ItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={item}
        onSave={handleSave}
      />
    </div>
  );
}
