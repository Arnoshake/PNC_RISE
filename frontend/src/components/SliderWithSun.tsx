"use client";

import SunIcon from "@/components/SunIcon";

interface SliderWithSunProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  leftLabel?: string;
  rightLabel?: string;
}

const TRACK_HEIGHT = 6;
const THUMB_SIZE = 32;
const WRAPPER_HEIGHT = THUMB_SIZE;

export default function SliderWithSun({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  leftLabel,
  rightLabel,
}: Readonly<SliderWithSunProps>) {
  const range = max - min;
  const pct = range > 0 ? ((value - min) / range) * 100 : 0;
  const phase = range > 0 ? (value - min) / range : 0;

  return (
    <div>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: WRAPPER_HEIGHT,
          overflow: "visible",
        }}
      >
        {/* Track background */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: (WRAPPER_HEIGHT - TRACK_HEIGHT) / 2,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
            background: "#E2E8F0",
            pointerEvents: "none",
          }}
        />
        {/* Track fill */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: `${pct}%`,
            top: (WRAPPER_HEIGHT - TRACK_HEIGHT) / 2,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
            background: "linear-gradient(to right, #0069AA, #F7941D)",
            pointerEvents: "none",
          }}
        />
        {/* Native input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number.parseFloat(e.target.value))}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
            zIndex: 10,
            margin: 0,
            padding: 0,
            boxSizing: "border-box",
          }}
        />
        {/* SunIcon thumb */}
        <div
          style={{
            position: "absolute",
            left: `calc(${pct}% - ${THUMB_SIZE / 2}px)`,
            top: (WRAPPER_HEIGHT - THUMB_SIZE) / 2,
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          <SunIcon phase={phase} size={THUMB_SIZE} showArc={false} />
        </div>
      </div>
      {(leftLabel || rightLabel) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>{leftLabel}</span>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}
