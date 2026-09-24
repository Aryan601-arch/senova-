import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Newsletter sign-up. Connect this to your email provider (Resend, Mailchimp, ConvertKit…). */
export async function POST(request: Request) {
  let email = "";
  try {
    ({ email = "" } = await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 422 });
  }
  console.info("[newsletter] New subscriber:", email.trim());
  return NextResponse.json({ ok: true });
}
