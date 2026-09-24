import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/db";
import { formatPrice } from "@/data/catalog";
import { cn } from "@/lib/utils";
import { ProductMedia } from "./product-media";

/** Catalog card: photo, model, specification and price, linking to the product page. */
export function ProductCard({ product, className }: { product: Product; className?: string }) {
  return (
    <Link
      href={`/product/${product.id}`}
      data-cursor="hover"
      data-cursor-label="View"
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-line bg-bg-elevated transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong",
        className,
      )}
    >
      <ProductMedia
        photo={product.photo}
        category={product.category}
        alt={product.model}
        sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw"
        className="relative aspect-square"
      />
      <div className="flex flex-1 flex-col gap-2 p-4 md:p-5">
        <p className="font-mono text-sm font-medium tracking-tight">{product.model}</p>
        <p className="line-clamp-3 text-sm leading-relaxed text-fg-muted">{product.spec}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <p className="font-mono text-base font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatPrice(product.price)}
          </p>
          <span className="grid size-8 place-items-center rounded-full border border-line text-fg-muted transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-transparent group-hover:bg-accent group-hover:text-accent-ink">
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
