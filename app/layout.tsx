import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SyncLayer — Demo",
  description: "AI-powered Design-to-Code Consistency Platform",
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
