"use client";

import Link from "next/link";
import { Box, Users, Archive, Plus, ArrowRight } from "lucide-react";
import { MOCK_ITEMS, MOCK_USERS } from "@/lib/mock";
import { Badge } from "@/components/ui/Badge";

export default function DashboardPage() {
  const total = MOCK_ITEMS.length;
  const active = MOCK_ITEMS.filter((i) => i.status === "ACTIVE").length;
  const archived = MOCK_ITEMS.filter((i) => i.status === "ARCHIVED").length;
  const recent = [...MOCK_ITEMS].reverse().slice(0, 3);

  const stats = [
    { label: "Total Items", value: total, icon: <Box size={18} className="text-violet-500" /> },
    { label: "Active", value: active, icon: <Box size={18} className="text-green-500" /> },
    { label: "Users", value: MOCK_USERS.length, icon: <Users size={18} className="text-blue-500" /> },
    { label: "Archived", value: archived, icon: <Archive size={18} className="text-neutral-400" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">Welcome back. Here&apos;s what&apos;s going on.</p>
        </div>
        <Link
          href="/items"
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          New item
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">{s.label}</span>
              {s.icon}
            </div>
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">{s.value}</span>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Recent Items</h2>
          <Link
            href="/items"
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {recent.map((item) => (
            <Link
              key={item.id}
              href={`/items/${item.id}`}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 flex items-center justify-between gap-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{item.title}</p>
                <p className="text-xs text-neutral-500 truncate mt-0.5">{item.description}</p>
              </div>
              <Badge variant={item.status} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
