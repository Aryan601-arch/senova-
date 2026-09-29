import { products } from "@/data/products";
import { site } from "@/data/site";
import type { Category, Product } from "./types";

export const categories: Category[] = ["Face", "Body", "Lips"];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function bestSellers(): Product[] {
  return products.filter((p) => p.bestSeller);
}

export function byCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category);
}

export function related(product: Product, count = 4): Product[] {
  return products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, count);
}

export function formatPrice(price: number) {
  return `${site.currency} ${price.toLocaleString("en-IN")}`;
}
