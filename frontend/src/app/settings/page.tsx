"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, Sparkles } from "lucide-react";
import SliderWithSun from "@/components/SliderWithSun";

const MOCK_CARDS_DATA = [
  { id: "pnc-1", name: "PNC Virtual Wallet", image: "/images/PNCdebitcard.jpg", monthlySpend: 1697.98 },
  { id: "cap1-1", name: "Capital One Savor", image: "/images/captialonesavor.jpg", monthlySpend: 378 },
];

const ASSUMED_INCOME = 4000;

function compound30yr(monthlyContribution: number) {
  const r = 0.07 / 12;
  const n = 360;
  return monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
}

export default function SettingsPage() {
  const [view, setView] = useState("list");
  const [growthIncomePct, setGrowthIncomePct] = useState(0.05);
  const [growthExpensePct, setGrowthExpensePct] = useState(0.02);
  const [showAI, setShowAI] = useState<string | null>(null);

  const selectedCard = MOCK_CARDS_DATA.find((c) => c.id === view);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 48 }}>
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 24px 0" }}>
        {/* B1 — Card List View */}
        <div style={{ opacity: view === "list" ? 1 : 0, transform: view === "list" ? "translateY(0)" : "translateY(-20px)", transition: "opacity 0.35s ease, transform 0.35s ease", pointerEvents: view === "list" ? "auto" : "none", position: view === "list" ? "relative" : "absolute" }}>
          {view === "list" && (
            <>
              <div className="fade-in-1">
                <h2 className="section-header">Your Card Settings</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: 15, marginTop: 8, marginBottom: 28 }}>Select a card to configure your savings percentage</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                {MOCK_CARDS_DATA.map((card, idx) => (
                  <div key={card.id} className={`card-tile fade-in-${idx + 2}`}
                    style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 24px", background: "rgba(255,255,255,0.72)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.85)", borderRadius: 20, boxShadow: "0 8px 32px rgba(0,40,85,0.14)", cursor: "pointer" }}
                    onClick={() => setView(card.id)} onKeyDown={(e) => { if (e.key === "Enter") setView(card.id); }} role="button" tabIndex={0}>
                    <div style={{ marginBottom: 16 }}>
                      <Image src={card.image} alt={card.name} width={180} height={113} unoptimized
                        style={{ objectFit: "contain", filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.4))", borderRadius: 10, transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
                        onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = "scale(1.08) rotate(1deg)"; }}
                        onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = "scale(1)"; }} />
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--navy)", margin: "0 0 6px", textAlign: "center" }}>{card.name}</h3>
                    <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>${card.monthlySpend.toFixed(2)}/mo</span>
                    <button className="btn-primary" style={{ padding: "10px 24px", fontSize: 14, marginTop: 12 }}
                      onClick={(e) => { e.stopPropagation(); setView(card.id); }}>Configure</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* B2 — Card Detail View */}
        {selectedCard && (
          <div style={{ opacity: view === "list" ? 0 : 1, transform: view === "list" ? "translateY(20px)" : "translateY(0)", transition: "opacity 0.35s ease, transform 0.35s ease" }}>
            <button onClick={() => { setView("list"); setShowAI(null); }}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 15, fontWeight: 600, padding: 0, marginBottom: 24, fontFamily: "'Nunito Sans', sans-serif" }}>
              <ChevronLeft size={18} /> Back to cards
            </button>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ marginBottom: 20 }}>
                <Image src={selectedCard.image} alt={selectedCard.name} width={220} height={140} unoptimized
                  style={{ display: "block", objectFit: "contain", filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.4))", borderRadius: 12 }} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)", margin: "0 0 32px" }}>{selectedCard.name}</h2>
            </div>

            {/* Slider 1 — Income to GROWTH */}
            <div className="glass" style={{ padding: 28, marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)", margin: "0 0 4px" }}>
                What % of income contributes to <span style={{ color: "#F7941D", fontWeight: 800 }}>GROWTH</span>
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 16px" }}>Based on assumed $4,000/mo income</p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: "var(--orange)", fontVariantNumeric: "tabular-nums" }}>
                  {(growthIncomePct * 100).toFixed(1)}%
                </span>
              </div>
              <SliderWithSun value={growthIncomePct} min={0} max={0.10} step={0.005} onChange={setGrowthIncomePct} leftLabel="0%" rightLabel="10%" />
            </div>

            {/* Slider 2 — Expense to GROWTH */}
            <div className="glass" style={{ padding: 28, marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)", margin: "0 0 4px" }}>
                What % of each expense contributes to <span style={{ color: "#F7941D", fontWeight: 800 }}>GROWTH</span>
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 16px" }}>Applied to every purchase on this card</p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: "var(--orange)", fontVariantNumeric: "tabular-nums" }}>
                  {(growthExpensePct * 100).toFixed(1)}%
                </span>
              </div>
              <SliderWithSun value={growthExpensePct} min={0} max={0.05} step={0.001} onChange={setGrowthExpensePct} leftLabel="0%" rightLabel="5%" />
            </div>

            {/* Live calculation panel */}
            {(() => {
              const fromIncome = ASSUMED_INCOME * growthIncomePct;
              const fromExpenses = selectedCard.monthlySpend * growthExpensePct;
              const totalMonthly = fromIncome + fromExpenses;
              const annual = totalMonthly * 12;
              const thirtyYear = compound30yr(totalMonthly);
              return (
                <div className="glass-sm" style={{ padding: 24, marginBottom: 20 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", margin: "0 0 16px" }}>Projected savings:</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>From income ({(growthIncomePct * 100).toFixed(1)}%)</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)" }}>${fromIncome.toFixed(2)}/mo</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>From expenses ({(growthExpensePct * 100).toFixed(1)}%)</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)" }}>${fromExpenses.toFixed(2)}/mo</span>
                    </div>
                    <div style={{ height: 1, background: "rgba(0,40,85,0.08)" }} />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--orange)" }}>Total monthly</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: "var(--orange)" }}>${totalMonthly.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>Annual projection</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)" }}>${annual.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>30-year projection (7%)</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: "#78BE20" }}>${thirtyYear.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 auto" }}
              onClick={() => setShowAI(showAI === selectedCard.id ? null : selectedCard.id)}>
              <Sparkles size={16} /> AI Suggestion
            </button>

            {showAI === selectedCard.id && (
              <div className="glass-sm fade-in-1" style={{ marginTop: 16, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ fontSize: 20 }}>✦</span>
                <p style={{ fontSize: 14, color: "var(--navy)", margin: 0, lineHeight: 1.6 }}>
                  Based on your spending, we suggest <strong style={{ color: "var(--orange)" }}>5%</strong> income and <strong style={{ color: "var(--orange)" }}>2.5%</strong> expense contribution to maximize growth.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
