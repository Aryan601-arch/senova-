import { cn } from "@/lib/utils";

/**
 * Splits the headline into lines → words → characters for the entrance animation.
 * The last word is set in the italic serif for contrast. Screen readers read the
 * plain sentence from the sr-only copy.
 */
export function HeroHeadline({ lines, className }: { lines: readonly string[]; className?: string }) {
  const full = lines.join(" ");
  return (
    <h1 className={cn("text-display font-medium", className)}>
      <span className="sr-only">{full}</span>
      <span aria-hidden="true" className="block">
        {lines.map((line, li) => {
          const words = line.split(" ");
          return (
            <span key={li} className="block whitespace-nowrap">
              {words.map((word, wi) => {
                const isAccent = li === lines.length - 1 && wi === words.length - 1;
                return (
                  <span key={wi} className="inline-block">
                    <span
                      className={cn(
                        "inline-flex overflow-hidden pb-[0.06em] -mb-[0.06em]",
                        isAccent && "font-serif font-normal italic tracking-[-0.02em] text-accent-text",
                      )}
                    >
                      {Array.from(word).map((ch, ci) => (
                        <span key={ci} data-char className="inline-block will-change-transform">
                          {ch}
                        </span>
                      ))}
                    </span>
                    {wi < words.length - 1 && <span className="inline-block w-[0.22em]" />}
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    </h1>
  );
}
