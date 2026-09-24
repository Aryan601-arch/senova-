import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { termsOfService } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern the use of the Senova Studio website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalPage doc={termsOfService} />;
}
