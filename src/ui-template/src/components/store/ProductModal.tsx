"use client";

import { useState, useEffect } from "react";
import { Product, ProductCategory } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { ImageInput } from "@/components/ui/ImageInput";

const CATEGORIES: ProductCategory[] = ["Electronics", "Clothing", "Food", "Accessories", "Home"];

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product;
  onSave: (product: Product) => void;
}

export function ProductModal({ open, onClose, product, onSave }: ProductModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Electronics");
  const [imageUrl, setImageUrl] = useState("");
  const [stock, setStock] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setName(product?.name ?? "");
      setDescription(product?.description ?? "");
      setPrice(product?.price?.toString() ?? "");
      setCategory(product?.category ?? "Electronics");
      setImageUrl(product?.imageUrl ?? "");
      setStock(product?.stock?.toString() ?? "");
      setErrors({});
    }
  }, [open, product]);

  const handleSave = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required.";
    if (!price || isNaN(Number(price)) || Number(price) <= 0) errs.price = "Enter a valid price.";
    if (stock === "" || isNaN(Number(stock)) || Number(stock) < 0) errs.stock = "Enter a valid stock count.";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    onSave({
      id: product?.id ?? String(Date.now()),
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(Number(price).toFixed(2)),
      category,
      imageUrl: imageUrl.trim() || undefined,
      stock: parseInt(stock),
      createdAt: product?.createdAt ?? new Date().toISOString(),
    });
  };

  const field = (label: string, key: string, children: React.ReactNode) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">{label}</label>
      {children}
      {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
    </div>
  );

  const inputCls = "w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product ? "Edit Product" : "New Product"}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            {product ? "Save changes" : "Create product"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          {field("Product name", "name",
            <input value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }} placeholder="e.g. Wireless Headphones" className={inputCls} />
          )}
          {field("Category", "category",
            <select value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)} className={`${inputCls} cursor-pointer`}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
        </div>

        {field("Description", "description",
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the product…" rows={3} className={`${inputCls} resize-none`} />
        )}

        <div className="grid grid-cols-2 gap-4">
          {field("Price ($)", "price",
            <input type="number" min="0" step="0.01" value={price} onChange={(e) => { setPrice(e.target.value); setErrors((p) => ({ ...p, price: "" })); }} placeholder="0.00" className={inputCls} />
          )}
          {field("Stock", "stock",
            <input type="number" min="0" step="1" value={stock} onChange={(e) => { setStock(e.target.value); setErrors((p) => ({ ...p, stock: "" })); }} placeholder="0" className={inputCls} />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Product image (optional)</label>
          <ImageInput value={imageUrl} onChange={setImageUrl} prompt={name.trim() ? `${name.trim()} product photo` : undefined} />
        </div>
      </div>
    </Modal>
  );
}
