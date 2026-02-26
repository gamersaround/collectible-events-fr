export { metadata, viewport } from "next-sanity/studio";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
