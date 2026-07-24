"use client";

import { Package } from "lucide-react";
import type { InventoryItem } from "./UpdateStockModal";
import { useLanguage } from "@/lib/LanguageContext";

interface InventoryCardProps {
  item: InventoryItem;
  onUpdate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const statusColor = {
  Healthy: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
  Low: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
  Out: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
};

export default function InventoryCard({ item, onUpdate, onEdit, onDelete }: InventoryCardProps) {
  const { t } = useLanguage();

  const stock = Number(item.stock.replace(" kg", ""));
  const available = Number(item.available.replace(" kg", ""));
  const percentage = stock === 0 ? 0 : Math.round((available / stock) * 100);

  const statusLabel: Record<string, string> = {
    Healthy: t.inventory.statusHealthy,
    Low: t.inventory.statusLow,
    Out: t.inventory.statusOut,
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md dark:bg-[#112d1a] dark:ring-white/10">

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20">
            <Package className="text-green-600 dark:text-green-400" size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {t.productNames?.[item.name] ?? item.name}
            </h3>
            <p className="text-sm text-gray-400 dark:text-green-100/50">
              {t.inventoryCategories?.[item.category] ?? item.category}
            </p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[item.status]}`}>
          {statusLabel[item.status]}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400 dark:text-green-100/50">{t.inventory.totalStock}</p>
          <p className="mt-1 font-semibold text-gray-900 dark:text-white">{item.stock}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 dark:text-green-100/50">{t.inventory.available}</p>
          <p className="mt-1 font-semibold text-gray-900 dark:text-white">{item.available}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-gray-400 dark:text-green-100/50">{t.inventory.stockRemaining}</span>
          <span className="text-xs font-semibold text-green-600 dark:text-green-400">{percentage}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-[#1b3a26]">
          <div className="h-full rounded-full bg-green-600 transition-all" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs text-gray-400 dark:text-green-100/50">{t.inventory.lastUpdated}</p>
        <p className="mt-1 text-sm font-medium text-gray-700 dark:text-green-100">{item.updated}</p>
      </div>

      <div className="mt-6 flex gap-2">
        <button onClick={onEdit} className="flex-1 rounded-lg border border-green-600 py-2 text-sm font-semibold text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10">
          {t.inventory.edit}
        </button>
        <button onClick={onUpdate} className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700">
          {t.inventory.update}
        </button>
        <button onClick={onDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
          {t.inventory.delete}
        </button>
      </div>

    </div>
  );
}
