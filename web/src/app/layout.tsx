import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atelier — Private Chef",
  description: "Culinary artistry. Private dining experiences, seasonal menus, and bespoke event catering.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
