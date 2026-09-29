import Link from "next/link";
import { bestSellers } from "@/lib/catalog";
import { ProductCard } from "../product-card";
import { SectionHeading } from "../section-heading";

export function BestSellers() {
  const items = bestSellers();
  return (
    <section id="best-sellers" className="bg-gradient-to-b from-cream to-white py-20 md:py-28">
      <div className="container-x">
        <SectionHeading title="Best Sellers" subtitle="Our Most Popular Products" />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/shop" className="btn btn-outline">View all products</Link>
        </div>
      </div>
    </section>
  );
}
