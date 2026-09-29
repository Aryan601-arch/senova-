import { LotusMark } from "./logo";

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "center" | "left";
};

export function SectionHeading({ title, subtitle, eyebrow, align = "center" }: Props) {
  const center = align === "center";
  return (
    <div data-reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-heading text-cocoa">{title}</h2>
      {subtitle && <p className="mt-3 font-serif text-xl text-cocoa-muted italic">{subtitle}</p>}
      <div className={`ornament-rule mt-5 ${center ? "justify-center" : ""}`}>
        <LotusMark className="h-4 w-6" />
      </div>
    </div>
  );
}
