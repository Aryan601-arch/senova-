import { siteConfig, contactInfo, socialLinks } from "@/data/site";
import { faqItems } from "@/data/faq";

/** Structured data for search engines: the store, the website and the FAQ. */
export function HomeJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ElectronicsStore",
        "@id": `${siteConfig.url}/#store`,
        name: siteConfig.legalName,
        url: siteConfig.url,
        logo: `${siteConfig.url}/icon.svg`,
        telephone: "+977-980-1111669",
        email: contactInfo.email,
        sameAs: socialLinks.map((s) => s.href),
        areaServed: "Nepal",
        description:
          "Authorized dealer of genuine Webor home appliances in Nepal — televisions, refrigerators, washing machines, air conditioners and more.",
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.legalName,
        description: siteConfig.description,
        publisher: { "@id": `${siteConfig.url}/#store` },
        inLanguage: "en",
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
