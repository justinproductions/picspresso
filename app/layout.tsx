import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

const BASE_URL = "https://www.picspresso.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Picspresso — Free WebP Converter Online",
  description:
    "Convert JPG, PNG, GIF and more to WebP — free, instant, and 100% private. Images never leave your browser. Bulk upload, resize, aspect ratio lock, quality control. No account needed.",
  keywords: [
    "webp converter",
    "jpg to webp",
    "png to webp",
    "convert to webp",
    "webp converter online",
    "free webp converter",
    "bulk webp converter",
    "image converter",
    "resize images",
    "compress images",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Picspresso — Free WebP Converter Online",
    description:
      "Convert JPG, PNG, GIF and more to WebP instantly. 100% private — images never leave your browser. Free forever.",
    url: BASE_URL,
    siteName: "Picspresso",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Picspresso — Free WebP Converter Online",
    description:
      "Convert JPG, PNG, GIF and more to WebP instantly. 100% private — images never leave your browser.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {/* Ambient glow blobs */}
        <div className="glow-blob glow-blob-pink" />
        <div className="glow-blob glow-blob-blue" />
        {children}
      </body>
    </html>
  );
}
