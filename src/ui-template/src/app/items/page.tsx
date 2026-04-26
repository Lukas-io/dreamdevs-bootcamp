"use client";

import { useState } from "react";
import { Box, Search, Plus } from "lucide-react";
import { MOCK_ITEMS } from "@/lib/mock";
import { Item, Status } from "@/lib/types";
import { ItemCard } from "@/components/items/ItemCard";
import { ItemModal } from "@/components/items/ItemModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | Status>("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);

  const filtered = items
    .filter((i) => filter === "ALL" || i.status === filter)
    .filter(
      (i) =>
        i.title.toLowerCase().includes(query.toLowerCase()) ||
        i.description.toLowerCase().includes(query.toLowerCase())
    );

  const handleSave = (item: Item) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = item;
        return next;
      }
      return [item, ...prev];
    });
    setModalOpen(false);
    setEditItem(undefined);
  };

  const handleEdit = (item: Item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleDelete = (item: Item) => setDeleteTarget(item);

  const confirmDelete = () => {
    if (deleteTarget) {
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Items</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {items.filter((i) => i.status === "ACTIVE").length} active · {items.length} total
          </p>
        </div>
        <button
          onClick={() => { setEditItem(undefined); setModalOpen(true); }}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus size={14} />
          New Item
        </button>
      </div>

      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
          />
        </div>
        <div className="flex gap-1">
          {(["ALL", "ACTIVE", "ARCHIVED"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer
                ${filter === f
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Box size={32} />}
          title={items.length === 0 ? "No items yet" : "No items match your search"}
          description={items.length === 0 ? "Create your first item to get started." : undefined}
          action={items.length === 0 ? (
            <button
              onClick={() => setModalOpen(true)}
              className="mt-1 px-3 py-2 text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              New Item
            </button>
          ) : undefined}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item)}
            />
          ))}
        </div>
      )}

      <ItemModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(undefined); }}
        item={editItem}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete item"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        danger
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
