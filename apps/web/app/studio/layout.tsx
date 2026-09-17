export { metadata, viewport } from "next-sanity/studio";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta name="google-adsense-account" content="ca-pub-8480412242622897" />
      </head>
      <body>{children}</body>
    </html>
  );
}
