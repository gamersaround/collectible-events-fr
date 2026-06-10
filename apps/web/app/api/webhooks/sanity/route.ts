import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { routing } from "@/i18n/routing";

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody(
      req,
      process.env.SANITY_WEBHOOK_SECRET
    );

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const doc = body as { _type?: string; slug?: { current?: string } };
    const slug = doc?.slug?.current;
    const docType = doc?._type;

    for (const locale of routing.locales) {
      if (docType === "article") {
        if (slug) {
          revalidatePath(`/${locale}/articles/${slug}`);
        }
        revalidatePath(`/${locale}/articles`);
      } else {
        if (slug) {
          revalidatePath(`/${locale}/evenements/${slug}`);
        }
        revalidatePath(`/${locale}/evenements`);
        revalidatePath(`/${locale}`);
        revalidatePath(`/${locale}/carte`);
      }
    }

    return NextResponse.json({ revalidated: true, slug: slug ?? null, type: docType ?? null });
  } catch (err) {
    console.error("Sanity webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
