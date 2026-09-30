"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import type { Product } from "@/lib/types";
import { ProductArt } from "./product-art";

type Props = {
  product: Pick<Product, "name" | "kind" | "image">;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * The product photo, drawn over matching artwork. The artwork shows while the photo
 * loads and stays if the photo can't be reached, so a card never looks broken.
 */
export function ProductImage({ product, sizes = "(max-width: 768px) 50vw, 25vw", priority, className }: Props) {
  const [state, setState] = useState<"loading" | "loaded" | "failed">("loading");
  const ref = useRef<HTMLImageElement>(null);

  // The photo may finish (or fail) before React hydrates and attaches its handlers.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete) setState(img.naturalWidth > 0 ? "loaded" : "failed");
  }, []);

  return (
    <div className={clsx("relative aspect-square overflow-hidden", className)}>
      <ProductArt
        kind={product.kind}
        name={product.name}
        className={clsx(
          "absolute inset-0 m-auto h-[78%] w-[78%] transition-opacity duration-500",
          state === "loaded" && "opacity-0",
        )}
      />
      {state !== "failed" && (
        <Image
          ref={ref}
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={() => setState("loaded")}
          onError={() => setState("failed")}
          className={clsx(
            "object-contain p-[8%] transition-[opacity,transform] duration-700 ease-(--ease-soft)",
            state === "loaded" ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
