"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createPortal } from "react-dom";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, count, total, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Cart {count > 0 && <span className="text-neutral-400 font-normal">({count})</span>}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
            <ShoppingBag size={40} className="text-neutral-200 dark:text-neutral-700" />
            <p className="text-sm font-medium text-neutral-500">Your cart is empty</p>
            <button onClick={onClose} className="mt-1 text-xs text-violet-600 dark:text-violet-400 hover:underline cursor-pointer">
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{product.name}</p>
                    <p className="text-xs text-neutral-400">${product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-auto">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-1 rounded text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 w-4 text-center">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-1 rounded text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                        <Plus size={12} />
                      </button>
                      <button onClick={() => removeItem(product.id)} className="ml-auto text-xs text-neutral-400 hover:text-red-500 transition-colors cursor-pointer">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Subtotal</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">${total.toFixed(2)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full py-2.5 text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-center hover:opacity-90 transition-opacity"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="w-full py-2 text-sm font-medium text-center text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>,
    document.body
  );
}
