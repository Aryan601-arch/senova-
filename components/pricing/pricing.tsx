"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { pricingIntro, pricingPlans, type PricingPlan } from "@/data/pricing";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function PlanCard({ plan, index }: { plan: PricingPlan; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  // Spotlight that follows the pointer across the card.
  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      initial={{ opacity: 0, y: 60, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[2rem] border p-8 md:p-10",
        plan.highlighted ? "border-transparent bg-fg text-bg" : "border-line bg-bg-elevated/50 backdrop-blur-sm",
      )}
      style={{ transformPerspective: 1000 }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: plan.highlighted
            ? "radial-gradient(420px circle at var(--mx) var(--my), color-mix(in oklab, var(--accent) 45%, transparent), transparent 60%)"
            : "radial-gradient(420px circle at var(--mx) var(--my), color-mix(in oklab, var(--fg) 8%, transparent), transparent 60%)",
        }}
      />
      <div className="relative flex items-center justify-between gap-4">
        <h3 className="text-2xl font-medium tracking-[-0.03em]">{plan.name}</h3>
        {plan.badge && (
          <span className="rounded-full bg-accent px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-accent-ink">
            {plan.badge}
          </span>
        )}
      </div>
      <p className={cn("relative mt-4 min-h-[3.5rem] text-sm leading-relaxed", plan.highlighted ? "text-bg/70" : "text-fg-muted")}>
        {plan.description}
      </p>
      <p className="relative mt-8 flex items-baseline gap-3">
        <span className="text-[clamp(3rem,5vw,4.5rem)] font-medium leading-none tracking-[-0.05em]">{plan.price}</span>
        <span className={cn("text-sm", plan.highlighted ? "text-bg/60" : "text-fg-muted")}>{plan.cadence}</span>
      </p>
      <ul className={cn("relative mt-8 flex flex-1 flex-col gap-3.5 border-t pt-8", plan.highlighted ? "border-bg/15" : "border-line")}>
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <span
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                plan.highlighted ? "bg-accent text-accent-ink" : "bg-fg/10 text-fg",
              )}
            >
              <Check className="size-3" aria-hidden="true" />
            </span>
            {f}
          </li>
        ))}
      </ul>
      <ButtonLink
        href="/#contact"
        variant={plan.highlighted ? "primary" : "secondary"}
        className="relative mt-10 w-full justify-between"
        aria-label={`${plan.cta} — ${plan.name} plan`}
      >
        {plan.cta}
      </ButtonLink>
    </motion.div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative py-28 md:py-44">
      <div className="container-x">
        <div className="mb-16 grid gap-10 md:mb-20 md:grid-cols-12 md:items-end">
          <SectionHeading
            className="md:col-span-7"
            index="08"
            eyebrow={pricingIntro.eyebrow}
            id="pricing-title"
            title={pricingIntro.title}
          />
          <div className="flex flex-col gap-3 md:col-span-4 md:col-start-9">
            <p className="text-lg leading-relaxed text-fg-muted">{pricingIntro.text}</p>
            <p className="font-mono text-xs text-fg-subtle">{pricingIntro.currencyNote}</p>
          </div>
        </div>
        <div className="grid gap-5 [perspective:1400px] lg:grid-cols-3">
          {pricingPlans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
