"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Item } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

interface ItemCardProps {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
}

export function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 flex items-center gap-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
      <Link href={`/items/${item.id}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-neutral-900 dark:text-white truncate">{item.title}</span>
          <Badge variant={item.status} />
        </div>
        <p className="text-xs text-neutral-500 truncate">{item.description}</p>
      </Link>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Edit"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer"
          aria-label="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
