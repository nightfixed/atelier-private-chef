import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://atelierprivatedining.ro"),
  title: {
    default: "Atelier Private Dining · Cluj-Napoca",
    template: "%s · Atelier Private Dining",
  },
  description:
    "Experiențe culinare private, gândite și executate de la zero — pentru cei care știu diferența. Chef Răzvan & Roland · 18+ ani fine dining · Cluj-Napoca, România.",
  keywords: [
    "private dining Cluj",
    "chef privat Cluj-Napoca",
    "fine dining la domiciliu",
    "meniu degustare personalizat",
    "corporate dining Cluj",
    "chef Razvan",
    "experienta culinara privata",
    "atelier private dining",
  ],
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://atelierprivatedining.ro",
    siteName: "Atelier Private Dining",
    title: "Atelier Private Dining · Cluj-Napoca",
    description:
      "Experiențe culinare private cu Chef Răzvan & Roland. Meniuri de degustare personalizate, ingrediente carpatice, 18+ ani fine dining. Cluj-Napoca, România.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atelier Private Dining · Cluj-Napoca",
    description:
      "Experiențe culinare private cu Chef Răzvan & Roland. Meniuri de degustare personalizate · Cluj-Napoca.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  authors: [{ name: "Răzvan", url: "https://atelierprivatedining.ro" }],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
