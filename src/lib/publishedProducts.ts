/**
 * Reads cooperative products from localStorage and returns only the published
 * ones converted into the public `Product` shape that ProductCard expects.
 */

import type { Product } from "@/data/products";
import type { ProductItemType } from "@/lib/cooperative-data";

const STORAGE_KEY = "agriconnect.cooperativeData";

/** Parse "RWF 5,000/kg" → { unitPrice: 5000, unit: "kg" } */
function parsePrice(priceStr: string): { unitPrice: number; unit: string } {
  const match = priceStr.replace(/,/g, "").match(/[\d.]+/g);
  const unitMatch = priceStr.match(/\/(\S+)$/);
  return {
    unitPrice: match ? Number(match[0]) : 0,
    unit: unitMatch ? unitMatch[1] : "kg",
  };
}

/** Parse "850 kg" → 850 */
function parseWeight(weightStr: string): number {
  const match = weightStr.replace(/,/g, "").match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}

/** Map tag/category to a known public category */
function normaliseCategory(tag: string): string {
  const lower = tag.toLowerCase();
  if (lower.includes("vegetable") || lower.includes("veggie")) return "Vegetables";
  if (lower.includes("fruit")) return "Fruits";
  if (lower.includes("coffee") || lower.includes("kafe")) return "Coffee";
  if (lower.includes("grain") || lower.includes("rice") || lower.includes("maize") || lower.includes("flour") || lower.includes("sorghum")) return "Grains";
  if (lower.includes("dairy") || lower.includes("milk")) return "Dairy";
  return "Vegetables";
}

/** Resolve local product image based on name keywords */
function resolveProductImage(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("bean")) return "/images/beans.webp";
  if (lower.includes("rice")) return "/images/products/rice.png";
  if (lower.includes("sweet potato")) return "/images/products/sweet potato.jpeg";
  if (lower.includes("potato")) return "/images/products/irish potatoes.jpeg";
  if (lower.includes("cabbage")) return "/images/products/cabages.jpg";
  if (lower.includes("tomato")) return "/images/products/tomato.jpeg";
  if (lower.includes("maize") || lower.includes("flour")) return "/images/products/maize.jpeg";
  if (lower.includes("milk") || lower.includes("dairy")) return "/images/products/fresh milk.jpeg";
  return "/images/products/famers.jpeg";
}

export function getPublishedCooperativeProducts(): Product[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const data = JSON.parse(raw) as { products?: ProductItemType[] };
    const items: ProductItemType[] = data.products ?? [];

    return items
      .filter((p) => p.published)
      .map((p): Product => {
        const { unitPrice, unit } = parsePrice(p.price);
        const availableQuantity = parseWeight(p.weight);

        return {
          id: `coop-${p.id}`,
          name: p.name,
          category: normaliseCategory(p.tag),
          imageUrl: p.imageUrl ?? resolveProductImage(p.name),
          description: p.description || `${p.name} — available from cooperative.`,
          availableQuantity,
          unit,
          unitPrice,
          district: "Rwanda",
          postedOn: new Date().toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          }),
          cooperative: {
            name: "Green Valley Cooperative",
            phone: "+250 788 000 000",
            email: "info@coop.rw",
            address: "Rwanda",
          },
        };
      });
  } catch {
    return [];
  }
}
