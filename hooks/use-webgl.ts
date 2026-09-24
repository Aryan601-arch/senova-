"use client";

import { useSyncExternalStore } from "react";
import { isWebGLAvailable } from "@/lib/webgl";

const noop = () => () => {};

/** `null` during SSR / first paint, then whether WebGL is usable. */
export function useWebGL(): boolean | null {
  return useSyncExternalStore(noop, isWebGLAvailable, () => null);
}

