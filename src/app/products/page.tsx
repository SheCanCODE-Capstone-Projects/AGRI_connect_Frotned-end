"use client";

import { useMemo, useState, useEffect } from "react";
import { products as staticProducts, categories } from "@/data/products";
import { getPublishedCooperativeProducts } from "@/lib/publishedProducts";
import SearchBar from "@/components/products/SearchBar";
import CategoryFilter from "@/components/products/CategoryFilter";
import ProductGrid from "@/components/products/ProductGrid";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import type { Product } from "@/data/products";

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);

  // Load published cooperative products from localStorage (client-side only)
  const [coopProducts, setCoopProducts] = useState<Product[]>([]);

  useEffect(() => {
    setCoopProducts(getPublishedCooperativeProducts());

    // Re-sync when the dashboard publishes/unpublishes a product
    function onStorage() {
      setCoopProducts(getPublishedCooperativeProducts());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Merge: cooperative products first, then static list.
  // If a cooperative product is similar to a static product, we keep the cooperative's
  // dynamic version and remove the static placeholder.
  const allProducts = useMemo<Product[]>(() => {
    const isSimilar = (name1: string, name2: string) => {
      const n1 = name1.toLowerCase();
      const n2 = name2.toLowerCase();
      if (n1 === n2) return true;
      if (n1.includes("tomato") && n2.includes("tomato")) return true;
      if (n1.includes("cabbage") && n2.includes("cabbage")) return true;
      if (n1.includes("potato") && n2.includes("potato")) return true;
      if (n1.includes("bean") && n2.includes("bean")) return true;
      if (n1.includes("maize") && n2.includes("maize")) return true;
      return false;
    };

    // Filter out static products that have a similar counterpart in coopProducts
    const filteredStatic = staticProducts.filter(
      (sp) => !coopProducts.some((cp) => isSimilar(cp.name, sp.name))
    );

    return [...coopProducts, ...filteredStatic];
  }, [coopProducts]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allProducts.filter((product) => {
      const matchesCategory =
        category === "All Categories" || product.category === category;
      const matchesSearch =
        query === "" ||
        product.name.toLowerCase().includes(query) ||
        product.cooperative.name.toLowerCase().includes(query) ||
        product.district.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [allProducts, search, category]);

  useEffect(() => { setCurrentPage(1); }, [search, category]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <main className="min-h-screen bg-surface dark:bg-[#081F14]">
      {/* Hero */}
      <section className="bg-green-50 border-b border-gray-200 px-6 py-12 dark:bg-[#0d2818] dark:border-[#1f3d29]">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-2 text-4xl font-extrabold text-gray-900 dark:text-white">
            {t.productsPage.title}
          </h1>
          <p className="text-gray-600 dark:text-green-100/60">
            {t.productsPage.subtitle}
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryFilter categories={categories} value={category} onChange={setCategory} />
        </div>

        <ProductGrid products={paginatedProducts} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-[#1f3d29] dark:bg-[#112d1a] dark:text-white dark:hover:bg-white/5"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                    currentPage === i + 1
                      ? "bg-green-600 text-white"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-[#1f3d29] dark:bg-[#112d1a] dark:text-green-100/70 dark:hover:bg-white/5"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-[#1f3d29] dark:bg-[#112d1a] dark:text-white dark:hover:bg-white/5"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
