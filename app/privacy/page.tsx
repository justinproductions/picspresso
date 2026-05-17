import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.picspresso.com";
const LAST_UPDATED = "2026-05-17";

export const metadata: Metadata = {
  title: "Privacy Policy — Picspresso",
  description:
    "How Picspresso handles your data. Spoiler: we don't have your images. Conversion happens 100% in your browser, nothing uploaded.",
  alternates: { canonical: `${BASE_URL}/privacy` },
  openGraph: {
    title: "Picspresso Privacy Policy",
    description:
      "How Picspresso handles your data. Conversion happens 100% in your browser. Images are never uploaded.",
    url: `${BASE_URL}/privacy`,
    type: "website",
  },
};

export default function PrivacyPage() {
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
            marginBottom: 12,
          }}
        >
          Privacy Policy
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 32 }}>
          Last updated: {LAST_UPDATED}
        </p>

        <Section title="Short version">
          <p>
            Picspresso converts images entirely in your browser. Your images are never
            uploaded, never stored on our servers, never logged, never shared, never
            sold. The only thing we &quot;collect&quot; is anonymous, privacy-friendly page
            analytics (no cookies, no fingerprinting), and any feedback you choose to
            send us through the feedback form. That&apos;s the whole policy. The detail
            below is for legal completeness.
          </p>
        </Section>

        <Section title="What we do not collect">
          <ul style={listStyle}>
            <li><strong>Your images.</strong> Conversion happens client-side via the browser Canvas API. The bytes never leave your device.</li>
            <li><strong>Account data.</strong> There are no accounts. We do not ask for names, passwords, payment info, or anything else.</li>
            <li><strong>Cookies for tracking.</strong> We do not set tracking cookies. Picspresso functions without any cookies at all.</li>
            <li><strong>Device fingerprints.</strong> No fingerprinting libraries, no canvas fingerprinting, no font enumeration.</li>
            <li><strong>Third-party advertising trackers.</strong> No Google Ads, Facebook Pixel, TikTok Pixel, or similar.</li>
          </ul>
        </Section>

        <Section title="What we do collect">
          <h3 style={subheadStyle}>Anonymous page analytics</h3>
          <p>
            We use <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer" style={linkStyle}>Vercel Web Analytics</a>, which is a privacy-friendly, cookieless analytics service.
            It records aggregate page views, country (derived from IP at request time
            and not stored), referrer, browser family, and operating system family.
            It does <strong>not</strong> set cookies, fingerprint devices, or build user
            profiles across sessions. Data is retained by Vercel per their privacy
            policy.
          </p>

          <h3 style={subheadStyle}>Optional feedback you send us</h3>
          <p>
            If you use the in-app feedback form to send us a message, we store the
            following in a <a href="https://turso.tech/privacy-policy" target="_blank" rel="noopener noreferrer" style={linkStyle}>Turso</a> (libSQL) database:
          </p>
          <ul style={listStyle}>
            <li>The message text you entered</li>
            <li>The email address you entered (only if you provided one — it is optional)</li>
            <li>A timestamp of when the message was submitted</li>
          </ul>
          <p style={{ marginTop: 10 }}>
            We do <strong>not</strong> store your IP address with the feedback. We use
            your IP only at the moment of submission for short-lived rate-limiting (to
            prevent spam) and to call <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" style={linkStyle}>Cloudflare Turnstile</a> for bot detection. The
            IP is not written to our database.
          </p>
        </Section>

        <Section title="Third-party services we use">
          <ul style={listStyle}>
            <li>
              <strong>Vercel</strong> — hosts the site. Vercel processes server requests and may log standard request metadata (IP, user-agent, timestamp) for security and operations. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={linkStyle}>Vercel&apos;s privacy policy</a>.
            </li>
            <li>
              <strong>Cloudflare Turnstile</strong> — protects the feedback form against bots. Turnstile runs a privacy-preserving challenge in your browser without setting cookies or tracking you across sites. See <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" style={linkStyle}>Cloudflare&apos;s privacy policy</a>.
            </li>
            <li>
              <strong>Turso (libSQL)</strong> — stores feedback messages. Only used when you submit feedback. See <a href="https://turso.tech/privacy-policy" target="_blank" rel="noopener noreferrer" style={linkStyle}>Turso&apos;s privacy policy</a>.
            </li>
            <li>
              <strong>Google Fonts</strong> — serves the Poppins font. Loaded via Next.js&apos;s self-hosted font system, so Google does not see your IP for font requests.
            </li>
          </ul>
        </Section>

        <Section title="Cookies">
          <p>
            Picspresso itself does not set cookies. Vercel Web Analytics is cookieless.
            Cloudflare Turnstile may set short-lived first-party cookies on the
            Cloudflare challenge domain (not on picspresso.com) solely to deliver the
            anti-bot challenge — these are not used for tracking.
          </p>
        </Section>

        <Section title="Data retention">
          <ul style={listStyle}>
            <li><strong>Images:</strong> never stored anywhere.</li>
            <li><strong>Analytics:</strong> retained by Vercel per their published retention policy.</li>
            <li><strong>Feedback messages:</strong> retained indefinitely unless you request deletion.</li>
            <li><strong>Server logs:</strong> standard Vercel access logs are retained per Vercel&apos;s defaults.</li>
          </ul>
        </Section>

        <Section title="Your rights (GDPR / CCPA)">
          <p>
            Since we do not maintain user accounts and do not collect personal data
            beyond what you voluntarily put in a feedback message, there is typically
            nothing on our side that can identify you. If you sent us a feedback
            message and want it deleted, or you have any other privacy-related
            request, email{" "}
            <a href="mailto:mail@justin.productions" style={linkStyle}>mail@justin.productions</a>{" "}
            with enough context to find the message (e.g. the approximate date and the
            email address used, if any).
          </p>
        </Section>

        <Section title="Children">
          <p>
            Picspresso is a general-audience tool. It is not directed at children under
            13, and we do not knowingly collect personal information from children.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If we change how we handle data, we will update the &quot;Last updated&quot; date
            at the top of this page. Material changes will be highlighted.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Privacy questions:{" "}
            <a href="mailto:mail@justin.productions" style={linkStyle}>mail@justin.productions</a>
          </p>
          <p style={{ marginTop: 8 }}>
            Operator:{" "}
            <a href="https://justin.productions/en" target="_blank" rel="noopener noreferrer" style={linkStyle}>Justin Productions</a>
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

const subheadStyle: React.CSSProperties = {
  color: "var(--heading)",
  fontSize: 13,
  fontWeight: 600,
  marginTop: 14,
  marginBottom: 6,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
  opacity: 0.85,
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
