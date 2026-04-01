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
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-3">
        {/* Width */}
        <div className="flex flex-col gap-2 flex-1">
          <label style={{ color: "var(--muted)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>Width</label>
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

        {/* Chain toggle */}
        <button
          onClick={onLockToggle}
          title={locked ? "Unlock aspect ratio" : "Lock aspect ratio"}
          style={{
            background: locked ? "rgba(191,32,30,0.15)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${locked ? "rgba(191,32,30,0.35)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 10,
            width: 36,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.2s ease",
            marginBottom: 1,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={locked ? "var(--accent)" : "rgba(255,255,255,0.3)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>

        {/* Height */}
        <div className="flex flex-col gap-2 flex-1">
          <label style={{ color: "var(--muted)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>Height</label>
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
        <p style={{ color: "var(--muted)", fontSize: 11, opacity: 0.6 }}>
          Original: {original.width} × {original.height}px
        </p>
      )}
    </div>
  );
}
