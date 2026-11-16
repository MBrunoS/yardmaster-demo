import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";
import { Easing, interpolate } from "remotion";

export const sans = loadSans("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["500"], subsets: ["latin"] }).fontFamily;

export const color = {
  bg: "#141318",
  panel: "#1d1b22",
  line: "#2e2b36",
  text: "#f1eee8",
  muted: "#9a95a3",
  accent: "#c6f24e",
  green: "#4cc38a",
  red: "#f0625a",
  amber: "#f2b84b",
  purple: "#a78bfa",
} as const;

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** 0 before `at`, easing to 1 over `duration` frames. */
export function appear(frame: number, at: number, duration = 14): number {
  return interpolate(frame, [at, at + duration], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** The last entry whose `at` has passed, or undefined before the first. */
export function current<T extends { readonly at: number }>(
  frame: number,
  steps: readonly T[],
): T | undefined {
  let found: T | undefined;
  for (const step of steps) if (frame >= step.at) found = step;
  return found;
}
