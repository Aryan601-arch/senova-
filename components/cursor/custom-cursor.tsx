"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { cursorStore } from "@/lib/stores";
import { useIsTouch } from "@/hooks/use-is-touch";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, [data-cursor]";

/**
 * Desktop-only custom cursor. Grows over interactive elements and shows a label
 * from `data-cursor-label` (DOM) or the cursor store (3D objects).
 * Disabled on touch devices and when reduced motion is preferred.
 */
export function CustomCursor() {
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();
  const enabled = !isTouch && !reduced;

  const ref = useRef<HTMLDivElement>(null);
  const [domState, setDomState] = useState<{ hover: boolean; label: string | null; text: boolean }>({
    hover: false,
    label: null,
    text: false,
  });
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const sceneCursor = cursorStore.use();

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    document.documentElement.classList.add("has-custom-cursor");
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      xTo(e.clientX);
      yTo(e.clientY);
      setVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest<HTMLElement>(INTERACTIVE);
      const isText = !!target?.closest("input[type='text'], input[type='email'], textarea");
      setDomState({
        hover: !!interactive,
        label: interactive?.dataset.cursorLabel ?? null,
        text: isText,
      });
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  const label = domState.label ?? sceneCursor.label;
  const hover = domState.hover || sceneCursor.variant === "hover";
  const size = label ? 88 : domState.text ? 4 : hover ? 56 : 14;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none fixed left-0 top-0 z-[100]", !label && !hover && "mix-blend-difference")}
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s" }}
    >
      <div
        className={cn(
          "grid place-items-center rounded-full transition-[width,height,background-color,border-color,transform] duration-500 ease-out-expo",
          label
            ? "bg-accent text-accent-ink"
            : hover
              ? "border border-fg/60 bg-fg/5 backdrop-blur-[2px]"
              : "bg-white",
        )}
        style={{
          width: size,
          height: domState.text && !label ? 28 : size,
          transform: `translate(-50%, -50%) scale(${pressed ? 0.85 : 1})`,
        }}
      >
        <span
          className={cn(
            "font-mono text-[0.65rem] font-medium uppercase tracking-[0.14em] transition-opacity duration-300",
            label ? "opacity-100" : "opacity-0",
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
