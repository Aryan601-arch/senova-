import { NextResponse } from "next/server";
import { validateContact, type ContactPayload } from "@/lib/contact-schema";

/**
 * Receives contact form submissions.
 * Set CONTACT_WEBHOOK_URL to forward submissions (JSON POST) to Formspree, Zapier,
 * a Slack proxy, your CRM, etc. Without it, submissions are validated and logged.
 */
export async function POST(request: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Bots fill hidden fields; pretend success so they move on.
  if (body.website) return NextResponse.json({ ok: true });

  const errors = validateContact(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const submission = {
    name: body.name!.trim(),
    email: body.email!.trim(),
    company: body.company?.trim() ?? "",
    projectType: body.projectType,
    budget: body.budget,
    message: body.message!.trim(),
    receivedAt: new Date().toISOString(),
  };

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      if (!res.ok) throw new Error(`Webhook responded with ${res.status}`);
    } catch (error) {
      console.error("[contact] Failed to forward submission", error);
      return NextResponse.json(
        { ok: false, error: "We couldn't send your message right now. Please try again or email us directly." },
        { status: 502 },
      );
    }
  } else {
    console.info("[contact] New submission (set CONTACT_WEBHOOK_URL to forward it):", submission);
  }

  return NextResponse.json({ ok: true });
}
