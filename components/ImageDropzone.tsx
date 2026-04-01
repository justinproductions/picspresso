"use client";

import { useCallback, useRef, useState } from "react";

interface Props {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  fill?: boolean;
  currentCount?: number;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif", "image/tiff", "image/bmp"];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB per file
const MAX_FILES = 200;

export default function ImageDropzone({ onFiles, disabled, fill, currentCount = 0 }: Props) {
  const [dragging, setDragging] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (raw: FileList | File[]) => {
      const valid = Array.from(raw)
        .filter((f) => ACCEPTED.includes(f.type))
        .filter((f) => f.size <= MAX_FILE_SIZE)
        .slice(0, Math.max(0, MAX_FILES - currentCount));

      if (valid.length > 0) onFiles(valid);
    },
    [onFiles, currentCount]
  );

  const onDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      dragCounter.current += 1;
      if (dragCounter.current === 1) setDragging(true);
    },
    [disabled]
  );

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setDragging(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles]
  );

  return (
    <div
      className={`glass flex flex-col items-center justify-center gap-4 p-10 cursor-pointer transition-all duration-300 select-none
        ${dragging ? "shadow-[0_0_30px_rgba(191,32,30,0.2)]" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-[rgba(255,255,255,0.2)]"}`}
      style={{
        minHeight: 220,
        flex: fill ? "1" : undefined,
        borderColor: dragging ? "rgba(191,32,30,0.6)" : undefined,
      }}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center w-16 h-16 rounded-full transition-all duration-200"
        style={{
          background: dragging ? "rgba(191,32,30,0.25)" : "rgba(191,32,30,0.15)",
          border: `1px solid ${dragging ? "rgba(191,32,30,0.6)" : "rgba(191,32,30,0.3)"}`,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(191,32,30,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>

      <div className="text-center">
        <p className="font-semibold" style={{ color: "var(--heading)", fontSize: 16 }}>
          {dragging ? "Release to upload" : "Drop images here"}
        </p>
        <p className="mt-1" style={{ color: "var(--muted)", fontSize: 13 }}>
          JPG, PNG, GIF, AVIF, TIFF, BMP, WebP
        </p>
        <p className="mt-2" style={{ color: "var(--muted)", fontSize: 11, opacity: 0.55 }}>
          Up to 200 files · 100 MB per file. Everything runs in your browser, no server involved.
        </p>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
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
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
}
