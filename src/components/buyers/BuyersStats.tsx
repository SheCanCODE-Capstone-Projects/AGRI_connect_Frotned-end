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

export default function BuyersStats({ buyers }: { buyers: Buyer[] }) {
  const { t } = useLanguage();

  const totalBuyers = buyers.length;
  const activeBuyers = buyers.filter((b) => b.active).length;
  const totalOrders = buyers.reduce((sum, b) => sum + b.orders, 0);
  const averageReliability =
    buyers.length > 0
      ? Math.round(buyers.reduce((sum, b) => sum + b.reliability, 0) / buyers.length)
      : 0;

  const stats = [
    { title: t.buyers.statTotalBuyers, value: totalBuyers, desc: t.buyers.statTotalBuyersDesc },
    { title: t.buyers.statActiveBuyers, value: activeBuyers, desc: t.buyers.statActiveBuyersDesc },
    { title: t.buyers.statTotalOrders, value: totalOrders, desc: t.buyers.statTotalOrdersDesc },
    { title: t.buyers.statReliability, value: `${averageReliability}%`, desc: t.buyers.statReliabilityDesc },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.title} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-[#112d1a] dark:ring-white/10">
          <p className="text-xs text-gray-400 dark:text-green-100/50">{stat.title}</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h2>
          <p className="mt-1 text-xs text-green-600 dark:text-green-400">{stat.desc}</p>
        </div>
      ))}
    </div>
  );
}
