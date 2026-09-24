import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site";

/** Senova mark: a four-point "nova" star inside an orbit ring. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn("size-7", className)}>
      <circle cx="16" cy="16" r="14.25" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <path
        d="M16 4.5c.9 6.1 5.4 10.6 11.5 11.5-6.1.9-10.6 5.4-11.5 11.5-.9-6.1-5.4-10.6-11.5-11.5C10.6 15.1 15.1 10.6 16 4.5Z"
        fill="var(--accent)"
      />
      <circle cx="16" cy="16" r="2.2" fill="var(--accent-ink)" />
    </svg>
  );
}

export function Logo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {showWordmark && (
        <span className="text-[1.15rem] font-semibold lowercase tracking-[-0.04em]">{siteConfig.name}</span>
      )}
    </span>
  );
}
