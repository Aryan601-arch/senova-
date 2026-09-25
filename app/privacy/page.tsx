import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { privacyPolicy } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Senova Studio collects, uses and protects your personal data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage doc={privacyPolicy} />;
}
