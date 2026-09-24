"use client";

import { themeStore } from "@/lib/stores";

export type ScenePalette = {
  isDark: boolean;
  bg: string;
  fg: string;
  accent: string;
  accent2: string;
  warm: string;
  metal: string;
  grid: string;
  particle: string;
};

const palettes: Record<"dark" | "light", ScenePalette> = {
  dark: {
    isDark: true,
    bg: "#07080a",
    fg: "#eeeee8",
    accent: "#d4ff3f",
    accent2: "#7b8cff",
    warm: "#ff7a45",
    metal: "#c9ccd2",
    grid: "#3a3d45",
    particle: "#e8ecff",
  },
  light: {
    isDark: false,
    bg: "#f2f1ec",
    fg: "#0b0c0e",
    accent: "#b8e617",
    accent2: "#5566ff",
    warm: "#ff6a2b",
    metal: "#8e939c",
    grid: "#b9b8b0",
    particle: "#4a4f63",
  },
};

/** Theme-aware colors for 3D scenes. Re-renders the scene when the theme changes. */
export function useScenePalette(): ScenePalette {
  const theme = themeStore.use();
  return palettes[theme];
}
