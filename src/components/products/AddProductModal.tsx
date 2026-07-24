"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { ProductItemType } from "@/lib/cooperative-data";
import { useLanguage } from "@/lib/LanguageContext";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: ProductItemType) => void;
}

export default function AddProductModal({ open, onClose, onSave }: AddProductModalProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Healthy" | "Low" | "Out">("Healthy");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (!open) {
      setName(""); setTag(""); setPrice(""); setWeight("");
      setDescription(""); setStatus("Healthy");
      setImageUrl(""); setImageError("");
    }
  }, [open]);

  if (!open) return null;

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be smaller than 5 MB.");
      return;
    }
    setImageError("");
    const reader = new FileReader();
    reader.onload = (ev) => setImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !tag.trim() || !price.trim() || !weight.trim()) {
      alert(t.productsBoard?.addModalRequiredError ?? "Please fill in all required fields.");
      return;
    }
    onSave({
      id: Date.now(),
      name, tag, price, weight, description, status,
      published: false,
      imageUrl: imageUrl || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-[#112d1a]">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t.productsBoard?.addModalTitle ?? "Add Product"}
          </h2>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── Image Upload ── */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
              {t.productsBoard?.addModalImage ?? "Product Image"}
            </label>

            {imageUrl ? (
              <div className="relative mb-3 h-44 w-full overflow-hidden rounded-xl border border-gray-200 dark:border-white/10">
                <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageUrl(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white hover:bg-red-700"
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500 transition hover:border-green-500 hover:bg-green-50 hover:text-green-700 dark:border-white/10 dark:bg-white/5 dark:hover:border-green-500 dark:hover:text-green-400"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span className="font-medium">{t.productsBoard?.addModalImagePlaceholder ?? "Click to upload image"}</span>
                <span className="text-xs text-gray-400">PNG, JPG, WEBP · max 5 MB</span>
              </button>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            {imageError && <p className="mt-1 text-xs text-red-600">{imageError}</p>}
          </div>

          {/* ── Name & Category ── */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t.productsBoard?.addModalProductName ?? "Product Name"}
              </label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600 dark:border-white/10 dark:bg-[#1b3a26] dark:text-white"
                placeholder="Premium Beans" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t.productsBoard?.addModalCategory ?? "Category"}
              </label>
              <input value={tag} onChange={(e) => setTag(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600 dark:border-white/10 dark:bg-[#1b3a26] dark:text-white"
                placeholder="Vegetables" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t.productsBoard?.addModalPrice ?? "Price"}
              </label>
              <input value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600 dark:border-white/10 dark:bg-[#1b3a26] dark:text-white"
                placeholder="RWF 5000/kg" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t.productsBoard?.addModalQuantity ?? "Quantity"}
              </label>
              <input value={weight} onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600 dark:border-white/10 dark:bg-[#1b3a26] dark:text-white"
                placeholder="250 kg" />
            </div>
          </div>

          {/* ── Status ── */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.productsBoard?.addModalStatus ?? "Status"}
            </label>
            <select value={status} onChange={(e) => setStatus(e.target.value as "Healthy" | "Low" | "Out")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600 dark:border-white/10 dark:bg-[#1b3a26] dark:text-white">
              <option value="Healthy">{t.productsBoard?.statusHealthy ?? "Healthy"}</option>
              <option value="Low">{t.productsBoard?.statusLow ?? "Low"}</option>
              <option value="Out">{t.productsBoard?.statusOut ?? "Out"}</option>
            </select>
          </div>

          {/* ── Description ── */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.productsBoard?.addModalDescription ?? "Description"}
            </label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600 dark:border-white/10 dark:bg-[#1b3a26] dark:text-white"
              placeholder={t.productsBoard?.addModalDescriptionPlaceholder ?? "Write a short description..."} />
          </div>

          {/* ── Actions ── */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2 font-medium dark:border-white/10 dark:text-white">
              {t.productsBoard?.addModalCancel ?? "Cancel"}
            </button>
            <button type="submit"
              className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700">
              {t.productsBoard?.addModalSave ?? "Save Product"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
