import { NextRequest, NextResponse } from "next/server";
import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { contacts, notes } from "@wix/crm";

function wixClient() {
  const apiKey = process.env.WIX_API_KEY;
  const siteId = process.env.WIX_SITE_ID;
  if (!apiKey || !siteId) throw new Error("WIX_API_KEY and WIX_SITE_ID must be set");
  return createClient({
    modules: { contacts, notes },
    auth: ApiKeyStrategy({ apiKey, siteId }),
  });
}

export async function POST(req: NextRequest) {
  const { name, email, image, intent, usage, size, message } =
    await req.json() as Record<string, string>;

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const [first, ...rest] = name.trim().split(" ");
  const last = rest.join(" ") || undefined;

  const noteText = [
    `Enquiry type: ${intent ?? "general"}`,
    image   && `Image: ${image}`,
    usage   && `Usage: ${usage}`,
    size    && `Print size: ${size}`,
    message && `\nMessage:\n${message}`,
  ].filter(Boolean).join("\n");

  try {
    const wix = wixClient();

    const { contact } = await wix.contacts.createContact(
      {
        name: { first, last },
        emails: { items: [{ tag: "MAIN", email }] },
      },
      { allowDuplicates: true },
    );

    if (contact?._id && noteText) {
      await wix.notes.createNote({
        contactId: contact._id,
        text: noteText,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Wix submission error:", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
