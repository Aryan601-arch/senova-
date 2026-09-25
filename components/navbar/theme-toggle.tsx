"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={!isDark}
      data-cursor="hover"
      className={cn(
        "relative grid size-11 place-items-center overflow-hidden rounded-full border border-line text-fg transition-colors duration-300 hover:border-line-strong hover:bg-fg/5",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 18, opacity: 0, rotate: -60 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -18, opacity: 0, rotate: 60 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="grid place-items-center"
        >
          {isDark ? <Moon className="size-[1.05rem]" aria-hidden="true" /> : <Sun className="size-[1.05rem]" aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
