"use client";

import { useRef, useState } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { cursorStore } from "@/lib/stores";

type FloatingSphereProps = ThreeElements["group"] & {
  radius?: number;
  color?: string;
  material?: "chrome" | "glass" | "matte" | "emissive";
  floatIntensity?: number;
  segments?: number;
  /** Cursor label shown while hovering. */
  hoverLabel?: string;
  onSelect?: () => void;
};

/** A sphere that bobs in space, swells on hover and pops on click. */
export function FloatingSphere({
  radius = 0.4,
  color = "#ffffff",
  material = "chrome",
  floatIntensity = 1.2,
  segments = 48,
  hoverLabel,
  onSelect,
  ...props
}: FloatingSphereProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const pop = useRef(0);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    pop.current = Math.max(0, pop.current - delta * 2.5);
    const target = (hovered ? 1.25 : 1) + Math.sin(pop.current * Math.PI) * 0.35;
    const s = THREE.MathUtils.damp(mesh.current.scale.x, target, 8, delta);
    mesh.current.scale.setScalar(s);
  });

  return (
    <group {...props}>
      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={floatIntensity}>
        <mesh
          ref={mesh}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            if (hoverLabel) cursorStore.set({ label: hoverLabel, variant: "hover" });
          }}
          onPointerOut={() => {
            setHovered(false);
            if (hoverLabel) cursorStore.set({ label: null, variant: "default" });
          }}
          onClick={(e) => {
            e.stopPropagation();
            pop.current = 1;
            onSelect?.();
          }}
        >
          <sphereGeometry args={[radius, segments, segments]} />
          {material === "chrome" && (
            <meshPhysicalMaterial color={color} metalness={1} roughness={0.12} clearcoat={1} clearcoatRoughness={0.1} />
          )}
          {material === "glass" && (
            <meshPhysicalMaterial
              color={color}
              metalness={0.1}
              roughness={0.05}
              clearcoat={1}
              iridescence={1}
              iridescenceIOR={1.3}
              transparent
              opacity={0.55}
              envMapIntensity={2}
            />
          )}
          {material === "matte" && <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />}
          {material === "emissive" && (
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 2.5 : 1.4} toneMapped={false} />
          )}
        </mesh>
      </Float>
    </group>
  );
}
