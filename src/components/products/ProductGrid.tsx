import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";
import { useLanguage } from "@/lib/LanguageContext";

export default function ProductGrid({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-gray-500 dark:border-[#1f3d29] dark:text-green-100/40">
        {t.productGrid.noProducts}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
