"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { clamp } from "@/lib/utils";

/**
 * Scroll progress of a DOM element through the viewport, read every frame
 * without React re-renders.
 *  - `progress`: 0 when the element's top enters the bottom of the viewport, 1 when its bottom leaves the top.
 *  - `inner`: 0 when the element's top hits the top of the viewport, 1 when its bottom hits the bottom (useful for pinned sections).
 *  - `exit`: 0 while the element's top is at/below the viewport top, 1 once it has fully scrolled past.
 *  - `visible`: whether any part is on screen.
 */
export function useSectionProgress(target: RefObject<HTMLElement | null>) {
  const state = useRef({ progress: 0, inner: 0, exit: 0, visible: false });

  useFrame(() => {
    const el = target.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    state.current.progress = clamp((vh - r.top) / (vh + r.height));
    state.current.inner = r.height > vh ? clamp(-r.top / (r.height - vh)) : clamp((vh - r.top) / (vh + r.height));
    state.current.exit = clamp(-r.top / r.height);
    state.current.visible = r.bottom > 0 && r.top < vh;
  }, -1);

  return state;
}
