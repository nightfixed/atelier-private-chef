import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atelier Private Dining",
  description: "Experiențe culinare private, gândite și executate de la zero — pentru cei care știu diferența. Chef Răzvan & Roland · Cluj-Napoca · România.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
