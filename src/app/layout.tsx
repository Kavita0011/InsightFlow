import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
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
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#3B82F6',
          colorBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputText: '#1f2937',
          colorText: '#1f2937',
          colorTextSecondary: '#6b7280',
          fontFamily: 'Geist, sans-serif',
          borderRadius: '0.5rem',
        },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
