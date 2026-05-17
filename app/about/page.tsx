import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.picspresso.com";

export const metadata: Metadata = {
  title: "About — Picspresso · Free Private WebP Converter",
  description:
    "Picspresso is a free, browser-based WebP image converter built for speed and privacy. Images never leave your device — all conversion happens in your browser.",
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    title: "About Picspresso",
    description:
      "Why Picspresso exists, how it works, and the privacy-first approach behind the converter.",
    url: `${BASE_URL}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main
      className="relative z-10 flex flex-col min-h-screen"
      style={{
        maxWidth: 760,
        margin: "0 auto",
        width: "100%",
        paddingTop: 48,
        paddingBottom: 48,
        paddingLeft: "clamp(16px, 5vw, 48px)",
        paddingRight: "clamp(16px, 5vw, 48px)",
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: 32 }}>
        <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.webp" alt="Picspresso" style={{ height: 32, width: "auto", display: "block" }} />
        </Link>
      </header>

      <article className="glass" style={{ padding: "40px clamp(24px, 5vw, 48px)" }}>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 40px)",
            fontWeight: 600,
            color: "var(--heading)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          About Picspresso
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>
          A free, fast, private WebP converter — made in 2026.
        </p>

        <Section title="What it is">
          <p>
            Picspresso is a single-page web tool that converts JPG, PNG, GIF, and other
            common image formats to WebP. It runs entirely in your browser. No account.
            No upload. No watermark. No file-size cap beyond what your browser can handle.
          </p>
        </Section>

        <Section title="Why we built it">
          <p>
            Every other WebP converter we tried either uploaded files to a server,
            slapped a watermark on the output, capped batch size, or shoved ads in the
            workflow. None of that is necessary — modern browsers can do the conversion
            natively via the Canvas API. So we built the version we wanted to use.
          </p>
        </Section>

        <Section title="How it works">
          <p>
            When you drop an image into Picspresso, the file stays on your device.
            The browser decodes it, draws it to an offscreen canvas at the resolution
            and quality you chose, then re-encodes it as WebP via{" "}
            <code style={codeStyle}>canvas.toBlob(&apos;image/webp&apos;, quality)</code>.
            For bulk downloads we package everything into a ZIP using{" "}
            <a href="https://stuk.github.io/jszip/" target="_blank" rel="noopener noreferrer" style={linkStyle}>JSZip</a>{" "}
            — still locally. The server never sees a single pixel.
          </p>
        </Section>

        <Section title="What we don't do">
          <ul style={listStyle}>
            <li>Upload your images anywhere</li>
            <li>Track what you convert</li>
            <li>Set tracking cookies</li>
            <li>Sell or share data</li>
            <li>Require an account</li>
            <li>Add watermarks or quality limits</li>
          </ul>
        </Section>

        <Section title="Who's behind it">
          <p>
            Picspresso is built and maintained by{" "}
            <a href="https://justin.productions/en" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Justin Productions
            </a>
            , a one-person studio focused on shipping small, useful, privacy-respecting
            web tools. If you have feedback, feature requests, or find a bug, the
            feedback button on the homepage goes straight to the inbox.
          </p>
        </Section>

        <Section title="Tech stack">
          <p>
            Next.js 16 (App Router), TypeScript, React 19, Tailwind CSS. Hosted on
            Vercel. Image conversion via Canvas API. Bulk packaging via JSZip. Feedback
            storage via Turso (libSQL). That&apos;s the whole list.
          </p>
        </Section>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
          <Link href="/" className="btn-accent" style={{ textDecoration: "none" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to converter
          </Link>
        </div>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2
        style={{
          color: "var(--heading)",
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 10,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      <div style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.7 }}>{children}</div>
    </section>
  );
}

const codeStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  padding: "1px 6px",
  fontSize: 12,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  color: "var(--heading)",
};

const linkStyle: React.CSSProperties = {
  color: "var(--heading)",
  textDecoration: "underline",
  textDecorationColor: "var(--accent-glow)",
  textUnderlineOffset: 3,
};

const listStyle: React.CSSProperties = {
  paddingLeft: 20,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};
