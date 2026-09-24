"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/db";
import { formatPrice } from "@/data/catalog";
import { ProductMedia } from "./product-media";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

function FeaturedCard({ product, index, total }: { product: Product; index: number; total: number }) {
  return (
    <Link
      href={`/product/${product.id}`}
      data-cursor="hover"
      data-cursor-label="View"
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-bg-elevated"
    >
      <div data-project-image className="relative flex-1">
        <ProductMedia
          photo={product.photo}
          category={product.category}
          alt={product.model}
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="absolute inset-0"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 md:p-6">
          <span className="rounded-full px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md" style={{ background: "rgba(10,10,12,0.55)" }}>
            {product.category}
          </span>
          <span className="rounded-full px-3 py-1.5 font-mono text-xs text-white backdrop-blur-md" style={{ background: "rgba(10,10,12,0.55)" }}>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-mono text-[clamp(1.4rem,2.2vw,2.1rem)] font-medium leading-none tracking-[-0.03em]">{product.model}</h3>
            <p className="line-clamp-2 max-w-md text-base leading-relaxed text-fg-muted">{product.spec}</p>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-fg text-bg transition-transform duration-500 ease-out-expo group-hover:rotate-45">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </div>
        <p className="font-mono text-2xl font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatPrice(product.price)}
          <span className="ml-2 font-sans text-xs font-normal text-fg-subtle">incl. VAT</span>
        </p>
      </div>
    </Link>
  );
}

/**
 * Featured products: on desktop the section pins and cards travel horizontally as you scroll.
 * On mobile/tablet and with reduced motion it becomes a simple vertical stack.
 */
export function FeaturedProducts({ products, total }: { products: Product[]; total: number }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const horizontal = useMediaQuery("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const q = gsap.utils.selector(section);

      if (horizontal) {
        const distance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
      } else {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          q("[data-project-card]").forEach((card) => {
            gsap.fromTo(card, { clipPath: "inset(12% 6% 0% 6% round 1.75rem)", y: 60 }, {
              clipPath: "inset(0% 0% 0% 0% round 1.75rem)",
              y: 0,
              duration: 1.2,
              ease: "expo.out",
              scrollTrigger: { trigger: card, start: "top 88%", once: true },
            });
          });
        });
        return () => mm.revert();
      }
    },
    { scope: sectionRef, dependencies: [horizontal], revertOnUpdate: true },
  );

  return (
    <section id="featured" ref={sectionRef} aria-labelledby="featured-title" className={cn("relative", horizontal ? "h-screen overflow-hidden" : "py-28 md:py-44")}>
      <div
        ref={trackRef}
        className={cn(
          horizontal ? "flex h-full w-max items-center gap-8 pl-[clamp(1rem,4vw,3.5rem)] pr-[8vw]" : "container-x flex flex-col gap-10",
        )}
      >
        <div className={cn("flex shrink-0 flex-col justify-between gap-10", horizontal ? "h-[72vh] w-[34vw] py-4" : "mb-6")}>
          <SectionHeading index="03" eyebrow="Featured" id="featured-title" title="Genuine Webor, on show." />
          <div className="flex flex-col gap-6">
            <p className="max-w-sm text-lg leading-relaxed text-fg-muted">
              A model from each range we have photos for. Every one is on the official price list, VAT included.
            </p>
            {horizontal && (
              <p className="eyebrow flex items-center gap-3">
                <span className="h-px w-10 bg-line-strong" aria-hidden="true" /> Scroll to travel
              </p>
            )}
          </div>
        </div>

        {products.map((product, i) => (
          <div
            key={product.id}
            data-project-card
            className={cn("shrink-0", horizontal ? "h-[72vh] w-[min(40vw,40rem)]" : "h-[36rem] w-full sm:h-[40rem]")}
          >
            <FeaturedCard product={product} index={i} total={products.length} />
          </div>
        ))}

        <div className={cn("flex shrink-0 flex-col items-start justify-center gap-8", horizontal ? "h-[72vh] w-[30vw] pl-8" : "py-10")}>
          <p className="text-[clamp(2rem,3.4vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            {total} models. <span className="font-serif font-normal italic text-accent-text">Every price.</span>
          </p>
          <ButtonLink href="/products" size="lg">
            Shop the range
          </ButtonLink>
        </div>
      </div>

      {horizontal && (
        <div className="container-x pointer-events-none absolute inset-x-0 bottom-8" aria-hidden="true">
          <div className="h-px w-full bg-line">
            <div ref={progressRef} className="h-full origin-left scale-x-0 bg-fg" />
          </div>
        </div>
      )}
    </section>
  );
}
