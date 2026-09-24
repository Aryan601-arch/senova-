"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Keeps ScrollTrigger positions correct when the page height changes after
 * triggers are created (web fonts swapping in, images loading, responsive
 * layouts switching after hydration).
 */
export function ScrollTriggerRefresh() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastHeight = document.documentElement.scrollHeight;

    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    };

    const observer = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight;
      if (Math.abs(h - lastHeight) > 2) {
        lastHeight = h;
        schedule();
      }
    });
    observer.observe(document.body);
    document.fonts?.ready.then(schedule).catch(() => {});
    window.addEventListener("load", schedule);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("load", schedule);
    };
  }, []);

  return null;
}
