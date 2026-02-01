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
  title: "K-Destiny | Discover Your K-Star Soul Connection",
  description:
    "Experience the fusion of traditional Korean Saju fortune telling with K-Culture. Discover which K-Pop idol or K-Drama character shares your destiny.",
  keywords: [
    "K-Destiny",
    "Saju",
    "Korean fortune telling",
    "K-Pop",
    "K-Drama",
    "Korean astrology",
    "사주",
    "운명",
    "K-Culture",
  ],
  authors: [{ name: "K-Destiny" }],
  openGraph: {
    title: "K-Destiny | Discover Your K-Star Soul Connection",
    description:
      "Experience the fusion of traditional Korean Saju fortune telling with K-Culture.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "K-Destiny | Discover Your K-Star Soul Connection",
    description:
      "Experience the fusion of traditional Korean Saju fortune telling with K-Culture.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
