"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "@/components/ui/logo";
import { loaderStore, webglStatusStore } from "@/lib/stores";
import { siteConfig } from "@/data/site";

const MIN_DURATION = 1100;
const MAX_DURATION = 3200;

/**
 * Loading screen: logo, percentage and progress line. Progress follows real
 * signals (fonts, window load, WebGL ready) and is capped so it never drags on.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [display, setDisplay] = useState(0);
  const target = useRef(8);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let raf = 0;
    let shown = 0;
    let finished = false;

    const bump = (amount: number) => {
      target.current = Math.min(100, target.current + amount);
    };

    document.fonts?.ready.then(() => bump(30)).catch(() => bump(30));
    if (document.readyState === "complete") bump(35);
    else window.addEventListener("load", () => bump(35), { once: true });

    const onWebgl = () => {
      if (webglStatusStore.get() !== "pending") {
        bump(27);
        unsubscribe();
      }
    };
    const unsubscribe = webglStatusStore.subscribe(onWebgl);
    onWebgl();

    const finish = () => {
      if (finished) return;
      finished = true;
      setDisplay(100);
      setTimeout(() => setVisible(false), reduced ? 0 : 280);
    };

    const tick = () => {
      const elapsed = performance.now() - start;
      // Time-based floor so the counter always moves, even while waiting on signals.
      const floor = Math.min(92, (elapsed / MAX_DURATION) * 100);
      const goal = Math.max(target.current, floor);
      shown += (goal - shown) * (reduced ? 1 : 0.08);
      setDisplay(Math.min(100, Math.round(shown)));
      if ((shown > 99.2 && elapsed > (reduced ? 0 : MIN_DURATION)) || elapsed > MAX_DURATION) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={() => loaderStore.set(true)}>
      {visible && (
        <motion.div
          key="preloader"
          role="progressbar"
          aria-label={`Loading ${siteConfig.legalName}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={display}
          data-preloader
          className="fixed inset-0 z-[90] flex flex-col justify-between bg-bg p-6 text-fg md:p-10"
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="grid">
                <LogoMark className="size-9" />
              </motion.span>
              <span className="text-lg font-semibold uppercase tracking-[0.02em]">{siteConfig.name}</span>
            </span>
            <span className="eyebrow hidden sm:block">Home appliances — Nepal</span>
          </div>

          <div className="flex items-end justify-between gap-6">
            <p className="eyebrow max-w-[18ch]">Creating easy life</p>
            <p
              className="text-[clamp(4.5rem,18vw,14rem)] font-medium leading-[0.8] tracking-[-0.06em]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {display}
              <span className="text-accent-text">%</span>
            </p>
          </div>

          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-line">
            <div
              className="h-full origin-left bg-accent transition-transform duration-200 ease-linear"
              style={{ transform: `scaleX(${display / 100})` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
