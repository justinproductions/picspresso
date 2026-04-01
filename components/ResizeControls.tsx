"use client";

import { useCallback } from "react";
import { calcHeightFromWidth, calcWidthFromHeight, clampDimension } from "@/lib/resize";
import type { Dimensions } from "@/lib/resize";

export type ResizeMode = "fixed" | "per-image";

interface Props {
  resizeMode: ResizeMode;
  width: number;
  height: number;
  locked: boolean;
  original: Dimensions | null;
  maxDimension: number;
  onChange: (dims: { width: number; height: number }) => void;
  onLockToggle: () => void;
  onResizeModeChange: (mode: ResizeMode) => void;
  onMaxDimensionChange: (value: number) => void;
}

export default function ResizeControls({
  resizeMode,
  width,
  height,
  locked,
  original,
  maxDimension,
  onChange,
  onLockToggle,
  onResizeModeChange,
  onMaxDimensionChange,
}: Props) {
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
      <span style={{ color: "var(--muted)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Dimensions
      </span>

      {/* Mode toggle */}
      <div className="flex" style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 3, border: "1px solid rgba(255,255,255,0.06)" }}>
        {(["fixed", "per-image"] as ResizeMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onResizeModeChange(mode)}
            style={{
              flex: 1,
              background: resizeMode === mode ? "rgba(191,32,30,0.2)" : "transparent",
              border: resizeMode === mode ? "1px solid rgba(191,32,30,0.35)" : "1px solid transparent",
              borderRadius: 9,
              padding: "5px 0",
              fontSize: 11,
              fontWeight: 600,
              color: resizeMode === mode ? "var(--accent)" : "rgba(255,255,255,0.3)",
              cursor: "pointer",
              transition: "all 0.18s ease",
              letterSpacing: "0.02em",
            }}
          >
            {mode === "fixed" ? "Fixed size" : "Per image"}
          </button>
        ))}
      </div>

      {resizeMode === "fixed" ? (
        <>
          {/* Lock toggle */}
          <div className="flex items-center justify-between">
            <span style={{ color: "var(--muted)", fontSize: 11, opacity: 0.6 }}>Aspect ratio</span>
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
        </>
      ) : (
        <>
          {/* Per-image: max dimension input */}
          <div className="flex flex-col gap-2">
            <label style={{ color: "var(--muted)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Max dimension
            </label>
            <div className="flex items-center gap-2">
              <input
                className="dim-input"
                style={{ flex: 1 }}
                type="number"
                min={1}
                max={16384}
                value={maxDimension}
                onChange={(e) => onMaxDimensionChange(clampDimension(Number(e.target.value) || 1))}
              />
              <span style={{ color: "var(--muted)", fontSize: 12, flexShrink: 0 }}>px</span>
            </div>
          </div>

          <p style={{ color: "var(--muted)", fontSize: 11, opacity: 0.6, lineHeight: 1.6 }}>
            Longest side capped at this value. Each image keeps its own aspect ratio, so portraits stay portrait and landscapes stay landscape.
          </p>
        </>
      )}
    </div>
  );
}
