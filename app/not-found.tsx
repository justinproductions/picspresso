import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Page not found · Picspresso",
  description: "This page couldn't be brewed. Head back to the converter.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      className="relative z-10 flex flex-col items-center justify-center min-h-screen"
      style={{
        maxWidth: 720,
        margin: "0 auto",
        width: "100%",
        paddingTop: 48,
        paddingBottom: 48,
        paddingLeft: "clamp(16px, 5vw, 48px)",
        paddingRight: "clamp(16px, 5vw, 48px)",
      }}
    >
      <div
        className="glass flex flex-col items-center text-center"
        style={{ padding: "48px 32px", width: "100%" }}
      >
        {/* Logo */}
        <img
          src="/logo.webp"
          alt="Picspresso"
          style={{ height: 36, width: "auto", display: "block", marginBottom: 32, opacity: 0.85 }}
        />

        {/* Big 404 */}
        <h1
          style={{
            fontSize: "clamp(72px, 16vw, 140px)",
            fontWeight: 600,
            lineHeight: 1,
            color: "var(--heading)",
            letterSpacing: "-0.04em",
            marginBottom: 8,
            background: "linear-gradient(135deg, var(--accent) 0%, var(--glow-pink) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </h1>

        <h2
          style={{
            fontSize: "clamp(18px, 3vw, 22px)",
            fontWeight: 500,
            color: "var(--heading)",
            marginBottom: 12,
          }}
        >
          This page got compressed to nothing
        </h2>

        <p
          style={{
            color: "var(--muted)",
            fontSize: 14,
            maxWidth: 380,
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist — or maybe it
          never did. Let&apos;s get you back to converting images.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link href="/" className="btn-accent" style={{ textDecoration: "none" }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to converter
          </Link>
          <a
            href="https://justin.productions/en"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ textDecoration: "none" }}
          >
            By Justin Productions
          </a>
        </div>
      </div>

      {/* Status code label */}
      <p
        style={{
          color: "var(--muted)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginTop: 24,
          opacity: 0.5,
        }}
      >
        Error 404 · Page not found
      </p>
    </main>
  );
}
