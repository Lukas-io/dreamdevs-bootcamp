"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Package, Pencil, Minus, Plus } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mock";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/ToastProvider";
import { ProductModal } from "@/components/store/ProductModal";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const initial = MOCK_PRODUCTS.find((p) => p.id === id);
  const [product, setProduct] = useState<Product | undefined>(initial);
  const [quantity, setQuantity] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const { addItem } = useCart();
  const { addToast } = useToast();

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          icon={<Package size={32} />}
          title="Product not found"
          description="This product doesn't exist or has been removed."
          action={
            <Link href="/products" className="mt-1 px-3 py-2 text-sm font-medium border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              Back to Products
            </Link>
          }
        />
      </div>
    );
  }

  const outOfStock = product.stock === 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    addToast(`${product.name} added to cart`, "success");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <Link href="/products" className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors w-fit">
        <ArrowLeft size={14} />
        Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-2xl overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-600">
              <Package size={80} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-violet-600 dark:text-violet-400">{product.category}</span>
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white leading-snug">{product.name}</h1>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
            >
              <Pencil size={12} />
              Edit
            </button>
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{product.description}</p>

          <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 flex flex-col gap-4">
            <span className="text-3xl font-bold text-neutral-900 dark:text-white">${product.price.toFixed(2)}</span>

            <div className="flex flex-col gap-1.5">
              {outOfStock ? (
                <span className="text-sm text-red-500 font-medium">Out of stock</span>
              ) : (
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  In stock {product.stock <= 5 && `· Only ${product.stock} left`}
                </span>
              )}
            </div>

            {!outOfStock && (
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-neutral-900 dark:text-white min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <ShoppingCart size={15} />
                  Add to Cart
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 text-xs text-neutral-400">
            Added {new Date(product.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
          </div>
        </div>
      </div>

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={product}
        onSave={(updated) => { setProduct(updated); setModalOpen(false); }}
      />
    </div>
  );
}
