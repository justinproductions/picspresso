"use client";

import Image from "next/image";

export type CardStatus = "idle" | "converting" | "done" | "error";

export interface ImageItem {
  id: string;
  file: File;
  preview: string;
  status: CardStatus;
  resultBlob?: Blob;
  resultName?: string;
  resultWidth?: number;
  resultHeight?: number;
  originalSize?: number;
  convertedSize?: number;
  error?: string;
}

interface Props {
  item: ImageItem;
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function savingsPercent(orig: number, conv: number): string {
  const pct = ((orig - conv) / orig) * 100;
  return pct > 0 ? `-${pct.toFixed(0)}%` : `+${Math.abs(pct).toFixed(0)}%`;
}

export default function ImageCard({ item, onRemove, onDownload }: Props) {
  const { id, file, preview, status, resultWidth, resultHeight, originalSize, convertedSize, error } = item;

  return (
    <div className="glass-sm flex flex-col gap-3 p-4 relative group">
      {/* Remove button */}
      <button
        onClick={() => onRemove(id)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8,
          color: "var(--muted)",
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        title="Remove"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Preview */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 120, borderRadius: 10, background: "rgba(0,0,0,0.3)" }}
      >
        <Image
          src={preview}
          alt={file.name}
          fill
          className="object-contain"
          unoptimized
        />

        {/* Status overlay */}
        {status === "converting" && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(5,5,5,0.7)" }}>
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(5,5,5,0.8)" }}>
            <span style={{ color: "#ef4444", fontSize: 11, textAlign: "center", padding: 8 }}>{error ?? "Failed"}</span>
          </div>
        )}
      </div>

      {/* File name */}
      <p style={{ color: "var(--text)", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {file.name}
      </p>

      {/* Stats */}
      {status === "done" && originalSize && convertedSize && (
        <div className="flex items-center justify-between">
          <div style={{ fontSize: 11, color: "var(--muted)" }}>
            <span>{formatBytes(originalSize)}</span>
            <span style={{ margin: "0 4px" }}>→</span>
            <span style={{ color: "var(--text)" }}>{formatBytes(convertedSize)}</span>
            <span style={{ marginLeft: 4, color: convertedSize < originalSize ? "#4ade80" : "#f87171" }}>
              {savingsPercent(originalSize, convertedSize)}
            </span>
          </div>
          {resultWidth && resultHeight && (
            <span style={{ fontSize: 11, color: "var(--muted)" }}>{resultWidth}×{resultHeight}</span>
          )}
        </div>
      )}

      {/* Download button */}
      {status === "done" && (
        <button className="btn-ghost w-full justify-center" style={{ fontSize: 12 }} onClick={() => onDownload(id)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
      )}
    </div>
  );
}
