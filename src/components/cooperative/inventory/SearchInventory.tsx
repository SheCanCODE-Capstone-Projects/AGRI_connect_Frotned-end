"use client";

import { Search } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface SearchInventoryProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

export default function SearchInventory({
  search, onSearchChange, filter, onFilterChange, category, onCategoryChange,
}: SearchInventoryProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-[#112d1a] md:flex-row md:items-center md:justify-between">

      <div className="relative w-full md:max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.inventory.searchPlaceholder}
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm outline-none transition focus:border-green-600 dark:border-white/10 dark:bg-[#183622] dark:text-white"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-green-600 dark:border-white/10 dark:bg-[#183622] dark:text-white"
        >
          <option value="All">{t.inventory.allCategories}</option>
          <option value="Grains">{t.inventory.categoryGrains}</option>
          <option value="Vegetables">{t.inventory.categoryVegetables}</option>
          <option value="Legumes">{t.inventory.categoryLegumes}</option>
          <option value="Root Veg">{t.inventory.categoryRootVeg}</option>
        </select>

        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-green-600 dark:border-white/10 dark:bg-[#183622] dark:text-white"
        >
          <option value="All">{t.inventory.allStatus}</option>
          <option value="Healthy">{t.inventory.statusHealthy}</option>
          <option value="Low">{t.inventory.statusLow}</option>
          <option value="Out">{t.inventory.statusOut}</option>
        </select>
      </div>

    </div>
  );
}
