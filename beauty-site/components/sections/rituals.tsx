import Link from "next/link";
import { collections } from "@/data/collections";
import { getProduct } from "@/lib/catalog";
import { ProductImage } from "../product-image";
import { SectionHeading } from "../section-heading";

/** Curated sets, laid out like the reference's "Special Offers" cards. */
export function Rituals() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blush via-cream to-blush-deep/50 py-20 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -top-20 -left-20 size-80 rounded-full bg-white/60 blur-3xl" />
      <div className="container-x relative">
        <SectionHeading title="Curated Rituals" subtitle="Complete Sets, Chosen for You" />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {collections.map((c, i) => {
            const items = c.picks.map(getProduct).filter((p) => p !== undefined);
            return (
              <article
                key={c.title}
                data-reveal
                style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
                className="flex flex-col overflow-hidden rounded-md border border-white bg-white/75 text-center shadow-card backdrop-blur"
              >
                <div className="px-6 pt-8">
                  <p className="font-serif text-xl text-cocoa-muted italic">{c.kicker}</p>
                  <h3 className="text-5xl leading-none text-rose">{c.title}</h3>
                  <p className="mx-auto mt-3 max-w-[16rem] text-sm leading-relaxed text-cocoa-muted">{c.line}</p>
                </div>
                <div className="mt-4 flex items-end justify-center -space-x-6 px-4">
                  {items.map((p, j) => (
                    <ProductImage
                      key={p.slug}
                      product={p}
                      sizes="120px"
                      className={j === 1 ? "z-10 w-[40%]" : "w-[32%] opacity-95"}
                    />
                  ))}
                </div>
                <div className="mt-auto p-6">
                  <Link href={`/shop?category=${c.category}`} className="btn btn-rose w-full">
                    Shop the set
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
