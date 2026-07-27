"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Phone, Mail, Package } from "lucide-react";
import { products as staticProducts } from "@/data/products";
import { getPublishedCooperativeProducts } from "@/lib/publishedProducts";
import { useLanguage } from "@/lib/LanguageContext";
import type { Product } from "@/data/products";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { t } = useLanguage();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check static products first
    const staticMatch = staticProducts.find((p) => p.id === id);
    if (staticMatch) { setProduct(staticMatch); setLoading(false); return; }

    // Then check published cooperative products from localStorage
    const coopProducts = getPublishedCooperativeProducts();
    const coopMatch = coopProducts.find((p) => p.id === id);
    if (coopMatch) { setProduct(coopMatch); setLoading(false); return; }

    // Not found — redirect back to products list
    router.replace("/products");
  }, [id, router]);

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  const displayName = t.productNames?.[product.name] ?? product.name;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#081F14]">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-600 dark:text-green-100/50 dark:hover:text-green-400"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.productDetail.backToProducts}
        </Link>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-[#1f3d29] dark:bg-[#112d1a]">
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative h-72 w-full md:h-full min-h-72 bg-gray-100 dark:bg-[#0d2818]">
              <Image
                src={product.imageUrl}
                alt={displayName}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
                unoptimized={product.imageUrl.startsWith("data:")}
              />
            </div>

            {/* Details */}
            <div className="p-8">
              <p className="mb-1 text-sm font-semibold text-green-600 dark:text-green-400">
                {product.cooperative.name}
              </p>
              <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
                {displayName}
              </h1>
              <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-green-100/60">
                {product.description}
              </p>

              {/* Price */}
              <div className="mb-6 rounded-xl bg-green-50 px-5 py-4 dark:bg-green-500/10 dark:border dark:border-green-500/20">
                <p className="text-3xl font-extrabold text-green-700 dark:text-green-400">
                  {product.unitPrice.toLocaleString()}{" "}
                  <span className="text-sm font-medium text-gray-500 dark:text-green-100/50">
                    RWF / {product.unit}
                  </span>
                </p>
              </div>

              {/* Meta */}
              <ul className="mb-6 space-y-3 text-sm text-gray-600 dark:text-green-100/60">
                <li className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-500" />
                  <span>
                    <span className="font-semibold text-gray-800 dark:text-white">{t.productDetail.availableQuantity}:</span>{" "}
                    {product.availableQuantity} {product.unit}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span>
                    <span className="font-semibold text-gray-800 dark:text-white">{t.productDetail.district}:</span>{" "}
                    {product.district}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span>
                    <span className="font-semibold text-gray-800 dark:text-white">{t.productDetail.postedOn}:</span>{" "}
                    {product.postedOn}
                  </span>
                </li>
              </ul>

              {/* Cooperative */}
              <div className="rounded-xl border border-gray-100 p-4 dark:border-[#1f3d29] dark:bg-[#0d2818]">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-green-100/40">
                  {t.productDetail.contactCooperative}
                </p>
                <p className="mb-1 font-semibold text-gray-900 dark:text-white">{product.cooperative.name}</p>
                <p className="text-xs text-gray-500 dark:text-green-100/50">{product.cooperative.address}</p>
                <div className="mt-3 flex flex-col gap-1.5">
                  <a href={`tel:${product.cooperative.phone}`} className="flex items-center gap-2 text-sm text-green-600 hover:underline dark:text-green-400">
                    <Phone className="h-3.5 w-3.5" />{product.cooperative.phone}
                  </a>
                  <a href={`mailto:${product.cooperative.email}`} className="flex items-center gap-2 text-sm text-green-600 hover:underline dark:text-green-400">
                    <Mail className="h-3.5 w-3.5" />{product.cooperative.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
