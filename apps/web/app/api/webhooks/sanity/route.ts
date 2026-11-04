import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { routing } from "@/i18n/routing";
import { citySlug, countryPathSlug } from "@/lib/geo-slugs";
import { countryCode } from "@/lib/countries";

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody(
      req,
      process.env.SANITY_WEBHOOK_SECRET
    );

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const doc = body as {
      _type?: string;
      slug?: { current?: string };
      city?: string;
      country?: string;
    };
    const slug = doc?.slug?.current;
    const docType = doc?._type;
    const city = doc?.city;
    const country = doc?.country;

    for (const locale of routing.locales) {
      if (docType === "article") {
        // Articles: revalidate only the specific page + listing
        if (slug) {
          revalidatePath(`/${locale}/articles/${slug}`);
        }
        revalidatePath(`/${locale}/articles`);
      } else {
        // Events: revalidate the event page + listing only.
        // Skip homepage, /carte, geo pages — they use ISR (7200s)
        // and will refresh on their own schedule. Revalidating them
        // on every Sanity mutation was the #1 Fluid CPU driver.
        if (slug) {
          revalidatePath(`/${locale}/evenements/${slug}`);
        }
        // Revalidate geo pages only when the event has city/country info
        if (city) {
          revalidatePath(`/${locale}/evenements/${citySlug(city)}`);
        }
        if (country) {
          revalidatePath(
            `/${locale}/evenements/${countryPathSlug(countryCode(country), locale)}`
          );
        }
        // Revalidate the events listing (keeps "à venir" section fresh)
        revalidatePath(`/${locale}/evenements`);
        // Skip: revalidatePath(`/${locale}`) — homepage will refresh via ISR
        // Skip: revalidatePath(`/${locale}/carte`) — map refreshes via ISR
      }
    }

    return NextResponse.json({
      revalidated: true,
      slug: slug ?? null,
      type: docType ?? null,
    });
  } catch (err) {
    console.error("Sanity webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
