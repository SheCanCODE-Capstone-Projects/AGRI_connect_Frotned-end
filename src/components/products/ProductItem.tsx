"use client";

import type { ProductItemType } from "@/lib/cooperative-data";
import { useLanguage } from "@/lib/LanguageContext";

interface ProductItemProps {
  product: ProductItemType;
  onPreview: () => void;
  onPublish: () => void;
}

const statusColor = {
  Healthy: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
  Low: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  Out: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
};

export default function ProductItem({ product, onPreview, onPublish }: ProductItemProps) {
  const { t } = useLanguage();

  const statusLabel: Record<string, string> = {
    Healthy: t.productsBoard.statusHealthy,
    Low: t.productsBoard.statusLow,
    Out: t.productsBoard.statusOut,
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md dark:bg-[#112d1a] dark:ring-white/10">

      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t.productNames?.[product.name] ?? product.name}
          </h3>
          <p className="text-xs text-gray-400 dark:text-green-100/50">
            {t.inventoryCategories?.[product.tag] ?? product.tag}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[product.status]}`}>
          {statusLabel[product.status]}
        </span>
      </div>

      <div className="mt-5 space-y-1">
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          {product.price}
        </p>
        <p className="text-sm text-gray-500 dark:text-green-100/60">
          {t.productsBoard.available} {product.weight}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onPreview}
          className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
        >
          {t.productsBoard.preview}
        </button>
        <button
          onClick={onPublish}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold text-white transition ${
            product.published ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          {product.published ? t.productsBoard.published : t.productsBoard.publish}
        </button>
      </div>

    </div>
  );
}
