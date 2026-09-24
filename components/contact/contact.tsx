"use client";

import dynamic from "next/dynamic";
import { Globe, Mail, Phone } from "lucide-react";
import { contactContent } from "@/data/contact";
import { contactInfo, socialLinks } from "@/data/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { SocialIcon } from "@/components/ui/social-icon";
import { SceneView } from "@/components/three/scene-view";
import { SceneFallback } from "@/components/three/scene-fallback";
import { ContactForm } from "./contact-form";

function FacebookGlyph({ className }: { className?: string }) {
  return <SocialIcon platform="facebook" className={className} />;
}

const ContactScene = dynamic(() => import("@/components/three/scenes/contact-scene"), { ssr: false });

export function Contact() {
  const details = [
    { icon: Phone, label: "Phone", value: contactInfo.phone, href: `tel:${contactInfo.phoneHref}` },
    { icon: Mail, label: "Email", value: contactInfo.email, href: `mailto:${contactInfo.email}` },
    { icon: FacebookGlyph, label: "Facebook", value: "29K followers · Message us", href: contactInfo.facebook },
    { icon: Globe, label: "Global brand", value: "weborelectronics.com", href: contactInfo.globalSite },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden py-28 md:py-44">
      {/* Interactive 3D background */}
      <SceneView
        className="absolute inset-0"
        camera={{ position: [0, 0, 7], fov: 40 }}
        fallback={<SceneFallback variant="grid" />}
      >
        <ContactScene />
      </SceneView>

      <div className="container-x relative">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-12 lg:col-span-5">
            <SectionHeading
              index="07"
              eyebrow={contactContent.eyebrow}
              id="contact-title"
              title={contactContent.title}
              description={contactContent.text}
            />
            <ul className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
              {details.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="bg-bg/80 p-5 backdrop-blur-md">
                  <p className="eyebrow mb-2 flex items-center gap-2">
                    <Icon className="size-3.5" aria-hidden="true" /> {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      data-cursor="hover"
                      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="break-words text-sm font-medium transition-colors hover:text-accent-text">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium">{value}</p>
                  )}
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-2" aria-label="Social media">
              {socialLinks.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} (opens in a new tab)`}
                    data-cursor="hover"
                    className="glass grid size-12 place-items-center rounded-full text-fg-muted transition-all duration-300 hover:-translate-y-1 hover:text-fg"
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-[2rem] p-6 md:p-10 lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
