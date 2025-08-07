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
  title: "QHacks 2026",
  description: "Queen's University's annual hackathon is back for it's 10th iteration! Come pre-register for the event in February 2025 and join hundreds of applicants, meet tech companies, and have one of the best experiences ever!",
  keywords: ['QHacks', 'QHacks 2025', 'Queens Hackathon'],
  icons: '/logo/logo.png',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
