import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { formatPrice, groupLabels } from "@/data/catalog";
import { contactInfo } from "@/data/site";
import { getProduct, getRelatedProducts } from "@/lib/db";
import { ButtonLink } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { ProductMedia } from "@/components/products/product-media";

type Props = { params: Promise<{ id: string }> };

async function load(params: Props["params"]) {
  const { id } = await params;
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? getProduct(n) : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await load(params);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.model} — ${product.category}`,
    description: `${product.category} ${product.model}: ${product.spec}. ${formatPrice(product.price)} incl. VAT. Call ${contactInfo.phone} to order.`,
    alternates: { canonical: `/product/${product.id}` },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await load(params);
  if (!product) notFound();
  const related = getRelatedProducts(product);
  const specs = product.spec.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <section className="relative pb-28 pt-32 md:pb-40 md:pt-40">
      <div className="container-x">
        <nav aria-label="Breadcrumb" className="eyebrow mb-10 flex flex-wrap items-center gap-2">
          <Link href="/products" className="transition-colors hover:text-fg">
            Products
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={`/products?group=${product.category_group}`} className="transition-colors hover:text-fg">
            {groupLabels[product.category_group] ?? product.category_group}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-fg">{product.category}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <ProductMedia
              photo={product.photo}
              category={product.category}
              alt={`${product.category} ${product.model}`}
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="relative aspect-square rounded-[2rem] border border-line lg:sticky lg:top-28"
            />
          </div>

          <div className="flex flex-col gap-8 lg:col-span-6">
            <div className="flex flex-col gap-4">
              <p className="eyebrow">{product.category}</p>
              <h1 className="font-mono text-[clamp(2.25rem,5vw,4.25rem)] font-medium leading-none tracking-[-0.04em]">
                {product.model}
              </h1>
              <p className="text-fg-muted">
                Sold by <span className="text-fg">Webor Appliances</span> · Nepal
              </p>
            </div>

            <ul className="flex flex-col border-t border-line">
              {specs.map((s) => (
                <li key={s} className="flex items-center gap-3 border-b border-line py-3.5 text-base">
                  <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-6 rounded-[1.75rem] border border-line bg-bg-elevated/60 p-6 md:p-8">
              <div>
                <p className="font-mono text-[clamp(2rem,4vw,3rem)] font-medium leading-none tracking-[-0.03em]" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatPrice(product.price)}
                </p>
                <p className="mt-2 text-sm text-fg-muted">Inclusive of VAT</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href={`tel:${contactInfo.phoneHref}`} size="lg">
                  Call to order — {contactInfo.phone}
                </ButtonLink>
                <ButtonLink href={contactInfo.facebook} size="lg" variant="secondary" target="_blank" rel="noopener noreferrer">
                  Message on Facebook
                </ButtonLink>
              </div>
              <ul className="flex flex-col gap-2.5 border-t border-line pt-5 text-sm text-fg-muted">
                {["Genuine Webor stock, not grey-market", "Backed by Webor's standard warranty", "Delivery & installation — ask when you call"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <Check className="size-4 text-accent-text" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24 flex flex-col gap-8 md:mt-32">
            <h2 className="text-headline max-w-[16ch] font-medium">More from {product.category}</h2>
            <ul className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
              {related.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
