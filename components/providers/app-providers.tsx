"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { SmoothScroll } from "./smooth-scroll";
import { ThemeSync } from "./theme-provider";
import { PointerTracker } from "./pointer-tracker";
import { ScrollTriggerRefresh } from "./scroll-trigger-refresh";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.7 }}>
      <SmoothScroll>
        <ThemeSync />
        <PointerTracker />
        <ScrollTriggerRefresh />
        {children}
      </SmoothScroll>
    </MotionConfig>
  );
}
