"use client";

import { useMediaQuery } from "./use-media-query";

/** True on touch-first devices (phones, tablets) where hover is not available. */
export function useIsTouch() {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}
