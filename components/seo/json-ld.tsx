import { siteConfig, contactInfo, socialLinks } from "@/data/site";
import { services } from "@/data/services";
import { faqItems } from "@/data/faq";

/** Structured data for search engines: organisation, website, services and FAQ. */
export function HomeJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.legalName,
        url: siteConfig.url,
        logo: `${siteConfig.url}/icon.svg`,
        email: contactInfo.email,
        telephone: contactInfo.phone,
        foundingDate: String(siteConfig.foundedYear),
        sameAs: socialLinks.map((s) => s.href),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": `${siteConfig.url}/#organization` },
        inLanguage: "en",
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteConfig.url}/#service`,
        name: siteConfig.legalName,
        url: siteConfig.url,
        areaServed: "Worldwide",
        address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, description: s.description },
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD must be injected as raw JSON; content comes from local data files only.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
