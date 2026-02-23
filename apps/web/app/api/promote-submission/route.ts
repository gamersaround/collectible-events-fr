import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { createClient } from "@sanity/client"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function POST(request: NextRequest) {
  try {
    const { submissionId } = await request.json()

    if (!submissionId) {
      return NextResponse.json(
        { error: "submissionId manquant" },
        { status: 400 }
      )
    }

    // Fetch the submission (try draft first, then published)
    const draftId = submissionId.startsWith("drafts.")
      ? submissionId
      : `drafts.${submissionId}`
    const publishedId = submissionId.startsWith("drafts.")
      ? submissionId.replace(/^drafts\./, "")
      : submissionId

    const [draft, published] = await Promise.all([
      writeClient.getDocument(draftId).catch(() => null),
      writeClient.getDocument(publishedId).catch(() => null),
    ])

    const submission = draft ?? published

    if (!submission) {
      return NextResponse.json(
        { error: "Soumission introuvable" },
        { status: 404 }
      )
    }

    if (submission.promotedToEventId) {
      return NextResponse.json(
        { error: "Cette soumission a déjà été promue", eventId: submission.promotedToEventId },
        { status: 409 }
      )
    }

    // Generate slug with date suffix for uniqueness
    const date = submission.startsAt
      ? new Date(submission.startsAt).toISOString().slice(0, 10).replace(/-/g, "")
      : new Date().toISOString().slice(0, 10).replace(/-/g, "")
    const slugBase = slugify(submission.title ?? "evenement")
    const slugValue = `${slugBase}-${date}`

    // Build the event document
    const eventDoc: { _type: string; [key: string]: unknown } = {
      _type: "event",
      title: submission.title,
      slug: { _type: "slug", current: slugValue },
      status: "a_venir",
    }

    const fieldsToCopy: string[] = [
      "description",
      "tcgTypes",
      "format",
      "venueName",
      "address",
      "city",
      "country",
      "departmentCode",
      "postalCode",
      "startsAt",
      "endsAt",
      "entryFee",
      "maxParticipants",
      "registrationUrl",
      "organizerName",
      "organizerContact",
      "websiteUrl",
      "image",
    ]

    for (const field of fieldsToCopy) {
      if (submission[field] !== undefined && submission[field] !== null) {
        eventDoc[field] = submission[field]
      }
    }

    // Create the event document
    const createdEvent = await writeClient.create(eventDoc)

    // Revalidate ISR pages immediately (mirrors Sanity webhook behavior)
    revalidatePath(`/evenements/${slugValue}`)
    revalidatePath("/evenements")
    revalidatePath("/")
    revalidatePath("/carte")

    // Patch the submission: mark as approved and link to event
    const submissionPatch = {
      status: "approuve",
      reviewedAt: new Date().toISOString(),
      promotedToEventId: createdEvent._id,
    }

    await writeClient
      .patch(publishedId)
      .set(submissionPatch)
      .commit()

    // Also patch the draft if it exists
    if (draft) {
      await writeClient
        .patch(draftId)
        .set(submissionPatch)
        .commit()
    }

    return NextResponse.json({ eventId: createdEvent._id }, { status: 201 })
  } catch (err) {
    console.error("POST /api/promote-submission error:", err)
    return NextResponse.json(
      { error: "Erreur lors de la promotion" },
      { status: 500 }
    )
  }
}
