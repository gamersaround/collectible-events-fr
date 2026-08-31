import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSubmission } from "@/lib/queries/submissions";

const submissionSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).nullable().optional(),
  tcg_types: z.array(z.string()).min(1),
  format: z.string(),
  venue_name: z.string().max(200).nullable().optional(),
  address: z.string().max(300).nullable().optional(),
  city: z.string().min(2).max(100),
  country: z
    .string()
    .regex(/^[A-Z]{2}$|^OTHER$/, "Invalid country")
    .optional()
    .default("FR"),
  department_code: z.string().max(10).nullable().optional(),
  postal_code: z.string().max(10).nullable().optional(),
  starts_at: z.string().datetime({ offset: true }).or(z.string().min(1)),
  ends_at: z.string().nullable().optional(),
  entry_fee: z.number().min(0).nullable().optional(),
  max_participants: z.number().int().min(1).nullable().optional(),
  registration_url: z.string().url().nullable().optional(),
  organizer_name: z.string().max(200).nullable().optional(),
  organizer_contact: z.string().email().nullable().optional(),
  website_url: z.string().url().nullable().optional(),
  honeypot_field: z.string().max(0, "Bot detected").optional(),
  image_asset_id: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot check
    if (body.honeypot_field && body.honeypot_field.length > 0) {
      // Silently accept but don't save (confuse bots)
      return NextResponse.json({ success: true });
    }

    const parsed = submissionSchema.safeParse(body);
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

    await createSubmission(
      {
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        tcg_types: parsed.data.tcg_types,
        format: parsed.data.format,
        venue_name: parsed.data.venue_name ?? null,
        address: parsed.data.address ?? null,
        city: parsed.data.city,
        country: parsed.data.country ?? "FR",
        department_code: parsed.data.department_code ?? null,
        postal_code: parsed.data.postal_code ?? null,
        starts_at: parsed.data.starts_at,
        ends_at: parsed.data.ends_at ?? null,
        entry_fee: parsed.data.entry_fee ?? null,
        max_participants: parsed.data.max_participants ?? null,
        registration_url: parsed.data.registration_url ?? null,
        organizer_name: parsed.data.organizer_name ?? null,
        organizer_contact: parsed.data.organizer_contact ?? null,
        website_url: parsed.data.website_url ?? null,
        image_asset_id: parsed.data.image_asset_id ?? null,
      },
      ip
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("POST /api/submissions error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la soumission" },
      { status: 500 }
    );
  }
}
