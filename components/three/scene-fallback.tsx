import { cn } from "@/lib/utils";

type SceneFallbackProps = {
  className?: string;
  accent?: string;
  variant?: "orb" | "rings" | "grid";
};

/**
 * Static, designed stand-in for 3D scenes. Shown before WebGL is ready and
 * permanently when WebGL is unavailable, so no section is ever blank.
 */
export function SceneFallback({ className, accent = "var(--accent)", variant = "orb" }: SceneFallbackProps) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="grid-lines mask-radial absolute inset-0 opacity-60" />
      <div
        className="absolute left-1/2 top-1/2 aspect-square w-[min(70%,34rem)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle at 32% 28%, color-mix(in oklab, white 70%, ${accent}) 0%, ${accent} 18%, color-mix(in oklab, ${accent} 40%, var(--accent-2)) 45%, transparent 72%)`,
          filter: "blur(2px)",
          opacity: 0.55,
          animation: "aurora 12s ease-in-out infinite",
        }}
      />
      {variant !== "orb" && (
        <>
          <div className="absolute left-1/2 top-1/2 aspect-square w-[min(80%,40rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line-strong" />
          <div className="absolute left-1/2 top-1/2 aspect-[2/1] w-[min(95%,48rem)] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-[50%] border border-line" />
        </>
      )}
      {variant === "grid" && (
        <div className="absolute inset-x-0 bottom-0 h-1/2 [perspective:600px]">
          <div className="grid-lines absolute inset-0 origin-bottom [transform:rotateX(60deg)] opacity-70" />
        </div>
      )}
    </div>
  );
}
