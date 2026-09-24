import { cn } from "@/lib/utils";

/** Webor mark: the "W" badge from the original store, drawn in the site accent. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn("size-7", className)}>
      <circle cx="16" cy="16" r="14.25" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="11" fill="var(--accent)" />
      <path
        d="M9.6 11.5h2.1l1.6 6.2 1.8-6.2h1.8l1.8 6.2 1.6-6.2h2.1l-2.7 9h-1.9l-1.8-6-1.8 6h-1.9l-2.7-9Z"
        fill="var(--accent-ink)"
      />
    </svg>
  );
}

export function Logo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {showWordmark && <span className="text-[1.15rem] font-semibold uppercase tracking-[0.02em]">Webor</span>}
    </span>
  );
}
