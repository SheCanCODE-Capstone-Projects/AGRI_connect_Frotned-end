"use client";

import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface InventoryStatsProps {
  healthy: number;
  low: number;
  out: number;
}

export default function InventoryStats({ healthy, low, out }: InventoryStatsProps) {
  const { t } = useLanguage();
  const total = healthy + low + out;

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-[#112d1a] dark:ring-white/10">
        <p className="text-sm text-gray-400 dark:text-green-100/50">{t.inventory.totalProducts}</p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{total}</h2>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-[#112d1a] dark:ring-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 dark:text-green-100/50">{t.inventory.healthy}</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">{healthy}</h2>
          </div>
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-500/20">
            <CheckCircle size={22} className="text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-[#112d1a] dark:ring-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 dark:text-green-100/50">{t.inventory.lowStock}</p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-500">{low}</h2>
          </div>
          <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-500/20">
            <AlertTriangle size={22} className="text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-[#112d1a] dark:ring-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 dark:text-green-100/50">{t.inventory.outOfStock}</p>
            <h2 className="mt-2 text-3xl font-bold text-red-500">{out}</h2>
          </div>
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-500/20">
            <XCircle size={22} className="text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

    </div>
  );
}
