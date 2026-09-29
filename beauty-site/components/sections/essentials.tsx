import Link from "next/link";
import { getProduct } from "@/lib/catalog";
import { ProductImage } from "../product-image";
import { SectionHeading } from "../section-heading";

const picks = [
  { slug: "hyaluronic-acid-serum", button: "btn-outline" },
  { slug: "rose-hydrating-daily-moisturizer", button: "btn-dark" },
  { slug: "green-tea-soothing-amino-acid-gentle-cleanser", button: "btn-rose" },
];

export function Essentials() {
  return (
    <section className="relative bg-gradient-to-b from-cream via-blush/50 to-cream py-20 md:py-28">
      <div className="container-x">
        <SectionHeading title="Skincare Essentials" subtitle="Nourish & Revitalize Your Skin" />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
          {picks.map(({ slug, button }, i) => {
            const p = getProduct(slug);
            if (!p) return null;
            return (
              <article
                key={slug}
                data-reveal
                style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
                className="group rounded-md border border-line bg-white p-4 text-center shadow-card transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <div className="overflow-hidden rounded bg-gradient-to-b from-blush/80 to-white">
                  <ProductImage product={p} sizes="(max-width: 640px) 90vw, 30vw" className="transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="mt-4 font-sans text-base font-medium">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cocoa-muted">{p.description}</p>
                <Link href={`/product/${p.slug}`} className={`btn ${button} mt-5`}>
                  Shop now
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
