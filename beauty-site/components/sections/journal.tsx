import { articles } from "@/data/journal";
import { ProductArt } from "../product-art";
import { SectionHeading } from "../section-heading";
import type { ProductKind } from "@/lib/types";

const art: Record<string, { bg: string; kinds: [ProductKind, string][] }> = {
  rose: { bg: "from-blush to-rose-soft/50", kinds: [["cleanser", "Rose"], ["toner", "Rose"], ["serum", "Rose"]] },
  sand: { bg: "from-cream to-gold/40", kinds: [["serum", "Vitamin C"], ["serum", "Honey"], ["serum", "Aloe"]] },
  sage: { bg: "from-cream to-sage/40", kinds: [["lipoil", "Strawberry"], ["balm", "Mint"], ["lipoil", "Rose"]] },
};

export function Journal() {
  return (
    <section id="journal" className="bg-white py-20 md:py-28">
      <div className="container-x">
        <SectionHeading title="Beauty Tips & Trends" subtitle="Get the Latest in Beauty & Wellness" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {articles.map((a, i) => (
            <article
              key={a.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
              className="group overflow-hidden rounded-md border border-line bg-cream shadow-card"
            >
              <div className={`flex aspect-[16/10] items-end justify-center gap-1 bg-gradient-to-br pb-3 ${art[a.tone].bg}`}>
                {art[a.tone].kinds.map(([kind, name], j) => (
                  <ProductArt
                    key={j}
                    kind={kind}
                    name={name}
                    className={`h-[70%] w-auto transition-transform duration-700 group-hover:-translate-y-1 ${j === 1 ? "h-[82%]" : ""}`}
                  />
                ))}
              </div>
              <div className="p-6">
                <p className="eyebrow">{a.tag}</p>
                <h3 className="mt-2 text-2xl">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cocoa-muted">{a.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
