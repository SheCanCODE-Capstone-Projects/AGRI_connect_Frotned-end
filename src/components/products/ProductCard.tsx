import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/data/products";
import { useLanguage } from "@/lib/LanguageContext";

export default function ProductCard({ product }: { product: Product }) {
  const { t } = useLanguage();
  const rating = product.rating ?? 4.5;
  const reviewsCount = product.reviewsCount ?? 100;

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-[#111811]">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="p-4 pb-5">
        {/* Cooperative name */}
        <p className="mb-1 text-xs font-semibold text-green-600 dark:text-green-500">
          {product.cooperative.name}
        </p>

        {/* Product name */}
        <h3 className="mb-1 text-base font-bold text-gray-900 dark:text-white">
          {t.productNames?.[product.name] ?? product.name}
        </h3>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {rating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            ({reviewsCount})
          </span>
        </div>

        {/* Price & Action */}
        <div className="flex items-end justify-between">
          <p className="text-xl font-bold text-green-700 dark:text-green-500">
            {product.unitPrice.toLocaleString()}{" "}
            <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              RWF/{product.unit}
            </span>
          </p>

          <Link
            href={`/products/${product.id}`}
            className="rounded-full bg-green-500 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-green-600"
          >
            {t.productGrid?.viewDetails ?? "View Details"}
          </Link>
        </div>
      </div>
    </div>
  );
}