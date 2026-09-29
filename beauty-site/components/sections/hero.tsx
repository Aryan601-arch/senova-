import Link from "next/link";
import { site } from "@/data/site";
import { byCategory } from "@/lib/catalog";
import { HeroStage } from "../three/hero-stage";
import { ProductImage } from "../product-image";

const tiles = [
  { label: "Face", href: "/shop?category=Face", product: byCategory("Face").find((p) => p.kind === "serum")! },
  { label: "Body", href: "/shop?category=Body", product: byCategory("Body").find((p) => p.kind === "lotion")! },
  { label: "Lips", href: "/shop?category=Lips", product: byCategory("Lips")[0] },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blush via-cream to-blush-deep/60">
      {/* soft glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-40 size-[36rem] rounded-full bg-white/70 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 size-[30rem] rounded-full bg-rose-soft/30 blur-3xl" />

      <div className="container-x relative grid items-center gap-6 pt-10 pb-10 md:pt-16 lg:grid-cols-[1fr_1.1fr] lg:gap-10 lg:pb-16">
        <div className="relative z-10 max-w-xl">
          <p data-reveal className="eyebrow">{site.name} Skincare</p>
          <h1 data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties} className="mt-4 text-display text-cocoa">
            Elevate Your <em className="text-rose not-italic italic">Beauty</em>
          </h1>
          <p data-reveal style={{ "--reveal-delay": "160ms" } as React.CSSProperties} className="mt-4 font-serif text-2xl text-cocoa-muted">
            Luxury Skincare &amp; Body Care
          </p>
          <p data-reveal style={{ "--reveal-delay": "220ms" } as React.CSSProperties} className="mt-5 max-w-md leading-relaxed text-cocoa-muted">
            {site.description}
          </p>
          <div data-reveal style={{ "--reveal-delay": "300ms" } as React.CSSProperties} className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-rose">Shop now</Link>
            <Link href="/#about" className="btn btn-outline">Discover more</Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-[5/4] w-full max-w-2xl">
          {/* The arch backdrop the products stand in front of */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[8%] top-[4%] bottom-[6%] rounded-t-full bg-gradient-to-b from-white/90 via-blush/80 to-blush-deep/70 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
          />
          <HeroStage />
          <p className="pointer-events-none absolute right-[10%] bottom-[2%] text-[0.65rem] tracking-[0.25em] text-cocoa-muted uppercase">
            Move to explore
          </p>
        </div>
      </div>

      {/* Category strip, like the photo row under the reference hero */}
      <div className="container-x relative pb-12">
        <ul className="grid grid-cols-3 gap-3 sm:gap-5">
          {tiles.map((t, i) => (
            <li key={t.label} data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}>
              <Link
                href={t.href}
                className="group relative block overflow-hidden rounded-md border border-white/80 bg-white/60 shadow-card backdrop-blur transition-shadow hover:shadow-lift"
              >
                <ProductImage
                  product={t.product}
                  sizes="33vw"
                  className="aspect-[4/3] transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-sm bg-white/90 px-3 py-1 text-[0.65rem] tracking-[0.2em] text-cocoa uppercase sm:bottom-3 sm:px-4 sm:text-xs">
                  {t.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
