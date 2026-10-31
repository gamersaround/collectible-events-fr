import { notFound } from "next/navigation";

// Studio is disabled in production to save Vercel Fluid CPU.
// Use https://sanity.io/manage for CMS access.
//
// To re-enable locally: SANITY_STUDIO_ENABLED=true pnpm dev
const studioEnabled =
  process.env.NODE_ENV !== "production" ||
  process.env.SANITY_STUDIO_ENABLED === "true";

export default function StudioPage() {
  if (!studioEnabled) {
    notFound();
  }

  // Dynamic import keeps the heavy Sanity bundle out of the main chunk.
  const StudioClient = require("./StudioClient").default;
  return <StudioClient />;
}
