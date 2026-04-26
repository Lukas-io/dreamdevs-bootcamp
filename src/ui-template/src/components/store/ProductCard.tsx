"use client";

import Link from "next/link";
import { ShoppingCart, Package } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/ToastProvider";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const outOfStock = product.stock === 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    addToast(`${product.name} added to cart`, "success");
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm transition-all flex flex-col"
    >
      <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-600">
            <Package size={48} />
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/70 dark:bg-neutral-900/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-neutral-500 bg-white dark:bg-neutral-900 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700">
              Out of stock
            </span>
          </div>
        )}
        <span className="absolute top-2 left-2 text-xs font-medium bg-white/90 dark:bg-neutral-900/90 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-700 backdrop-blur-sm">
          {product.category}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-sm font-semibold text-neutral-900 dark:text-white line-clamp-2 leading-snug">
          {product.name}
        </p>
        <p className="text-xs text-neutral-500 line-clamp-2 flex-1">{product.description}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-base font-bold text-neutral-900 dark:text-white">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ShoppingCart size={12} />
            Add
          </button>
        </div>
        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs text-amber-600 dark:text-amber-400">Only {product.stock} left</p>
        )}
      </div>
    </Link>
  );
}
