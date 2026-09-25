"use client";

import { useRef } from "react";
import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./project-card";

/**
 * Work: on desktop the section pins and cards travel horizontally as you scroll.
 * On mobile/tablet and with reduced motion it becomes a simple vertical stack.
 */
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const horizontal = useMediaQuery("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const q = gsap.utils.selector(section);

      if (horizontal) {
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
        // Images counter-drift inside their frames for depth.
        q("[data-project-image]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: 6 },
            {
              xPercent: -6,
              ease: "none",
              scrollTrigger: {
                trigger: img,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      } else {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          q("[data-project-card]").forEach((card) => {
            gsap.fromTo(card, { clipPath: "inset(12% 6% 0% 6% round 1.75rem)", y: 60 }, {
              clipPath: "inset(0% 0% 0% 0% round 1.75rem)",
              y: 0,
              duration: 1.2,
              ease: "expo.out",
              scrollTrigger: { trigger: card, start: "top 88%", once: true },
            });
          });
        });
        return () => mm.revert();
      }
    },
    { scope: sectionRef, dependencies: [horizontal], revertOnUpdate: true },
  );

  return (
    <section id="work" ref={sectionRef} aria-labelledby="work-title" className={cn("relative", horizontal ? "h-screen overflow-hidden" : "py-28 md:py-44")}>
      <div
        ref={trackRef}
        className={cn(
          horizontal ? "flex h-full w-max items-center gap-8 pl-[clamp(1rem,4vw,3.5rem)] pr-[8vw]" : "container-x flex flex-col gap-10",
        )}
      >
        <div className={cn("flex shrink-0 flex-col justify-between gap-10", horizontal ? "h-[72vh] w-[34vw] py-4" : "mb-6")}>
          <SectionHeading index="03" eyebrow="Selected work" id="work-title" title="Work that moves people." />
          <div className="flex flex-col gap-6">
            <p className="max-w-sm text-lg leading-relaxed text-fg-muted">
              A few recent collaborations across platforms, products and immersive experiences.
            </p>
            {horizontal && (
              <p className="eyebrow flex items-center gap-3">
                <span className="h-px w-10 bg-line-strong" aria-hidden="true" /> Scroll to travel
              </p>
            )}
          </div>
        </div>

        {projects.map((project, i) => (
          <div
            key={project.slug}
            data-project-card
            className={cn("shrink-0", horizontal ? "h-[72vh] w-[min(62vw,64rem)]" : "w-full")}
          >
            <ProjectCard project={project} index={i} total={projects.length} priority={false} className="h-full" />
          </div>
        ))}

        <div className={cn("flex shrink-0 flex-col items-start justify-center gap-8", horizontal ? "h-[72vh] w-[30vw] pl-8" : "py-10")}>
          <p className="text-[clamp(2rem,3.4vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            Your project <span className="font-serif font-normal italic text-accent-text">could be next.</span>
          </p>
          <ButtonLink href="/#contact" size="lg">
            Start a Project
          </ButtonLink>
        </div>
      </div>

      {horizontal && (
        <div className="container-x pointer-events-none absolute inset-x-0 bottom-8" aria-hidden="true">
          <div className="h-px w-full bg-line">
            <div ref={progressRef} className="h-full origin-left scale-x-0 bg-fg" />
          </div>
        </div>
      )}
    </section>
  );
}
