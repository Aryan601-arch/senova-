"use client";

import { useCallback, useEffect } from "react";
import { themeStore, type Theme } from "@/lib/stores";

export const THEME_STORAGE_KEY = "senova-theme";

/** Inline script injected in <head> to set the theme before first paint (prevents flashes). */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t='dark'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','dark')}})();`;

export function ThemeSync() {
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    themeStore.set(current === "light" ? "light" : "dark");
  }, []);
  return null;
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeStore.set(theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* storage unavailable (private mode) — theme still applies for this visit */
  }
}

/**
 * Returns the current theme and a toggle that uses the View Transitions API
 * (circular reveal from the click point) when available.
 */
export function useTheme() {
  const theme = themeStore.use();

  const toggle = useCallback((origin?: { x: number; y: number }) => {
    const next: Theme = themeStore.get() === "dark" ? "light" : "dark";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (!doc.startViewTransition || reduce || !origin) {
      applyTheme(next);
      return;
    }

    const { x, y } = origin;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = doc.startViewTransition(() => applyTheme(next));
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  }, []);

  return { theme, toggle };
}
