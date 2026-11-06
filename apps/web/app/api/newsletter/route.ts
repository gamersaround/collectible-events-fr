import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const LISTMONK_URL = (
  process.env.LISTMONK_URL ?? "https://news.cardagenda.com"
).replace(/\/$/, "");
const LIST_UUID =
  process.env.LISTMONK_LIST_UUID ?? "0963fa9f-f39b-4b37-89e3-d0539cd490fe";

const schema = z.object({
  email: z.string().trim().email().max(200),
  honeypot_field: z.string().max(0).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.honeypot_field && String(body.honeypot_field).length > 0) {
      return NextResponse.json({ success: true });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const res = await fetch(`${LISTMONK_URL}/api/public/subscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: parsed.data.email,
        list_uuids: [LIST_UUID],
      }),
    });

    if (res.ok) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const text = await res.text();
    let message = "Subscribe failed";
    try {
      const json = JSON.parse(text) as { message?: string };
      if (json.message) message = json.message;
    } catch {
      /* ignore */
    }

    if (res.status === 409 || /already/i.test(message)) {
      return NextResponse.json({ success: true, already: true });
    }

    console.error("POST /api/newsletter listmonk", res.status, message);
    return NextResponse.json({ error: message }, { status: 502 });
  } catch (err) {
    console.error("POST /api/newsletter error:", err);
    return NextResponse.json({ error: "Subscribe failed" }, { status: 500 });
  }
}
