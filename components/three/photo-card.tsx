"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { cursorStore } from "@/lib/stores";

/** A product photo shown inside a 3D scene. */
export type ScenePhoto = { id: number; src: string; label: string };

type PhotoCardProps = ThreeElements["group"] & {
  src: string;
  /** Card width in world units; height follows the photo's shape. */
  width?: number;
  /** Cursor label and click action (e.g. open the product page). */
  hoverLabel?: string;
  onSelect?: () => void;
};

function Card({ src, width = 1, hoverLabel, onSelect, ...props }: PhotoCardProps) {
  const texture = useTexture(src, (t) => {
    const tex = Array.isArray(t) ? t[0] : t;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
  });
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const { w, h, imgW, imgH } = useMemo(() => {
    const img = texture.image as { width: number; height: number } | undefined;
    const aspect = img ? img.width / img.height : 1;
    // Card is between portrait and landscape; the photo sits inside with a white margin.
    const cardAspect = THREE.MathUtils.clamp(aspect, 0.72, 1.35);
    const cw = width;
    const ch = width / cardAspect;
    const pad = 0.1 * width;
    const fit = Math.min((cw - pad) / aspect, ch - pad);
    return { w: cw, h: ch, imgW: fit * aspect, imgH: fit };
  }, [texture, width]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const s = THREE.MathUtils.damp(group.current.scale.x, hovered ? 1.12 : 1, 8, delta);
    group.current.scale.setScalar(s);
  });

  const interactive = !!onSelect;

  return (
    <group {...props}>
      <group
        ref={group}
        onPointerOver={
          interactive
            ? (e) => {
                e.stopPropagation();
                setHovered(true);
                cursorStore.set({ label: hoverLabel ?? "View", variant: "hover" });
              }
            : undefined
        }
        onPointerOut={
          interactive
            ? () => {
                setHovered(false);
                cursorStore.set({ label: null, variant: "default" });
              }
            : undefined
        }
        onClick={
          interactive
            ? (e) => {
                e.stopPropagation();
                cursorStore.set({ label: null, variant: "default" });
                onSelect?.();
              }
            : undefined
        }
      >
        <RoundedBox args={[w, h, 0.04]} radius={Math.min(w, h) * 0.08} smoothness={4}>
          <meshBasicMaterial color="#ffffff" toneMapped={false} fog={false} />
        </RoundedBox>
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[imgW, imgH]} />
          <meshBasicMaterial map={texture} toneMapped={false} fog={false} transparent />
        </mesh>
      </group>
    </group>
  );
}

/** White rounded card holding a product photo. Loads its texture lazily. */
export function PhotoCard(props: PhotoCardProps) {
  return (
    <Suspense fallback={null}>
      <Card {...props} />
    </Suspense>
  );
}
