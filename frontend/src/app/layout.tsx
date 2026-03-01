import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "PNC RISE",
  description: "Financial literacy for young adults – understand how daily finances affect your future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" style={{ paddingTop: 64, paddingBottom: 24 }}>
        <Navigation />
        <main style={{ minHeight: "100vh" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
