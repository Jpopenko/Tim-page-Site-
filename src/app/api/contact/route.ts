import { NextRequest, NextResponse } from "next/server";
import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { contacts, notes } from "@wix/crm";

// Where enquiry notifications are sent.
const OWNER_EMAIL = process.env.OWNER_ALERT_EMAIL ?? "timpagephoto@bigpond.com";
// Verified Resend sender, e.g. "Tim Page Enquiries <enquiries@yourdomain.com>".
const EMAIL_FROM = process.env.EMAIL_FROM;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

type Fields = {
  name: string; email: string;
  image?: string; intent?: string; usage?: string; size?: string; message?: string;
};

/** Send the enquiry to the estate inbox via Resend. Returns true if it sent. */
async function sendEmail(f: Fields): Promise<boolean> {
  if (!RESEND_API_KEY || !EMAIL_FROM) return false; // not configured yet
  const subject = `New enquiry — ${f.name} (${f.intent ?? "general"})`;
  const text = [
    `Name:    ${f.name}`,
    `Email:   ${f.email}`,
    `Type:    ${f.intent ?? "general"}`,
    f.image   && `Image:   ${f.image}`,
    f.usage   && `Usage:   ${f.usage}`,
    f.size    && `Size:    ${f.size}`,
    f.message && `\nMessage:\n${f.message}`,
    `\n— Sent from the enquiry form at timpage.com`,
  ].filter(Boolean).join("\n");

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
    return false;
  }
  return true;
}

/** Interim fallback: record the enquiry in Wix CRM (removed once Resend is live). */
async function saveToWix(f: Fields): Promise<boolean> {
  const apiKey = process.env.WIX_API_KEY;
  const siteId = process.env.WIX_SITE_ID;
  if (!apiKey || !siteId) return false;

  const [first, ...rest] = f.name.trim().split(" ");
  const last = rest.join(" ") || undefined;
  const noteText = [
    `Enquiry type: ${f.intent ?? "general"}`,
    f.image   && `Image: ${f.image}`,
    f.usage   && `Usage: ${f.usage}`,
    f.size    && `Print size: ${f.size}`,
    f.message && `\nMessage:\n${f.message}`,
  ].filter(Boolean).join("\n");

  try {
    const wix = createClient({
      modules: { contacts, notes },
      auth: ApiKeyStrategy({ apiKey, siteId }),
    });
    const { contact } = await wix.contacts.createContact(
      { name: { first, last }, emails: { items: [{ tag: "MAIN", email: f.email }] } },
      { allowDuplicates: true },
    );
    if (contact?._id && noteText) {
      await wix.notes.createNote({ contactId: contact._id, text: noteText });
    }
    return true;
  } catch (err) {
    console.error("[contact] Wix submission error:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  const f = await req.json() as Fields;

  if (!f.name?.trim() || !f.email?.trim()) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  // Send via email and (for now) also record in Wix, so the form works either way.
  const [emailed, saved] = await Promise.all([sendEmail(f), saveToWix(f)]);

  if (!emailed && !saved) {
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
