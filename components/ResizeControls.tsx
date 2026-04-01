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
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span style={{ color: "var(--heading)", fontSize: 14, fontWeight: 500 }}>Resize</span>
        <button
          className={`btn-ghost text-xs ${locked ? "active" : ""}`}
          onClick={onLockToggle}
          title={locked ? "Unlock aspect ratio" : "Lock aspect ratio"}
        >
          {locked ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Locked
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </svg>
              Free
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1 items-center">
          <label style={{ color: "var(--muted)", fontSize: 11 }}>W</label>
          <input
            className="dim-input"
            type="number"
            min={1}
            max={16384}
            value={width}
            onChange={(e) => handleWidth(e.target.value)}
          />
        </div>

        {/* Chain icon */}
        <div className="flex flex-col items-center justify-center mt-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={locked ? "var(--accent)" : "var(--border)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>

        <div className="flex flex-col gap-1 items-center">
          <label style={{ color: "var(--muted)", fontSize: 11 }}>H</label>
          <input
            className="dim-input"
            type="number"
            min={1}
            max={16384}
            value={height}
            onChange={(e) => handleHeight(e.target.value)}
          />
        </div>
      </div>

      {original && (
        <p style={{ color: "var(--muted)", fontSize: 11 }}>
          Original: {original.width} × {original.height}
        </p>
      )}
    </div>
  );
}
