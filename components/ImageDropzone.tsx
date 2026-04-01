"use client";

import { useCallback, useRef, useState } from "react";

interface Props {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif", "image/tiff", "image/bmp"];

export default function ImageDropzone({ onFiles, disabled }: Props) {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (raw: FileList | File[]) => {
      const valid = Array.from(raw).filter((f) => ACCEPTED.includes(f.type));
      if (valid.length > 0) onFiles(valid);
    },
    [onFiles]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  return (
    <div
      className={`glass flex flex-col items-center justify-center gap-4 p-10 cursor-pointer transition-all duration-300 select-none
        ${dragging ? "border-[rgba(191,32,30,0.6)] shadow-[0_0_30px_rgba(191,32,30,0.2)]" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-[rgba(255,255,255,0.2)]"}`}
      style={{ minHeight: 220 }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center w-16 h-16 rounded-full"
        style={{ background: "rgba(191,32,30,0.15)", border: "1px solid rgba(191,32,30,0.3)" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(191,32,30,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>

      <div className="text-center">
        <p className="font-semibold" style={{ color: "var(--heading)", fontSize: 16 }}>
          Drop images here
        </p>
        <p className="mt-1" style={{ color: "var(--muted)", fontSize: 13 }}>
          JPG, PNG, GIF, AVIF, TIFF, BMP, WebP
        </p>
      </div>

      <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn-ghost"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
          Select files
        </button>
        <button
          className="btn-ghost"
          disabled={disabled}
          onClick={() => folderInputRef.current?.click()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          Select folder
        </button>
      </div>

      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      <input
        ref={folderInputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        className="hidden"
        // @ts-expect-error webkitdirectory is non-standard
        webkitdirectory=""
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
}
