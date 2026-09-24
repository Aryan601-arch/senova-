import { connection } from "next/server";
import { Hero } from "@/components/hero/hero";
import { About } from "@/components/about/about";
import { Services } from "@/components/services/services";
import { FeaturedProducts } from "@/components/products/featured-products";
import { Promotion } from "@/components/promotion/promotion";
import { Process } from "@/components/process/process";
import { Faq } from "@/components/faq/faq";
import { Contact } from "@/components/contact/contact";
import { HashScroll } from "@/components/providers/hash-scroll";
import { HomeJsonLd } from "@/components/seo/json-ld";
import { promotion } from "@/data/promotion";
import type { Stat } from "@/data/about";
import { getCatalogStats, getFeaturedProducts, getProducts } from "@/lib/db";

export default async function HomePage() {
  // Read the live database on every request so admin edits show immediately.
  await connection();
  const catalog = getCatalogStats();
  const featured = getFeaturedProducts(8);
  const promoProducts = getProducts("cooling").filter((p) => p.category === promotion.category);

  const stats: Stat[] = [
    { value: catalog.products, label: "Models", detail: "On the official price list" },
    { value: catalog.categories, label: "Categories", detail: "From TVs to dishwashers" },
    { value: 29, suffix: "K+", label: "Followers", detail: "People who follow us on Facebook" },
    { value: 1, label: "Number to call", detail: "980-1111669, for sales and support" },
  ];

  return (
    <>
      <HomeJsonLd />
      <HashScroll />
      <Hero />
      <About stats={stats} />
      <Services counts={catalog.byGroup} />
      <FeaturedProducts products={featured} total={catalog.products} />
      <Promotion products={promoProducts} />
      <Process />
      <Faq />
      <Contact />
    </>
  );
}
