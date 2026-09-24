import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SplitText } from "./split-text";

type SectionHeadingProps = {
  eyebrow: string;
  index?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  index,
  title,
  description,
  align = "left",
  className,
  titleClassName,
  id,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-6", align === "center" && "items-center text-center", className)}>
      <p className="eyebrow flex items-center gap-3">
        {index && <span className="text-accent-text">{index}</span>}
        <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
        <span>{eyebrow}</span>
      </p>
      <SplitText
        as="h2"
        text={title}
        className={cn("text-headline max-w-[16ch] font-medium text-balance", align === "center" && "mx-auto", titleClassName)}
        id={id}
      />
      {description && (
        <div className={cn("max-w-xl text-base leading-relaxed text-fg-muted md:text-lg", align === "center" && "mx-auto")}>
          {description}
        </div>
      )}
    </div>
  );
}
