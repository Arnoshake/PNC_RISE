"use client";

interface SunIconProps {
  phase: number;
  size?: number;
  showArc?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

export default function SunIcon({
  phase: rawPhase,
  size = 48,
  showArc = false,
  className,
  style,
}: Readonly<SunIconProps>) {
  const p = Math.max(0, Math.min(1, rawPhase));

  const moonOpacity = p < 0.2 ? 1 : p < 0.45 ? 1 - (p - 0.2) / 0.25 : 0;
  const sunOpacity = p < 0.2 ? 0 : p < 0.45 ? (p - 0.2) / 0.25 : 1;
  const sunCY = p < 0.45 ? 52 : 52 - ((p - 0.45) / 0.55) * 30;
  const sunColor = p < 0.45 ? "#F97316" : p < 0.75 ? "#F7941D" : "#FFB81C";
  const rayOpacity = p < 0.45 ? 0 : Math.min((p - 0.45) / 0.3, 1);
  const rayCount = p > 0.7 ? 8 : 4;
  const rayLen = 4 + p * 8;
  const glowOpacity = p > 0.7 ? (p - 0.7) / 0.3 : 0;
  const sunR = 10;
  const sunCX = 24;

  const rays = [];
  for (let i = 0; i < rayCount; i++) {
    const angle = (360 / rayCount) * i;
    rays.push(
      <line
        key={i}
        x1={sunCX}
        y1={sunCY - sunR - 2}
        x2={sunCX}
        y2={sunCY - sunR - rayLen}
        stroke={sunColor}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={rayOpacity}
        transform={`rotate(${angle} ${sunCX} ${sunCY})`}
        style={{ transition: "all 0.5s ease" }}
      />
    );
  }

  const uid = `si-${Math.random().toString(36).slice(2, 8)}`;

  const arcW = size * 2.5;
  const arcH = size * 0.6;
  const arcR = arcW * 0.38;
  const arcCx = arcW / 2;
  const arcCy = arcH * 0.9;
  const arcCircumference = Math.PI * arcR;
  const arcDashOffset = arcCircumference * (1 - p);

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        style={{ transition: "all 0.5s ease", overflow: "visible" }}
      >
        {/* Glow */}
        {glowOpacity > 0 && (
          <circle
            cx={sunCX}
            cy={sunCY}
            r={sunR + 6}
            fill={sunColor}
            opacity={glowOpacity * 0.3}
            style={{ transition: "all 0.5s ease" }}
          />
        )}

        {/* Sun circle */}
        <circle
          cx={sunCX}
          cy={sunCY}
          r={sunR}
          fill={sunColor}
          opacity={sunOpacity}
          style={{ transition: "all 0.5s ease" }}
        />

        {/* Rays */}
        {rays}

        {/* Moon crescent */}
        <circle
          cx={24}
          cy={20}
          r={10}
          fill="#94A3B8"
          opacity={moonOpacity}
          style={{ transition: "all 0.5s ease" }}
        />
        <circle
          cx={28}
          cy={18}
          r={9}
          fill="#E8F0F8"
          opacity={moonOpacity}
          style={{ transition: "all 0.5s ease" }}
        />
      </svg>

      {showArc && (
        <svg
          width={arcW}
          height={arcH}
          viewBox={`0 0 ${arcW} ${arcH}`}
          style={{ marginTop: -4 }}
        >
          <defs>
            <linearGradient id={`${uid}-g`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={p < 0.5 ? "#002855" : "#F7941D"} />
              <stop offset="100%" stopColor={p < 0.5 ? "#F7941D" : "#FFB81C"} />
            </linearGradient>
          </defs>
          <path
            d={`M ${arcCx - arcR} ${arcCy} A ${arcR} ${arcR} 0 0 1 ${arcCx + arcR} ${arcCy}`}
            fill="none"
            stroke="rgba(0,40,85,0.12)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <path
            d={`M ${arcCx - arcR} ${arcCy} A ${arcR} ${arcR} 0 0 1 ${arcCx + arcR} ${arcCy}`}
            fill="none"
            stroke={`url(#${uid}-g)`}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={arcCircumference}
            strokeDashoffset={arcDashOffset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
      )}
    </div>
  );
}
