"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * The 3D hero: Senova packaging on blush pedestals, with drifting petals.
 * Everything is built from simple shapes, so there are no model files to download.
 * The whole arrangement turns gently toward the pointer.
 */

const ROSE = "#e8b4a8";
const ROSE_DEEP = "#b0685a";
const GOLD = "#d4b07e";
const PEARL = "#fbf3ef";

function useLabelTexture(text: string, color = "#7a4a3e") {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "500 92px Georgia, 'Times New Roman', serif";
    ctx.letterSpacing = "18px";
    ctx.fillText(text, 256, 110);
    ctx.font = "300 30px Georgia, serif";
    ctx.letterSpacing = "8px";
    ctx.fillText("SKINCARE", 256, 190);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [text, color]);
}

function Label({ width, y, z }: { width: number; y: number; z: number }) {
  const tex = useLabelTexture("SENOVA");
  if (!tex) return null;
  return (
    <mesh position={[0, y, z]}>
      <planeGeometry args={[width, width / 2]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  );
}

/** Glass dropper bottle with rose serum inside. */
function SerumBottle(props: React.ComponentProps<"group">) {
  return (
    <group {...props}>
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 1.7, 64]} />
        <meshPhysicalMaterial
          color="#fff4ef"
          transmission={0.92}
          roughness={0.06}
          thickness={0.6}
          ior={1.45}
          clearcoat={1}
          attenuationColor={ROSE}
          attenuationDistance={1.2}
        />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.47, 0.47, 1.3, 48]} />
        <meshPhysicalMaterial color={ROSE} roughness={0.25} transmission={0.4} thickness={0.4} />
      </mesh>
      <Label width={0.8} y={0.95} z={0.56} />
      <mesh position={[0, 1.83, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.34, 0.28, 48]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.22} />
      </mesh>
      <mesh position={[0, 2.25, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.42, 8, 24]} />
        <meshPhysicalMaterial color="#3d2b27" roughness={0.35} clearcoat={0.6} />
      </mesh>
    </group>
  );
}

/** Pearl cream jar with a gold lid. */
function CreamJar(props: React.ComponentProps<"group">) {
  return (
    <group {...props}>
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.68, 0.76, 64]} />
        <meshPhysicalMaterial color={PEARL} roughness={0.28} clearcoat={0.8} sheen={1} sheenColor={ROSE} />
      </mesh>
      <Label width={0.9} y={0.36} z={0.715} />
      <mesh position={[0, 0.92, 0]} castShadow>
        <cylinderGeometry args={[0.76, 0.76, 0.34, 64]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.18} />
      </mesh>
    </group>
  );
}

/** Tall pump bottle, like the toners and body lotions. */
function PumpBottle(props: React.ComponentProps<"group">) {
  return (
    <group {...props}>
      <RoundedBox args={[0.9, 2.1, 0.9]} radius={0.28} smoothness={6} position={[0, 1.05, 0]} castShadow>
        <meshPhysicalMaterial color="#f3d5cc" roughness={0.3} clearcoat={1} clearcoatRoughness={0.15} />
      </RoundedBox>
      <Label width={0.78} y={1.1} z={0.455} />
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.24, 0.24, 32]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.44, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.3, 16]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0.18, 2.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.08, 0.38, 6, 16]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

/** Lip oil wand, standing. */
function LipOil(props: React.ComponentProps<"group">) {
  return (
    <group {...props}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.1, 32]} />
        <meshPhysicalMaterial color="#e58f8f" transmission={0.6} thickness={0.4} roughness={0.1} clearcoat={1} />
      </mesh>
      <mesh position={[0, 1.45, 0]} castShadow>
        <cylinderGeometry args={[0.21, 0.21, 0.8, 32]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Pedestal({ radius, height, ...props }: { radius: number; height: number } & React.ComponentProps<"group">) {
  return (
    <group {...props}>
      <mesh position={[0, height / 2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[radius, radius, height, 96]} />
        <meshStandardMaterial color="#f7e6de" roughness={0.85} />
      </mesh>
    </group>
  );
}

/** Small seeded random generator, so petals land in the same places every visit. */
function makePetals(count: number) {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return Array.from({ length: count }, () => ({
    x: (rand() - 0.5) * 9,
    y: rand() * 5 - 0.5,
    z: (rand() - 0.5) * 4 - 1,
    speed: 0.15 + rand() * 0.25,
    spin: rand() * Math.PI * 2,
    scale: 0.12 + rand() * 0.12,
  }));
}

/** Soft rose petals drifting around the products. */
function Petals({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(() => makePetals(count), [count]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -1);
    shape.bezierCurveTo(1.1, -0.6, 0.9, 0.9, 0, 1);
    shape.bezierCurveTo(-0.9, 0.9, -1.1, -0.6, 0, -1);
    return new THREE.ShapeGeometry(shape, 12);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const mesh = ref.current;
    if (!mesh) return;
    seeds.forEach((s, i) => {
      const y = ((s.y - t * s.speed + 6) % 6) - 0.8;
      dummy.position.set(s.x + Math.sin(t * 0.6 + s.spin) * 0.35, y, s.z);
      dummy.rotation.set(t * 0.5 + s.spin, t * 0.3 + s.spin, s.spin);
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[geometry, undefined, count]}>
      <meshStandardMaterial color="#efb9ac" roughness={0.6} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const targetY = state.pointer.x * 0.35;
    const targetX = -state.pointer.y * 0.08;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, delta);
  });
  return <group ref={ref}>{children}</group>;
}

export default function HeroScene({ compact = false }: { compact?: boolean }) {
  return (
    <Canvas
      shadows
      dpr={[1, compact ? 1.5 : 2]}
      camera={{ position: [0, 2.3, 9.6], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 1.2, 0)}
      aria-label="3D arrangement of Senova skincare products"
    >
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 7, 5]}
        intensity={1.6}
        color="#fff1ea"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <pointLight position={[-4, 3, 2]} intensity={12} color={ROSE} />

      <Environment resolution={256}>
        {/* A warm cream room, so gold and glass reflect soft light instead of black */}
        <mesh scale={50}>
          <sphereGeometry args={[1, 32, 16]} />
          <meshBasicMaterial color="#f1ddd4" side={THREE.BackSide} />
        </mesh>
        <Lightformer form="rect" intensity={2.2} position={[0, 5, -3]} scale={[10, 3, 1]} color="#fff" />
        <Lightformer form="rect" intensity={1.2} position={[-5, 2, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#ffe3da" />
        <Lightformer form="ring" intensity={1.5} position={[5, 3, 2]} rotation-y={-Math.PI / 2} scale={3} color="#ffd9cc" />
      </Environment>

      <Rig>
        <group position={[0, -0.2, 0]}>
          <Pedestal radius={1.25} height={0.7} position={[-0.35, 0, 0]} />
          <Pedestal radius={0.95} height={0.35} position={[1.65, 0, 0.6]} />
          <Pedestal radius={0.8} height={1.1} position={[-2.35, 0, -0.6]} />

          <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.35} floatingRange={[0, 0.15]}>
            <SerumBottle position={[-0.35, 0.72, 0]} rotation={[0, -0.25, 0]} />
          </Float>
          <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.3} floatingRange={[0, 0.12]}>
            <CreamJar position={[1.65, 0.37, 0.6]} rotation={[0, -0.5, 0]} />
          </Float>
          <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.25} floatingRange={[0, 0.1]}>
            <PumpBottle position={[-2.35, 1.12, -0.6]} rotation={[0, 0.35, 0]} scale={0.9} />
          </Float>
          <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
            <LipOil position={[2.5, 2.2, -0.8]} rotation={[0.2, 0, -0.55]} scale={0.8} />
          </Float>

          {[
            [0.95, 0.12, 1.5, 0.12],
            [-1.4, 0.1, 1.35, 0.1],
            [2.6, 0.09, 1.3, 0.09],
          ].map(([x, y, z, r], i) => (
            <mesh key={i} position={[x, y, z]} castShadow>
              <sphereGeometry args={[r, 32, 32]} />
              <meshPhysicalMaterial color={PEARL} roughness={0.15} clearcoat={1} sheen={1} sheenColor={ROSE_DEEP} />
            </mesh>
          ))}

          <ContactShadows position={[0, 0.001, 0]} opacity={0.35} scale={12} blur={2.6} far={4} color="#93503f" />
        </group>
        <Petals count={compact ? 14 : 26} />
      </Rig>
    </Canvas>
  );
}
