"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useLanguage } from "@/lib/LanguageContext";
import { isAuthenticated, signOut } from "@/lib/auth";



export default function CooperativeLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { locale, t, toggleLocale } = useLanguage();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setAuthenticated(true);
    } else {
      router.replace("/login");
    }
  }, [router]);

  /* ── Map routes → readable breadcrumb names ── */
  const BREADCRUMB_MAP: Record<string, string> = {
    "/dashboard":          t.dashboard.title,
    "/inventory":          t.inventory.title,
    "/cooperative/products": t.productsBoard.title,
    "/orders":             t.orders.title,
    "/buyers":             t.buyers.title,
    "/members":            t.members.title,
    "/reports":            t.dashboard.sidebarReports,
    "/settings":           t.settings.title,
  };

  const pageTitle =
    Object.entries(BREADCRUMB_MAP).find(([route]) =>
      pathname?.startsWith(route)
    )?.[1] ?? t.dashboard.title;

  if (!authenticated) {
    return <div className="min-h-screen bg-gray-100 dark:bg-[#081F14]" aria-busy="true" />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-100 dark:bg-[#081F14]">

      {/* ══════════════════════════════════════════
          TOP HEADER BAR (replaces public Navbar)
      ══════════════════════════════════════════ */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm dark:border-white/10 dark:bg-[#0d2818]">

        {/* Left: hamburger (mobile) + logo + breadcrumb */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-green-100/70 dark:hover:bg-white/10 lg:hidden"
            aria-label="Toggle menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          {/* Logo mark */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-700 shadow">
              <span className="text-xs font-black text-white">AC</span>
            </div>
            <span className="hidden text-sm font-bold text-gray-900 dark:text-white sm:block">
              AgriConnect
            </span>
          </Link>

          {/* Divider */}
          <span className="hidden h-5 w-px bg-gray-300 dark:bg-white/20 sm:block" />

          {/* Breadcrumb */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <span className="text-xs text-gray-400 dark:text-green-100/50">{t.dashboard.sidebarCooperative}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span className="text-xs font-semibold text-gray-800 dark:text-white">{pageTitle}</span>
          </div>
        </div>

        {/* Right: Back / Forward + Language + Theme + Exit */}
        <div className="flex items-center gap-2">

          {/* ← Back */}
          <button
            onClick={() => router.back()}
            title="Go back"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-green-100/70 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* → Forward */}
          <button
            onClick={() => router.forward()}
            title="Go forward"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-green-100/70 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Language toggle */}
          <button
            onClick={toggleLocale}
            title={locale === "en" ? "Switch to Kinyarwanda" : "Switch to English"}
            className="flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 text-[11px] font-bold uppercase tracking-wider text-gray-700 transition hover:bg-green-600 hover:text-white dark:border-white/10 dark:bg-white/5 dark:text-green-100/70 dark:hover:bg-green-600 dark:hover:text-white"
          >
            🇷🇼 {locale === "en" ? "EN" : "RW"}
          </button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Exit to public site */}
          <button
            onClick={() => { signOut(); router.replace("/login"); }}
            title="Back to public site"
            className="flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-[11px] font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-green-100/70 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hidden sm:inline">{t.dashboard.exit}</span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          BODY: sidebar + main content
      ══════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* Mobile overlay */}
        {open && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-14 z-40 w-64 shrink-0 overflow-y-auto transition-transform duration-300 lg:relative lg:inset-y-0 lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onClose={() => setOpen(false)} />
        </aside>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
