import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Picspresso — Free WebP Converter Online";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#050505",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow blobs */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,27,107,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(69,202,255,0.14) 0%, transparent 70%)",
          }}
        />

        {/* Glass card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            background: "rgba(20,20,30,0.6)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 32,
            padding: "56px 80px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <span style={{ fontSize: 72, fontWeight: 700, color: "#bf201e", letterSpacing: "-2px" }}>
              pic
            </span>
            <span style={{ fontSize: 72, fontWeight: 700, color: "#ffffff", letterSpacing: "-2px" }}>
              spresso
            </span>
          </div>

          {/* Tagline */}
          <span style={{ fontSize: 26, color: "#aaaaaa", fontWeight: 400, textAlign: "center" }}>
            Free WebP converter. Runs entirely in your browser.
          </span>

          {/* Badges */}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            {["Fast", "Secure", "Private", "No uploads"].map((label) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 20,
                  padding: "8px 18px",
                  fontSize: 18,
                  color: "#aaaaaa",
                  fontWeight: 500,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            fontSize: 20,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.05em",
          }}
        >
          picspresso.com
        </div>
      </div>
    ),
    { ...size }
  );
}
