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
import { getCatalogStats, getPhotoProducts, getProducts, type Product } from "@/lib/db";
import type { ScenePhoto } from "@/lib/stores";
import type { ProductGroup } from "@/data/catalog";

const toScenePhoto = (p: Product): ScenePhoto => ({
  id: p.id,
  src: `/uploads/${p.photo}`,
  model: p.model,
  category: p.category,
  price: p.price,
});

/** Fisher–Yates shuffle, so every visit shows a different mix of photos. */
function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function HomePage() {
  // Read the live database on every request so admin edits show immediately.
  await connection();
  const catalog = getCatalogStats();
  // Photos are picked at random on every page load (reload = new pictures).
  const withPhotos = shuffle(getPhotoProducts());
  // Featured: one random product from each of eight random categories.
  const featured: Product[] = [];
  for (const p of withPhotos) {
    if (featured.length < 8 && !featured.some((f) => f.category === p.category)) featured.push(p);
  }
  const rangePhotos: Partial<Record<ProductGroup, ScenePhoto[]>> = {};
  for (const p of withPhotos) {
    // One photo per category first, so each range shows a mix of product types.
    const list = (rangePhotos[p.category_group] ??= []);
    if (list.length < 3 && !list.some((x) => x.category === p.category)) list.push(toScenePhoto(p));
  }
  for (const p of withPhotos) {
    const list = (rangePhotos[p.category_group] ??= []);
    if (list.length < 3 && !list.some((x) => x.id === p.id)) list.push(toScenePhoto(p));
  }
  const heroPhotos = featured.map(toScenePhoto);
  const aboutPhotos = withPhotos.filter((p) => !featured.some((f) => f.id === p.id)).slice(0, 4).map(toScenePhoto);

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
      <Hero photos={heroPhotos} />
      <About stats={stats} photos={aboutPhotos} />
      <Services counts={catalog.byGroup} photos={rangePhotos} />
      <FeaturedProducts products={featured} total={catalog.products} />
      <Promotion products={promoProducts} />
      <Process />
      <Faq />
      <Contact />
    </>
  );
}
