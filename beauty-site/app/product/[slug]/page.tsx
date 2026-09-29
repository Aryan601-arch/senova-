import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { products } from "@/data/products";
import { site } from "@/data/site";
import { formatPrice, getProduct, related } from "@/lib/catalog";
import { AddToBag } from "@/components/add-to-bag";
import { ProductCard } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { SectionHeading } from "@/components/section-heading";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const more = related(product);

  return (
    <>
      <section className="bg-gradient-to-b from-blush/70 to-cream pt-8 pb-20">
        <div className="container-x">
          <Link href={`/shop?category=${product.category}`} className="inline-flex items-center gap-1 text-sm text-cocoa-muted hover:text-rose-deep">
            <ChevronLeft className="size-4" aria-hidden="true" /> {product.category}
          </Link>
          <div className="mt-6 grid items-center gap-10 md:grid-cols-2 lg:gap-16">
            <div data-reveal className="rounded-md border border-white bg-gradient-to-b from-white to-blush p-6 shadow-lift">
              <ProductImage product={product} priority sizes="(max-width: 768px) 90vw, 45vw" />
            </div>
            <div>
              <p data-reveal className="eyebrow">{site.name} · {product.category}</p>
              <h1 data-reveal className="mt-3 text-heading">{product.name}</h1>
              {product.price !== undefined && (
                <p data-reveal className="mt-3 text-xl text-rose-deep">{formatPrice(product.price)}</p>
              )}
              <p data-reveal className="mt-5 max-w-md leading-relaxed text-cocoa-muted">{product.description}</p>
              <div data-reveal className="mt-8 max-w-sm">
                <AddToBag slug={product.slug} name={product.name} />
              </div>
              <ul data-reveal className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6 text-center text-xs text-cocoa-muted">
                <li><Leaf className="mx-auto mb-2 size-5 text-rose" aria-hidden="true" />Natural extracts</li>
                <li><Sparkles className="mx-auto mb-2 size-5 text-rose" aria-hidden="true" />Visible glow</li>
                <li><ShieldCheck className="mx-auto mb-2 size-5 text-rose" aria-hidden="true" />Gentle on skin</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {more.length > 0 && (
        <section className="bg-white py-20">
          <div className="container-x">
            <SectionHeading title="You May Also Love" />
            <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {more.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
