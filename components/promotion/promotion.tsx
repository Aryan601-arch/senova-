import Link from "next/link";
import { ArrowUpRight, Snowflake } from "lucide-react";
import type { Product } from "@/lib/db";
import { promotion } from "@/data/promotion";
import { formatPrice } from "@/data/catalog";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

/** This season's promotion, with the live list of models it covers. */
export function Promotion({ products }: { products: Product[] }) {
  return (
    <section id="promotions" aria-labelledby="promotions-title" className="relative py-28 md:py-44">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2.25rem] border border-line bg-bg-elevated/60 p-6 md:p-12 lg:p-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div
              className="absolute -right-[10%] -top-[30%] aspect-square w-[60%] rounded-full opacity-25 blur-[110px]"
              style={{ background: "#43e5c4", animation: "aurora 18s ease-in-out infinite" }}
            />
            <div
              className="absolute -bottom-[40%] -left-[10%] aspect-square w-[50%] rounded-full opacity-20 blur-[110px]"
              style={{ background: "var(--accent-2)", animation: "aurora 22s ease-in-out infinite reverse" }}
            />
          </div>

          <div className="relative grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="flex min-w-0 flex-col gap-10 lg:col-span-6">
              <SectionHeading
                index="04"
                eyebrow={promotion.eyebrow}
                id="promotions-title"
                title={promotion.title}
                description={promotion.text}
              />
              <div className="flex flex-wrap gap-3">
                <ButtonLink href={promotion.primaryCta.href} size="lg">
                  {promotion.primaryCta.label}
                </ButtonLink>
                <ButtonLink href={promotion.secondaryCta.href} size="lg" variant="secondary">
                  {promotion.secondaryCta.label}
                </ButtonLink>
              </div>
            </div>

            <Reveal className="min-w-0 lg:col-span-6">
              <div className="glass rounded-[1.75rem] p-5 md:p-7">
                <p className="eyebrow mb-2 flex items-center gap-2">
                  <Snowflake className="size-3.5" aria-hidden="true" /> {promotion.category} lineup
                </p>
                <p className="mb-5 text-sm text-fg-muted">{promotion.rangeText}</p>
                <ul className="flex flex-col">
                  {products.map((p) => (
                    <li key={p.id} className="border-t border-line first:border-t-0">
                      <Link
                        href={`/product/${p.id}`}
                        data-cursor="hover"
                        className="group flex items-center gap-4 py-4"
                      >
                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                          <span className="font-mono text-sm font-medium">{p.model}</span>
                          <span className="truncate text-xs text-fg-muted">{p.spec}</span>
                        </span>
                        <span className="font-mono text-sm font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                          {formatPrice(p.price)}
                        </span>
                        <ArrowUpRight
                          className="size-4 shrink-0 text-fg-muted transition-transform duration-500 ease-out-expo group-hover:rotate-45 group-hover:text-fg"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
