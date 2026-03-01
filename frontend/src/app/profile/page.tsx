"use client";

import { useState, useEffect } from "react";
import { Pencil, Landmark, HeartPulse, PiggyBank, Shield } from "lucide-react";
import SunIcon from "@/components/SunIcon";
import SliderWithSun from "@/components/SliderWithSun";

const MOCK_PROFILE = {
  name: "Jordan Casey",
  savings_intensity: 0.6,
  notification_frequency: "weekly",
  savings_goals: ["ira"],
  goals: [
    { label: "Retirement Comfortability", value: 0.7 },
    { label: "Emergency Fund Priority", value: 0.5 },
    { label: "Short-term Savings", value: 0.4 },
  ],
};

const GOAL_LABELS: [string, string][] = [
  ["Minimal", "Comfortable"],
  ["Low Priority", "Top Priority"],
  ["Not Important", "Critical"],
];

const NOTIFICATION_OPTIONS = ["Daily", "Weekly", "Monthly"] as const;

const SAVINGS_GOALS = [
  { id: "ira", label: "IRA", Icon: Landmark },
  { id: "hsa", label: "HSA", Icon: HeartPulse },
  { id: "general", label: "General Savings", Icon: PiggyBank },
  { id: "emergency", label: "Emergency Fund", Icon: Shield },
];

export default function ProfilePage() {
  const [goals, setGoals] = useState(MOCK_PROFILE.goals.map((g) => g.value));
  const [savingsIntensity, setSavingsIntensity] = useState(MOCK_PROFILE.savings_intensity);
  const [notifFreq, setNotifFreq] = useState(MOCK_PROFILE.notification_frequency);
  const [decisionSuggestions, setDecisionSuggestions] = useState(true);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(MOCK_PROFILE.savings_goals);
  const [toastVisible, setToastVisible] = useState(false);
  const [sunPhase, setSunPhase] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const max = el.scrollHeight - el.clientHeight;
      setSunPhase(max > 0 ? Math.min(scrolled / max, 1) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const phaseLabelMap: [number, string][] = [
    [0.2, "Setting intentions..."],
    [0.4, "Dawn is breaking..."],
    [0.6, "Goals are rising..."],
    [0.8, "Almost there..."],
  ];
  const phaseLabel = phaseLabelMap.find(([t]) => sunPhase < t)?.[1] ?? "Goals set!";

  const handleSave = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const updateGoal = (index: number, value: number) => {
    setGoals((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.length > 1 ? prev.filter((g) => g !== goalId) : prev
        : [...prev, goalId]
    );
  };

  const sweepPercent = Math.round(savingsIntensity * 10 + 1);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 48 }}>
      <div style={{ position: "fixed", top: 76, right: 20, zIndex: 50, width: 100, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, pointerEvents: "none" }}>
        <SunIcon phase={sunPhase} size={60} showArc={false} />
        <span style={{ fontSize: 10, fontWeight: 700, textAlign: "center", maxWidth: 100, color: sunPhase < 0.4 ? "#94A3B8" : "#F7941D", transition: "color 0.4s ease" }}>{phaseLabel}</span>
      </div>

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "24px 24px 0", display: "flex", flexDirection: "column", gap: 28 }}>
        {/* User Info Card */}
        <div className="glass fade-in-1" style={{ padding: 24, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#002855", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, flexShrink: 0 }}>JC</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#002855", margin: 0 }}>{MOCK_PROFILE.name}</h2>
              <Pencil size={16} style={{ color: "#4A6FA5", cursor: "pointer" }} />
            </div>
            <span style={{ display: "inline-block", marginTop: 6, padding: "4px 14px", borderRadius: 9999, background: "rgba(247,148,29,0.12)", color: "#F7941D", fontSize: 13, fontWeight: 700 }}>
              {selectedGoals.map((g) => SAVINGS_GOALS.find((sg) => sg.id === g)?.label).filter(Boolean).join(", ")}
            </span>
          </div>
        </div>

        {/* AI Suggestion Banner */}
        <div className="fade-in-2" style={{ background: "linear-gradient(135deg, #F7941D, #E8830A)", borderRadius: 16, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <p style={{ color: "white", fontSize: 14, fontWeight: 600, margin: 0, lineHeight: 1.5 }}>AI-generated suggestions applied based on your spending data</p>
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "underline", flexShrink: 0 }}>Customize</span>
        </div>

        {/* Goals Section */}
        <div className="fade-in-3">
          <h2 className="section-header" style={{ marginBottom: 20 }}>Let&apos;s Set Your Goals!</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {MOCK_PROFILE.goals.map((goal, i) => (
              <div key={goal.label} className="glass" style={{ padding: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#002855", margin: "0 0 8px", textAlign: "center" }}>{goal.label}</h3>
                  <span style={{ fontSize: 24, fontWeight: 800, color: "#F7941D", fontVariantNumeric: "tabular-nums" }}>{Math.round(goals[i] * 100)}%</span>
                </div>
                <SliderWithSun value={goals[i]} onChange={(v) => updateGoal(i, v)} leftLabel={GOAL_LABELS[i][0]} rightLabel={GOAL_LABELS[i][1]} />
              </div>
            ))}
          </div>
        </div>

        {/* Savings Intensity */}
        <div className="glass fade-in-4" style={{ padding: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#002855", margin: "0 0 8px", textAlign: "center" }}>Savings Intensity</h3>
            <span style={{ fontSize: 24, fontWeight: 800, color: "#F7941D", fontVariantNumeric: "tabular-nums" }}>~{sweepPercent}%</span>
          </div>
          <SliderWithSun value={savingsIntensity} onChange={setSavingsIntensity} leftLabel="Conservative" rightLabel="Aggressive" />
          <p style={{ fontSize: 13, color: "#4A6FA5", margin: "10px 0 0", textAlign: "center" }}>Currently sweeping ~{sweepPercent}% of purchases</p>
        </div>

        {/* Notification Frequency */}
        <div className="glass fade-in-4" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#002855", margin: "0 0 14px" }}>Notification Frequency</h3>
          <div style={{ display: "flex", gap: 8 }}>
            {NOTIFICATION_OPTIONS.map((opt) => (
              <button key={opt} type="button" onClick={() => setNotifFreq(opt.toLowerCase())}
                style={{ flex: 1, padding: "10px 0", borderRadius: 9999, fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s ease", border: "2px solid #002855", background: notifFreq === opt.toLowerCase() ? "#002855" : "white", color: notifFreq === opt.toLowerCase() ? "white" : "#002855" }}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Decision Suggestions Toggle */}
        <div className="glass fade-in-4" style={{ padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#002855", margin: "0 0 4px" }}>Decision Suggestions</h3>
            <p style={{ fontSize: 14, color: "#4A6FA5", margin: 0 }}>Get AI tips when you make large purchases</p>
          </div>
          <button type="button" onClick={() => setDecisionSuggestions(!decisionSuggestions)}
            style={{ position: "relative", width: 48, height: 24, borderRadius: 9999, border: "none", cursor: "pointer", transition: "background 0.25s ease", background: decisionSuggestions ? "#F7941D" : "rgba(0,40,85,0.2)", flexShrink: 0 }}>
            <span style={{ position: "absolute", top: 4, width: 16, height: 16, borderRadius: "50%", background: "white", transition: "left 0.25s ease", left: decisionSuggestions ? 28 : 4, boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
          </button>
        </div>

        {/* GROWTH Goals — multi-select */}
        <div className="fade-in-5">
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#002855", margin: "0 0 14px" }}>
            <span style={{ color: "#F7941D", fontWeight: 800 }}>GROWTH</span> Goals
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {SAVINGS_GOALS.map((sg) => {
              const isSelected = selectedGoals.includes(sg.id);
              return (
                <button key={sg.id} type="button" onClick={() => toggleGoal(sg.id)}
                  style={{ padding: 20, textAlign: "center", cursor: "pointer", transition: "all 0.2s ease", borderRadius: 16, border: isSelected ? "2px solid #F7941D" : "1px solid #E2E8F0", background: isSelected ? "rgba(247,148,29,0.1)" : "white", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <sg.Icon size={28} style={{ color: isSelected ? "#F7941D" : "#002855", transition: "color 0.2s ease" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#002855" }}>{sg.label}</span>
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: 13, color: "#4A6FA5", margin: "10px 0 0" }}>
            Selected: {selectedGoals.map((g) => SAVINGS_GOALS.find((sg) => sg.id === g)?.label).filter(Boolean).join(", ")}
          </p>
        </div>

        {/* Save Button */}
        <div className="fade-in-5" style={{ position: "relative" }}>
          <button type="button" className="btn-primary" onClick={handleSave} style={{ width: "100%" }}>Save Preferences</button>
          {toastVisible && (
            <p style={{ textAlign: "center", color: "#27ae60", fontWeight: 600, fontSize: 15, marginTop: 12, animation: "fadeSlideUp 0.3s ease forwards" }}>Preferences saved!</p>
          )}
        </div>
      </main>
    </div>
  );
}
