import { contactContent } from "@/data/contact";

export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
  /** Honeypot — must stay empty. */
  website?: string;
};

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared validation used by the form (client) and the API route (server). */
export function validateContact(data: Partial<ContactPayload>): ContactErrors {
  const errors: ContactErrors = {};
  const name = data.name?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const message = data.message?.trim() ?? "";

  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > 100) errors.name = "That name is a little long.";
  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if ((data.company?.length ?? 0) > 120) errors.company = "Company name is too long.";
  if (!data.projectType || !contactContent.projectTypes.includes(data.projectType))
    errors.projectType = "Please choose a project type.";
  if (!data.budget || !contactContent.budgets.includes(data.budget)) errors.budget = "Please choose a budget range.";
  if (message.length < 20) errors.message = "Please tell us a bit more (at least 20 characters).";
  else if (message.length > 5000) errors.message = "Please keep your message under 5000 characters.";
  return errors;
}
