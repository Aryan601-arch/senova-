"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { Check } from "lucide-react";
import { aboutContent, stats } from "@/data/about";
import { SplitText } from "@/components/ui/split-text";
import { Reveal } from "@/components/ui/reveal";
import { SceneView } from "@/components/three/scene-view";
import { SceneFallback } from "@/components/three/scene-fallback";
import { Stats } from "./stats";

const AboutScene = dynamic(() => import("@/components/three/scenes/about-scene"), { ssr: false });

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="about" ref={sectionRef} aria-labelledby="about-title" className="relative py-28 md:py-44">
      <div className="container-x">
        <p className="eyebrow mb-10 flex items-center gap-3">
          <span className="text-accent-text">01</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
          <span>{aboutContent.eyebrow}</span>
        </p>

        <SplitText
          as="h2"
          id="about-title"
          mode="scrub"
          text={aboutContent.statement}
          className="max-w-[22ch] text-[clamp(2rem,4.6vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.04em] text-balance"
        />

        <div className="mt-20 grid gap-12 md:mt-28 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-6 lg:col-span-5">
            <figure className="relative overflow-hidden rounded-[2rem] border border-line bg-bg-elevated/40">
              <SceneView
                className="relative aspect-[4/5] w-full"
                camera={{ position: [0, 0, 7.2], fov: 35 }}
                fallback={<SceneFallback variant="rings" />}
                label="A 3D gyroscope of three nested rings rotating around a glowing core"
              >
                <AboutScene sectionRef={sectionRef} />
              </SceneView>
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                <span className="eyebrow max-w-[26ch] leading-relaxed">
                  Fig. 01 — Strategy, design and engineering in one motion.
                </span>
                <span className="font-mono text-xs text-fg-subtle">3D / Live</span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="flex flex-col justify-between gap-12 md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
            <div className="flex flex-col gap-6">
              {aboutContent.intro.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <p className="max-w-xl text-lg leading-relaxed text-fg-muted md:text-xl">{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <ul className="flex flex-wrap gap-2.5">
                {aboutContent.principles.map((p) => (
                  <li
                    key={p}
                    className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fg transition-colors hover:border-line-strong"
                  >
                    <Check className="size-3.5 text-accent-text" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <Stats items={stats} />
      </div>
    </section>
  );
}
