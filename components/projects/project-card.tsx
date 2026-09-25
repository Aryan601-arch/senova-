"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { SmartImage } from "@/components/ui/smart-image";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  index: number;
  total: number;
  className?: string;
  priority?: boolean;
};

/** Large project card with pointer-driven 3D tilt and a light sheen. */
export function ProjectCard({ project, index, total, className, priority }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !cardRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(cardRef.current, { rotateY: px * 7, rotateX: -py * 7, duration: 0.6, ease: "power3.out" });
    if (sheenRef.current) {
      sheenRef.current.style.background = `radial-gradient(40% 50% at ${(px + 0.5) * 100}% ${(py + 0.5) * 100}%, rgba(255,255,255,0.16), transparent 70%)`;
    }
  };
  const onPointerLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 1, ease: "elastic.out(1, 0.5)" });
    if (sheenRef.current) sheenRef.current.style.background = "transparent";
  };

  return (
    <div className={cn("[perspective:1400px]", className)}>
      <article
        ref={cardRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-bg-elevated [transform-style:preserve-3d] will-change-transform"
        aria-labelledby={`project-${project.slug}`}
      >
        <Link
          href={`/work/${project.slug}`}
          data-cursor="hover"
          data-cursor-label="View"
          className="relative block aspect-[16/11] overflow-hidden md:aspect-[16/10]"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div data-project-image className="absolute inset-0 scale-[1.08] transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.14]">
            <SmartImage
              src={project.image}
              alt={project.imageAlt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="object-cover"
              accent={project.color}
              fallbackLabel={project.title}
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-700 group-hover:opacity-100"
            style={{ background: `linear-gradient(135deg, ${project.color}55, transparent 60%)` }}
          />
          <div ref={sheenRef} aria-hidden="true" className="pointer-events-none absolute inset-0 transition-[background] duration-300" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 md:p-6">
            <span className="rounded-full px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md" style={{ background: "rgba(10,10,12,0.4)" }}>
              {project.category}
            </span>
            <span className="rounded-full px-3 py-1.5 font-mono text-xs text-white backdrop-blur-md" style={{ background: "rgba(10,10,12,0.4)" }}>
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </Link>

        <div className="flex flex-1 flex-col gap-6 p-6 md:p-8 [transform:translateZ(30px)]">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-3">
              <h3 id={`project-${project.slug}`} className="text-[clamp(1.75rem,3vw,2.75rem)] font-medium leading-none tracking-[-0.04em]">
                {project.title}
              </h3>
              <p className="max-w-md text-base leading-relaxed text-fg-muted">{project.description}</p>
            </div>
            <span className="font-mono text-sm text-fg-subtle">{project.year}</span>
          </div>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
            <ul className="flex flex-wrap gap-2" aria-label="Technologies">
              {project.technologies.map((t) => (
                <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-fg-muted">
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href={`/work/${project.slug}`}
              data-cursor="hover"
              data-cursor-label="Open"
              className="group/link inline-flex items-center gap-2 text-sm font-medium"
            >
              <span className="relative">
                View Project<span className="sr-only">: {project.title}</span>
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-out-expo group-hover/link:origin-left group-hover/link:scale-x-100" />
              </span>
              <span className="grid size-9 place-items-center rounded-full bg-fg text-bg transition-transform duration-500 ease-out-expo group-hover/link:rotate-45">
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
