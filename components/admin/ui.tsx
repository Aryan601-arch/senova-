import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "block w-full rounded-2xl border border-line-strong bg-bg-elevated px-4 py-3 text-base text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-fg/50";

export function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {hint && <span className="ml-2 font-normal text-fg-muted">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

export function Flash({ children, tone = "success" }: { children: ReactNode; tone?: "success" | "error" }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        tone === "error" ? "border-danger/40 bg-danger/10 text-danger" : "border-success/40 bg-success/10 text-fg",
      )}
    >
      {children}
    </p>
  );
}

export const smallButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-line-strong px-4 text-sm font-medium transition-colors hover:bg-fg/5";
export const primaryButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-accent-ink transition-transform active:scale-95 disabled:opacity-60";
