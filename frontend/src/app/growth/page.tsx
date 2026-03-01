"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useCountUp } from "@/hooks/useCountUp";
import SunIcon from "@/components/SunIcon";
import SliderWithSun from "@/components/SliderWithSun";

type GrowthEntry = { year: number; label: string; bal: number };
type GoalData = {
  before: GrowthEntry[];
  withRise: GrowthEntry[];
  projectedRetirement: number;
  monthlyContribution: number;
};

const GROWTH_DATA: Record<string, GoalData> = {
  IRA: {
    before: [
      { year: 0, label: "2025", bal: 1000 },
      { year: 1, label: "2026", bal: 1090 },
      { year: 2, label: "2027", bal: 1188 },
      { year: 5, label: "2030", bal: 1539 },
      { year: 10, label: "2035", bal: 2367 },
      { year: 20, label: "2045", bal: 5604 },
      { year: 30, label: "2055", bal: 13268 },
      { year: 40, label: "2065", bal: 31409 },
      { year: 50, label: "2075", bal: 74358 },
    ],
    withRise: [
      { year: 0, label: "2025", bal: 1000 },
      { year: 1, label: "2026", bal: 1280 },
      { year: 2, label: "2027", bal: 1638 },
      { year: 5, label: "2030", bal: 3713 },
      { year: 10, label: "2035", bal: 13800 },
      { year: 20, label: "2045", bal: 190000 },
      { year: 30, label: "2055", bal: 890000 },
      { year: 40, label: "2065", bal: 2400000 },
      { year: 50, label: "2075", bal: 5800000 },
    ],
    projectedRetirement: 890000,
    monthlyContribution: 89.4,
  },
  HSA: {
    before: [
      { year: 0, label: "2025", bal: 500 }, { year: 1, label: "2026", bal: 540 }, { year: 5, label: "2030", bal: 680 },
      { year: 10, label: "2035", bal: 920 }, { year: 20, label: "2045", bal: 1690 }, { year: 30, label: "2055", bal: 3100 },
      { year: 40, label: "2065", bal: 5700 }, { year: 50, label: "2075", bal: 10400 },
    ],
    withRise: [
      { year: 0, label: "2025", bal: 500 }, { year: 1, label: "2026", bal: 700 }, { year: 5, label: "2030", bal: 2100 },
      { year: 10, label: "2035", bal: 8200 }, { year: 20, label: "2045", bal: 95000 }, { year: 30, label: "2055", bal: 420000 },
      { year: 40, label: "2065", bal: 1100000 }, { year: 50, label: "2075", bal: 2600000 },
    ],
    projectedRetirement: 420000,
    monthlyContribution: 45.2,
  },
  Savings: {
    before: [
      { year: 0, label: "2025", bal: 2000 }, { year: 1, label: "2026", bal: 2160 }, { year: 5, label: "2030", bal: 2938 },
      { year: 10, label: "2035", bal: 4318 }, { year: 20, label: "2045", bal: 9318 }, { year: 30, label: "2055", bal: 20124 },
      { year: 40, label: "2065", bal: 43449 }, { year: 50, label: "2075", bal: 93791 },
    ],
    withRise: [
      { year: 0, label: "2025", bal: 2000 }, { year: 1, label: "2026", bal: 2900 }, { year: 5, label: "2030", bal: 9100 },
      { year: 10, label: "2035", bal: 32000 }, { year: 20, label: "2045", bal: 390000 }, { year: 30, label: "2055", bal: 1800000 },
      { year: 40, label: "2065", bal: 5200000 }, { year: 50, label: "2075", bal: 14000000 },
    ],
    projectedRetirement: 1800000,
    monthlyContribution: 112,
  },
  "Emergency Fund": {
    before: [
      { year: 0, label: "2025", bal: 500 }, { year: 1, label: "2026", bal: 560 }, { year: 5, label: "2030", bal: 780 },
      { year: 10, label: "2035", bal: 1090 }, { year: 20, label: "2045", bal: 2120 }, { year: 30, label: "2055", bal: 4120 },
      { year: 40, label: "2065", bal: 8010 }, { year: 50, label: "2075", bal: 15580 },
    ],
    withRise: [
      { year: 0, label: "2025", bal: 500 }, { year: 1, label: "2026", bal: 900 }, { year: 5, label: "2030", bal: 4200 },
      { year: 10, label: "2035", bal: 18000 }, { year: 20, label: "2045", bal: 160000 }, { year: 30, label: "2055", bal: 720000 },
      { year: 40, label: "2065", bal: 1900000 }, { year: 50, label: "2075", bal: 4800000 },
    ],
    projectedRetirement: 720000,
    monthlyContribution: 67.4,
  },
};

const GOAL_TYPES = Object.keys(GROWTH_DATA);
const TODAY_YEAR = 0.5;

function fmtY(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
  return `$${v}`;
}

type CombinedRow = { year: number; pastBefore: number | null; futureBefore: number | null; pastWith: number | null; futureWith: number | null };

function buildCombined(before: GrowthEntry[], withRise: GrowthEntry[], maxYear: number): CombinedRow[] {
  const yrs = new Set<number>();
  for (const e of before) if (e.year <= maxYear) yrs.add(e.year);
  for (const e of withRise) if (e.year <= maxYear) yrs.add(e.year);
  yrs.add(TODAY_YEAR);
  const sorted = Array.from(yrs).sort((a, b) => a - b);

  function interp(data: GrowthEntry[], yr: number): number | null {
    if (yr > maxYear) return null;
    const exact = data.find((d) => d.year === yr);
    if (exact) return exact.bal;
    let lo = data[0];
    let hi = data.at(-1)!;
    for (const d of data) {
      if (d.year <= yr) lo = d;
      if (d.year >= yr && d.year < hi.year) { hi = d; break; }
    }
    if (lo.year === hi.year) return lo.bal;
    const t = (yr - lo.year) / (hi.year - lo.year);
    return Math.round(lo.bal + t * (hi.bal - lo.bal));
  }

  return sorted.map((yr) => {
    const bv = interp(before, yr);
    const wv = interp(withRise, yr);
    return {
      year: yr,
      pastBefore: yr <= TODAY_YEAR ? bv : null,
      futureBefore: yr >= TODAY_YEAR ? bv : null,
      pastWith: yr <= TODAY_YEAR ? wv : null,
      futureWith: yr >= TODAY_YEAR ? wv : null,
    };
  });
}

function ChartSectionInner({
  before, withRise, maxYear,
}: Readonly<{ before: GrowthEntry[]; withRise: GrowthEntry[]; maxYear: number }>) {
  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } = require("recharts");
  const data = useMemo(() => buildCombined(before, withRise, maxYear), [before, withRise, maxYear]);
  const sharedYMax = useMemo(() => {
    const allBals = data.flatMap((d: CombinedRow) => [d.pastBefore, d.futureBefore, d.pastWith, d.futureWith].filter((v): v is number => v !== null));
    return allBals.length > 0 ? Math.max(...allBals) * 1.1 : 100;
  }, [data]);
  const startBal = withRise[0]?.bal ?? 0;
  const currentBal = (() => {
    const row = data.find((d: CombinedRow) => d.year === TODAY_YEAR);
    return row?.pastWith ?? startBal;
  })();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, position: "relative", alignItems: "stretch" }}>
      <div className="glass" style={{ flex: "1 1 280px", padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#002855", margin: "0 0 4px" }}>Without RISE</h3>
        <p style={{ fontSize: 13, color: "#3387BB", margin: "0 0 2px", fontWeight: 600 }}>↑ Gradual growth without plan</p>
        <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 14px" }}>Cumulative savings balance over time</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,40,85,0.08)" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#4A6FA5" }} axisLine={false} tickLine={false} tickFormatter={(yr: number) => yr === 0 ? "Start" : `Yr ${yr}`} />
            <YAxis tick={{ fontSize: 11, fill: "#4A6FA5" }} axisLine={false} tickLine={false} tickFormatter={fmtY} domain={[0, sharedYMax]} />
            <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Balance"]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
            <Line type="monotone" dataKey="pastBefore" stroke="#3387BB" strokeWidth={3} dot={false} connectNulls={false} />
            <Line type="monotone" dataKey="futureBefore" stroke="#3387BB" strokeWidth={2} strokeDasharray="8 5" strokeOpacity={0.65} dot={false} connectNulls={false} />
            <ReferenceDot x={0} y={before[0]?.bal ?? 0} r={6} fill="#002855" stroke="#fff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 48, height: 48, borderRadius: "50%", background: "#002855", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, zIndex: 10, boxShadow: "0 4px 16px rgba(0,40,85,0.3)" }}>VS</div>
      <div className="glass" style={{ flex: "1 1 280px", padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#002855", margin: "0 0 4px" }}>Your Journey with RISE</h3>
        <p style={{ fontSize: 13, color: "#27ae60", margin: "0 0 2px", fontWeight: 600 }}>↑ Dramatically steeper growth</p>
        <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 14px" }}>Cumulative savings balance over time</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,40,85,0.08)" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#4A6FA5" }} axisLine={false} tickLine={false} tickFormatter={(yr: number) => yr === 0 ? "Start" : `Yr ${yr}`} />
            <YAxis tick={{ fontSize: 11, fill: "#4A6FA5" }} axisLine={false} tickLine={false} tickFormatter={fmtY} domain={[0, sharedYMax]} />
            <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Balance"]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
            <Line type="monotone" dataKey="pastWith" stroke="#F7941D" strokeWidth={3} dot={false} connectNulls={false} />
            <Line type="monotone" dataKey="futureWith" stroke="#F7941D" strokeWidth={2} strokeDasharray="8 5" strokeOpacity={0.75} dot={false} connectNulls={false} />
            <ReferenceDot x={0} y={startBal} r={6} fill="#002855" stroke="#fff" strokeWidth={2} />
            <ReferenceDot x={TODAY_YEAR} y={currentBal} r={8} fill="#F7941D" stroke="#fff" strokeWidth={2} label={{ value: "You are here", position: "top", fill: "#F7941D", fontSize: 11, fontWeight: 700, offset: 12 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const ChartSection = dynamic(() => Promise.resolve(ChartSectionInner), { ssr: false });

/* ---------- Discretionary spending data for recommendations ---------- */
const ITEMIZED_MONTH = [
  { vendor: "Chipotle", category: "Eating Out", amount: 14.75 },
  { vendor: "Starbucks", category: "Eating Out", amount: 24.75 },
  { vendor: "Taco Bell", category: "Eating Out", amount: 18.45 },
  { vendor: "Taco Bell", category: "Eating Out", amount: 12.30 },
  { vendor: "Uber Eats", category: "Eating Out", amount: 38.50 },
  { vendor: "Chipotle", category: "Eating Out", amount: 16.75 },
  { vendor: "H&M", category: "Clothes", amount: 89.99 },
  { vendor: "Anthropologie", category: "Clothes", amount: 200.00 },
  { vendor: "Nike", category: "Clothes", amount: 130.00 },
  { vendor: "Netflix", category: "Entertainment", amount: 15.99 },
  { vendor: "Spotify", category: "Entertainment", amount: 10.00 },
  { vendor: "AMC Theaters", category: "Entertainment", amount: 28.50 },
];

const DISCRETIONARY_CATEGORIES = ["Eating Out", "Entertainment", "Clothes"];

function calcFutureValue(monthly: number, rate: number, yrs: number, _start: number) {
  const r = rate / 12;
  const n = yrs * 12;
  if (r === 0) return Math.round(monthly * n);
  return Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
}

function calcLumpSum(principal: number, annualRate: number, years: number) {
  return Math.round(principal * Math.pow(1 + annualRate, years));
}

const VENDOR_MAP: Record<string, { total: number; category: string }> = {};
for (const p of ITEMIZED_MONTH) {
  if (!DISCRETIONARY_CATEGORIES.includes(p.category)) continue;
  if (!VENDOR_MAP[p.vendor]) VENDOR_MAP[p.vendor] = { total: 0, category: p.category };
  VENDOR_MAP[p.vendor].total += p.amount;
}
const VENDOR_ENTRIES = Object.entries(VENDOR_MAP)
  .sort(([, a], [, b]) => b.total - a.total)
  .slice(0, 3)
  .map(([vendor, { total, category }]) => ({
    vendor,
    category,
    monthly: Math.round(total * 100) / 100,
  }));

function buildCategoryRecos() {
  const map: Record<string, number> = {};
  for (const p of ITEMIZED_MONTH) {
    if (!DISCRETIONARY_CATEGORIES.includes(p.category)) continue;
    map[p.category] = (map[p.category] ?? 0) + p.amount;
  }
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .map(([category, total]) => {
      const saving = Math.round(total * 0.20 * 100) / 100;
      return {
        category,
        total: Math.round(total * 100) / 100,
        saving,
        impact10: calcFutureValue(saving, 0.09, 10, 0),
        impact30: calcFutureValue(saving, 0.09, 30, 0),
      };
    });
}

const CATEGORY_RECOS = buildCategoryRecos();

/* ---------- What-If combined chart ---------- */
function compoundGrowth(startBal: number, monthly: number, rate: number, yrs: number) {
  const r = rate / 12;
  let bal = startBal;
  const out: { year: number; bal: number }[] = [{ year: 0, bal: Math.round(bal) }];
  for (let y = 1; y <= yrs; y++) {
    for (let m = 0; m < 12; m++) bal = (bal + monthly) * (1 + r);
    out.push({ year: y, bal: Math.round(bal) });
  }
  return out;
}

function interpAt(data: GrowthEntry[], yr: number): number {
  const exact = data.find((d) => d.year === yr);
  if (exact) return exact.bal;
  let lo = data[0];
  let hi = data.at(-1)!;
  for (const d of data) {
    if (d.year <= yr) lo = d;
    if (d.year >= yr && d.year < hi.year) { hi = d; break; }
  }
  if (lo.year === hi.year) return lo.bal;
  const t = (yr - lo.year) / (hi.year - lo.year);
  return Math.round(lo.bal + t * (hi.bal - lo.bal));
}

function WhatIfChartInner({
  combinedData, startBal,
}: Readonly<{ combinedData: { year: number; current: number | null; whatIf: number | null }[]; startBal: number }>) {
  const { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot, Legend } = require("recharts");

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <defs>
          <linearGradient id="whatIfShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F7941D" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#F7941D" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis dataKey="year" tickFormatter={(v: number) => v === 0 ? "Start" : `Yr ${v}`} tick={{ fontSize: 11, fill: "#4A6FA5" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmtY} tick={{ fontSize: 11, fill: "#4A6FA5" }} axisLine={false} tickLine={false} domain={[0, "auto"]} />
        <Tooltip
          content={({ active, payload, label }: { active?: boolean; payload?: readonly { name?: string; value?: number; color?: string; dataKey?: string }[]; label?: number }) => {
            if (!active || !payload) return null;
            const unique = [...payload].filter((p, i, arr) => p.dataKey !== undefined && arr.findIndex((q) => q.dataKey === p.dataKey) === i).filter((p) => p.dataKey === "current" || (p.dataKey === "whatIf" && p.name === "whatIf"));
            const deduped = unique.length > 2 ? unique.slice(0, 2) : unique;
            return (
              <div style={{ background: "#001A3A", borderRadius: 10, padding: "12px 16px", border: "1px solid rgba(247,148,29,0.3)" }}>
                <div style={{ color: "#F7CEA9", fontSize: 12, marginBottom: 8 }}>Year {label}</div>
                {deduped.map((entry) => (
                  <div key={String(entry.dataKey)} style={{ color: "#fff", fontSize: 13, marginBottom: 4, display: "flex", justifyContent: "space-between", gap: 24 }}>
                    <span style={{ color: entry.color }}>{entry.dataKey === "current" ? "Current Projection" : "What-If Projection"}</span>
                    <span>${Number(entry.value ?? 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            );
          }}
        />
        <Legend formatter={(value: string) => value === "current" ? "Current Projection" : "What-If Projection"} wrapperStyle={{ fontSize: 13, color: "#002855" }} />
        <Area type="monotone" dataKey="whatIf" stroke="none" fill="url(#whatIfShade)" connectNulls={false} legendType="none" tooltipType="none" />
        <Line type="monotone" dataKey="current" stroke="#3387BB" strokeWidth={2.5} dot={false} connectNulls={false} name="current" />
        <Line type="monotone" dataKey="whatIf" stroke="#F7941D" strokeWidth={2.5} strokeDasharray="8 4" dot={false} connectNulls={false} name="whatIf" />
        <ReferenceDot x={0.5} y={startBal} r={7} fill="#F7941D" stroke="#fff" strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

const WhatIfChart = dynamic(() => Promise.resolve(WhatIfChartInner), { ssr: false });

/* ---------- Main page ---------- */
export default function GrowthPage() {
  const [activeGoal, setActiveGoal] = useState("IRA");
  const [years, setYears] = useState(10);
  const activeData = GROWTH_DATA[activeGoal];

  const visibleBefore = useMemo(() => activeData.before.filter((d) => d.year <= years), [activeData, years]);
  const visibleWith = useMemo(() => activeData.withRise.filter((d) => d.year <= years), [activeData, years]);

  const lastBal = visibleWith.at(-1)?.bal ?? 0;
  const totalSaved = useCountUp(lastBal);

  // What-If state
  const [whatIfOpen, setWhatIfOpen] = useState(false);
  const [whatIfMonthly, setWhatIfMonthly] = useState(activeData.monthlyContribution);
  const [whatIfRate, setWhatIfRate] = useState(0.09);
  const [whatIfYears, setWhatIfYears] = useState(years);
  const [recoTab, setRecoTab] = useState("By Vendor");

  const activeGoalData = activeData;

  const vendorRecos = useMemo(() =>
    VENDOR_ENTRIES.map((v) => ({
      ...v,
      impact10: calcLumpSum(v.monthly, whatIfRate, 10),
      impact30: calcLumpSum(v.monthly, whatIfRate, 30),
    })),
    [whatIfRate],
  );

  const startBal = activeData.withRise[0]?.bal ?? 0;

  const whatIfProjection = useMemo(
    () => compoundGrowth(startBal, whatIfMonthly, whatIfRate, whatIfYears),
    [startBal, whatIfMonthly, whatIfRate, whatIfYears],
  );

  const combinedWhatIfData = useMemo(() => {
    const maxYr = Math.max(years, whatIfYears);
    const result: { year: number; current: number | null; whatIf: number | null }[] = [];
    for (let y = 0; y <= maxYr; y++) {
      const curVal = interpAt(activeData.withRise, y);
      const wiPt = whatIfProjection.find((d) => d.year === y);
      result.push({ year: y, current: curVal, whatIf: wiPt?.bal ?? null });
    }
    return result;
  }, [activeData.withRise, whatIfProjection, years, whatIfYears]);

  const whatIfEnd = whatIfProjection.at(-1)?.bal ?? 0;
  const currentEnd = visibleWith.at(-1)?.bal ?? 0;
  const diff = whatIfEnd - currentEnd;
  const timeDiff = whatIfYears - years;
  const timeSuffix = timeDiff > 0 ? ` (${timeDiff} yrs longer)` : timeDiff < 0 ? ` (${Math.abs(timeDiff)} yrs shorter)` : "";

  const milestones = [
    { label: "Today", amount: visibleWith[0]?.bal ?? 0 },
    { label: "6 months", amount: Math.round((visibleWith[0]?.bal ?? 0) + 6 * activeData.monthlyContribution) },
    { label: "1 year", amount: Math.round((visibleWith[0]?.bal ?? 0) + 12 * activeData.monthlyContribution) },
    { label: "5 years", amount: Math.round((visibleWith[0]?.bal ?? 0) + 60 * activeData.monthlyContribution) },
    { label: "Retirement", amount: activeData.projectedRetirement },
  ];
  const PHASES = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 96 }}>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 0", display: "flex", flexDirection: "column", gap: 32 }}>
        <div className="fade-in-1">
          <h2 className="section-header">Your Growth Journey</h2>
          <p style={{ fontSize: 15, color: "#4A6FA5", marginTop: 8 }}>See how RISE is changing your financial future</p>
        </div>

        {/* Goal Type Selector */}
        <div className="fade-in-2" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {GOAL_TYPES.map((goal) => (
            <button key={goal} type="button" onClick={() => { setActiveGoal(goal); setWhatIfMonthly(GROWTH_DATA[goal].monthlyContribution); }}
              style={{ padding: "8px 20px", borderRadius: 9999, fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s ease", border: "2px solid #002855", background: activeGoal === goal ? "#002855" : "white", color: activeGoal === goal ? "white" : "#002855" }}>
              {goal}
            </button>
          ))}
        </div>

        {/* Year Scope Slider */}
        <div className="glass-sm fade-in-3" style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#002855" }}>Projection Horizon</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#F7941D" }}>Showing {years}-Year Projection</span>
          </div>
          <SliderWithSun value={years} onChange={(v) => setYears(Math.round(v))} min={1} max={50} step={1} leftLabel="1 yr" rightLabel="50 yrs" />
        </div>

        {/* Charts */}
        <div className="fade-in-4">
          <ChartSection before={visibleBefore} withRise={visibleWith} maxYear={years} />
        </div>

        {/* What-If Section */}
        <div className="fade-in-5">
          <button type="button" onClick={() => setWhatIfOpen(!whatIfOpen)}
            style={{ width: "100%", padding: "16px 24px", borderRadius: 16, fontWeight: 700, fontSize: 16, cursor: "pointer", transition: "all 0.2s ease", border: "2px solid #F7941D", background: whatIfOpen ? "linear-gradient(135deg, #F7941D, #E8830A)" : "white", color: whatIfOpen ? "white" : "#F7941D", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "'Nunito Sans', sans-serif" }}>
            {whatIfOpen ? "▲ Close What-If Explorer" : "▼ Open What-If Explorer"}
          </button>

          {whatIfOpen && (
            <div className="glass" style={{ marginTop: 16, padding: 28 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#002855", margin: "0 0 24px" }}>What-If Explorer</h3>

              {/* Slider 1 — Monthly contribution */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#002855" }}>What if you saved...</span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: "#F7941D" }}>${whatIfMonthly.toFixed(0)}/mo</span>
                </div>
                <SliderWithSun value={whatIfMonthly} onChange={setWhatIfMonthly} min={0} max={1000} step={10} leftLabel="$0/mo" rightLabel="$1,000/mo" />
              </div>

              {/* Slider 2 — Return rate */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#002855" }}>At a return rate of...</span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: "#F7941D" }}>{(whatIfRate * 100).toFixed(1)}%</span>
                </div>
                <SliderWithSun value={whatIfRate} onChange={setWhatIfRate} min={0.01} max={0.15} step={0.005} leftLabel="1%" rightLabel="15%" />
              </div>

              {/* Slider 3 — Time horizon */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#002855" }}>What if you stayed invested for...</span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: "#F7941D" }}>{whatIfYears} years</span>
                </div>
                <SliderWithSun value={whatIfYears} onChange={(v) => setWhatIfYears(Math.round(v))} min={1} max={50} step={1} leftLabel="1 year" rightLabel="50 years" />
              </div>

              {/* Reset button */}
              <button type="button" onClick={() => { setWhatIfMonthly(Math.round(activeGoalData.monthlyContribution * 1.75)); setWhatIfRate(0.09); setWhatIfYears(years); }}
                style={{ background: "none", border: "none", color: "#94A3B8", fontSize: 12, cursor: "pointer", textDecoration: "underline", marginTop: 0, marginBottom: 24, display: "block" }}>
                Reset to defaults
              </button>

              {/* Personalized What-If Scenarios */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#002855" }}>Personalized What-If Scenarios</div>
                <div style={{ fontSize: 12, color: "#4A6FA5", marginTop: 4 }}>Based on your actual discretionary spending this month</div>
              </div>

              <div style={{ display: "flex", background: "rgba(0,40,85,0.08)", borderRadius: 12, padding: 4, marginBottom: 20, width: "fit-content" }}>
                {(["By Vendor", "By Category"] as const).map((tab) => (
                  <button key={tab} type="button" onClick={() => setRecoTab(tab)}
                    style={{ padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.2s ease", background: recoTab === tab ? "#F7941D" : "transparent", color: recoTab === tab ? "#fff" : "#4A6FA5", boxShadow: recoTab === tab ? "0 4px 12px rgba(247,148,29,0.3)" : "none" }}>
                    {tab}
                  </button>
                ))}
              </div>

              {recoTab === "By Vendor" && (
                <div style={{ background: "linear-gradient(135deg, rgba(247,148,29,0.06), rgba(0,40,85,0.03))", border: "1px solid rgba(247,148,29,0.2)", borderRadius: 16, overflow: "hidden", marginBottom: 24 }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", fontStyle: "italic", padding: "12px 20px 0" }}>
                    Each projection shows a single skipped purchase invested as a lump sum
                  </div>
                  {vendorRecos.map((item, i) => (
                    <div key={item.vendor} style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: i < vendorRecos.length - 1 ? "1px solid rgba(0,40,85,0.07)" : "none", gap: 12, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#002855" }}>Skip {item.vendor}</div>
                        <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{item.category} · skip once = ${item.monthly.toFixed(2)}</div>
                      </div>
                      <div style={{ color: "#F7941D", fontSize: 20, flexShrink: 0 }}>→</div>
                      <div style={{ textAlign: "right", minWidth: 140 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#F7941D" }}>${item.impact10.toLocaleString()} in 10 yrs</div>
                        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>${item.impact30.toLocaleString()} in 30 yrs @ {(whatIfRate * 100).toFixed(0)}%</div>
                      </div>
                      <button type="button" title="Add this amount to your monthly What-If contribution"
                        onClick={() => setWhatIfMonthly((prev) => Math.round((prev + item.monthly) * 100) / 100)}
                        style={{ background: "rgba(247,148,29,0.12)", border: "1px solid rgba(247,148,29,0.4)", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, color: "#F7941D", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s ease" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#F7941D"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(247,148,29,0.12)"; e.currentTarget.style.color = "#F7941D"; }}>
                        + Add to What-If
                      </button>
                    </div>
                  ))}
                  <div style={{ padding: "14px 20px", background: "rgba(0,40,85,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#002855" }}>Skip all 3 vendors once</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>${vendorRecos.reduce((s, v) => s + v.monthly, 0).toFixed(2)} total lump sum</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#F7941D" }}>${calcLumpSum(vendorRecos.reduce((s, v) => s + v.monthly, 0), whatIfRate, 30).toLocaleString()} in 30 yrs @ {(whatIfRate * 100).toFixed(0)}%</div>
                    </div>
                    <button type="button" title="Add all vendor amounts to your monthly What-If contribution"
                      onClick={() => setWhatIfMonthly(Math.round((activeGoalData.monthlyContribution + vendorRecos.reduce((s, v) => s + v.monthly, 0)) * 100) / 100)}
                      style={{ background: "linear-gradient(135deg, #F7941D, #E8830A)", border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 12px rgba(247,148,29,0.35)", whiteSpace: "nowrap" }}>
                      Add All ✦
                    </button>
                  </div>
                </div>
              )}

              {recoTab === "By Category" && (
                <div style={{ background: "linear-gradient(135deg, rgba(0,40,85,0.04), rgba(247,148,29,0.04))", border: "1px solid rgba(0,40,85,0.1)", borderRadius: 16, overflow: "hidden", marginBottom: 24 }}>
                  {CATEGORY_RECOS.map((item, i) => (
                    <div key={item.category} style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: i < CATEGORY_RECOS.length - 1 ? "1px solid rgba(0,40,85,0.07)" : "none", gap: 12, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#002855" }}>Cut {item.category} by 20%</div>
                        <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>${item.total.toFixed(2)}/mo → save ${item.saving.toFixed(2)}/mo</div>
                      </div>
                      <div style={{ color: "#0069AA", fontSize: 20, flexShrink: 0 }}>→</div>
                      <div style={{ textAlign: "right", minWidth: 140 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#0069AA" }}>+${item.impact10.toLocaleString()} in 10 yrs</div>
                        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>+${item.impact30.toLocaleString()} in 30 yrs @ 9%</div>
                      </div>
                      <button type="button" onClick={() => setWhatIfMonthly((prev) => Math.round((prev + item.saving) * 100) / 100)}
                        style={{ background: "rgba(0,40,85,0.08)", border: "1px solid rgba(0,40,85,0.2)", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, color: "#002855", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s ease" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#002855"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,40,85,0.08)"; e.currentTarget.style.color = "#002855"; }}>
                        + Try This
                      </button>
                    </div>
                  ))}
                  <div style={{ padding: "14px 20px", background: "rgba(0,40,85,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#002855" }}>Cut all 3 categories by 20%</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>Save ${CATEGORY_RECOS.reduce((s, c) => s + c.saving, 0).toFixed(2)}/mo</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#0069AA" }}>+${calcFutureValue(CATEGORY_RECOS.reduce((s, c) => s + c.saving, 0), 0.09, 30, 0).toLocaleString()} in 30 yrs</div>
                    </div>
                    <button type="button" onClick={() => setWhatIfMonthly(Math.round((activeGoalData.monthlyContribution + CATEGORY_RECOS.reduce((s, c) => s + c.saving, 0)) * 100) / 100)}
                      style={{ background: "linear-gradient(135deg, #002855, #003D62)", border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,40,85,0.3)", whiteSpace: "nowrap" }}>
                      Apply All ✦
                    </button>
                  </div>
                </div>
              )}

              {/* Combined chart */}
              <div style={{ marginBottom: 16, marginTop: 8 }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#002855" }}>Your Projection vs. What-If</div>
                <div style={{ fontSize: 12, color: "#4A6FA5", marginTop: 4 }}>Shaded area shows additional growth potential</div>
              </div>
              <WhatIfChart combinedData={combinedWhatIfData} startBal={startBal} />

              {/* Difference callout */}
              <div className="glass-sm" style={{ padding: "16px 20px", marginTop: 16, textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#4A6FA5", margin: "0 0 6px" }}>
                  {whatIfYears !== years
                    ? `Projected difference at Year ${whatIfYears} vs your current Year ${years} outlook:`
                    : `Projected difference at Year ${years}:`}
                </p>
                <p style={{ fontSize: 28, fontWeight: 800, color: diff >= 0 ? "#78BE20" : "#E74C3C", margin: 0 }}>
                  {diff >= 0 ? "+" : ""}${Math.abs(diff).toLocaleString()}{timeSuffix}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Milestone Timeline */}
        <div className="fade-in-6">
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#002855", marginBottom: 16 }}>Your Milestones</h3>
          <div style={{ background: "linear-gradient(135deg, #002855 0%, #1a4a7a 40%, #F7941D 100%)", borderRadius: 20, height: 160, overflow: "hidden", padding: 20, display: "flex", alignItems: "center", position: "relative" }}>
            <div style={{ position: "absolute", top: "50%", left: 60, right: 60, height: 0, borderTop: "2px dashed rgba(255,255,255,0.3)" }} />
            <div style={{ display: "flex", flex: 1, justifyContent: "space-between", position: "relative", zIndex: 1 }}>
              {milestones.map((m, i) => (
                <div key={m.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <SunIcon phase={PHASES[i]} size={36} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? "#F7941D" : "rgba(255,255,255,0.4)" }} />
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", margin: 0, fontWeight: 600 }}>{m.label}</p>
                  <p style={{ fontSize: 13, color: "#F7941D", margin: 0, fontWeight: 800 }}>${m.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="fade-in-7" style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <div className="glass-sm" style={{ flex: "1 1 160px", padding: 20, textAlign: "center" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#F7941D", margin: 0 }}>${totalSaved.toLocaleString()}</p>
            <p style={{ fontSize: 13, color: "#4A6FA5", margin: "6px 0 0" }}>Total Saved with RISE</p>
          </div>
          <div className="glass-sm" style={{ flex: "1 1 160px", padding: 20, textAlign: "center" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#F7941D", margin: 0 }}>${activeData.projectedRetirement.toLocaleString()}</p>
            <p style={{ fontSize: 13, color: "#4A6FA5", margin: "6px 0 0" }}>Projected at Retirement</p>
          </div>
          <div className="glass-sm" style={{ flex: "1 1 160px", padding: 20, textAlign: "center" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#F7941D", margin: 0 }}>${activeData.monthlyContribution.toFixed(2)}</p>
            <p style={{ fontSize: 13, color: "#4A6FA5", margin: "6px 0 0" }}>Monthly Contribution</p>
          </div>
        </div>
      </main>
    </div>
  );
}
