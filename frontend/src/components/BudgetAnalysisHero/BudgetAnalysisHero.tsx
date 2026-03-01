"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
  type PieSectorDataItem,
} from "recharts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type BudgetPeriodData = {
  total: number;
  label: string;
  subtitle: string;
  categories: { name: string; value: number; color: string }[];
};

const BUDGET_DATA: Record<string, BudgetPeriodData> = {
  day: {
    total: 89.47,
    label: "Today — March 1, 2026",
    subtitle: "Based on transactions so far today",
    categories: [
      { name: "Eating Out", value: 34.5, color: "#002855" },
      { name: "Grocery", value: 28.97, color: "#003D62" },
      { name: "Transportation", value: 16, color: "#0069AA" },
      { name: "Entertainment", value: 10, color: "#3387BB" },
    ],
  },
  week: {
    total: 623.18,
    label: "This Week — Feb 23 – Mar 1",
    subtitle: "Feb 23 through today",
    categories: [
      { name: "Grocery", value: 156.4, color: "#002855" },
      { name: "Eating Out", value: 134.28, color: "#003D62" },
      { name: "Transportation", value: 92.5, color: "#0069AA" },
      { name: "Entertainment", value: 78, color: "#3387BB" },
      { name: "Health", value: 60, color: "#66A5CC" },
      { name: "Clothes", value: 55, color: "#EF9D52" },
      { name: "Utilities", value: 47, color: "#F7941D" },
    ],
  },
  month: {
    total: 4250,
    label: "February 2026",
    subtitle: "Full month of February",
    categories: [
      { name: "Housing", value: 1200, color: "#002855" },
      { name: "Grocery", value: 680, color: "#003D62" },
      { name: "Eating Out", value: 520, color: "#0069AA" },
      { name: "Transportation", value: 420, color: "#3387BB" },
      { name: "Health", value: 380, color: "#66A5CC" },
      { name: "Clothes", value: 320, color: "#EF9D52" },
      { name: "Entertainment", value: 280, color: "#F7941D" },
      { name: "Utilities", value: 250, color: "#E8830A" },
      { name: "Childcare", value: 200, color: "#BC6A1F" },
    ],
  },
};

const PERIOD_KEYS = ["day", "week", "month"] as const;
const PERIOD_LABELS: Record<string, string> = { day: "Day", week: "Week", month: "Month" };

const AI_INSIGHTS = [
  { color: "#F7941D", text: "You\u2019ve been doing a good job lowering discretionary spending recently, but you could go further! Consider going to Taco Bell only once a week. That would free up a little extra cash to really hit your goals." },
  { color: "#3387BB", text: "Your grocery spending at Giant Eagle is solid \u2014 you\u2019re right around the recommended 15% of take-home pay. Nice work keeping this consistent." },
  { color: "#E8830A", text: "Streaming subscriptions are adding up quietly. If you cut one service, that\u2019s roughly $15/month \u2014 or $180 a year \u2014 going straight to your RISE savings instead." },
  { color: "#66A5CC", text: "Gas spending is slightly above average for your area. Consolidating errands into fewer trips could save you $20\u201330 a month without any real lifestyle change." },
  { color: "#002855", text: "Your biggest win this month? Housing costs are stable and well within range. That\u2019s the foundation everything else builds on \u2014 keep it locked in." },
];

export function BudgetAnalysisHero() {
  const [activePeriod, setActivePeriod] = useState<string>("month");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const activeData = BUDGET_DATA[activePeriod];

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (drawerOpen) {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 600);
      return () => clearTimeout(t);
    }
  }, [drawerOpen]);

  const renderActiveShape = (props: PieSectorDataItem) => {
    const { cx = 0, cy = 0, innerRadius = 0, outerRadius = 0, startAngle = 0, endAngle = 0, fill = "#ccc" } = props;
    return (
      <g>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius - 4} outerRadius={outerRadius + 12} startAngle={startAngle} endAngle={endAngle} fill={fill} stroke="#ffffff" strokeWidth={2} />
        <Sector cx={cx} cy={cy} innerRadius={outerRadius + 16} outerRadius={outerRadius + 20} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      </g>
    );
  };

  const pieData = activeData.categories.map((cat) => ({
    name: cat.name,
    value: cat.value,
    fill: cat.color,
    percentage: activeData.total > 0 ? (cat.value / activeData.total) * 100 : 0,
  }));

  return (
    <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.8)", borderRadius: 24, boxShadow: "0 8px 32px rgba(0,40,85,0.12)", padding: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Period selector — 3 buttons only */}
        <div style={{ display: "flex", gap: 6 }}>
          {PERIOD_KEYS.map((pk) => (
            <button key={pk} type="button" onClick={() => setActivePeriod(pk)}
              style={{ flex: 1, padding: "8px 0", borderRadius: 9999, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s ease", border: "2px solid #002855", background: activePeriod === pk ? "#002855" : "white", color: activePeriod === pk ? "white" : "#002855", fontFamily: "'Nunito Sans', sans-serif" }}>
              {PERIOD_LABELS[pk]}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minHeight: 400, minWidth: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={110}
                  outerRadius={180}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  isAnimationActive={true}
                  animationBegin={mounted ? 0 : undefined}
                  animationDuration={500}
                  activeShape={renderActiveShape}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={`${entry.name}-${i}`} fill={entry.fill} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }: { active?: boolean; payload?: readonly { name?: string; value?: number }[] }) => {
                    if (!active || !payload?.length) return null;
                    const { name, value } = payload[0];
                    const pct = activeData.total > 0 ? (((value ?? 0) / activeData.total) * 100).toFixed(1) : "0";
                    return (
                      <div style={{ background: "#001A3A", border: "1px solid rgba(247,148,29,0.35)", borderRadius: 12, padding: "12px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
                        <div style={{ color: "#F7CEA9", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{name}</div>
                        <div style={{ color: "#FFFFFF", fontWeight: 800, fontSize: 20 }}>${Number(value ?? 0).toLocaleString()}</div>
                        <div style={{ color: "#A8C4E0", fontSize: 12, marginTop: 4 }}>{pct}% of total spending</div>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 240, flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pieData.map((entry) => (
                <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: entry.fill, flexShrink: 0 }} />
                  <div>
                    <span style={{ color: "#002855", fontWeight: 500 }}>{entry.name}</span>
                    <span style={{ color: "#4A6FA5", marginLeft: 4 }}>
                      ${entry.value.toLocaleString()} ({entry.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <button type="button" style={{ marginTop: 24, width: "100%", padding: "12px 0", borderRadius: 999, fontWeight: 600, color: "white", background: "#F7941D", border: "none", cursor: "pointer", fontSize: 15, transition: "background 0.2s" }}>
                  AI Insight
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="ai-insight-drawer" style={{ width: 380, maxWidth: "95vw", background: "#001A3A", borderLeft: "4px solid #F7941D", padding: 0, color: "white" }}>
                <SheetHeader style={{ padding: "24px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <SheetTitle style={{ color: "#FFFFFF", fontSize: 18, fontWeight: 800 }}>AI Spending Insights ✦</SheetTitle>
                </SheetHeader>
                <div style={{ padding: "8px 24px 24px", overflowY: "auto", flex: 1 }}>
                  {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 0" }}>
                      {[100, 85, 80, 100, 75].map((w, i) => (
                        <div key={`skel-${w}-${i}`} style={{ height: 12, background: "rgba(255,255,255,0.15)", borderRadius: 6, width: `${w}%` }} />
                      ))}
                    </div>
                  ) : (
                    <div>
                      {AI_INSIGHTS.map((insight, i) => (
                        <div key={insight.color} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: i < AI_INSIGHTS.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: insight.color, flexShrink: 0, marginTop: 6 }} />
                          <p style={{ color: "#FFFFFF", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{insight.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#002855", margin: 0 }}>
            Total: ${activeData.total.toLocaleString()} · {activeData.label}
          </p>
          <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>{activeData.subtitle}</p>
        </div>
      </div>
    </div>
  );
}
