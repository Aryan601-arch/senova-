import Link from "next/link";
import { FlaskConical, Leaf, Sparkles } from "lucide-react";
import { site } from "@/data/site";
import { getProduct } from "@/lib/catalog";
import { LotusMark } from "../logo";
import { ProductImage } from "../product-image";

const values = [
  { icon: Leaf, title: "Natural ingredients", text: "Rose, aloe, green tea, papaya and more." },
  { icon: FlaskConical, title: "Research-led", text: "Proven actives like vitamin C and retinol." },
  { icon: Sparkles, title: "Everyday glow", text: "Gentle formulas for every skin type." },
];

const collage = ["vitamin-c-toner", "vitamin-c-brightening-face-cream", "collagen-anti-aging-face-serum"]
  .map((s) => getProduct(s))
  .filter((p) => p !== undefined);

export function Welcome() {
  return (
    <section id="about" className="relative overflow-hidden bg-blush/60 py-20 md:py-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <div>
          <div data-reveal className="text-rose">
            <LotusMark className="h-10 w-14" />
          </div>
          <h2 data-reveal className="mt-4 text-heading">Welcome to {site.name}</h2>
          <p data-reveal className="mt-3 font-serif text-xl text-cocoa-muted italic">— Enhancing Your Natural Beauty</p>
          <p data-reveal className="mt-6 max-w-lg leading-relaxed text-cocoa-muted">
            {site.description} From gentle amino-acid cleansers to silky body lotions and nourishing lip oils, every
            {" "}{site.name} product is made to be a small, joyful ritual in your day.
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {values.map(({ icon: Icon, title, text }, i) => (
              <li key={title} data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}>
                <span className="grid size-11 place-items-center rounded-full bg-white text-rose shadow-card">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-3 font-medium">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-cocoa-muted">{text}</p>
              </li>
            ))}
          </ul>
          <Link data-reveal href="/shop" className="btn btn-rose mt-10">Learn more</Link>
        </div>

        <div className="relative mx-auto grid w-full max-w-lg grid-cols-2 gap-4" style={{ perspective: "1200px" }}>
          {collage.map((p, i) => (
            <div
              key={p.slug}
              data-reveal
              style={{ "--reveal-delay": `${i * 120}ms`, "--r": `${[-3, 2, 0][i]}deg`, animation: `float-soft ${6 + i}s ease-in-out infinite` } as React.CSSProperties}
              className={
                i === 0
                  ? "row-span-2 self-center rounded-md border border-white bg-gradient-to-b from-white to-blush p-3 shadow-lift"
                  : "rounded-md border border-white bg-gradient-to-b from-white to-blush p-3 shadow-lift"
              }
            >
              <ProductImage product={p} sizes="(max-width: 1024px) 45vw, 22vw" className={i === 0 ? "aspect-[3/4]" : ""} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
