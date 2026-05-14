import type { Metadata } from "next";

import { appConfig } from "@/config/app";

import "./globals.css";

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full font-sans antialiased">
      <body className="min-h-full bg-stone-50 text-stone-950">{children}</body>
    </html>
  );
}
