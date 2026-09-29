import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import { SectionHeading } from "@/components/section-heading";
import { categories } from "@/lib/catalog";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop",
  description: "Face, body and lip care from Senova.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category } = await searchParams;
  const initial = categories.find((c) => c === category) as Category | undefined;
  return (
    <div className="bg-gradient-to-b from-blush/70 via-cream to-cream pt-14 pb-24">
      <div className="container-x">
        <SectionHeading title="Shop Senova" subtitle="Face, Body & Lip Care" />
        <div className="mt-12">
          <Catalog key={initial ?? "All"} initialCategory={initial} />
        </div>
      </div>
    </div>
  );
}
