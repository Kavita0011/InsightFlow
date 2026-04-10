import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InsightFlow - Multi-Tenant Analytics Platform",
  description: "Build beautiful dashboards for your clients with drag-and-drop simplicity. Form-based intake, white-label embedding, and robust billing.",
  keywords: ["analytics", "dashboard", "multi-tenant", "SaaS", "business intelligence", "data visualization"],
  authors: [{ name: "InsightFlow" }],
  openGraph: {
    title: "InsightFlow - Multi-Tenant Analytics Platform",
    description: "Build beautiful dashboards for your clients with drag-and-drop simplicity.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
