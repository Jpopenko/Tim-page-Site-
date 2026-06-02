import { NextRequest, NextResponse } from "next/server";

// Where enquiry notifications are sent.
const OWNER_EMAIL = process.env.OWNER_ALERT_EMAIL ?? "timpagephoto@bigpond.com";
// Verified Resend sender, e.g. "Tim Page Enquiries <enquiries@timpagephoto.com>".
const EMAIL_FROM = process.env.EMAIL_FROM;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

type Fields = {
  name: string; email: string;
  image?: string; intent?: string; usage?: string; size?: string; message?: string;
};

export async function POST(req: NextRequest) {
  const f = await req.json() as Fields;

  if (!f.name?.trim() || !f.email?.trim()) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  if (!RESEND_API_KEY || !EMAIL_FROM) {
    console.error("[contact] Email not configured (missing RESEND_API_KEY or EMAIL_FROM)");
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }

  const subject = `New enquiry — ${f.name} (${f.intent ?? "general"})`;
  const text = [
    `Name:    ${f.name}`,
    `Email:   ${f.email}`,
    `Type:    ${f.intent ?? "general"}`,
    f.image   && `Image:   ${f.image}`,
    f.usage   && `Usage:   ${f.usage}`,
    f.size    && `Size:    ${f.size}`,
    f.message && `\nMessage:\n${f.message}`,
    `\n— Sent from the enquiry form at timpagephoto.com`,
  ].filter(Boolean).join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [OWNER_EMAIL],
        reply_to: f.email, // replying goes straight to the enquirer
        subject,
        text,
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend error:", res.status, await res.text());
      return NextResponse.json({ error: "Submission failed" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Send failed:", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
