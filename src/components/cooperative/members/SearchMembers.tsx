"use client";

import { useLanguage } from "@/lib/LanguageContext";

type SearchMembersProps = { search: string; onSearchChange: (value: string) => void };

export default function SearchMembers({ search, onSearchChange }: SearchMembersProps) {
  const { t } = useLanguage();
  return (
    <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100 dark:bg-[#112d1a] dark:ring-white/10">
      <label className="relative block w-full min-w-0">
        <span className="sr-only">{t.members.searchPlaceholder}</span>
        <svg aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />
        </svg>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.members.searchPlaceholder}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-green-600 dark:border-white/10 dark:bg-[#183622] dark:text-white"
        />
      </label>
    </div>
  );
}
