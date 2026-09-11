import type { PendingSponsorInquiry } from "@/lib/queries/sponsorInquiries";

function formatInquiry(item: PendingSponsorInquiry): string {
  const when = item._createdAt;
  return [
    `— ${item.name} <${item.email}>`,
    `  Org: ${item.organization}`,
    `  Locale: ${item.locale ?? "—"}`,
    `  Date: ${when}`,
    `  Message: ${item.message}`,
  ].join("\n");
}

export function buildSponsorDigestText(items: PendingSponsorInquiry[]): string {
  return [
    `CardAgenda — digest sponsoring / mise en avant (${items.length})`,
    "",
    ...items.map(formatInquiry),
  ].join("\n");
}

export async function sendSponsorDigest(
  items: PendingSponsorInquiry[]
): Promise<{ sent: boolean; channel: "resend" | "slack" | null; reason?: string }> {
  if (items.length === 0) {
    return { sent: false, channel: null, reason: "empty" };
  }

  const text = buildSponsorDigestText(items);
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.SPONSOR_DIGEST_TO;
  const from = process.env.SPONSOR_DIGEST_FROM;
  const slackUrl = process.env.SLACK_WEBHOOK_URL;

  if (resendKey && to && from) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `CardAgenda — ${items.length} demande(s) sponsoring / mise en avant`,
        text,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend ${res.status}: ${body}`);
    }
    return { sent: true, channel: "resend" };
  }

  if (slackUrl) {
    const res = await fetch(slackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Slack webhook ${res.status}: ${body}`);
    }
    return { sent: true, channel: "slack" };
  }

  return {
    sent: false,
    channel: null,
    reason: "no digest destination (set RESEND_API_KEY + SPONSOR_DIGEST_TO + SPONSOR_DIGEST_FROM, or SLACK_WEBHOOK_URL)",
  };
}
