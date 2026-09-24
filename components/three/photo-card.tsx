"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { cursorStore, hoveredPhotoStore, isTouchScreen, photoNavigation, type ScenePhoto } from "@/lib/stores";

export type { ScenePhoto };

type PhotoCardProps = ThreeElements["group"] & {
  photo: ScenePhoto;
  /** Card width in world units; height follows the photo's shape. */
  width?: number;
};

/**
 * Hovering shows the product's details card and grows the photo a little;
 * clicking opens the product page.
 */
function Card({ photo, width = 1, ...props }: PhotoCardProps) {
  const texture = useTexture(photo.src, (t) => {
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

  const leave = () => {
    setHovered(false);
    cursorStore.set({ label: null, variant: "default" });
    hoveredPhotoStore.set((current) => (current?.id === photo.id ? null : current));
  };

  // Clear the details card if this photo unmounts while hovered.
  useEffect(() => () => hoveredPhotoStore.set((c) => (c?.id === photo.id ? null : c)), [photo.id]);

  return (
    <group {...props}>
      <group
        ref={group}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (isTouchScreen()) return; // touch: handled by tap below
          setHovered(true);
          cursorStore.set({ label: "View", variant: "hover" });
          hoveredPhotoStore.set(photo);
        }}
        onPointerOut={leave}
        onClick={(e) => {
          e.stopPropagation();
          if (isTouchScreen() && hoveredPhotoStore.get()?.id !== photo.id) {
            // First tap shows the details card; tapping the same photo again opens it.
            hoveredPhotoStore.set(photo);
            return;
          }
          leave();
          photoNavigation.open?.(photo.id);
        }}
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
