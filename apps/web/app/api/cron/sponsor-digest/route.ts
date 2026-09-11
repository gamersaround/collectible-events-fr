import { NextRequest, NextResponse } from "next/server";
import {
  listPendingSponsorInquiries,
  markSponsorInquiriesDigested,
} from "@/lib/queries/sponsorInquiries";
import { sendSponsorDigest } from "@/lib/sponsor-digest";

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET || process.env.CRAWLER_SECRET;
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  const headerSecret = request.headers.get("x-cron-secret");
  return bearer === secret || headerSecret === secret;
}

/**
 * Daily digest of sponsorship / featuring inquiries.
 * Vercel Cron: 08:00 UTC. Does not email on each submission.
 *
 * Hook (set on Vercel, then the cron can notify):
 * - RESEND_API_KEY + SPONSOR_DIGEST_TO + SPONSOR_DIGEST_FROM
 * - or SLACK_WEBHOOK_URL
 * Auth: Authorization Bearer CRON_SECRET (fallback CRAWLER_SECRET).
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pending = await listPendingSponsorInquiries();
    const result = await sendSponsorDigest(pending);

    if (result.sent) {
      await markSponsorInquiriesDigested(pending.map((item) => item._id));
    }

    return NextResponse.json({
      count: pending.length,
      sent: result.sent,
      channel: result.channel,
      reason: result.reason ?? null,
    });
  } catch (err) {
    console.error("GET /api/cron/sponsor-digest error:", err);
    return NextResponse.json({ error: "Digest failed" }, { status: 500 });
  }
}
