import { Hero } from "@/components/sections/hero";
import { BestSellers } from "@/components/sections/best-sellers";
import { Welcome } from "@/components/sections/welcome";
import { ShowcaseRing } from "@/components/sections/showcase-ring";
import { Essentials } from "@/components/sections/essentials";
import { Rituals } from "@/components/sections/rituals";
import { Journal } from "@/components/sections/journal";
import { products } from "@/data/products";

// One of each kind of packaging, so the 3D ring shows the full range.
const ringProducts = products.filter((p, i, all) => all.findIndex((q) => q.kind === p.kind) === i).slice(0, 12);

export default function HomePage() {
  return (
    <>
      <Hero />
      <BestSellers />
      <Welcome />
      <ShowcaseRing products={ringProducts} />
      <Essentials />
      <Rituals />
      <Journal />
    </>
  );
}
