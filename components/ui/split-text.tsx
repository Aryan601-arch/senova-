"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type SplitTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  wordClassName?: string;
  /** "mask": words slide up from behind a mask. "scrub": words brighten as you scroll. */
  mode?: "mask" | "scrub";
  delay?: number;
  stagger?: number;
  /** Start immediately instead of when scrolled into view. */
  immediate?: boolean;
  id?: string;
};

/**
 * Accessible split-text animation. Screen readers get the full sentence from a visually hidden copy;
 * the animated word spans are aria-hidden.
 */
export function SplitText({
  text,
  as = "p",
  className,
  wordClassName,
  mode = "mask",
  delay = 0,
  stagger = 0.06,
  immediate = false,
  id,
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Polymorphic tag; typed as div for the ref.
  const Tag = as as "div";
  const words = text.split(" ");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = el.querySelectorAll<HTMLElement>("[data-word]");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (mode === "mask") {
          // fromTo with explicit y keeps the start state deterministic even if a
          // previous run left an inline transform behind (StrictMode, HMR).
          gsap.fromTo(
            targets,
            { yPercent: 110, y: 0, rotate: 4 },
            {
              yPercent: 0,
              y: 0,
              rotate: 0,
              duration: 1.1,
              ease: "expo.out",
              stagger,
              delay,
              scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
            },
          );
        } else {
          gsap.fromTo(
            targets,
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
            },
          );
        }
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [text, mode] },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className={cn(mode === "mask" && "inline-flex overflow-hidden pb-[0.08em] -mb-[0.08em]", "align-top")}
        >
          <span data-word className={cn("inline-block will-change-transform", wordClassName)}>
            {word}
          </span>
        </span>
      )).reduce<React.ReactNode[]>((acc, node, i) => (i === 0 ? [node] : [...acc, " ", node]), [])}
    </Tag>
  );
}
