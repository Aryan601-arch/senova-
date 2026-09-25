"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

// The very first page load is revealed by the preloader, so only client-side
// navigations get the transition (this also keeps content visible without JS).
let isFirstRender = true;

/**
 * Page transition. `template.tsx` re-mounts on every navigation, so each route
 * fades and lifts in quickly. Kept short so navigation never feels slow.
 * Only opacity/transform are animated; transform returns to `none` at rest,
 * so fixed and pinned descendants keep working.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const animate = !isFirstRender;
  useEffect(() => {
    isFirstRender = false;
  }, []);

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
