"use client";

import { useScrollTo } from "@/hooks/use-lenis-scroll";

export function ScrollIndicator({ targetId }: { targetId: string }) {
  const scrollTo = useScrollTo();
  return (
    <a
      href={`#${targetId}`}
      onClick={(e) => {
        e.preventDefault();
        scrollTo(targetId);
      }}
      data-cursor="hover"
      data-cursor-label="Scroll"
      className="group pointer-events-auto flex items-center gap-3 text-fg-muted transition-colors hover:text-fg"
    >
      <span className="relative flex h-10 w-6 justify-center rounded-full border border-line-strong pt-2">
        <span className="block size-1 rounded-full bg-current" style={{ animation: "scroll-dot 1.8s ease-in-out infinite" }} />
      </span>
      <span className="eyebrow group-hover:text-fg">Scroll to explore</span>
    </a>
  );
}
