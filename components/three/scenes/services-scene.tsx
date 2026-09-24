"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { services, type ServiceVisual } from "@/data/services";
import { activeServiceStore } from "@/lib/stores";
import { useScenePalette, type ScenePalette } from "../scene-theme";
import { SceneEnvironment } from "../scene-environment";
import { RotatingObject } from "../rotating-object";

type FormProps = { color: string; palette: ScenePalette };

function WebForm({ color, palette }: FormProps) {
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[1.25, 2]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.55} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.78, 64, 64]} />
        <meshPhysicalMaterial color={palette.metal} metalness={1} roughness={0.12} clearcoat={1} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.55, 0.012, 8, 160]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function PhoneForm({ color, palette }: FormProps) {
  return (
    <group rotation={[0.1, -0.5, 0.12]}>
      <RoundedBox args={[1.15, 2.2, 0.12]} radius={0.12} smoothness={6}>
        <meshPhysicalMaterial color={palette.isDark ? "#1a1c22" : "#dcdde0"} metalness={0.9} roughness={0.2} clearcoat={1} />
      </RoundedBox>
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[1.02, 2.05]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.4} />
      </mesh>
      {[0.55, 0.1, -0.35].map((y, i) => (
        <mesh key={y} position={[0.2 - i * 0.15, y, 0.28 + i * 0.12]}>
          <boxGeometry args={[0.8, 0.28, 0.03]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.6} roughness={0.1} clearcoat={1} />
        </mesh>
      ))}
    </group>
  );
}

function NeuralForm({ color }: FormProps) {
  const { nodes, lines } = useMemo(() => {
    const count = 28;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      // Fibonacci sphere distribution
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = i * Math.PI * (3 - Math.sqrt(5));
      const jitter = 0.85 + ((i * 37) % 10) / 40;
      pts.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(1.3 * jitter));
    }
    const segs: number[] = [];
    pts.forEach((a, i) =>
      pts.forEach((b, j) => {
        if (j > i && a.distanceTo(b) < 0.9) segs.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }),
    );
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(segs, 3));
    return { nodes: pts, lines: geo };
  }, []);

  return (
    <group>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={color} transparent opacity={0.45} />
      </lineSegments>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i % 5 === 0 ? 0.09 : 0.05, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={i % 5 === 0 ? 2 : 0.8} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function KnotForm({ color }: FormProps) {
  return (
    <mesh>
      <torusKnotGeometry args={[0.8, 0.26, 220, 36]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.6}
        roughness={0.15}
        clearcoat={1}
        iridescence={0.8}
        iridescenceIOR={1.4}
      />
    </mesh>
  );
}

function CloudForm({ color, palette }: FormProps) {
  const puffs: [number, number, number, number][] = [
    [0, 0, 0, 0.7],
    [-0.75, -0.15, 0.1, 0.5],
    [0.75, -0.1, 0, 0.55],
    [-0.35, 0.45, -0.1, 0.48],
    [0.35, 0.4, 0.15, 0.45],
    [0, -0.35, 0.35, 0.42],
  ];
  return (
    <group>
      {puffs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 48, 48]} />
          <meshPhysicalMaterial
            color={i === 0 ? color : palette.isDark ? "#e8ecf2" : "#ffffff"}
            roughness={0.35}
            metalness={0.1}
            clearcoat={0.6}
            transparent
            opacity={i === 0 ? 1 : 0.85}
          />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
        <torusGeometry args={[1.3, 0.008, 8, 128]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function CubeForm({ color, palette }: FormProps) {
  return (
    <group rotation={[0.5, 0.6, 0]}>
      <mesh>
        <boxGeometry args={[1.9, 1.9, 1.9]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[0.6, 0.6, 0]}>
        <boxGeometry args={[1.05, 1.05, 1.05]} />
        <meshPhysicalMaterial color={palette.metal} metalness={1} roughness={0.14} clearcoat={1} />
      </mesh>
      <mesh position={[0.95, 0.95, 0.95]}>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

const forms: Record<ServiceVisual, (p: FormProps) => React.JSX.Element> = {
  sphere: WebForm,
  phone: PhoneForm,
  neural: NeuralForm,
  knot: KnotForm,
  cloud: CloudForm,
  cube: CubeForm,
};

/** Services: the visual morphs between six forms as services are hovered. */
export default function ServicesScene() {
  const palette = useScenePalette();
  const groups = useRef<(THREE.Group | null)[]>([]);
  const light = useRef<THREE.PointLight>(null);
  const lightColor = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const active = activeServiceStore.get();
    groups.current.forEach((g, i) => {
      if (!g) return;
      const isActive = i === active;
      const target = isActive ? 1 : 0;
      const s = THREE.MathUtils.damp(g.scale.x, target, isActive ? 6 : 9, delta);
      g.scale.setScalar(Math.max(0.0001, s));
      g.visible = s > 0.01;
      g.rotation.y += delta * (0.25 + (1 - s) * 4);
      g.position.y = Math.sin(state.clock.elapsedTime * 0.8 + i) * 0.06;
    });
    if (light.current) {
      lightColor.set(services[active]?.color ?? palette.accent);
      light.current.color.lerp(lightColor, 0.08);
    }
  });

  return (
    <>
      <SceneEnvironment palette={palette} />
      <pointLight ref={light} position={[2, 2, 3]} intensity={18} distance={12} />
      <RotatingObject speed={[0, 0, 0]} pointerTilt={0.5}>
        {services.map((service, i) => {
          const Form = forms[service.visual];
          return (
            <group key={service.id} ref={(el) => void (groups.current[i] = el)} scale={i === 0 ? 1 : 0.0001}>
              <Form color={service.color} palette={palette} />
            </group>
          );
        })}
      </RotatingObject>
    </>
  );
}
