"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Check, Loader2 } from "lucide-react";
import { contactContent } from "@/data/contact";
import { contactInfo } from "@/data/site";
import { validateContact, type ContactErrors, type ContactPayload } from "@/lib/contact-schema";
import { Button } from "@/components/ui/button";
import { PillGroup, TextAreaField, TextField } from "./field";

const empty: ContactPayload = { name: "", email: "", company: "", projectType: "", budget: "", message: "", website: "" };

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactPayload, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const set = <K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    // Re-validate a field live once the user has interacted with it.
    if (touched[key] || errors[key]) setErrors((e) => ({ ...e, [key]: validateContact(next)[key] }));
  };
  const blur = (key: keyof ContactPayload) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((e) => ({ ...e, [key]: validateContact(values)[key] }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    setTouched({ name: true, email: true, company: true, projectType: true, budget: true, message: true });
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      const el = document.getElementById(first) ?? document.querySelector<HTMLInputElement>(`input[name="${first}"]`);
      el?.focus();
      return;
    }
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: ContactErrors };
      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
      setValues(empty);
      setTouched({});
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[32rem] flex-col items-start justify-center gap-6"
            role="status"
          >
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
              className="grid size-16 place-items-center rounded-full bg-accent text-accent-ink"
            >
              <Check className="size-7" aria-hidden="true" />
            </motion.span>
            <h3 className="text-4xl font-medium tracking-[-0.04em]">{contactContent.successTitle}</h3>
            <p className="max-w-sm text-lg text-fg-muted">{contactContent.successText}</p>
            <Button variant="secondary" onClick={() => setStatus("idle")} icon={false}>
              Send another message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={onSubmit}
            noValidate
            aria-label="Project enquiry"
            className="grid gap-x-8 gap-y-4 md:grid-cols-2"
          >
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
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              onBlur={() => blur("email")}
              error={touched.email ? errors.email : undefined}
            />
            <TextField
              id="company"
              label="Company"
              optional
              autoComplete="organization"
              value={values.company}
              onChange={(e) => set("company", e.target.value)}
              onBlur={() => blur("company")}
              error={errors.company}
              className="md:col-span-2"
            />
            <div className="md:col-span-2">
              <PillGroup
                name="projectType"
                legend="Project type"
                options={contactContent.projectTypes}
                value={values.projectType}
                onChange={(v) => set("projectType", v)}
                error={touched.projectType ? errors.projectType : undefined}
              />
            </div>
            <div className="md:col-span-2">
              <PillGroup
                name="budget"
                legend="Budget"
                options={contactContent.budgets}
                value={values.budget}
                onChange={(v) => set("budget", v)}
                error={touched.budget ? errors.budget : undefined}
              />
            </div>
            <TextAreaField
              id="message"
              label="Tell us about your project"
              required
              rows={4}
              value={values.message}
              onChange={(e) => set("message", e.target.value)}
              onBlur={() => blur("message")}
              error={touched.message ? errors.message : undefined}
              className="md:col-span-2"
            />
            {/* Honeypot for bots — hidden from people and assistive tech */}
            <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
            </div>

            <div className="mt-4 flex flex-col gap-5 md:col-span-2 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-fg-subtle">{contactInfo.responseTime}</p>
              <Button
                type="submit"
                size="lg"
                disabled={status === "submitting"}
                aria-busy={status === "submitting"}
                icon={
                  status === "submitting" ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="size-4 transition-transform duration-500 group-hover/btn:translate-x-0.5" aria-hidden="true" />
                  )
                }
              >
                {status === "submitting" ? "Sending…" : "Send message"}
              </Button>
            </div>

            <AnimatePresence>
              {status === "error" && serverError && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="alert"
                  className="flex items-start gap-2 rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger md:col-span-2"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {serverError}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
