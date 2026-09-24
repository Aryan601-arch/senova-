/**
 * Legal copy. This is a sensible starting point, not legal advice —
 * have it reviewed for your jurisdiction before launch.
 */
export type LegalDoc = { title: string; updated: string; intro: string; sections: { heading: string; body: string }[] };

export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  updated: "September 2026",
  intro:
    "We respect your privacy. This policy explains what personal data Senova Studio collects through this website, why we collect it and how you can control it.",
  sections: [
    {
      heading: "What we collect",
      body: "When you use the contact form or subscribe to our newsletter we collect the details you provide: your name, email address, company, project information and message. We also collect anonymous, aggregated analytics about how the site is used.",
    },
    {
      heading: "How we use it",
      body: "We use your details only to reply to your enquiry, prepare proposals and — if you subscribed — send our newsletter. We never sell your data or share it with third parties for their own marketing.",
    },
    {
      heading: "Storage and retention",
      body: "Enquiries are stored securely with our email and CRM providers for up to 24 months, or longer if we start working together. Newsletter subscriptions are kept until you unsubscribe.",
    },
    {
      heading: "Cookies",
      body: "This site stores your colour theme preference in your browser. It does not use advertising or cross-site tracking cookies.",
    },
    {
      heading: "Your rights",
      body: "You can ask us to access, correct, export or delete your personal data at any time. Email hello@senova.studio and we will respond within 30 days.",
    },
  ],
};

export const termsOfService: LegalDoc = {
  title: "Terms of Use",
  updated: "September 2026",
  intro: "These terms govern your use of the Senova Studio website. By using the site you agree to them.",
  sections: [
    {
      heading: "Use of this website",
      body: "You may browse, share and link to this website for personal and business purposes. You may not attempt to disrupt the site, access it by automated means that degrade its performance, or use it for unlawful purposes.",
    },
    {
      heading: "Intellectual property",
      body: "Unless stated otherwise, the design, code, text and visuals on this site belong to Senova Studio. Client work is shown with permission and remains the property of the respective owners. Some content on this site is demonstration material and is labelled as such.",
    },
    {
      heading: "No professional advice",
      body: "Content on this site is provided for general information. Project scopes, prices and timelines are indicative and are only binding once agreed in a signed proposal.",
    },
    {
      heading: "Liability",
      body: "We work hard to keep the site accurate and available but provide it “as is”. To the extent permitted by law, we are not liable for losses arising from its use.",
    },
    {
      heading: "Changes",
      body: "We may update these terms from time to time. The date above shows when they were last changed.",
    },
  ],
};
