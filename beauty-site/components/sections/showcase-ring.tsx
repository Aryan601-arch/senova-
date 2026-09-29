"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductImage } from "../product-image";
import { SectionHeading } from "../section-heading";

/**
 * A 3D carousel: products stand in a ring that turns slowly.
 * Drag or use the arrows to spin it; it pauses while the pointer is over it.
 */
export function ShowcaseRing({ products }: { products: Product[] }) {
  const ringRef = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const velocity = useRef(0);
  const drag = useRef<{ x: number; a: number } | null>(null);
  const hovering = useRef(false);
  const [radius, setRadius] = useState(420);
  const step = 360 / products.length;

  useEffect(() => {
    const onResize = () => setRadius(window.innerWidth < 640 ? 250 : window.innerWidth < 1024 ? 340 : 440);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      if (!drag.current) {
        if (!hovering.current && !reduce) angle.current -= 6 * dt;
        angle.current += velocity.current * dt;
        velocity.current *= Math.pow(0.04, dt);
      }
      if (ringRef.current) ringRef.current.style.transform = `translateZ(${-radius}px) rotateY(${angle.current}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [radius]);

  const nudge = (dir: number) => {
    velocity.current = 0;
    angle.current += dir * step;
  };

  return (
    <section className="overflow-hidden bg-gradient-to-b from-white via-blush/40 to-cream py-20 md:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="In 3D" title="Explore the Collection" subtitle="Drag to turn, tap a product to see it" />
      </div>

      <div
        className="relative mx-auto mt-10 h-[22rem] touch-pan-y select-none sm:h-[26rem]"
        style={{ perspective: "1400px" }}
        onPointerEnter={() => (hovering.current = true)}
        onPointerLeave={() => {
          hovering.current = false;
          drag.current = null;
        }}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, a: angle.current };
          velocity.current = 0;
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const next = drag.current.a + (e.clientX - drag.current.x) * 0.25;
          velocity.current = (next - angle.current) * 20;
          angle.current = next;
        }}
        onPointerUp={() => (drag.current = null)}
      >
        {/* floor glow */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 mx-auto h-16 max-w-3xl rounded-[50%] bg-rose-soft/30 blur-2xl" />
        <div ref={ringRef} className="absolute top-1/2 left-1/2 size-0" style={{ transformStyle: "preserve-3d" }}>
          {products.map((p, i) => (
            <Link
              key={p.slug}
              href={`/product/${p.slug}`}
              draggable={false}
              onClick={(e) => {
                if (Math.abs(velocity.current) > 40) e.preventDefault();
              }}
              className="absolute -top-36 -left-24 block w-48 rounded-md border border-white bg-white/85 p-3 text-center shadow-lift backdrop-blur [backface-visibility:hidden] sm:-top-40 sm:-left-28 sm:w-56"
              style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
            >
              <ProductImage product={p} sizes="224px" className="rounded bg-gradient-to-b from-blush/70 to-white" />
              <p className="mt-2 text-[0.6rem] tracking-[0.2em] text-rose uppercase">{p.category}</p>
              <p className="mt-0.5 line-clamp-2 text-sm leading-snug font-medium">{p.name}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button type="button" onClick={() => nudge(1)} className="grid size-11 place-items-center rounded-full border border-rose-soft bg-white text-cocoa hover:border-rose hover:text-rose-deep" aria-label="Turn left">
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={() => nudge(-1)} className="grid size-11 place-items-center rounded-full border border-rose-soft bg-white text-cocoa hover:border-rose hover:text-rose-deep" aria-label="Turn right">
          <ChevronRight className="size-5" />
        </button>
      </div>
    </section>
  );
}
