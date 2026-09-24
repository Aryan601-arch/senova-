"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type CounterProps = { value: number; prefix?: string; suffix?: string; className?: string };

/** Counts up to `value` when scrolled into view. The final value is server-rendered for SEO/no-JS. */
export function Counter({ value, prefix = "", suffix = "", className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const obj = { n: 0 };
        el.textContent = `${prefix}0${suffix}`;
        gsap.to(obj, {
          n: value,
          duration: 2.2,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(obj.n)}${suffix}`;
          },
        });
      });
      return () => mm.revert();
    },
    { dependencies: [value, prefix, suffix] },
  );

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
