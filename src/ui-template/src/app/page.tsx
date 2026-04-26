"use client";

import Link from "next/link";
import { Box, Users, Archive, Plus, ArrowRight, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { MOCK_ITEMS, MOCK_USERS, MOCK_PRODUCTS, MOCK_ORDERS } from "@/lib/mock";
import { Badge } from "@/components/ui/Badge";

export default function DashboardPage() {
  const totalItems = MOCK_ITEMS.length;
  const activeItems = MOCK_ITEMS.filter((i) => i.status === "ACTIVE").length;
  const archivedItems = MOCK_ITEMS.filter((i) => i.status === "ARCHIVED").length;
  const totalProducts = MOCK_PRODUCTS.length;
  const inStock = MOCK_PRODUCTS.filter((p) => p.stock > 0).length;
  const totalRevenue = MOCK_ORDERS.reduce((sum, o) => sum + o.total, 0);
  const recent = [...MOCK_ITEMS].reverse().slice(0, 3);
  const featuredProducts = MOCK_PRODUCTS.slice(0, 3);

  const stats = [
    { label: "Total Items", value: totalItems, icon: <Box size={18} className="text-violet-500" />, href: "/items" },
    { label: "Active", value: activeItems, icon: <Box size={18} className="text-green-500" />, href: "/items" },
    { label: "Products", value: totalProducts, icon: <Package size={18} className="text-blue-500" />, href: "/products" },
    { label: "In Stock", value: inStock, icon: <TrendingUp size={18} className="text-emerald-500" />, href: "/products" },
    { label: "Users", value: MOCK_USERS.length, icon: <Users size={18} className="text-indigo-500" />, href: "/settings" },
    { label: "Archived", value: archivedItems, icon: <Archive size={18} className="text-neutral-400" />, href: "/items" },
    { label: "Orders", value: MOCK_ORDERS.length, icon: <ShoppingBag size={18} className="text-orange-500" />, href: "/orders" },
    { label: "Revenue", value: `$${totalRevenue.toFixed(0)}`, icon: <TrendingUp size={18} className="text-pink-500" />, href: "/orders" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">Welcome back. Here&apos;s what&apos;s going on.</p>
        </div>
        <Link
          href="/products/new"
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          New item
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col gap-2 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">{s.label}</span>
              {s.icon}
            </div>
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">{s.value}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Recent Items</h2>
            <Link href="/items" className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
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

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Featured Products</h2>
            <Link href="/products" className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0">
                  {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{product.name}</p>
                  <p className="text-xs text-neutral-500">{product.category} · ${product.price}</p>
                </div>
                <span className={`text-xs font-medium ${product.stock === 0 ? "text-red-400" : product.stock <= 5 ? "text-amber-500" : "text-green-600 dark:text-green-400"}`}>
                  {product.stock === 0 ? "Out" : `${product.stock} left`}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
