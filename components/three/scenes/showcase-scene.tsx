"use client";

import { useContext, useMemo, useRef, useState, type RefObject } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { showcaseNodes, type ShowcaseNode } from "@/data/showcase";
import { cursorStore, showcaseDrag, showcaseStore } from "@/lib/stores";
import { getDeviceTier } from "@/lib/webgl";
import { useScenePalette, type ScenePalette } from "../scene-theme";
import { SceneEnvironment } from "../scene-environment";
import { ParticleField } from "../particle-field";
import { InteractiveGrid } from "../interactive-grid";
import { useSectionProgress } from "../use-section-progress";
import { ViewElementContext } from "../view-context";

type Props = {
  sectionRef: RefObject<HTMLElement | null>;
  labelRefs: RefObject<Record<string, HTMLElement | null>>;
};

const smooth = (t: number) => t * t * (3 - 2 * t);

// Three layouts the nodes travel between as the user scrolls through the chapters.
function layoutFor(chapter: number, i: number, n: number, t: number, out: THREE.Vector3) {
  const a = (i / n) * Math.PI * 2;
  if (chapter === 0) {
    // Core: nodes huddle close to the centre.
    return out.set(Math.cos(a * 2.1) * 1.35, Math.sin(a * 1.7) * 0.9, Math.sin(a * 2.1) * 1.1);
  }
  if (chapter === 1) {
    // System: a clean, flat ring — structure.
    return out.set(Math.cos(a) * 2.6, 0, Math.sin(a) * 2.6);
  }
  // Orbit: tilted, moving orbits.
  const r = 2.4 + (i % 3) * 0.55;
  const speed = 0.25 + (i % 2) * 0.12;
  const th = a + t * speed;
  const tilt = (i % 2 ? 0.5 : -0.35) + i * 0.08;
  return out.set(Math.cos(th) * r, Math.sin(th) * r * Math.sin(tilt), Math.sin(th) * r * Math.cos(tilt));
}

function NodeGeometry({ shape }: { shape: ShowcaseNode["shape"] }) {
  switch (shape) {
    case "icosahedron":
      return <icosahedronGeometry args={[0.32, 0]} />;
    case "torus":
      return <torusGeometry args={[0.26, 0.1, 24, 64]} />;
    case "octahedron":
      return <octahedronGeometry args={[0.34, 0]} />;
    case "box":
      return <boxGeometry args={[0.44, 0.44, 0.44]} />;
    default:
      return <sphereGeometry args={[0.3, 48, 48]} />;
  }
}

function NodeMaterial({ node, palette, hot }: { node: ShowcaseNode; palette: ScenePalette; hot: boolean }) {
  const emissiveIntensity = hot ? 0.9 : 0.12;
  if (node.material === "glass") {
    return (
      <meshPhysicalMaterial
        color={node.color}
        emissive={node.color}
        emissiveIntensity={emissiveIntensity}
        roughness={0.05}
        metalness={0.1}
        clearcoat={1}
        iridescence={1}
        transparent
        opacity={0.8}
        envMapIntensity={2}
      />
    );
  }
  if (node.material === "matte") {
    return <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={emissiveIntensity} roughness={0.7} />;
  }
  return (
    <meshPhysicalMaterial
      color={palette.isDark ? node.color : node.color}
      emissive={node.color}
      emissiveIntensity={emissiveIntensity}
      metalness={1}
      roughness={0.18}
      clearcoat={1}
    />
  );
}

/**
 * The immersive showcase: a core, five labelled system nodes connected by light,
 * a grid floor and particles. Scroll moves through three chapters; drag rotates;
 * hover highlights; click selects (details open in the DOM panel).
 */
export default function ShowcaseScene({ sectionRef, labelRefs }: Props) {
  const palette = useScenePalette();
  const [tier] = useState(getDeviceTier);
  const viewEl = useContext(ViewElementContext);
  const { size } = useThree();
  const isMobile = size.width < 768;
  const progress = useSectionProgress(sectionRef);
  const { hovered, selected } = showcaseStore.use();

  const world = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);
  const tmpA = useMemo(() => new THREE.Vector3(), []);
  const tmpB = useMemo(() => new THREE.Vector3(), []);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  // One line per node from the core, positions updated every frame.
  const lines = useMemo(
    () =>
      showcaseNodes.map((n) => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
        const mat = new THREE.LineBasicMaterial({ color: n.color, transparent: true, opacity: 0.5 });
        return new THREE.Line(geo, mat);
      }),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const inner = progress.current.inner;
    const chapterFloat = Math.min(inner * 2.4, 2);
    const from = Math.floor(chapterFloat);
    const to = Math.min(from + 1, 2);
    const blend = smooth(chapterFloat - from);

    // Drag rotation with inertia plus a slow idle spin.
    showcaseDrag.x += (showcaseDrag.targetX - showcaseDrag.x) * 0.08;
    showcaseDrag.y += (showcaseDrag.targetY - showcaseDrag.y) * 0.08;
    if (world.current) {
      world.current.rotation.y = showcaseDrag.x + t * 0.04 + inner * 1.2;
      world.current.rotation.x = THREE.MathUtils.clamp(showcaseDrag.y, -0.6, 0.6) + 0.12;
    }

    // Camera pulls back and rises through the chapters.
    const cam = state.camera;
    const dist = (isMobile ? 14.5 : 8.2) + chapterFloat * 1.2;
    const height = 0.4 + chapterFloat * 1.1;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, 0, 3, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, height, 3, delta);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, dist, 3, delta);
    cam.lookAt(lookAt.set(0, 0, 0));

    if (core.current) {
      core.current.rotation.y += delta * 0.3;
      core.current.rotation.x += delta * 0.12;
      const coreScale = 1 - chapterFloat * 0.12 + Math.sin(t * 1.5) * 0.02;
      core.current.scale.setScalar(coreScale);
    }

    const n = showcaseNodes.length;
    const el = viewEl?.current;
    const rect = { width: el?.clientWidth ?? size.width, height: el?.clientHeight ?? size.height };
    showcaseNodes.forEach((node, i) => {
      const g = nodeRefs.current[i];
      if (!g) return;
      layoutFor(from, i, n, t, tmpA);
      layoutFor(to, i, n, t, tmpB);
      tmpA.lerp(tmpB, blend);
      g.position.lerp(tmpA, 0.12);
      g.rotation.x += delta * 0.4;
      g.rotation.y += delta * 0.6;
      const isHot = hovered === node.id || selected === node.id;
      const baseScale = from === 0 && to === 0 ? 0.75 : 0.75 + Math.min(chapterFloat, 1) * 0.25;
      const s = THREE.MathUtils.damp(g.scale.x, baseScale * (isHot ? 1.35 : 1), 8, delta);
      g.scale.setScalar(s);

      // Connection line from the core to the node.
      const line = lines[i];
      const attr = line.geometry.getAttribute("position") as THREE.BufferAttribute;
      attr.setXYZ(0, 0, 0, 0);
      attr.setXYZ(1, g.position.x, g.position.y, g.position.z);
      attr.needsUpdate = true;
      (line.material as THREE.LineBasicMaterial).opacity = (0.15 + Math.min(chapterFloat, 1) * 0.45) * (isHot ? 1.6 : 1);

      // Position the DOM label over the node.
      const label = labelRefs.current?.[node.id];
      if (label) {
        g.getWorldPosition(projected);
        projected.project(cam);
        const visible = projected.z < 1;
        const x = ((projected.x + 1) / 2) * rect.width;
        const y = ((1 - projected.y) / 2) * rect.height;
        label.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        label.style.opacity = visible ? "1" : "0";
      }
    });

    if (halo.current) {
      const idx = showcaseNodes.findIndex((nd) => nd.id === selected);
      const g = idx >= 0 ? nodeRefs.current[idx] : null;
      halo.current.visible = !!g;
      if (g) {
        halo.current.position.copy(g.position);
        halo.current.lookAt(state.camera.position);
        halo.current.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
      }
    }
  });

  const onOver = (id: string) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    showcaseStore.set((s) => ({ ...s, hovered: id }));
    cursorStore.set({ label: "Open", variant: "hover" });
  };
  const onOut = () => {
    showcaseStore.set((s) => ({ ...s, hovered: null }));
    cursorStore.set({ label: null, variant: "default" });
  };
  const onClick = (id: string) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta > 8) return; // it was a drag, not a click
    showcaseStore.set((s) => ({ ...s, selected: s.selected === id ? null : id }));
  };

  return (
    <>
      <SceneEnvironment palette={palette} />
      <group ref={world}>
        {/* Core */}
        <group ref={core}>
          <mesh>
            <icosahedronGeometry args={[0.95, 1]} />
            <meshPhysicalMaterial
              color={palette.isDark ? "#9aa1ae" : "#c4c7ce"}
              metalness={0.9}
              roughness={0.12}
              clearcoat={1}
              iridescence={1}
              iridescenceIOR={1.5}
              flatShading
            />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[1.25, 1]} />
            <meshBasicMaterial color={palette.accent} wireframe transparent opacity={0.35} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={2} toneMapped={false} />
          </mesh>
        </group>

        {lines.map((line, i) => (
          <primitive key={showcaseNodes[i].id} object={line} />
        ))}

        {showcaseNodes.map((node, i) => (
          <group key={node.id} ref={(el) => void (nodeRefs.current[i] = el)}>
            <mesh onPointerOver={onOver(node.id)} onPointerOut={onOut} onClick={onClick(node.id)}>
              <NodeGeometry shape={node.shape} />
              <NodeMaterial node={node} palette={palette} hot={hovered === node.id || selected === node.id} />
            </mesh>
            {/* Invisible, larger hit area makes small objects easy to hover and tap */}
            <mesh onPointerOver={onOver(node.id)} onPointerOut={onOut} onClick={onClick(node.id)} visible={false}>
              <sphereGeometry args={[0.55, 12, 12]} />
            </mesh>
          </group>
        ))}

        <mesh ref={halo} visible={false}>
          <ringGeometry args={[0.52, 0.56, 64]} />
          <meshBasicMaterial color={palette.accent} toneMapped={false} side={THREE.DoubleSide} transparent opacity={0.9} />
        </mesh>
      </group>

      <InteractiveGrid
        position={[0, -2.4, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={40}
        cells={56}
        color={palette.grid}
        glowColor={palette.accent}
        glowRadius={0.08}
        opacity={palette.isDark ? 1 : 0.6}
      />
      <ParticleField
        count={tier === "high" ? 700 : tier === "mid" ? 450 : 220}
        radius={10}
        depth={10}
        size={2.4}
        color={palette.particle}
        opacity={palette.isDark ? 0.7 : 0.45}
      />
    </>
  );
}
