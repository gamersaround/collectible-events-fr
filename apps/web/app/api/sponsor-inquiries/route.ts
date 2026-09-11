import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSponsorInquiry } from "@/lib/queries/sponsorInquiries";

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  organization: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
  locale: z.string().max(8).nullable().optional(),
  honeypot_field: z.string().max(0, "Bot detected").optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.honeypot_field && body.honeypot_field.length > 0) {
      return NextResponse.json({ success: true });
    }

    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      undefined;

    await createSponsorInquiry(
      {
        name: parsed.data.name,
        email: parsed.data.email,
        organization: parsed.data.organization,
        message: parsed.data.message,
        locale: parsed.data.locale ?? null,
      },
      ip
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("POST /api/sponsor-inquiries error:", err);
    return NextResponse.json({ error: "Erreur lors de l’envoi" }, { status: 500 });
  }
}
