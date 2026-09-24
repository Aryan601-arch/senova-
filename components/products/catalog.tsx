"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { Product } from "@/lib/db";
import { contactInfo } from "@/data/site";
import { groupLabels, productGroups, type ProductGroup } from "@/data/catalog";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "./category-icon";
import { ProductCard } from "./product-card";

type CatalogProps = { products: Product[]; activeGroup: ProductGroup | null };

/** Range filters, a live search box, and the products grouped by category. */
export function Catalog({ products, activeGroup }: CatalogProps) {
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = q
      ? products.filter((p) => `${p.model} ${p.spec} ${p.category}`.toLowerCase().includes(q))
      : products;
    const map = new Map<string, Product[]>();
    for (const p of matches) map.set(p.category, [...(map.get(p.category) ?? []), p]);
    return [...map.entries()].map(([name, items]) => ({ name, items, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") }));
  }, [products, query]);

  const chip = (active: boolean) =>
    cn(
      "inline-flex h-10 items-center rounded-full border px-4 text-sm transition-colors duration-300",
      active ? "border-transparent bg-fg text-bg" : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
    );

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Product ranges" className="flex flex-wrap gap-2">
          <Link href="/products" scroll={false} className={chip(!activeGroup)} aria-current={!activeGroup ? "page" : undefined}>
            All products
          </Link>
          {productGroups.map((g) => (
            <Link
              key={g}
              href={`/products?group=${g}`}
              scroll={false}
              className={chip(activeGroup === g)}
              aria-current={activeGroup === g ? "page" : undefined}
            >
              {groupLabels[g]}
            </Link>
          ))}
        </nav>
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-fg-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search — model, TV, fridge, AC…"
            aria-label="Search products"
            className="h-12 w-full rounded-full border border-line-strong bg-bg-elevated/60 pl-11 pr-11 text-sm outline-none transition-colors placeholder:text-fg-subtle focus:border-fg/40 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-fg-muted hover:bg-fg/5 hover:text-fg"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {categories.length === 0 && (
        <p className="rounded-3xl border border-line p-8 text-fg-muted" role="status">
          No products found for &ldquo;{query}&rdquo;. Call{" "}
          <a href={`tel:${contactInfo.phoneHref}`} className="text-fg underline underline-offset-4">
            {contactInfo.phone}
          </a>{" "}
          — we may still carry it.
        </p>
      )}

      {categories.map((cat) => (
        <section key={cat.name} aria-labelledby={`cat-${cat.slug}`} className="flex flex-col gap-6">
          <div className="flex items-center gap-4 border-b border-line pb-5">
            <span className="grid size-11 place-items-center rounded-full border border-line text-fg-muted">
              <CategoryIcon category={cat.name} className="size-6" />
            </span>
            <h2 id={`cat-${cat.slug}`} className="text-2xl font-medium tracking-[-0.03em] md:text-3xl">
              {cat.name}
            </h2>
            <span className="ml-auto font-mono text-xs text-fg-muted">
              {cat.items.length} model{cat.items.length === 1 ? "" : "s"}
            </span>
          </div>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
            {cat.items.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
