import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "GigScope AI — Research smarter. Write better. Launch with confidence.",
  description:
    "Turn your Fiverr Gig drafts into researched, buyer-focused content with competitor insights, keyword evidence, and practical optimization recommendations.",
  keywords: [
    "Fiverr gig optimization",
    "gig title optimizer",
    "fiverr gig description",
    "fiverr faqs",
    "freelance market research",
    "gig intelligence",
  ],
  authors: [{ name: "GigScope AI" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
