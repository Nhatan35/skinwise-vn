import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { appConfig } from "@/config/app";
import { cn } from "@/shared/utils";

import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
    <html
      lang="vi"
      className={cn("h-full antialiased", "font-sans", geist.variable)}
    >
      <body className="min-h-full bg-stone-50 text-stone-950">{children}</body>
    </html>
  );
}
