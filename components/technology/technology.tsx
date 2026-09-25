"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { technologies, type Technology as Tech } from "@/data/technologies";
import { SectionHeading } from "@/components/ui/section-heading";
import { SceneView } from "@/components/three/scene-view";
import { SceneFallback } from "@/components/three/scene-fallback";
import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const TechnologyScene = dynamic(() => import("@/components/three/scenes/technology-scene"), { ssr: false });

function TechInfo({ tech }: { tech: Tech | null }) {
  return (
    <div aria-live="polite" className="min-h-[9.5rem]">
      <AnimatePresence mode="wait">
        {tech ? (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="glass flex flex-col gap-3 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-2xl font-medium tracking-[-0.03em]">{tech.name}</p>
              <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-accent-ink">
                {tech.category}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-fg-muted">{tech.description}</p>
            <p className="font-mono text-xs text-fg-subtle">In production for {tech.experience}</p>
          </motion.div>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="eyebrow pt-2"
          >
            Hover or focus a technology to learn how we use it
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Technology chips orbit the 3D planet in CSS 3D space (crisp, accessible text).
 * Positions are updated on GSAP's ticker without React re-renders.
 */
export function Technology() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  const orbit = useMediaQuery("(min-width: 768px) and (prefers-reduced-motion: no-preference)");

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (!orbit) {
      chipRefs.current.forEach((el) => el && (el.style.transform = ""));
      return;
    }
    const stage = stageRef.current;
    if (!stage) return;
    let angle = 0;
    let speed = 0.12;
    let tiltX = 0;
    let tiltTarget = 0;
    let lastScroll = window.scrollY;
    const n = technologies.length;

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      tiltTarget = ((e.clientY - r.top) / r.height - 0.5) * 16;
    };
    stage.addEventListener("pointermove", onMove);

    const tick = (_: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 50) / 1000;
      const scrollDelta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      const targetSpeed = activeRef.current === null ? 0.12 + Math.min(Math.abs(scrollDelta) * 0.01, 0.8) : 0;
      speed += (targetSpeed - speed) * 0.06;
      angle += speed * dt;
      tiltX += (tiltTarget - tiltX) * 0.05;

      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const rx = Math.min(w * 0.4, 620);
      const rz = 240;
      const perRing = [Math.ceil(n / 2), Math.floor(n / 2)];

      chipRefs.current.forEach((el, i) => {
        if (!el) return;
        // Two counter-rotating bands, above and below the planet.
        const ring = i < perRing[0] ? 0 : 1;
        const idx = ring === 0 ? i : i - perRing[0];
        const dir = ring === 0 ? 1 : -1;
        const theta = angle * dir + (idx / perRing[ring]) * Math.PI * 2 + ring * 0.4;
        const x = Math.cos(theta) * rx * (ring ? 0.86 : 1);
        const z = Math.sin(theta) * rz;
        const bandY = ring === 0 ? -h * 0.2 : h * 0.2;
        const y = bandY + Math.sin(theta) * h * 0.06 * dir + Math.sin(angle * 3 + i) * 5;
        const depth = (z / rz + 1) / 2; // 0 back → 1 front
        const isActive = activeRef.current === i;
        const scale = (0.78 + depth * 0.3) * (isActive ? 1.15 : 1);
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateX(${(-tiltX).toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = String(activeRef.current !== null && !isActive ? 0.3 : 0.45 + depth * 0.55);
        el.style.zIndex = String(Math.round(depth * 100));
      });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      stage.removeEventListener("pointermove", onMove);
    };
  }, [orbit]);

  const current = active === null ? null : technologies[active];

  return (
    <section id="technology" ref={sectionRef} aria-labelledby="technology-title" className="relative overflow-hidden py-28 md:py-44">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <SectionHeading
            className="md:col-span-7"
            index="04"
            eyebrow="Technology"
            id="technology-title"
            title="Modern tools, chosen with intent."
          />
          <div className="hidden md:col-span-4 md:col-start-9 md:block">
            <TechInfo tech={current} />
          </div>
        </div>
      </div>

      <div ref={stageRef} className="relative mt-10 md:mt-0 md:h-[78vh]" onPointerLeave={() => setActive(null)}>
        <SceneView
          className="absolute inset-0"
          camera={{ position: [0, 0, 7.5], fov: 35 }}
          fallback={<SceneFallback variant="rings" accent="var(--accent-2)" />}
        >
          <TechnologyScene sectionRef={sectionRef} />
        </SceneView>

        <ul
          className={cn(
            orbit
              ? "absolute inset-0 flex items-center justify-center [perspective:1100px] [transform-style:preserve-3d]"
              : "container-x relative grid grid-cols-2 gap-3 py-10 sm:grid-cols-3",
          )}
          aria-label="Technologies we use"
        >
          {technologies.map((tech, i) => (
            <li key={tech.name} className={cn(orbit && "absolute left-1/2 top-1/2 -ml-[5.5rem] -mt-8 w-44")}>
              <button
                ref={(el) => void (chipRefs.current[i] = el)}
                type="button"
                data-cursor="hover"
                data-cursor-label="Info"
                aria-pressed={active === i}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => setActive((a) => (a === i ? null : i))}
                className={cn(
                  "glass group flex h-16 w-full items-center gap-3 rounded-2xl px-4 text-left transition-[border-color,box-shadow,background-color] duration-300 will-change-transform",
                  active === i ? "border-accent/60 shadow-[0_0_40px_-8px_var(--accent)]" : "hover:border-line-strong",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-xl font-mono text-xs font-semibold transition-colors duration-300",
                    active === i ? "bg-accent text-accent-ink" : "bg-fg/10 text-fg",
                  )}
                >
                  {tech.short}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{tech.name}</span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-fg-subtle">{tech.category}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {!orbit && (
          <div className="container-x relative md:hidden">
            <TechInfo tech={current} />
          </div>
        )}
      </div>
    </section>
  );
}
