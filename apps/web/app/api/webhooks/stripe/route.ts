import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

// Verify Stripe webhook signature without the Stripe SDK
async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string
): Promise<boolean> {
  const parts = sigHeader.split(",").reduce<Record<string, string>>((acc, part) => {
    const [k, v] = part.split("=");
    if (k && v) acc[k] = v;
    return acc;
  }, {});

  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;

  // Reject if older than 5 minutes
  if (Math.abs(Date.now() / 1000 - parseInt(timestamp)) > 300) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const expected = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(`${timestamp}.${payload}`)
  );
  const expectedHex = Array.from(new Uint8Array(expected))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return expectedHex === signature;
}

async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    }),
  });
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sigHeader = req.headers.get("stripe-signature") ?? "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  // Verify signature
  const valid = await verifyStripeSignature(payload, sigHeader, secret);
  if (!valid) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let event: {
    type: string;
    data: {
      object: {
        amount_total?: number;
        currency?: string;
        customer_details?: { email?: string; name?: string };
        custom_fields?: Array<{ key: string; text?: { value?: string } }>;
        metadata?: Record<string, string>;
        payment_link?: string;
        id: string;
      };
    };
  };

  try {
    event = JSON.parse(payload);
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;
  const amount = ((session.amount_total ?? 0) / 100).toFixed(2);
  const currency = (session.currency ?? "eur").toUpperCase();
  const customerName = session.customer_details?.name ?? "Inconnu";
  const customerEmail = session.customer_details?.email ?? "";

  // Récupérer le nom de l'event depuis les custom fields Stripe
  const eventNameField = session.custom_fields?.find(
    (f) => f.key === "nom_de_votre_evenement" || f.key === "event_name" || f.key === "evenement"
  );
  const eventName = eventNameField?.text?.value ?? session.metadata?.event_name ?? "Non renseigné";

  // Notification Telegram
  const message = [
    `💰 *Nouveau sponsoring Cardagenda !*`,
    ``,
    `*Montant :* ${amount} ${currency}`,
    `*Organisateur :* ${customerName}`,
    `*Email :* ${customerEmail}`,
    `*Événement :* ${eventName}`,
    ``,
    `Pour activer la mise en avant, cherche l'event dans Sanity Studio et coche "Notre sélection" avec les dates souhaitées.`,
    ``,
    `Studio : https://www.cardagenda.com/studio`,
  ].join("\n");

  await sendTelegramNotification(message);

  // Log dans la console Vercel pour trace
  console.log("Stripe sponsoring received", {
    sessionId: session.id,
    amount,
    currency,
    customerName,
    customerEmail,
    eventName,
  });

  return NextResponse.json({ received: true });
}
