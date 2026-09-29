"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { clsx } from "clsx";
import { products } from "@/data/products";
import { categories } from "@/lib/catalog";
import type { Category } from "@/lib/types";
import { ProductCard } from "./product-card";

export function Catalog({ initialCategory }: { initialCategory?: Category }) {
  const [category, setCategory] = useState<Category | "All">(initialCategory ?? "All");
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) => (category === "All" || p.category === category) && (!q || p.name.toLowerCase().includes(q)),
    );
  }, [category, query]);

  function choose(c: Category | "All") {
    setCategory(c);
    const url = new URL(window.location.href);
    if (c === "All") url.searchParams.delete("category");
    else url.searchParams.set("category", c);
    window.history.replaceState(null, "", url);
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Category" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {(["All", ...categories] as const).map((c) => {
            const count = c === "All" ? products.length : products.filter((p) => p.category === c).length;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={category === c}
                onClick={() => choose(c)}
                className={clsx(
                  "shrink-0 rounded-full border px-5 py-2 text-xs tracking-[0.16em] uppercase transition-colors",
                  category === c ? "border-rose bg-rose text-white" : "border-line bg-white text-cocoa hover:border-rose-soft",
                )}
              >
                {c} <span className="opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
        <label className="relative block md:w-72">
          <span className="sr-only">Search products</span>
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-cocoa-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            className="w-full rounded-full border border-line bg-white py-2.5 pr-4 pl-10 text-sm outline-none placeholder:text-cocoa-muted/70 focus:border-rose"
          />
        </label>
      </div>

      {shown.length === 0 ? (
        <p className="py-24 text-center font-serif text-2xl text-cocoa-muted">No products match “{query}”.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} priority={i < 4} />
          ))}
        </div>
      )}
    </>
  );
}
