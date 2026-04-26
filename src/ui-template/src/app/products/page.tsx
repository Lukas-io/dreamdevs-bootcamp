"use client";

import { useState } from "react";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mock";
import { Product, ProductCategory } from "@/lib/types";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductModal } from "@/components/store/ProductModal";
import { EmptyState } from "@/components/ui/EmptyState";

const CATEGORIES: ("ALL" | ProductCategory)[] = ["ALL", "Electronics", "Clothing", "Food", "Accessories", "Home"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"ALL" | ProductCategory>("ALL");
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc">("default");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>(undefined);

  const filtered = products
    .filter((p) => category === "ALL" || p.category === category)
    .filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0;
    });

  const handleSave = (product: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = product; return next; }
      return [product, ...prev];
    });
    setModalOpen(false);
    setEditProduct(undefined);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Products</h1>
          <p className="text-sm text-neutral-500 mt-1">{products.length} products · {products.filter((p) => p.stock > 0).length} in stock</p>
        </div>
        <button
          onClick={() => { setEditProduct(undefined); setModalOpen(true); }}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity cursor-pointer shrink-0"
        >
          <Plus size={14} />
          New Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-neutral-400 shrink-0" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 outline-none text-neutral-700 dark:text-neutral-300 cursor-pointer"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer
              ${category === c
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
          >
            {c === "ALL" ? "All" : c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try a different search or category filter."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <ProductModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditProduct(undefined); }}
        product={editProduct}
        onSave={handleSave}
      />
    </div>
  );
}
