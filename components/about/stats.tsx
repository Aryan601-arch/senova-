"use client";

import type { Stat } from "@/data/about";
import { Counter } from "@/components/ui/counter";
import { Reveal } from "@/components/ui/reveal";

export function Stats({ items }: { items: Stat[] }) {
  return (
    <dl className="mt-24 grid grid-cols-2 border-t border-line md:mt-32 lg:grid-cols-4">
      {items.map((s, i) => (
        <Reveal
          key={s.label}
          delay={i * 0.08}
          className="group relative flex flex-col gap-3 border-b border-line py-8 pr-4 even:pl-4 md:py-12 lg:border-b-0 lg:pl-8 lg:first:pl-0 lg:[&:not(:first-child)]:border-l lg:even:pl-8"
        >
          <dt className="order-2 flex flex-col gap-1">
            <span className="text-base font-medium">{s.label}</span>
            <span className="text-sm text-fg-muted">{s.detail}</span>
          </dt>
          <dd className="order-1 text-[clamp(3.25rem,7vw,6.5rem)] font-medium leading-none tracking-[-0.05em] transition-colors duration-500 group-hover:text-accent-text">
            <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
          </dd>
        </Reveal>
      ))}
    </dl>
  );
}
