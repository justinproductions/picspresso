"use client";

import { useCallback, useState } from "react";
import ImageDropzone from "@/components/ImageDropzone";
import ImageCard, { type ImageItem } from "@/components/ImageCard";
import ResizeControls from "@/components/ResizeControls";
import QualitySlider from "@/components/QualitySlider";
import { convertToWebP, getOutputFileName } from "@/lib/converter";
import { getImageDimensions } from "@/lib/resize";
import { downloadSingle, downloadZip } from "@/lib/zip";
import type { Dimensions } from "@/lib/resize";

let idCounter = 0;
function nextId() {
  return String(++idCounter);
}

export default function Home() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState(82);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [locked, setLocked] = useState(true);
  const [firstOriginal, setFirstOriginal] = useState<Dimensions | null>(null);
  const [converting, setConverting] = useState(false);

  const handleFiles = useCallback(
    async (files: File[]) => {
      const newItems: ImageItem[] = files.map((file) => ({
        id: nextId(),
        file,
        preview: URL.createObjectURL(file),
        status: "idle",
      }));
      setItems((prev) => [...prev, ...newItems]);

      // Set dimensions from first image added (if no images yet)
      if (items.length === 0 && files.length > 0) {
        try {
          const dims = await getImageDimensions(files[0]);
          setFirstOriginal(dims);
          setWidth(dims.width);
          setHeight(dims.height);
        } catch {
          // non-critical
        }
      }
    },
    [items.length]
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const downloadItem = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.resultBlob && item.resultName) {
        downloadSingle(item.resultBlob, item.resultName);
      }
      return prev;
    });
  }, []);

  const convertAll = useCallback(async () => {
    if (items.length === 0 || converting) return;
    setConverting(true);

    const idleIds = items.filter((i) => i.status !== "done").map((i) => i.id);

    // Mark all as converting
    setItems((prev) =>
      prev.map((i) =>
        idleIds.includes(i.id) ? { ...i, status: "converting" as const } : i
      )
    );

    for (const id of idleIds) {
      const item = items.find((i) => i.id === id);
      if (!item) continue;

      try {
        const result = await convertToWebP(item.file, { quality, width, height });
        const resultName = getOutputFileName(item.file.name);
        setItems((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: "done" as const,
                  resultBlob: result.blob,
                  resultName,
                  resultWidth: result.width,
                  resultHeight: result.height,
                  originalSize: result.originalSize,
                  convertedSize: result.convertedSize,
                }
              : i
          )
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: "error" as const,
                  error: err instanceof Error ? err.message : "Conversion failed",
                }
              : i
          )
        );
      }
    }

    setConverting(false);
  }, [items, converting, quality, width, height]);

  const downloadAll = useCallback(async () => {
    const done = items.filter((i) => i.status === "done" && i.resultBlob && i.resultName);
    if (done.length === 0) return;
    if (done.length === 1 && done[0].resultBlob && done[0].resultName) {
      downloadSingle(done[0].resultBlob, done[0].resultName);
      return;
    }
    await downloadZip(
      done.map((i) => ({ name: i.resultName!, blob: i.resultBlob! }))
    );
  }, [items]);

  const clearAll = useCallback(() => {
    items.forEach((i) => URL.revokeObjectURL(i.preview));
    setItems([]);
    setFirstOriginal(null);
  }, [items]);

  const doneCount = items.filter((i) => i.status === "done").length;
  const totalCount = items.length;

  return (
    <main className="relative z-10 flex flex-col min-h-screen px-6 py-8" style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1
            style={{
              color: "var(--heading)",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.5px",
            }}
          >
            <span style={{ color: "var(--accent)" }}>pic</span>spresso
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>
            Fast browser-based WebP converter
          </p>
        </div>
        <a
          href="https://justin.productions/en"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--muted)", fontSize: 12, textDecoration: "none" }}
          className="hover:text-white transition-colors"
        >
          by justin.productions
        </a>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* Left panel — controls */}
        <aside className="glass p-6 flex flex-col gap-6" style={{ flex: "1 1 0", minWidth: 0, minHeight: 0 }}>
          <ResizeControls
            width={width}
            height={height}
            locked={locked}
            original={firstOriginal}
            onChange={({ width: w, height: h }) => {
              setWidth(w);
              setHeight(h);
            }}
            onLockToggle={() => setLocked((l) => !l)}
          />

          <div style={{ height: 1, background: "var(--border)" }} />

          <QualitySlider value={quality} onChange={setQuality} />

          <div style={{ height: 1, background: "var(--border)" }} />

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              className="btn-accent w-full justify-center"
              onClick={convertAll}
              disabled={totalCount === 0 || converting}
            >
              {converting ? (
                <>
                  <div className="w-3 h-3 border border-t-transparent rounded-full animate-spin" style={{ borderColor: "currentColor", borderTopColor: "transparent" }} />
                  Converting…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                  Convert {totalCount > 0 ? `(${totalCount})` : ""}
                </>
              )}
            </button>

            {doneCount > 0 && (
              <button className="btn-ghost w-full justify-center" onClick={downloadAll}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download all ({doneCount})
              </button>
            )}

            {totalCount > 0 && (
              <button className="btn-ghost w-full justify-center" style={{ fontSize: 12 }} onClick={clearAll}>
                Clear all
              </button>
            )}
          </div>

          {/* Stats */}
          {totalCount > 0 && (
            <div className="glass-sm p-3 flex items-center justify-between">
              <span style={{ color: "var(--muted)", fontSize: 12 }}>Progress</span>
              <span style={{ fontSize: 12, color: "var(--text)" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>{doneCount}</span>
                {" / "}
                {totalCount}
              </span>
            </div>
          )}

          {/* Spacer pushes how-to + footer to bottom */}
          <div style={{ flex: 1 }} />

          {/* How to use */}
          <div style={{ height: 1, background: "var(--border)" }} />
          <div className="flex flex-col gap-2">
            <span style={{ color: "var(--heading)", fontSize: 13, fontWeight: 600 }}>How to use</span>
            {[
              { n: "1", text: "Drop images or select a folder" },
              { n: "2", text: "Set dimensions & quality" },
              { n: "3", text: "Click Convert" },
              { n: "4", text: "Download single or all as ZIP" },
            ].map(({ n, text }) => (
              <div key={n} className="flex items-start gap-2">
                <span
                  style={{
                    background: "rgba(191,32,30,0.15)",
                    border: "1px solid rgba(191,32,30,0.3)",
                    borderRadius: 6,
                    color: "var(--accent)",
                    fontSize: 10,
                    fontWeight: 700,
                    width: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {n}
                </span>
                <span style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ height: 1, background: "var(--border)" }} />
          <a
            href="https://justin.productions/en"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--muted)",
              fontSize: 11,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "color 0.2s ease",
            }}
            className="hover:text-white"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            justin.productions
          </a>
        </aside>

        {/* Right panel — dropzone + grid */}
        <div className="flex flex-col gap-6 min-w-0" style={{ flex: "1 1 0" }}>
          <ImageDropzone onFiles={handleFiles} disabled={converting} />

          {items.length > 0 && (
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
            >
              {items.map((item) => (
                <ImageCard
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  onDownload={downloadItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
