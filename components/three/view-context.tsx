"use client";

import { createContext, useContext, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pointer } from "@/lib/stores";

/** Gives scenes access to the DOM element their <View> is tracking. */
export const ViewElementContext = createContext<RefObject<HTMLElement | null> | null>(null);

/**
 * Pointer in the view's own normalised device coordinates (-1..1), smoothed.
 * The global pointer is relative to the window; each View only covers part of it.
 * `inside` is true when the pointer is over the view.
 */
export function useViewPointer(smoothing = 0.08) {
  const el = useContext(ViewElementContext);
  const state = useRef({ x: 0, y: 0, rawX: 0, rawY: 0, inside: false, ndc: new THREE.Vector2() });

  useFrame(() => {
    const node = el?.current;
    const s = state.current;
    if (!node || pointer.clientX < 0) {
      s.x += (0 - s.x) * smoothing;
      s.y += (0 - s.y) * smoothing;
      return;
    }
    const r = node.getBoundingClientRect();
    const rx = ((pointer.clientX - r.left) / r.width) * 2 - 1;
    const ry = -(((pointer.clientY - r.top) / r.height) * 2 - 1);
    s.inside = pointer.active && rx >= -1 && rx <= 1 && ry >= -1 && ry <= 1;
    s.rawX = rx;
    s.rawY = ry;
    // Clamp so objects don't fly off when the pointer is far outside the view.
    const tx = THREE.MathUtils.clamp(rx, -1.2, 1.2);
    const ty = THREE.MathUtils.clamp(ry, -1.2, 1.2);
    s.x += (tx - s.x) * smoothing;
    s.y += (ty - s.y) * smoothing;
    s.ndc.set(rx, ry);
  }, -1);

  return state;
}
