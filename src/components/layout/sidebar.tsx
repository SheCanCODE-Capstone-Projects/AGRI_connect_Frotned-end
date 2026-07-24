"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { getCurrentAccount, Account } from "@/lib/auth";

type SidebarProps = {
  onClose?: () => void;
};

/* ── Icons ── */
const icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  inventory: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 8v13H3V8" />
      <path d="M1 3h22v5H1z" />
      <path d="M10 12h4" />
    </svg>
  ),
  products: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 7 12 3 4 7v10l8 4 8-4V7z" />
      <path d="M4 7l8 4 8-4" />
      <path d="M12 11v10" />
    </svg>
  ),
  orders: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  buyers: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  members: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M17 8h4m-2-2v4M15 17h5l2 2v-6a3 3 0 0 0-3-3h-1" />
    </svg>
  ),
  reports: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    setAccount(getCurrentAccount());
  }, []);

  const navItems = [
    { name: t.dashboard.sidebarDashboard, href: "/dashboard", icon: icons.dashboard },
    { name: t.dashboard.sidebarInventory, href: "/inventory", icon: icons.inventory },
    { name: t.dashboard.sidebarProducts, href: "/cooperative/products", icon: icons.products },
    { name: t.dashboard.sidebarOrders, href: "/orders", icon: icons.orders },
    { name: t.dashboard.sidebarBuyers, href: "/buyers", icon: icons.buyers },
    { name: t.members.title, href: "/members", icon: icons.members },
    { name: t.dashboard.sidebarReports, href: "/reports", icon: icons.reports },
  ];

  const handleLogout = () => {
    // TODO: clear auth token / session here
    router.push("/login");
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-[#0d2818] text-white">

      {/* ── Cooperative identity header ── */}
      <div className="px-4 pt-5 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-base font-black shadow-lg shadow-green-900/50">
            {account?.cooperativeName
              ? account.cooperativeName
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()
              : "GV"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {account?.cooperativeName || "Green Valley Coop"}
            </p>
            <p className="text-[11px] text-green-100/60">{t.dashboard.sidebarCooperative}</p>
          </div>
        </div>

        {/* Online status badge */}
        <div className="mt-3 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[11px] text-green-300/80">Active · Musanze District</span>
        </div>
      </div>

      {/* ── Navigation items ── */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-green-100/30">
          {t.dashboard.mainMenu}
        </p>
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-green-600 text-white shadow-md shadow-green-900/40"
                  : "text-green-100/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={isActive ? "text-white" : "text-green-100/50"}>
                {item.icon}
              </span>
              {item.name}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom section: settings link + logout ── */}
      <div className="border-t border-white/10 px-3 py-3 space-y-1">
        {/* Settings */}
        <Link
          href="/settings"
          onClick={onClose}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            pathname?.startsWith("/settings")
              ? "bg-green-600 text-white shadow-md shadow-green-900/40"
              : "text-green-100/60 hover:bg-white/5 hover:text-white"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          {t.dashboard.settings}
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400/80 transition hover:bg-red-500/10 hover:text-red-400"
        >
          {icons.logout}
          {t.dashboard.logout}
        </button>
      </div>
    </aside>
  );
}