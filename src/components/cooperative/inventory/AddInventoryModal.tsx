"use client";

import { useEffect, useState } from "react";
import type { InventoryItem } from "./UpdateStockModal";
import { useLanguage } from "@/lib/LanguageContext";

type Props = { open: boolean; onClose: () => void; onSave: (item: InventoryItem) => boolean };

export default function AddInventoryModal({ open, onClose, onSave }: Props) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Grains");
  const [stock, setStock] = useState("");
  const [available, setAvailable] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) { setName(""); setCategory("Grains"); setStock(""); setAvailable(""); setError(""); }
  }, [open]);

  if (!open) return null;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const total = Number(stock);
    const remaining = Number(available);
    if (!name.trim() || !stock.trim() || !available.trim()) { setError(t.inventory.addModalErrorEmpty); return; }
    if (!Number.isFinite(total) || !Number.isFinite(remaining) || total < 0 || remaining < 0) { setError(t.inventory.addModalErrorInvalid); return; }
    if (remaining > total) { setError(t.inventory.addModalErrorExceeds); return; }
    if (onSave({ name: name.trim(), category, stock: `${total} kg`, available: `${remaining} kg`, status: remaining === 0 ? "Out" : remaining <= 100 ? "Low" : "Healthy", updated: "Just now" })) onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="add-inventory-title">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-[#112d1a]">
        <div className="flex items-center justify-between">
          <h2 id="add-inventory-title" className="text-xl font-bold text-gray-900 dark:text-white">{t.inventory.addModalTitle}</h2>
          <button type="button" onClick={onClose} className="text-2xl text-gray-400 hover:text-red-500">×</button>
        </div>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            {t.inventory.addModalProductName}
            <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-[#1b3a26] dark:text-white" />
          </label>
          <label className="block text-sm font-medium">
            {t.inventory.addModalCategory}
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-[#1b3a26] dark:text-white">
              <option value="Grains">{t.inventory.categoryGrains}</option>
              <option value="Vegetables">{t.inventory.categoryVegetables}</option>
              <option value="Legumes">{t.inventory.categoryLegumes}</option>
              <option value="Root Veg">{t.inventory.categoryRootVeg}</option>
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              {t.inventory.addModalTotalStock}
              <input required min="0" step="any" type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-[#1b3a26] dark:text-white" />
            </label>
            <label className="block text-sm font-medium">
              {t.inventory.addModalAvailableStock}
              <input required min="0" step="any" type="number" value={available} onChange={(e) => setAvailable(e.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-[#1b3a26] dark:text-white" />
            </label>
          </div>
          {error && <p role="alert" className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 dark:bg-red-500/20 dark:text-red-400">{error}</p>}
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-5 py-2 font-medium dark:border-white/10 dark:text-white">{t.inventory.addModalCancel}</button>
          <button type="submit" className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700">{t.inventory.addModalSubmit}</button>
        </div>
      </form>
    </div>
  );
}
