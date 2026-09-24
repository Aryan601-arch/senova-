"use client";

import { useCallback } from "react";
import { useLenis } from "lenis/react";

/**
 * Returns a function that smoothly scrolls to a section id,
 * falling back to native scrolling when Lenis is disabled (reduced motion).
 */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (id: string) => {
      const target = id === "home" ? 0 : document.getElementById(id);
      if (target === null) return false;
      if (lenis) {
        lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      } else if (target === 0) {
        window.scrollTo({ top: 0 });
      } else {
        target.scrollIntoView();
      }
      if (target !== 0) {
        // Move focus for keyboard and screen-reader users.
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
      history.replaceState(null, "", id === "home" ? window.location.pathname : `#${id}`);
      return true;
    },
    [lenis],
  );
}
