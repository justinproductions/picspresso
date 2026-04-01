"use client";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

function qualityLabel(q: number): string {
  if (q >= 90) return "Lossless";
  if (q >= 75) return "High";
  if (q >= 50) return "Medium";
  if (q >= 25) return "Low";
  return "Minimal";
}

export default function QualitySlider({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span style={{ color: "var(--heading)", fontSize: 14, fontWeight: 500 }}>Quality</span>
        <div className="flex items-center gap-2">
          <span style={{ color: "var(--muted)", fontSize: 12 }}>{qualityLabel(value)}</span>
          <input
            type="number"
            min={0}
            max={100}
            value={value}
            onChange={(e) => {
              const n = Math.min(100, Math.max(0, Number(e.target.value) || 0));
              onChange(n);
            }}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              width: 48,
              padding: "2px 6px",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--accent)",
              textAlign: "center",
              outline: "none",
              fontFamily: "inherit",
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between" style={{ color: "var(--muted)", fontSize: 11 }}>
        <span>Smallest</span>
        <span>Best quality</span>
      </div>
    </div>
  );
}
