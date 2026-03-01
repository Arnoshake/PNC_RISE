"use client";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(c1: [number, number, number], c2: [number, number, number], t: number): string {
  return `rgb(${Math.round(lerp(c1[0], c2[0], t))},${Math.round(lerp(c1[1], c2[1], t))},${Math.round(lerp(c1[2], c2[2], t))})`;
}

const SKY_STOPS: { t: number; top: [number, number, number]; bot: [number, number, number] }[] = [
  { t: 0.0, top: [13, 27, 42], bot: [26, 39, 68] },
  { t: 0.25, top: [26, 26, 78], bot: [61, 43, 110] },
  { t: 0.5, top: [201, 75, 75], bot: [75, 19, 79] },
  { t: 0.75, top: [247, 148, 29], bot: [255, 215, 0] },
  { t: 1.0, top: [135, 206, 235], bot: [240, 165, 0] },
];

function getSkyColors(phase: number) {
  const p = Math.max(0, Math.min(1, phase));
  let i = 0;
  for (let k = 0; k < SKY_STOPS.length - 1; k++) {
    if (p >= SKY_STOPS[k].t) i = k;
  }
  const s1 = SKY_STOPS[i];
  const s2 = SKY_STOPS[Math.min(i + 1, SKY_STOPS.length - 1)];
  const range = s2.t - s1.t || 1;
  const local = (p - s1.t) / range;
  return {
    top: lerpColor(s1.top, s2.top, local),
    bot: lerpColor(s1.bot, s2.bot, local),
  };
}

interface SunRisingProps {
  phase: number;
  width?: number;
  height?: number;
}

const STAR_POSITIONS = [
  { cx: 30, cy: 18 }, { cx: 85, cy: 10 }, { cx: 150, cy: 22 },
  { cx: 170, cy: 45 }, { cx: 50, cy: 50 }, { cx: 120, cy: 35 },
];

export default function SunRising({ phase, width = 200, height = 120 }: Readonly<SunRisingProps>) {
  const p = Math.max(0, Math.min(1, phase));
  const sky = getSkyColors(p);

  const moonOpacity = Math.max(0, 1 - p * 3.3);
  const moonX = lerp(40, 20, p);
  const moonY = lerp(30, 60, p);

  const sunVisible = p > 0.2;
  const sunPhase = Math.max(0, (p - 0.2) / 0.8);
  const sunX = lerp(140, 120, sunPhase);
  const sunY = lerp(95, 20, sunPhase);
  const sunR = lerp(10, 16, sunPhase);
  const sunOpacity = Math.min(1, sunPhase * 2);
  const sunColor = lerpColor([249, 115, 22], [255, 215, 0], sunPhase);

  const rayOpacity = p > 0.4 ? Math.min(1, (p - 0.4) / 0.4) : 0;
  const rayLen = lerp(8, 18, sunPhase);

  const starOpacity = Math.max(0, 1 - p * 3);

  const horizonGlowOpacity = p > 0.3 ? Math.min(0.6, (p - 0.3) * 1.5) : 0;

  const uid = `sr-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg width={width} height={height} viewBox="0 0 200 120" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky.top} />
          <stop offset="100%" stopColor={sky.bot} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="#F7941D" stopOpacity={horizonGlowOpacity} />
          <stop offset="100%" stopColor="#F7941D" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="200" height="90" fill={`url(#${uid}-sky)`} />

      {/* Horizon glow */}
      <ellipse cx={sunX} cy={90} rx={60} ry={30} fill={`url(#${uid}-glow)`} />

      {/* Ground */}
      <rect x="0" y="90" width="200" height="30" fill="#0a1a0a" />
      <line x1="0" y1="90" x2="200" y2="90" stroke="#1a3a1a" strokeWidth="1.5" />

      {/* Stars */}
      {STAR_POSITIONS.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={1.2} fill="white" opacity={starOpacity} />
      ))}

      {/* Moon */}
      {moonOpacity > 0 && (
        <circle cx={moonX} cy={moonY} r={12} fill="#E8E8E8" opacity={moonOpacity} />
      )}

      {/* Sun */}
      {sunVisible && (
        <g opacity={sunOpacity}>
          {/* Rays */}
          {rayOpacity > 0 && Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x1 = sunX + Math.cos(angle) * (sunR + 3);
            const y1 = sunY + Math.sin(angle) * (sunR + 3);
            const x2 = sunX + Math.cos(angle) * (sunR + 3 + rayLen);
            const y2 = sunY + Math.sin(angle) * (sunR + 3 + rayLen);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={sunColor} strokeWidth={1.5} strokeLinecap="round"
                opacity={rayOpacity}
              />
            );
          })}
          <circle cx={sunX} cy={sunY} r={sunR} fill={sunColor} />
        </g>
      )}
    </svg>
  );
}
