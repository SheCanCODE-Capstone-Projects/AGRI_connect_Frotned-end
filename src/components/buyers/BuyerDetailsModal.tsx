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

interface BuyerDetailsModalProps {
  buyer: Buyer | null;
  onClose: () => void;
}

export default function BuyerDetailsModal({ buyer, onClose }: BuyerDetailsModalProps) {
  const { t } = useLanguage();

  if (!buyer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-[#112d1a]">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t.buyers.detailsTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">✕</button>
        </div>

        {/* Profile */}
        <div className="mt-5 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-700 text-lg font-bold text-white">
            {buyer.initials}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{buyer.name}</h3>
            <p className="text-sm text-gray-400 dark:text-green-100/50">{buyer.location}</p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 space-y-4">

          <div className="flex justify-between">
            <span className="text-sm text-gray-400 dark:text-green-100/50">{t.buyers.detailsStatus}</span>
            <span className={`text-sm font-semibold ${buyer.active ? "text-green-600" : "text-gray-500"}`}>
              {buyer.active ? t.buyers.statusActive : t.buyers.statusInactive}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-400 dark:text-green-100/50">{t.buyers.detailsTotalOrders}</span>
            <span className="font-semibold text-gray-900 dark:text-white">{buyer.orders}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-400 dark:text-green-100/50">{t.buyers.detailsTotalSpending}</span>
            <span className="font-semibold text-gray-900 dark:text-white">{buyer.spend}</span>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 dark:text-green-100/50">{t.buyers.detailsReliability}</span>
              <span className="font-semibold text-green-600">{buyer.reliability}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-white/10">
              <div className="h-2 rounded-full bg-green-500" style={{ width: `${buyer.reliability}%` }} />
            </div>
          </div>

        </div>

        {/* Recent Orders */}
        <div className="mt-6 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <h4 className="text-sm font-semibold text-green-700 dark:text-green-400">
            {t.buyers.detailsRecentOrders}
          </h4>
          <ul className="mt-3 space-y-2 text-xs text-gray-600 dark:text-green-100/70">
            <li>• Fresh Beans - 500kg</li>
            <li>• Rice Supply - 300kg</li>
            <li>• Vegetables - Weekly delivery</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
