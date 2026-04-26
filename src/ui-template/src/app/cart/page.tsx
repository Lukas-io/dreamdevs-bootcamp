"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <EmptyState
          icon={<ShoppingBag size={36} />}
          title="Your cart is empty"
          description="Add some products to get started."
          action={
            <Link href="/products" className="mt-1 px-4 py-2 text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity">
              Browse products
            </Link>
          }
        />
      </div>
    );
  }

  const shipping = total >= 100 ? 0 : 9.99;
  const grandTotal = total + shipping;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Cart</h1>
        <button onClick={clearCart} className="text-xs text-neutral-400 hover:text-red-500 transition-colors cursor-pointer">
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-3">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex gap-4">
              <Link href={`/products/${product.id}`} className="w-20 h-20 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs">No img</div>
                )}
              </Link>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <Link href={`/products/${product.id}`} className="text-sm font-semibold text-neutral-900 dark:text-white hover:underline truncate">
                  {product.name}
                </Link>
                <span className="text-xs text-neutral-400">{product.category}</span>
                <div className="flex items-center justify-between mt-auto flex-wrap gap-2">
                  <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-2.5 py-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                      <Minus size={12} />
                    </button>
                    <span className="px-3 text-sm font-medium text-neutral-900 dark:text-white">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="px-2.5 py-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                    <button onClick={() => removeItem(product.id)} className="p-1.5 rounded-lg text-neutral-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 h-fit flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Order summary</h2>
          <div className="flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-600 dark:text-green-400">Free</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            {total < 100 && (
              <p className="text-xs text-neutral-400">Add ${(100 - total).toFixed(2)} more for free shipping</p>
            )}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2.5 flex justify-between font-bold text-neutral-900 dark:text-white">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl hover:opacity-90 transition-opacity"
          >
            Checkout
            <ArrowRight size={14} />
          </Link>
          <Link href="/products" className="text-center text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
