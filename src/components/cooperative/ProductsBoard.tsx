"use client";

import { useState, useMemo } from "react";
import { useCooperativeData, type ProductItemType } from "@/lib/cooperative-data";
import { useLanguage } from "@/lib/LanguageContext";
import AddProductModal from "@/components/products/AddProductModal";
import ProductItem from "@/components/products/ProductItem";
import ProductPreview from "@/components/products/ProductPreview";

export default function ProductsBoard() {
  const { t } = useLanguage();
  const { products, addProduct, toggleProductPublish } = useCooperativeData();

  const [selectedProduct, setSelectedProduct] =
    useState<ProductItemType | null>(products[0] ?? null);

  const [openModal, setOpenModal] = useState(false);
  const [messageKey, setMessageKey] = useState<"default" | "previewing" | "published" | "draft" | "added">("default");
  const [messageName, setMessageName] = useState("");
  const [messagePublished, setMessagePublished] = useState(true);

  // Recomputes when locale changes
  const message = useMemo(() => {
    switch (messageKey) {
      case "previewing": return `${t.productsBoard.previewing} ${messageName}`;
      case "published":
      case "draft": return `${messageName} ${messagePublished ? t.productsBoard.nowPublished : t.productsBoard.nowDraft}.`;
      case "added": return `${messageName} ${t.productsBoard.addedSuccess}.`;
      default: return t.productsBoard.defaultMessage;
    }
  }, [messageKey, messageName, messagePublished, t]);

  function handlePreview(product: ProductItemType) {
    setSelectedProduct(product);
    setMessageKey("previewing");
    setMessageName(product.name);
  }

  function handlePublish(id: number) {
    const current = products.find((item) => item.id === id);
    toggleProductPublish(id);
    if (current) {
      const next = { ...current, published: !current.published };
      setSelectedProduct(next);
      setMessageKey(next.published ? "published" : "draft");
      setMessageName(current.name);
      setMessagePublished(next.published);
      window.dispatchEvent(new Event("storage"));
    }
  }

  function handleAddProduct(product: ProductItemType) {
    addProduct(product);
    setSelectedProduct(product);
    setMessageKey("added");
    setMessageName(product.name);
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-gray-400 dark:text-green-100/50">
            {t.productsBoard.subtitle}
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.productsBoard.title}
          </h1>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
        >
          {t.productsBoard.addProduct}
        </button>
      </div>

      <div className="rounded-xl border border-green-100 bg-green-50/80 px-4 py-3 text-sm text-green-900 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-100">
        {message}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onPreview={() => handlePreview(product)}
            onPublish={() => handlePublish(product.id)}
          />
        ))}
      </div>

      {selectedProduct && <ProductPreview product={selectedProduct} />}

      <AddProductModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={(product) => {
          handleAddProduct(product);
          setOpenModal(false);
        }}
      />

    </div>
  );
}
