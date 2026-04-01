"use client";

import { useCallback } from "react";
import { calcHeightFromWidth, calcWidthFromHeight, clampDimension } from "@/lib/resize";
import type { Dimensions } from "@/lib/resize";

interface Props {
  width: number;
  height: number;
  locked: boolean;
  original: Dimensions | null;
  onChange: (dims: { width: number; height: number }) => void;
  onLockToggle: () => void;
}

export default function ResizeControls({ width, height, locked, original, onChange, onLockToggle }: Props) {
  const handleWidth = useCallback(
    (raw: string) => {
      const w = clampDimension(Number(raw) || 1);
      if (locked && original) {
        onChange({ width: w, height: calcHeightFromWidth(w, original) });
      } else {
        onChange({ width: w, height });
      }
    },
    [locked, original, height, onChange]
  );

  const handleHeight = useCallback(
    (raw: string) => {
      const h = clampDimension(Number(raw) || 1);
      if (locked && original) {
        onChange({ width: calcWidthFromHeight(h, original), height: h });
      } else {
        onChange({ width, height: h });
      }
    },
    [locked, original, width, onChange]
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Section label */}
      <div className="flex items-center justify-between">
        <span style={{ color: "var(--muted)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Dimensions</span>
        <button
          onClick={onLockToggle}
          title={locked ? "Unlock aspect ratio" : "Lock aspect ratio"}
          className="flex items-center gap-1.5"
          style={{
            background: locked ? "rgba(191,32,30,0.12)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${locked ? "rgba(191,32,30,0.3)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 20,
            padding: "4px 10px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            color: locked ? "var(--accent)" : "rgba(255,255,255,0.3)",
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {locked
              ? <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>
              : <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></>
            }
          </svg>
          {locked ? "Locked" : "Free"}
        </button>
      </div>

      {/* W & H inputs */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-2 flex-1">
          <label style={{ color: "var(--muted)", fontSize: 11, textAlign: "center", letterSpacing: "0.06em", textTransform: "uppercase" }}>W</label>
          <input
            className="dim-input"
            style={{ width: "100%" }}
            type="number"
            min={1}
            max={16384}
            value={width}
            onChange={(e) => handleWidth(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 22, color: "var(--border)", fontSize: 18, lineHeight: 1, userSelect: "none" }}>×</div>

        <div className="flex flex-col gap-2 flex-1">
          <label style={{ color: "var(--muted)", fontSize: 11, textAlign: "center", letterSpacing: "0.06em", textTransform: "uppercase" }}>H</label>
          <input
            className="dim-input"
            style={{ width: "100%" }}
            type="number"
            min={1}
            max={16384}
            value={height}
            onChange={(e) => handleHeight(e.target.value)}
          />
        </div>
      </div>

      {original && (
        <p style={{ color: "var(--muted)", fontSize: 11, opacity: 0.5, textAlign: "center" }}>
          Original: {original.width} × {original.height}px
        </p>
      )}
    </div>
  );
}
