"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { useCooperativeData } from "@/lib/cooperative-data";

function formatRwf(value: number) {
  if (value >= 1_000_000) {
    return `RWF ${(value / 1_000_000).toFixed(1)}M`;
  }

  return `RWF ${new Intl.NumberFormat("en-US").format(value)}`;
}

export default function StatsCards() {
  const { t } = useLanguage();
  const { products, inventory, buyers, orders } = useCooperativeData();

  const totalInventory = inventory.reduce((sum, item) => {
    const value = Number(item.available.replace(" kg", ""));
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  const totalRevenue = buyers.reduce((sum, buyer) => {
    const value = Number(buyer.spend.replace(/[^0-9]/g, ""));
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  const pendingRequests = orders.filter((order) => order.status !== "Delivered").length;
  const scheduledDeliveries = orders.filter((order) => order.status === "Dispatched").length;

  const stats = [
    {
      label: t.dashboard.totalProducts,
      value: String(products.length),
      trend: t.dashboard.trendUp, // "+3 this week"
      trendUp: true,
      href: "/cooperative/products",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 7 12 3 4 7v10l8 4 8-4V7z" />
          <path d="M4 7l8 4 8-4" />
          <path d="M12 11v10" />
        </svg>
      ),
    },
    {
      label: t.dashboard.inventoryAvailable,
      value: `${totalInventory} kg`,
      trend: t.dashboard.trendInStock,
      trendUp: true,
      href: "/inventory",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 8v13H3V8" />
          <path d="M1 3h22v5H1z" />
          <path d="M10 12h4" />
        </svg>
      ),
    },
    {
      label: t.dashboard.newRequests,
      value: String(pendingRequests),
      trend: `${pendingRequests} ${t.dashboard.trendPending}`,
      trendUp: false,
      href: "/orders",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
    {
      label: t.dashboard.monthlyRevenueStat,
      value: formatRwf(totalRevenue),
      trend: t.dashboard.trendUpdatedFromBuyers,
      trendUp: true,
      href: "/reports",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" />
          <path d="M18 17V9" />
          <path d="M13 17V5" />
          <path d="M8 17v-3" />
        </svg>
      ),
    },
    {
      label: t.dashboard.pendingDeliveries,
      value: String(scheduledDeliveries),
      trend: `${scheduledDeliveries} ${t.dashboard.trendScheduled}`,
      trendUp: true,
      href: "/orders",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" rx="1" />
          <path d="M16 8h4l3 5v3h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((s) => (
        <Link
          key={s.label}
          href={s.href}
          className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100 transition duration-150 hover:-translate-y-0.5 hover:shadow-md hover:ring-green-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 sm:p-4 dark:bg-[#112d1a] dark:ring-white/10 dark:hover:ring-green-500/60"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-green-100/60">{s.label}</span>
            <span className="text-green-600 dark:text-green-400">{s.icon}</span>
          </div>
          <p className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">{s.value}</p>
          <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${s.trendUp ? "text-green-600 dark:text-green-400" : "text-amber-500"}`}>
            {s.trendUp ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M6 9l6 6 6-6" />
              </svg>
            )}
            {s.trend}
          </p>
        </Link>
      ))}
    </div>
  );
}
