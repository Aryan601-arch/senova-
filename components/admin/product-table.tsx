"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/db";
import { formatPrice } from "@/data/catalog";
import { removeProduct } from "@/app/admin/actions";
import { inputClass, smallButton } from "./ui";

export function ProductTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const rows = q ? products.filter((p) => `${p.model} ${p.spec} ${p.category}`.toLowerCase().includes(q)) : products;

  return (
    <div className="flex flex-col gap-5">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter by model, spec, or category…"
        aria-label="Filter products"
        className={inputClass}
      />
      <div className="overflow-x-auto rounded-[1.5rem] border border-line">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="bg-bg-elevated text-fg-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Photo</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Model</th>
              <th className="px-4 py-3 font-medium">Spec</th>
              <th className="px-4 py-3 font-medium">Price (NPR)</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-line align-middle">
                <td className="px-4 py-3">
                  {p.photo ? (
                    <span className="relative block size-12 overflow-hidden rounded-xl bg-white">
                      <Image src={`/uploads/${p.photo}`} alt="" fill unoptimized sizes="48px" className="object-contain p-1" />
                    </span>
                  ) : (
                    <span className="text-fg-subtle">—</span>
                  )}
                </td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3 font-mono">{p.model}</td>
                <td className="max-w-xs px-4 py-3 text-fg-muted">{p.spec}</td>
                <td className="whitespace-nowrap px-4 py-3 font-mono">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} className={smallButton}>
                      Edit
                    </Link>
                    <form
                      action={removeProduct.bind(null, p.id)}
                      onSubmit={(e) => {
                        if (!window.confirm(`Delete ${p.model}? This cannot be undone.`)) e.preventDefault();
                      }}
                    >
                      <button type="submit" className={`${smallButton} border-danger/40 text-danger hover:bg-danger/10`}>
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-fg-muted">
                  No products match &ldquo;{query}&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
