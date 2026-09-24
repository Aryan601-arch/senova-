import type { Metadata } from "next";
import { groupLabels, isProductGroup, priceNote } from "@/data/catalog";
import { getProducts } from "@/lib/db";
import { Catalog } from "@/components/products/catalog";
import { SectionHeading } from "@/components/ui/section-heading";

type Props = { searchParams: Promise<{ group?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { group } = await searchParams;
  const label = isProductGroup(group) ? groupLabels[group] : null;
  return {
    title: label ? `${label} — Products` : "Products",
    description: "The full official Webor price list for Nepal — every model and price, VAT inclusive.",
    alternates: { canonical: label ? `/products?group=${group}` : "/products" },
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const { group } = await searchParams;
  const activeGroup = isProductGroup(group) ? group : null;
  const products = getProducts(activeGroup);

  return (
    <section className="relative pb-28 pt-36 md:pb-40 md:pt-44">
      <div className="grid-lines mask-radial pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70vh] opacity-50" aria-hidden="true" />
      <div className="container-x">
        <SectionHeading
          eyebrow="Official price list"
          title="Every model, every price."
          description="Live from our database — this list updates the moment we change a price or add a model."
          className="mb-12 md:mb-16"
        />
        <Catalog products={products} activeGroup={activeGroup} />
        <p className="mt-16 max-w-3xl border-t border-line pt-8 text-sm leading-relaxed text-fg-muted">{priceNote}</p>
      </div>
    </section>
  );
}
