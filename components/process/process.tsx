"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { processSteps } from "@/data/process";
import { SectionHeading } from "@/components/ui/section-heading";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Process: a sticky "active stage" panel on the left follows the step
 * currently in the middle of the viewport on the right.
 */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useGSAP(
    () => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", sectionRef.current);
      // The active step is the last one whose top has crossed 55% of the viewport.
      const updateActive = () => {
        const line = window.innerHeight * 0.55;
        let idx = 0;
        steps.forEach((step, i) => {
          if (step.getBoundingClientRect().top <= line) idx = i;
        });
        setActive(idx);
      };

      const list = sectionRef.current?.querySelector("[data-steps]");
      if (list) {
        ScrollTrigger.create({
          trigger: list,
          start: "top 55%",
          end: "bottom 55%",
          onRefresh: updateActive,
          onToggle: updateActive,
          onUpdate: (self) => {
            updateActive();
            if (barRef.current) barRef.current.style.transform = `scaleY(${self.progress})`;
            if (ringRef.current) ringRef.current.style.strokeDashoffset = String(264 * (1 - self.progress));
          },
        });
      }

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        steps.forEach((step) => {
          gsap.fromTo(step.querySelectorAll("[data-step-reveal]"), { y: 40, opacity: 0 }, {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: step, start: "top 80%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const current = processSteps[active];

  return (
    <section id="process" ref={sectionRef} aria-labelledby="process-title" className="relative py-28 md:py-44">
      <div className="container-x">
        <SectionHeading
          index="06"
          eyebrow="Process"
          id="process-title"
          title="A clear path from idea to impact."
          description="Six stages, no black boxes. You always know what is happening, what comes next and why."
          className="mb-16 md:mb-24"
        />

        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {/* Sticky active stage */}
          <div className="hidden md:col-span-5 md:block">
            <div className="sticky top-28 flex flex-col gap-8 rounded-[2rem] border border-line bg-bg-elevated/40 p-8 backdrop-blur-sm lg:p-10">
              <div className="flex items-center justify-between">
                <span className="eyebrow">Current stage</span>
                <svg viewBox="0 0 100 100" className="size-14 -rotate-90" aria-hidden="true">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--line)" strokeWidth="4" />
                  <circle
                    ref={ringRef}
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="264"
                    strokeDashoffset="264"
                  />
                </svg>
              </div>
              <div className="relative h-[clamp(8rem,14vw,13rem)] overflow-hidden" aria-live="polite">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.p
                    key={current.number}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 text-[clamp(8rem,14vw,13rem)] font-medium leading-[0.85] tracking-[-0.06em]"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {current.number}
                    <span className="sr-only">: {current.title}</span>
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-3xl font-medium tracking-[-0.03em]">{current.title}</p>
                <p className="font-mono text-xs text-fg-muted">{current.duration}</p>
              </div>
              <ol className="flex gap-1.5" aria-hidden="true">
                {processSteps.map((s, i) => (
                  <li
                    key={s.number}
                    className={cn("h-1 flex-1 rounded-full transition-colors duration-500", i <= active ? "bg-accent" : "bg-line")}
                  />
                ))}
              </ol>
            </div>
          </div>

          {/* Steps */}
          <div data-steps className="relative md:col-span-6 md:col-start-7">
            <div aria-hidden="true" className="absolute bottom-0 left-[0.6875rem] top-0 w-px bg-line">
              <div ref={barRef} className="h-full w-full origin-top scale-y-0 bg-accent" />
            </div>
            <ol className="relative">
            {processSteps.map((step, i) => (
              <li key={step.number} data-step className="relative flex min-h-[46vh] gap-8 pb-16 md:min-h-[52vh]">
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative z-10 mt-2 grid size-6 shrink-0 place-items-center rounded-full border transition-all duration-500",
                    i <= active ? "border-accent bg-accent" : "border-line-strong bg-bg",
                  )}
                >
                  <span className={cn("size-1.5 rounded-full transition-colors", i <= active ? "bg-accent-ink" : "bg-fg-subtle")} />
                </span>
                <div className={cn("flex flex-col gap-5 transition-opacity duration-500", i === active ? "opacity-100" : "md:opacity-40")}>
                  <p data-step-reveal className="font-mono text-xs text-fg-muted">
                    {step.number} — {step.duration}
                  </p>
                  <h3 data-step-reveal className="text-[clamp(2.25rem,4.5vw,4rem)] font-medium leading-none tracking-[-0.045em]">
                    {step.title}
                  </h3>
                  <p data-step-reveal className="max-w-md text-lg leading-relaxed text-fg-muted">
                    {step.description}
                  </p>
                  <ul data-step-reveal className="flex flex-wrap gap-2">
                    {step.outputs.map((o) => (
                      <li key={o} className="rounded-full border border-line px-3 py-1 text-xs text-fg-muted">
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
