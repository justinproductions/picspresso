import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Picspresso — WebP Converter",
  description:
    "Convert, resize, and export images to WebP. Bulk upload, aspect ratio lock, quality control.",
  openGraph: {
    title: "Picspresso",
    description: "Fast browser-based WebP image converter",
    siteName: "Picspresso",
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
