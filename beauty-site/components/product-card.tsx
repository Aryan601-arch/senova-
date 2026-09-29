"use client";

import Link from "next/link";
import { useRef } from "react";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { bag } from "@/lib/bag";
import { formatPrice } from "@/lib/catalog";
import { ProductImage } from "./product-image";

type Props = {
  product: Product;
  index?: number;
  priority?: boolean;
};

/** Product card with a gentle 3D tilt that follows the pointer. */
export function ProductCard({ product, index = 0, priority }: Props) {
  const ref = useRef<HTMLElement>(null);

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${x * 10}deg`);
    el.style.setProperty("--rx", `${-y * 10}deg`);
  }

  function onLeave() {
    ref.current?.style.setProperty("--ry", "0deg");
    ref.current?.style.setProperty("--rx", "0deg");
  }

  return (
    <article
      ref={ref}
      data-reveal
      style={{ "--reveal-delay": `${(index % 4) * 90}ms` } as React.CSSProperties}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="tilt group flex flex-col rounded-md border border-line bg-white shadow-card hover:shadow-lift"
    >
      <Link href={`/product/${product.slug}`} className="block rounded-t-md bg-gradient-to-b from-blush/70 to-white">
        <div className="tilt-pop">
          <ProductImage product={product} priority={priority} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col px-4 pt-3 pb-4 text-center">
        <p className="text-[0.65rem] tracking-[0.2em] text-rose uppercase">{product.category}</p>
        <h3 className="mt-1 font-sans text-[0.95rem] leading-snug font-medium text-cocoa">
          <Link href={`/product/${product.slug}`} className="hover:text-rose-deep">
            {product.name}
          </Link>
        </h3>
        {product.price !== undefined && (
          <p className="mt-1 text-sm text-cocoa-muted">{formatPrice(product.price)}</p>
        )}
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={() => bag.add(product.slug)}
            className="btn btn-rose w-full"
            aria-label={`Add ${product.name} to bag`}
          >
            <ShoppingBag className="size-3.5" aria-hidden="true" />
            Add to bag
          </button>
        </div>
      </div>
    </article>
  );
}
