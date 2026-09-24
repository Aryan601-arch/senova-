"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { testimonials, testimonialsAreDemo } from "@/data/testimonials";
import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/section-heading";
import { SmartImage } from "@/components/ui/smart-image";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 7000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const total = testimonials.length;
  const current = testimonials[index];

  const go = useCallback(
    (delta: number) => {
      setDirection(delta);
      setIndex((i) => (i + delta + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (paused || reduced) return;
    const id = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, reduced, go]);

  const companies = Array.from(new Set([...testimonials.map((t) => t.company), ...projects.map((p) => p.client.replace(" (demo)", ""))]));

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="relative overflow-hidden py-28 md:py-44">
      <div className="container-x">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8 md:mb-20">
          <SectionHeading index="07" eyebrow="Testimonials" id="testimonials-title" title="Kind words from ambitious teams." />
          {testimonialsAreDemo && (
            <p className="rounded-full border border-dashed border-line-strong px-4 py-2 font-mono text-[0.7rem] uppercase tracking-wider text-fg-muted">
              Demo content — fictional clients
            </p>
          )}
        </div>

        <div
          className="relative grid gap-10 rounded-[2rem] border border-line bg-bg-elevated/40 p-6 backdrop-blur-sm md:grid-cols-12 md:p-12 lg:p-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
        >
          <Quote className="size-10 text-accent-text md:col-span-1" aria-hidden="true" />

          <div className="relative min-h-[20rem] md:col-span-11 md:min-h-[17rem]" aria-live={paused ? "polite" : "off"}>
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.figure
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-10"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${total}`}
              >
                <blockquote className="max-w-4xl text-[clamp(1.4rem,2.6vw,2.4rem)] font-medium leading-[1.2] tracking-[-0.03em] text-balance">
                  “{current.quote}”
                </blockquote>
                <figcaption className="flex items-center gap-4">
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-full border border-line">
                    <SmartImage src={current.image} alt="" fill sizes="56px" className="object-cover" fallbackLabel="" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium">{current.name}</span>
                    <span className="text-sm text-fg-muted">
                      {current.role}, {current.company}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between gap-6 md:col-span-11 md:col-start-2">
            <div className="flex flex-1 gap-2" aria-hidden="true">
              {testimonials.map((t, i) => (
                <span key={t.name} className="h-0.5 max-w-24 flex-1 overflow-hidden rounded-full bg-line">
                  <span
                    key={`${index}-${paused}`}
                    className={cn("block h-full origin-left rounded-full bg-fg", i < index ? "scale-x-100" : "scale-x-0")}
                    style={
                      i === index && !paused && !reduced
                        ? { animation: `grow ${AUTOPLAY_MS}ms linear forwards` }
                        : i === index
                          ? { transform: "scaleX(1)" }
                          : undefined
                    }
                  />
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                data-cursor="hover"
                className="grid size-12 place-items-center rounded-full border border-line transition-all hover:border-fg hover:bg-fg hover:text-bg active:scale-95"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                data-cursor="hover"
                className="grid size-12 place-items-center rounded-full border border-line transition-all hover:border-fg hover:bg-fg hover:text-bg active:scale-95"
              >
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slow marquee of client names */}
      <div className="mask-fade-x group mt-20 flex overflow-hidden md:mt-28" aria-label="Clients" role="group">
        <ul
          className="animate-marquee flex shrink-0 items-center gap-16 pr-16 group-hover:[animation-play-state:paused]"
          style={{ ["--marquee-duration" as string]: "45s" }}
        >
          {[...companies, ...companies].map((c, i) => (
            <li
              key={`${c}-${i}`}
              aria-hidden={i >= companies.length}
              className="whitespace-nowrap text-[clamp(1.75rem,3.5vw,3rem)] font-medium tracking-[-0.04em] text-fg/25 transition-colors hover:text-fg"
            >
              {c}
              <span className="ml-16 text-accent-text" aria-hidden="true">
                ✦
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
