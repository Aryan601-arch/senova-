"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { contactContent } from "@/data/contact";
import { contactInfo } from "@/data/site";
import { validateContact, type ContactErrors, type ContactPayload } from "@/lib/contact-schema";
import { Button } from "@/components/ui/button";
import { TextAreaField, TextField } from "./field";

const empty: ContactPayload = { name: "", phone: "", message: "" };

/** Opens the visitor's own email app with the enquiry ready to send — nothing is stored. */
export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactPayload, boolean>>>({});

  const set = <K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched[key] || errors[key]) setErrors((e) => ({ ...e, [key]: validateContact(next)[key] }));
  };
  const blur = (key: keyof ContactPayload) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((e) => ({ ...e, [key]: validateContact(values)[key] }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    setTouched({ name: true, phone: true, message: true });
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    const subject = `Enquiry from ${values.name.trim()}`;
    const body = `Name: ${values.name.trim()}\nPhone: ${values.phone.trim()}\n\n${values.message.trim()}`;
    window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Send us a note" className="flex flex-col gap-4">
      <div className="mb-4 flex flex-col gap-2">
        <h3 className="text-2xl font-medium tracking-[-0.03em]">{contactContent.formTitle}</h3>
        <p className="text-sm text-fg-muted">{contactContent.formText}</p>
      </div>
      <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
        <TextField
          id="name"
          label="Your name"
          autoComplete="name"
          required
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          onBlur={() => blur("name")}
          error={touched.name ? errors.name : undefined}
        />
        <TextField
          id="phone"
          label="Phone number"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          required
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
          onBlur={() => blur("phone")}
          error={touched.phone ? errors.phone : undefined}
        />
      </div>
      <TextAreaField
        id="message"
        label="What do you need?"
        rows={4}
        required
        value={values.message}
        onChange={(e) => set("message", e.target.value)}
        onBlur={() => blur("message")}
        error={touched.message ? errors.message : undefined}
      />
      <div className="mt-2 flex flex-col items-start gap-5">
        <Button type="submit" size="lg" icon={<ArrowRight className="size-4" />}>
          Prepare email
        </Button>
        <p className="max-w-md text-sm text-fg-muted">{contactContent.formNote}</p>
      </div>
    </form>
  );
}
