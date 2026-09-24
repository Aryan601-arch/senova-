"use client";

import { useEffect } from "react";
import { loaderStore } from "@/lib/stores";
import { ScrollTrigger } from "@/lib/gsap";
import { useScrollTo } from "@/hooks/use-lenis-scroll";

/**
 * When arriving at /#section from another page, scroll to that section once
 * the loader is gone and pinned sections have measured themselves.
 */
export function HashScroll() {
  const loaded = loaderStore.use();
  const scrollTo = useScrollTo();

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
      scrollTo(id);
    }, loaded ? 150 : 900);
    return () => clearTimeout(t);
    // Run once per page mount, after the loader state settles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  return null;
}
