import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Project id + dataset are enough for CDN URLs. Do not import @sanity/client
// here: EventCard is a client component and the full client (~rxjs/buffer/get-it)
// was landing in homepage chunk 1890 (~78% unused per PSI).
const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
});

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
