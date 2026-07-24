"use client";

import { useLanguage } from "@/lib/LanguageContext";

type Buyer = {
  initials: string;
  name: string;
  location: string;
  orders: number;
  spend: string;
  reliability: number;
  active: boolean;
};

interface BuyerCardProps {
  buyer: Buyer;
  onViewHistory?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function BuyerCard({ buyer, onViewHistory, onEdit, onDelete }: BuyerCardProps) {
  const { t } = useLanguage();

  const reliabilityLabel =
    buyer.reliability >= 90
      ? t.buyers.reliabilityExcellent
      : buyer.reliability >= 75
      ? t.buyers.reliabilityGood
      : t.buyers.reliabilityNeedsAttention;

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md dark:bg-[#112d1a] dark:ring-white/10">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-700 text-sm font-bold text-white">
            {buyer.initials}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{buyer.name}</h3>
            <p className="text-xs text-gray-400 dark:text-green-100/50">{buyer.location}</p>
          </div>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
          buyer.active
            ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
            : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-green-100/40"
        }`}>
          {buyer.active ? t.buyers.statusActive : t.buyers.statusInactive}
        </span>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400 dark:text-green-100/50">{t.buyers.orders}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{buyer.orders}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 dark:text-green-100/50">{t.buyers.spending}</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{buyer.spend}</p>
        </div>
      </div>

      {/* Reliability */}
      <div className="mt-5">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400 dark:text-green-100/50">{t.buyers.reliability}</span>
          <span className="font-semibold text-green-700 dark:text-green-400">
            {buyer.reliability}% ({reliabilityLabel})
          </span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-white/10">
          <div className="h-2 rounded-full bg-green-500 transition-all" style={{ width: `${buyer.reliability}%` }} />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4 dark:border-white/10">
        <button onClick={onViewHistory} className="flex-1 rounded-lg bg-green-600 py-2 text-xs font-medium text-white transition hover:bg-green-700">
          {t.buyers.history}
        </button>
        <button onClick={onEdit} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700">
          {t.buyers.edit}
        </button>
        <button onClick={onDelete} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700">
          {t.buyers.delete}
        </button>
      </div>

    </div>
  );
}
