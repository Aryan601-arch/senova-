import { Hero } from "@/components/hero/hero";
import { About } from "@/components/about/about";
import { Services } from "@/components/services/services";
import { Projects } from "@/components/projects/projects";
import { Technology } from "@/components/technology/technology";
import { Showcase } from "@/components/showcase/showcase";
import { Process } from "@/components/process/process";
import { Testimonials } from "@/components/testimonials/testimonials";
import { Pricing } from "@/components/pricing/pricing";
import { Faq } from "@/components/faq/faq";
import { Contact } from "@/components/contact/contact";
import { HashScroll } from "@/components/providers/hash-scroll";
import { HomeJsonLd } from "@/components/seo/json-ld";

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <HashScroll />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Technology />
      <Showcase />
      <Process />
      <Testimonials />
      <Pricing />
      <Faq />
      <Contact />
    </>
  );
}
