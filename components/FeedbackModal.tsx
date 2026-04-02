"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  onClose: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function FeedbackModal({ onClose }: Props) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 3) return;
    setStatus("submitting");

    try {
      const { error } = await supabase.from("feedback").insert({
        message: message.trim(),
        email: email.trim() || null,
      });
      if (error) throw error;
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass flex flex-col gap-5 w-full"
        style={{ maxWidth: 440, margin: "0 16px", padding: "32px 28px" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 style={{ color: "var(--heading)", fontSize: 18, fontWeight: 600 }}>
              Ideas & requests
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
              Feature request, bug, or just a thought — all welcome.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ color: "var(--muted)", background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div style={{
              background: "rgba(74,222,128,0.1)",
              border: "1px solid rgba(74,222,128,0.25)",
              borderRadius: "50%",
              width: 48, height: 48,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p style={{ color: "var(--heading)", fontWeight: 600 }}>Got it, thanks!</p>
            <p style={{ color: "var(--muted)", fontSize: 13 }}>Your feedback helps shape what gets built next.</p>
            <button className="btn-ghost mt-2" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label style={{ color: "var(--muted)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Message <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Would love a dark mode export option..."
                rows={4}
                maxLength={1000}
                required
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  color: "var(--text)",
                  fontSize: 13,
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(191,32,30,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <span style={{ color: "var(--muted)", fontSize: 11, opacity: 0.5, textAlign: "right" }}>
                {message.length}/1000
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label style={{ color: "var(--muted)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Email <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  color: "var(--text)",
                  fontSize: 13,
                  fontFamily: "inherit",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(191,32,30,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            {status === "error" && (
              <p style={{ color: "#f87171", fontSize: 12 }}>Something went wrong. Please try again.</p>
            )}

            <button
              type="submit"
              className="btn-accent w-full justify-center"
              disabled={status === "submitting" || message.trim().length < 3}
            >
              {status === "submitting" ? (
                <>
                  <div className="w-3 h-3 border border-t-transparent rounded-full animate-spin" style={{ borderColor: "currentColor", borderTopColor: "transparent" }} />
                  Sending...
                </>
              ) : "Send feedback"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
