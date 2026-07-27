"use client";
import { Search } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useLanguage();
  return (
    <div className="relative w-full">
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-green-100/40" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.productsPage.searchPlaceholder}
        className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 dark:border-[#1f3d29] dark:bg-[#112d1a] dark:text-white dark:placeholder:text-green-100/40 dark:focus:border-green-500"
      />
    </div>
  );
}
