import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody(
      req,
      process.env.SANITY_WEBHOOK_SECRET
    );

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const slug = (body as { slug?: { current?: string } })?.slug?.current;

    if (slug) {
      revalidatePath(`/evenements/${slug}`);
    }

    revalidatePath("/evenements");
    revalidatePath("/");
    revalidatePath("/carte");

    return NextResponse.json({ revalidated: true, slug: slug ?? null });
  } catch (err) {
    console.error("Sanity webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
