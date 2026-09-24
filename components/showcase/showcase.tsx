"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hand, MousePointerClick, X } from "lucide-react";
import { showcaseChapters, showcaseNodes } from "@/data/showcase";
import { showcaseDrag, showcaseStore } from "@/lib/stores";
import { SceneView } from "@/components/three/scene-view";
import { SceneFallback } from "@/components/three/scene-fallback";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const ShowcaseScene = dynamic(() => import("@/components/three/scenes/showcase-scene"), { ssr: false });

/**
 * Immersive 3D showcase. The section is 300vh tall with a sticky viewport, so
 * scrolling moves through three chapters while the scene stays in view.
 */
export function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRefs = useRef<Record<string, HTMLElement | null>>({});
  const [chapter, setChapter] = useState(0);
  const { selected, hovered } = showcaseStore.use();
  const reduced = useReducedMotion();
  const drag = useRef<{ active: boolean; x: number; y: number; id: number } | null>(null);

  // Track which chapter is active from scroll position.
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const inner = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      setChapter(Math.min(showcaseChapters.length - 1, Math.floor(inner * 2.4 + 0.35)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Clear selection with Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") showcaseStore.set((s) => ({ ...s, selected: null }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d?.active || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    d.x = e.clientX;
    d.y = e.clientY;
    showcaseDrag.targetX += dx * 0.008;
    if (e.pointerType === "mouse") showcaseDrag.targetY = Math.max(-0.6, Math.min(0.6, showcaseDrag.targetY + dy * 0.004));
  };
  const endDrag = () => {
    drag.current = null;
  };

  const selectedNode = showcaseNodes.find((n) => n.id === selected) ?? null;
  const current = showcaseChapters[chapter];

  return (
    <section
      id="showcase"
      ref={sectionRef}
      aria-labelledby="showcase-title"
      className={cn("relative", reduced ? "h-auto" : "h-[320vh]")}
    >
      <div
        className={cn("top-0 h-[100svh] overflow-hidden", !reduced && "sticky")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => {
          endDrag();
          showcaseStore.set((s) => ({ ...s, hovered: null }));
        }}
        style={{ touchAction: "pan-y" }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-1/2 aspect-square w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-[140px]"
            style={{ background: selectedNode?.color ?? "var(--accent)" }}
          />
        </div>

        <SceneView
          interactive
          className="absolute inset-0"
          viewClassName="cursor-grab active:cursor-grabbing"
          camera={{ position: [0, 0.4, 8.2], fov: 38 }}
          fallback={<SceneFallback variant="grid" />}
          label="Interactive 3D system: a glowing core connected to five objects representing interface, real-time 3D, data, intelligence and cloud"
        >
          <ShowcaseScene sectionRef={sectionRef} labelRefs={labelRefs} />
        </SceneView>

        {/* Object labels, positioned every frame by the 3D scene */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="false">
          {showcaseNodes.map((node) => {
            const isHot = hovered === node.id || selected === node.id;
            return (
              <div
                key={node.id}
                ref={(el) => void (labelRefs.current[node.id] = el)}
                className="absolute left-0 top-0 opacity-0 transition-opacity duration-500 will-change-transform"
              >
                <button
                  type="button"
                  onClick={() => showcaseStore.set((s) => ({ ...s, selected: s.selected === node.id ? null : node.id }))}
                  onFocus={() => showcaseStore.set((s) => ({ ...s, hovered: node.id }))}
                  onBlur={() => showcaseStore.set((s) => ({ ...s, hovered: null }))}
                  aria-pressed={selected === node.id}
                  data-cursor="hover"
                  data-cursor-label="Open"
                  className="pointer-events-auto absolute bottom-0 left-0 ml-5 mb-5 flex -translate-y-0 items-center gap-2 whitespace-nowrap"
                >
                  {/* Leader line from the object to the label */}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-5 -left-5 h-px w-7 origin-left -rotate-45 bg-fg/50"
                  />
                  <span
                    className={cn(
                      "glass flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3.5 text-xs font-medium transition-all duration-300",
                      isHot && "!border-transparent !bg-accent text-accent-ink",
                    )}
                  >
                    <span className="size-2 rounded-full" style={{ background: isHot ? "var(--accent-ink)" : node.color }} aria-hidden="true" />
                    {node.label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Chapter copy */}
        <div className="container-x pointer-events-none absolute inset-x-0 top-0 pt-28 md:pt-32">
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="text-accent-text">05</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
            <span id="showcase-title">Immersive showcase</span>
          </p>
          <div className="max-w-md" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="mb-3 font-mono text-xs text-fg-muted">{current.label}</p>
                <h2 className="text-[clamp(1.9rem,3.6vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-balance">
                  {current.title}
                </h2>
                <p className="mt-4 hidden max-w-sm text-base leading-relaxed text-fg-muted sm:block">{current.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Chapter progress + hints */}
        <div className="container-x pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 pb-8">
          <ol className="flex gap-2" aria-label="Chapters">
            {showcaseChapters.map((c, i) => (
              <li key={c.id} className="flex flex-col gap-2">
                <span className="h-0.5 w-12 overflow-hidden rounded-full bg-line md:w-20">
                  <span
                    className="block h-full origin-left rounded-full bg-fg transition-transform duration-700 ease-out-expo"
                    style={{ transform: `scaleX(${i <= chapter ? 1 : 0})` }}
                  />
                </span>
                <span className={cn("font-mono text-[0.65rem] uppercase tracking-wider", i === chapter ? "text-fg" : "text-fg-subtle")}>
                  {c.id}
                </span>
              </li>
            ))}
          </ol>
          <div className="hidden items-center gap-5 text-fg-muted md:flex">
            <span className="flex items-center gap-2 text-xs">
              <Hand className="size-4" aria-hidden="true" /> Drag to rotate
            </span>
            <span className="flex items-center gap-2 text-xs">
              <MousePointerClick className="size-4" aria-hidden="true" /> Click an object
            </span>
          </div>
        </div>

        {/* Detail panel for the selected object */}
        <AnimatePresence>
          {selectedNode && (
            <motion.aside
              key={selectedNode.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              aria-live="polite"
              className="glass absolute bottom-24 right-4 z-10 w-[min(22rem,calc(100%-2rem))] rounded-3xl p-6 md:bottom-auto md:right-[clamp(1rem,4vw,3.5rem)] md:top-1/2 md:-translate-y-1/2"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="size-3 rounded-full" style={{ background: selectedNode.color }} aria-hidden="true" />
                  <h3 className="text-xl font-medium tracking-[-0.03em]">{selectedNode.label}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => showcaseStore.set((s) => ({ ...s, selected: null }))}
                  aria-label="Close details"
                  className="grid size-9 place-items-center rounded-full border border-line transition-colors hover:bg-fg/10"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
              <p className="text-sm leading-relaxed text-fg-muted">{selectedNode.detail}</p>
              <p className="mt-5 inline-flex rounded-full bg-accent px-3 py-1 font-mono text-xs text-accent-ink">{selectedNode.metric}</p>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
