"use client";

import dynamic from "next/dynamic";
import { useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { AirVent, ArrowUpRight, CookingPot, Fan, Refrigerator, Tv, WashingMachine, type LucideIcon } from "lucide-react";
import { services, type Service } from "@/data/services";
import { activeServiceStore } from "@/lib/stores";
import { SectionHeading } from "@/components/ui/section-heading";
import { SceneView } from "@/components/three/scene-view";
import { SceneFallback } from "@/components/three/scene-fallback";
import { cn } from "@/lib/utils";
import type { ScenePhoto } from "@/lib/stores";

const ServicesScene = dynamic(() => import("@/components/three/scenes/services-scene"), { ssr: false });

const icons: Record<Service["icon"], LucideIcon> = {
  fridge: Refrigerator,
  ac: AirVent,
  washer: WashingMachine,
  pot: CookingPot,
  tv: Tv,
  fan: Fan,
};

function ServiceRow({ service, index, active, count }: { service: Service; index: number; active: boolean; count?: number }) {
  const panelId = useId();
  const Icon = icons[service.icon];
  const activate = () => activeServiceStore.set(index);

  return (
    <li
      className="group relative border-b border-line"
      onPointerEnter={(e) => e.pointerType === "mouse" && activate()}
    >
      {/* Accent line that grows across the row when active */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-px left-0 h-px origin-left bg-fg transition-transform duration-700 ease-out-expo",
          active ? "w-full scale-x-100" : "w-full scale-x-0",
        )}
      />
      <h3>
        <button
          type="button"
          aria-expanded={active}
          aria-controls={panelId}
          onClick={activate}
          onFocus={activate}
          data-cursor="hover"
          className="flex w-full items-center gap-5 py-7 text-left md:gap-8 md:py-9"
        >
          <span className={cn("font-mono text-xs transition-colors duration-500", active ? "text-accent-text" : "text-fg-subtle")}>
            {service.number}
          </span>
          <span
            className={cn(
              "flex-1 text-[clamp(1.6rem,3.2vw,3rem)] font-medium leading-none tracking-[-0.04em] transition-[color,transform] duration-500 ease-out-expo",
              active ? "translate-x-2 text-fg" : "text-fg/45 group-hover:text-fg/80",
            )}
          >
            {service.title}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-out-expo",
              active ? "rotate-45 border-transparent bg-accent text-accent-ink" : "border-line text-fg-muted",
            )}
          >
            <ArrowUpRight className="size-4" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            id={panelId}
            role="region"
            aria-label={service.title}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-5 pb-9 pl-9 md:flex-row md:items-start md:gap-10 md:pl-[3.25rem]">
              <Icon className="hidden size-6 shrink-0 text-accent-text md:block" aria-hidden="true" />
              <div className="flex max-w-md flex-col gap-4">
                <p className="text-base leading-relaxed text-fg-muted">{service.description}</p>
                <Link
                  href={`/products?group=${service.id}`}
                  data-cursor="hover"
                  className="group/link inline-flex w-fit items-center gap-2 text-sm font-medium"
                >
                  <span className="relative">
                    Browse {service.title}
                    {count ? <span className="text-fg-muted"> — {count} models</span> : null}
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-out-expo group-hover/link:origin-left group-hover/link:scale-x-100" />
                  </span>
                  <ArrowUpRight className="size-4 transition-transform duration-500 ease-out-expo group-hover/link:rotate-45" aria-hidden="true" />
                </Link>
              </div>
              <ul className="flex flex-wrap gap-2 md:ml-auto md:max-w-[14rem] md:justify-end">
                {service.deliverables.map((d) => (
                  <li key={d} className="rounded-full border border-line px-3 py-1 text-xs text-fg-muted">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Services({
  counts = {},
  photos = {},
}: {
  counts?: Partial<Record<Service["id"], number>>;
  photos?: Partial<Record<Service["id"], ScenePhoto[]>>;
}) {
  const active = activeServiceStore.use();
  const current = services[active] ?? services[0];
  const CurrentIcon = icons[current.icon];

  return (
    <section id="ranges" aria-labelledby="services-title" className="relative py-28 md:py-44">
      <div className="container-x">
        <div className="mb-16 grid gap-10 md:mb-24 md:grid-cols-12 md:items-end">
          <SectionHeading
            className="md:col-span-7"
            index="02"
            eyebrow="Shop by range"
            id="services-title"
            title="Find what you need."
          />
          <p className="max-w-md text-lg leading-relaxed text-fg-muted md:col-span-4 md:col-start-9">
            Six ranges, from TVs to dishwashers. Pick one to see what it covers and browse every model and price.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Visual panel */}
          <div className="lg:order-2 lg:col-span-5">
            <div className="relative overflow-hidden rounded-[2rem] border border-line lg:sticky lg:top-28">
              <SceneView
                interactive
                className="relative aspect-[4/3] w-full lg:aspect-[4/5]"
                camera={{ position: [0, 0, 6], fov: 35 }}
                fallback={<SceneFallback accent={current.color} />}
                label={`${current.title} products from Webor in a 3D display`}
              >
                <ServicesScene photos={photos} />
              </SceneView>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-30 transition-[background] duration-700"
                style={{ background: `radial-gradient(60% 50% at 50% 55%, ${current.color}33, transparent 70%)` }}
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-6">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={current.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-3"
                  >
                    <span className="grid size-10 place-items-center rounded-full glass">
                      <CurrentIcon className="size-4" style={{ color: current.color }} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium">{current.title}</span>
                  </motion.span>
                </AnimatePresence>
                <span className="font-mono text-sm text-fg-muted" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {current.number} / {String(services.length).padStart(2, "0")}
                </span>
              </div>
              <div className="pointer-events-none absolute inset-x-6 bottom-6 flex gap-1.5" aria-hidden="true">
                {services.map((s, i) => (
                  <span key={s.id} className="h-0.5 flex-1 overflow-hidden rounded-full bg-line">
                    <span
                      className="block h-full rounded-full transition-transform duration-700 ease-out-expo origin-left"
                      style={{ background: s.color, transform: `scaleX(${i === active ? 1 : 0})` }}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <ul className="border-t border-line lg:order-1 lg:col-span-7">
            {services.map((service, i) => (
              <ServiceRow key={service.id} service={service} index={i} active={i === active} count={counts[service.id]} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
