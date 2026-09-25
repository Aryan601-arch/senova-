"use client";

import { useRef, type ReactNode } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { useViewPointer } from "./view-context";

type RotatingObjectProps = ThreeElements["group"] & {
  children: ReactNode;
  /** Idle spin speed (radians / second) on each axis. */
  speed?: [number, number, number];
  /** How far the object tilts toward the pointer (radians). */
  pointerTilt?: number;
  /** Extra rotation driven externally, e.g. by scroll (mutable ref). */
  extra?: React.RefObject<{ x: number; y: number }>;
};

/** Spins its children and leans them toward the pointer with smooth damping. */
export function RotatingObject({
  children,
  speed = [0.05, 0.15, 0],
  pointerTilt = 0.35,
  extra,
  ...props
}: RotatingObjectProps) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const vp = useViewPointer(0.06);

  useFrame((_, delta) => {
    if (!inner.current || !outer.current) return;
    inner.current.rotation.x += speed[0] * delta;
    inner.current.rotation.y += speed[1] * delta;
    inner.current.rotation.z += speed[2] * delta;
    const ex = extra?.current?.x ?? 0;
    const ey = extra?.current?.y ?? 0;
    outer.current.rotation.x = THREE.MathUtils.damp(outer.current.rotation.x, -vp.current.y * pointerTilt + ex, 4, delta);
    outer.current.rotation.y = THREE.MathUtils.damp(outer.current.rotation.y, vp.current.x * pointerTilt + ey, 4, delta);
  });

  return (
    <group ref={outer} {...props}>
      <group ref={inner}>{children}</group>
    </group>
  );
}
