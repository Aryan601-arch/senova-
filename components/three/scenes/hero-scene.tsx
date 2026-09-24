"use client";

import { useRef, useState, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { cursorStore } from "@/lib/stores";
import { getDeviceTier } from "@/lib/webgl";
import { useScenePalette } from "../scene-theme";
import { SceneEnvironment } from "../scene-environment";
import { ParticleField } from "../particle-field";
import { InteractiveGrid } from "../interactive-grid";
import { FloatingSphere } from "../floating-sphere";
import { useSectionProgress } from "../use-section-progress";
import { useViewPointer } from "../view-context";
import { PhotoCard, type ScenePhoto } from "../photo-card";

type DistortMaterialImpl = THREE.MeshPhysicalMaterial & { distort: number; speed: number };

type HeroSceneProps = {
  sectionRef: RefObject<HTMLElement | null>;
  /** Product photos that orbit the core; hover shows details, click opens the product. */
  photos?: ScenePhoto[];
};

/**
 * Hero: a liquid-chrome core wrapped in a glass ring, with Webor product photos
 * orbiting it above an interactive grid. Reacts to pointer, hover, click and scroll.
 */
export default function HeroScene({ sectionRef, photos = [] }: HeroSceneProps) {
  const palette = useScenePalette();
  const [tier] = useState(getDeviceTier);
  const { size, viewport } = useThree();
  const isMobile = size.width < 768;

  const progress = useSectionProgress(sectionRef);
  const vp = useViewPointer(0.05);

  const root = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const coreMesh = useRef<THREE.Mesh>(null);
  const material = useRef<DistortMaterialImpl>(null);
  const glassRing = useRef<THREE.Mesh>(null);
  const orbitA = useRef<THREE.Mesh>(null);
  const orbitB = useRef<THREE.Mesh>(null);
  const cards = useRef<(THREE.Group | null)[]>([]);
  const [hovered, setHovered] = useState(false);
  const pulse = useRef(0);
  const intro = useRef(0);

  const segments = tier === "high" ? 160 : tier === "mid" ? 112 : 72;
  const baseX = isMobile ? 0 : viewport.width * 0.25;
  const baseY = isMobile ? 1.05 : 0.05;
  const baseScale = isMobile ? 0.46 : 1;
  // Keep the orbiting photos clear of the headline on the left: the orbit is
  // narrow across the screen and deep toward the viewer instead.
  const orbitX = isMobile ? 2.7 : Math.min(2.4, viewport.width * 0.19);
  const orbitZ = isMobile ? 1.5 : 2;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const exit = progress.current.exit;
    intro.current = THREE.MathUtils.damp(intro.current, 1, 1.6, delta);
    pulse.current = Math.max(0, pulse.current - delta * 1.4);

    if (root.current) {
      // Parallax the whole scene with the pointer and lift it away as the hero scrolls out.
      root.current.position.x = THREE.MathUtils.damp(root.current.position.x, vp.current.x * 0.25, 3, delta);
      root.current.position.y = THREE.MathUtils.damp(root.current.position.y, vp.current.y * 0.15 + exit * 2.2, 4, delta);
      root.current.rotation.z = THREE.MathUtils.damp(root.current.rotation.z, -vp.current.x * 0.05, 3, delta);
    }

    if (core.current) {
      core.current.rotation.y += delta * (hovered ? 0.6 : 0.18) + exit * delta * 2;
      core.current.rotation.x = THREE.MathUtils.damp(core.current.rotation.x, -vp.current.y * 0.5 + exit * 1.4, 3, delta);
      core.current.rotation.z = THREE.MathUtils.damp(core.current.rotation.z, vp.current.x * 0.35, 3, delta);
      const s = baseScale * intro.current * (1 - exit * 0.35) * (1 + Math.sin(pulse.current * Math.PI) * 0.12);
      core.current.scale.setScalar(Math.max(0.001, s));
    }

    if (material.current) {
      const targetDistort = (hovered ? 0.52 : 0.32) + pulse.current * 0.45;
      material.current.distort = THREE.MathUtils.damp(material.current.distort, targetDistort, 4, delta);
      material.current.speed = hovered ? 2.6 : 1.4;
    }

    if (glassRing.current) {
      glassRing.current.rotation.x = 1.1 + Math.sin(t * 0.4) * 0.15 + vp.current.y * 0.3;
      glassRing.current.rotation.y = t * 0.25 + vp.current.x * 0.4;
    }
    // Product cards travel around the core on a tilted ellipse, passing behind it.
    const n = cards.current.length;
    cards.current.forEach((card, i) => {
      if (!card) return;
      const a = t * 0.16 + (i / n) * Math.PI * 2;
      card.position.set(Math.cos(a) * orbitX, Math.sin(a) * 0.55 + Math.sin(t * 0.9 + i) * 0.08, Math.sin(a) * orbitZ);
      const depth = (Math.sin(a) + 1) / 2; // 0 = back, 1 = front
      card.scale.setScalar(Math.max(0.001, intro.current * (0.72 + depth * 0.38)));
    });

    if (orbitA.current) orbitA.current.rotation.z = t * 0.2;
    if (orbitB.current) orbitB.current.rotation.z = -t * 0.12;
  });

  return (
    <>
      <SceneEnvironment palette={palette} />
      <group ref={root}>
        <group position={[baseX, baseY, 0]}>
          <group ref={core}>
            <mesh
              ref={coreMesh}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
                cursorStore.set({ label: "Tap", variant: "hover" });
              }}
              onPointerOut={() => {
                setHovered(false);
                cursorStore.set({ label: null, variant: "default" });
              }}
              onClick={(e) => {
                e.stopPropagation();
                pulse.current = 1;
              }}
            >
              <sphereGeometry args={[1.15, segments, segments]} />
              <MeshDistortMaterial
                ref={material as never}
                color={palette.isDark ? "#8d93a1" : "#c9ccd3"}
                metalness={0.82}
                roughness={0.16}
                clearcoat={1}
                clearcoatRoughness={0.08}
                iridescence={1}
                iridescenceIOR={1.45}
                iridescenceThicknessRange={[120, 900]}
                envMapIntensity={palette.isDark ? 1.9 : 1.4}
                distort={0.32}
                speed={1.4}
              />
            </mesh>

            {/* Glass ring */}
            <mesh ref={glassRing} rotation={[1.1, 0, 0]}>
              <torusGeometry args={[1.75, 0.13, 48, 180]} />
              <meshPhysicalMaterial
                color={palette.isDark ? "#ffffff" : "#f5f5f0"}
                metalness={0.05}
                roughness={0.04}
                clearcoat={1}
                iridescence={1}
                iridescenceIOR={1.3}
                transparent
                opacity={palette.isDark ? 0.42 : 0.5}
                envMapIntensity={2.5}
              />
            </mesh>
          </group>

          {/* Thin glowing orbits */}
          <mesh ref={orbitA} rotation={[1.35, 0.2, 0]} scale={baseScale}>
            <torusGeometry args={[2.35, 0.006, 8, 256]} />
            <meshBasicMaterial color={palette.accent} toneMapped={false} transparent opacity={0.9} />
          </mesh>
          <mesh ref={orbitB} rotation={[1.2, -0.5, 0.3]} scale={baseScale}>
            <torusGeometry args={[2.85, 0.004, 8, 256]} />
            <meshBasicMaterial color={palette.accent2} toneMapped={false} transparent opacity={0.6} />
          </mesh>

          <group scale={baseScale}>
            {photos.map((photo, i) => (
              <group key={photo.id} ref={(el) => void (cards.current[i] = el)} scale={0.001}>
                <Billboard>
                  <PhotoCard photo={photo} width={isMobile ? 0.9 : 0.66} />
                </Billboard>
              </group>
            ))}
          </group>

          <FloatingSphere position={[1.6 * baseScale, 1.25 * baseScale, 0.4]} radius={0.14} material="emissive" color={palette.accent} hoverLabel="Pop" />
          <FloatingSphere position={[-1.85 * baseScale, -1.2 * baseScale, 0.6]} radius={0.24} material="chrome" color={palette.metal} hoverLabel="Pop" />
          <FloatingSphere position={[-1.5 * baseScale, 1.45 * baseScale, -0.8]} radius={0.12} material="glass" color="#ffffff" floatIntensity={2} />
        </group>

        <ParticleField
          count={tier === "high" ? 900 : tier === "mid" ? 600 : 280}
          radius={9}
          depth={8}
          size={isMobile ? 2.2 : 2.8}
          color={palette.particle}
          opacity={palette.isDark ? 0.75 : 0.5}
        />

        <InteractiveGrid
          position={[0, -2.4, -2]}
          rotation={[-Math.PI / 2, 0, 0]}
          size={34}
          cells={60}
          color={palette.grid}
          glowColor={palette.accent}
          opacity={palette.isDark ? 0.8 : 0.55}
        />
      </group>
    </>
  );
}
