"use client";

import StatsCards from "@/components/dashboard/StatsCards";
import RevenueChart from "@/components/dashboard/RevenueChart";
import BuyerMatchCard from "@/components/dashboard/BuyerMatchCard";
import { useLanguage } from "@/lib/LanguageContext";

export default function DashboardPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top bar */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-gray-400 dark:text-green-100/50">{t.dashboard.portal}</p>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">{t.dashboard.title}</h1>
        </div>
        <span className="text-xs text-gray-400 dark:text-green-100/50">{t.dashboard.home}</span>
      </div>

      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#0d2818] px-4 py-4 text-white shadow-lg sm:px-6 sm:py-5">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-green-700/20" />
        <div className="pointer-events-none absolute -bottom-8 right-24 h-32 w-32 rounded-full bg-green-600/10" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-green-700/40 px-3 py-1 text-xs font-medium text-green-300">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              {t.dashboard.welcomeBack}
            </div>
            <h2 className="mt-2 text-xl font-bold sm:text-2xl">Green Valley Cooperative</h2>
            <p className="mt-1 text-sm text-green-100/70">
              {t.dashboard.youHave} <span className="font-semibold text-amber-400">4 {t.dashboard.urgentRequests}</span> {t.dashboard.requestsPending}.
            </p>
          </div>
          <div className="shrink-0 text-left sm:text-right">
            <p className="text-xs text-green-100/60">{t.dashboard.august}</p>
            <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">RWF 11.2M</p>
            <p className="mt-0.5 text-xs text-green-300">{t.dashboard.monthlyRevenue}</p>
          </div>
        </div>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
        <div className="lg:col-span-2"><RevenueChart /></div>
        <BuyerMatchCard />
      </div>
    </div>
  );
}
