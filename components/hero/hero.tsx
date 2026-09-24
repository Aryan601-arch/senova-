"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import type { ScenePhoto } from "@/lib/stores";
import { heroContent } from "@/data/site";
import { ButtonLink } from "@/components/ui/button";
import { SceneView } from "@/components/three/scene-view";
import { SceneFallback } from "@/components/three/scene-fallback";
import { gsap, useGSAP } from "@/lib/gsap";
import { loaderStore } from "@/lib/stores";
import { HeroHeadline } from "./hero-headline";
import { ScrollIndicator } from "./scroll-indicator";

const HeroScene = dynamic(() => import("@/components/three/scenes/hero-scene"), { ssr: false });

export function Hero({ photos = [] }: { photos?: ScenePhoto[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const loaded = loaderStore.use();

  // Entrance: characters rise from a mask once the loader has finished.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(sectionRef);
        const chars = q("[data-char]");
        const fades = q("[data-hero-fade]");
        if (!loaded) {
          gsap.set(chars, { yPercent: 115, y: 0, rotate: 6 });
          gsap.set(fades, { autoAlpha: 0, y: 24 });
          return;
        }
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo(chars, { yPercent: 115, y: 0, rotate: 6 }, { yPercent: 0, y: 0, rotate: 0, duration: 1.3, stagger: 0.035 }).fromTo(
          fades,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 },
          0.45,
        );
      });
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [loaded] },
  );

  // Scroll: content drifts up and fades while the 3D scene lifts away.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(contentRef.current, {
          yPercent: -18,
          opacity: 0.1,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Animated gradient lighting, painted beneath the WebGL canvas */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -right-[10%] top-[5%] aspect-square w-[60vw] rounded-full opacity-[0.16] blur-[120px]"
          style={{ background: "var(--accent)", animation: "aurora 16s ease-in-out infinite" }}
        />
        <div
          className="absolute -left-[15%] bottom-[-10%] aspect-square w-[50vw] rounded-full opacity-[0.14] blur-[120px]"
          style={{ background: "var(--accent-2)", animation: "aurora 20s ease-in-out infinite reverse" }}
        />
      </div>

      <SceneView
        interactive
        className="absolute inset-0"
        camera={{ position: [0, 0, 7], fov: 35 }}
        fallback={<SceneFallback variant="grid" />}
        label="Webor product photos orbiting a liquid chrome sphere wrapped in a glass ring"
      >
        <HeroScene sectionRef={sectionRef} photos={photos} />
      </SceneView>

      <div
        ref={contentRef}
        className="container-x pointer-events-none relative flex flex-1 flex-col justify-end pb-10 pt-32 md:pb-12"
      >
        <p data-hero-fade className="eyebrow mb-6 flex items-center gap-3 md:mb-8">
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inset-0 rounded-full bg-accent" style={{ animation: "pulse-ring 2s ease-out infinite" }} />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          {heroContent.eyebrow}
        </p>

        <HeroHeadline lines={heroContent.headline} className="max-w-[12ch] select-none md:max-w-none" />

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end">
          <div className="flex flex-col gap-8 md:col-span-6 lg:col-span-5">
            <p data-hero-fade className="max-w-md text-lg leading-relaxed text-fg-muted md:text-xl">
              {heroContent.supporting}
            </p>
            <div data-hero-fade className="pointer-events-auto flex flex-wrap items-center gap-3">
              <ButtonLink
                href={heroContent.primaryCta.href}
                size="lg"
                cursorLabel="Shop"
              >
                {heroContent.primaryCta.label}
              </ButtonLink>
              <ButtonLink
                href={heroContent.secondaryCta.href}
                size="lg"
                variant="secondary"
              >
                {heroContent.secondaryCta.label}
              </ButtonLink>
            </div>
          </div>

          <div data-hero-fade className="flex items-end justify-between gap-6 md:col-span-6 lg:col-span-7">
            <ScrollIndicator targetId="about" />
            <dl className="hidden gap-10 text-right sm:flex">
              {heroContent.meta.map((m) => (
                <div key={m.label}>
                  <dt className="eyebrow mb-1.5">{m.label}</dt>
                  <dd className="text-sm">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
