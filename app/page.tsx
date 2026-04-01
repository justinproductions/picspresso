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

  const totalOriginalBytes = items.reduce((sum, i) => sum + (i.originalSize ?? 0), 0);
  const totalConvertedBytes = items.reduce((sum, i) => sum + (i.convertedSize ?? 0), 0);
  const savedBytes = totalOriginalBytes - totalConvertedBytes;
  const savedPct = totalOriginalBytes > 0 ? (savedBytes / totalOriginalBytes) * 100 : 0;

  function fmtMB(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <main className="relative z-10 flex flex-col min-h-screen px-6 py-8" style={{ maxWidth: 960, margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <header className="mb-10 pb-8" style={{ borderBottom: "1px solid var(--border)" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1 }}>
          <span style={{ color: "var(--accent)" }}>pic</span><span style={{ color: "var(--heading)" }}>spresso</span>
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
          Fast browser-based WebP converter
        </p>
        {/* Badges */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {[
            { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "Fast" },
            { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "Secure" },
            { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4", label: "Private" },
            { icon: "M18 20V10M12 20V4M6 20v-6", label: "No uploads" },
          ].map(({ icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: "4px 10px",
                fontSize: 11,
                color: "var(--muted)",
                fontWeight: 500,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={icon} />
              </svg>
              {label}
            </span>
          ))}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Left panel — controls */}
        <aside className="glass p-6 flex flex-col gap-5" style={{ flex: "1 1 0", minWidth: 0 }}>
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

        </aside>

        {/* Right panel — dropzone + grid */}
        <div className="flex flex-col gap-4 min-w-0" style={{ flex: "1 1 0" }}>
          <ImageDropzone onFiles={handleFiles} disabled={converting} fill />

          {/* Stats summary bar — visible once at least one image is done */}
          {doneCount > 0 && (
            <div className="glass-sm px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-2">
              {/* Images converted */}
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span style={{ color: "var(--muted)", fontSize: 12 }}>
                  <span style={{ color: "var(--heading)", fontWeight: 600 }}>{doneCount}</span>
                  {" "}image{doneCount !== 1 ? "s" : ""} converted
                </span>
              </div>

              <div style={{ width: 1, height: 16, background: "var(--border)", flexShrink: 0 }} />

              {/* Size before → after */}
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <span style={{ color: "var(--muted)", fontSize: 12 }}>
                  <span style={{ color: "var(--text)" }}>{fmtMB(totalOriginalBytes)}</span>
                  <span style={{ margin: "0 4px" }}>→</span>
                  <span style={{ color: "var(--heading)", fontWeight: 600 }}>{fmtMB(totalConvertedBytes)}</span>
                </span>
              </div>

              <div style={{ width: 1, height: 16, background: "var(--border)", flexShrink: 0 }} />

              {/* Savings */}
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={savedBytes >= 0 ? "#4ade80" : "#f87171"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points={savedBytes >= 0 ? "23 6 13.5 15.5 8.5 10.5 1 18" : "1 6 10.5 15.5 15.5 10.5 23 18"} />
                  <polyline points={savedBytes >= 0 ? "17 6 23 6 23 12" : "17 18 23 18 23 12"} />
                </svg>
                <span style={{ fontSize: 12 }}>
                  <span style={{ color: savedBytes >= 0 ? "#4ade80" : "#f87171", fontWeight: 700 }}>
                    {savedBytes >= 0 ? "-" : "+"}{Math.abs(savedPct).toFixed(1)}%
                  </span>
                  <span style={{ color: "var(--muted)", marginLeft: 4 }}>
                    ({savedBytes >= 0 ? "saved" : "grew"} {fmtMB(Math.abs(savedBytes))})
                  </span>
                </span>
              </div>
            </div>
          )}

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

      {/* How it works — SEO content, below the fold */}
      <section className="mt-16 mb-8" style={{ margin: "64px 0 32px" }}>
        <div style={{ height: 1, background: "var(--border)", marginBottom: 40 }} />

        <h2 style={{ color: "var(--heading)", fontSize: 20, fontWeight: 600, marginBottom: 24 }}>
          How Picspresso works
        </h2>

        <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div style={{
                background: "rgba(191,32,30,0.15)",
                border: "1px solid rgba(191,32,30,0.3)",
                borderRadius: 10,
                width: 36, height: 36,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <h3 style={{ color: "var(--heading)", fontSize: 14, fontWeight: 600 }}>Drop your images</h3>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7 }}>
              Drag and drop JPG, PNG, GIF, AVIF, TIFF, or BMP files directly onto the converter — or click to select them in bulk. There is no file size limit because nothing is being uploaded anywhere.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div style={{
                background: "rgba(191,32,30,0.15)",
                border: "1px solid rgba(191,32,30,0.3)",
                borderRadius: 10,
                width: 36, height: 36,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <h3 style={{ color: "var(--heading)", fontSize: 14, fontWeight: 600 }}>Set resize & quality</h3>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7 }}>
              Set a target width and height — the aspect ratio locks automatically so your images never stretch. Then use the quality slider to balance file size against visual fidelity. 82 is a good starting point for web use.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div style={{
                background: "rgba(191,32,30,0.15)",
                border: "1px solid rgba(191,32,30,0.3)",
                borderRadius: 10,
                width: 36, height: 36,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 style={{ color: "var(--heading)", fontSize: 14, fontWeight: 600 }}>Converted in your browser</h3>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7 }}>
              Conversion happens entirely on your device using the browser&apos;s built-in Canvas API. Your images are drawn onto an invisible canvas, encoded to WebP natively, then handed to your downloads folder — all without a single network request. Open the DevTools Network tab and watch: nothing is sent.
            </p>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--border)", margin: "40px 0 32px" }} />

        <div className="flex flex-col gap-3">
          <h2 style={{ color: "var(--heading)", fontSize: 20, fontWeight: 600 }}>
            Why WebP — and why not the other converters
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.8, maxWidth: 720 }}>
            WebP images are typically 25–35% smaller than equivalent JPEGs and up to 80% smaller than PNGs at similar visual quality. For websites, that means faster load times, lower bandwidth costs, and better Core Web Vitals scores. Most modern browsers have supported WebP natively since 2020.
          </p>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.8, maxWidth: 720 }}>
            Tools like Convertio and CloudConvert upload your files to their servers to process them. That means your images — personal, professional, or confidential — pass through infrastructure you don&apos;t control. Picspresso converts JPG to WebP, PNG to WebP, and more without ever touching a server. It is faster, private by design, and works on files of any size.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", marginTop: 16, paddingTop: 28, paddingBottom: 32 }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span style={{ color: "var(--heading)", fontWeight: 600, fontSize: 15 }}>
              <span style={{ color: "var(--accent)" }}>pic</span>spresso
            </span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span style={{ color: "var(--muted)", fontSize: 12 }}>Free browser-based WebP converter</span>
          </div>

          {/* Privacy badge */}
          <div className="flex items-center gap-2" style={{ color: "var(--muted)", fontSize: 12 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Images never leave your browser
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/justinproductions/picspresso"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--muted)", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}
              className="hover:text-white transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
            <a
              href="https://justin.productions/en"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--muted)", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}
              className="hover:text-white transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              justin.productions
            </a>
          </div>
        </div>

        <p style={{ color: "var(--muted)", fontSize: 11, marginTop: 20, opacity: 0.5, textAlign: "center" }}>
          © {new Date().getFullYear()} justin.productions · MIT License
        </p>
      </footer>
    </main>
  );
}
