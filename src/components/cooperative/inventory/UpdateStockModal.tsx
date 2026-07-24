"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export type InventoryItem = {
  name: string;
  category: string;
  stock: string;
  available: string;
  status: "Healthy" | "Low" | "Out";
  updated: string;
};

interface UpdateStockModalProps {
  open: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
}

export default function UpdateStockModal({ open, item, onClose, onSave }: UpdateStockModalProps) {
  const { t } = useLanguage();
  const [stock, setStock] = useState("");
  const [available, setAvailable] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!item) return;
    setStock(item.stock.replace(" kg", ""));
    setAvailable(item.available.replace(" kg", ""));
    setError("");
  }, [item]);

  if (!open || !item) return null;

  function handleSave() {
    const stockValue = Number(stock);
    const availableValue = Number(available);

    if (!stock.trim() || !available.trim() || !Number.isFinite(stockValue) || !Number.isFinite(availableValue)) {
      setError(t.inventory.updateModalErrorInvalid);
      return;
    }
    if (stockValue < 0 || availableValue < 0) {
      setError(t.inventory.updateModalErrorNegative);
      return;
    }
    if (availableValue > stockValue) {
      setError(t.inventory.updateModalErrorExceeds);
      return;
    }

    const status: "Healthy" | "Low" | "Out" =
      availableValue === 0 ? "Out" : availableValue <= 100 ? "Low" : "Healthy";

    onSave({ ...item!, stock: `${stockValue} kg`, available: `${availableValue} kg`, status, updated: "Just now" });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-[#112d1a]">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.inventory.updateModalTitle}</h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-red-500">×</button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">{t.inventory.updateModalProduct}</label>
            <input disabled value={item.name} className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 dark:border-white/10 dark:bg-[#1b3a26]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">{t.inventory.updateModalTotalStock}</label>
            <input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-600 focus:outline-none dark:border-white/10 dark:bg-[#1b3a26]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">{t.inventory.updateModalAvailableStock}</label>
            <input type="number" min={0} value={available} onChange={(e) => setAvailable(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-600 focus:outline-none dark:border-white/10 dark:bg-[#1b3a26]" />
          </div>
          {error && (
            <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 dark:bg-red-500/20 dark:text-red-400">{error}</div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-gray-300 px-5 py-2 font-medium hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/10">
            {t.inventory.updateModalCancel}
          </button>
          <button onClick={handleSave} className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition hover:bg-green-700">
            {t.inventory.updateModalSave}
          </button>
        </div>

      </div>
    </div>
  );
}
