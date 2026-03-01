"use client";

import { useState } from "react";
import { X, Info, Gift, Banknote, TrendingUp } from "lucide-react";
import SunIcon from "@/components/SunIcon";
import { useCountUp } from "@/hooks/useCountUp";

const REWARDS_DISPLAY = [
  { id: "gc", name: "Gift Cards", type: "gift_card", dollar_value: 7.5, points_required: 750, Icon: Gift },
  { id: "cb", name: "Cash Back", type: "cash_back", dollar_value: 5, points_required: 500, Icon: Banknote },
  { id: "ira", name: "Direct GROWTH Contribution", nameJsx: true, type: "direct_contribution", dollar_value: 10, points_required: 1000, Icon: TrendingUp },
];

const GIFT_CARDS = [
  { name: "Amazon", color: "#FF9900", amount: 5, points: 500, tier: 1,
    tile: () => <div style={{ background: "#FF9900", borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial", fontWeight: 900, fontSize: 22, color: "#000", letterSpacing: -1, boxShadow: "0 4px 16px #FF990044" }}>a</div> },
  { name: "Starbucks", color: "#00704A", amount: 5, points: 500, tier: 1,
    tile: () => <div style={{ background: "#00704A", borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #CBA258", boxShadow: "0 4px 16px #00704A44" }}><svg viewBox="0 0 24 24" width={28} height={28} fill="#FFFFFF"><circle cx={12} cy={8} r={4}/><path d="M5 20 Q12 14 19 20"/></svg></div> },
  { name: "Target", color: "#CC0000", amount: 10, points: 1000, tier: 2,
    tile: () => <div style={{ background: "#CC0000", borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px #CC000044" }}><svg viewBox="0 0 24 24" width={32} height={32}><circle cx={12} cy={12} r={10} fill="none" stroke="#fff" strokeWidth={2.5}/><circle cx={12} cy={12} r={5} fill="none" stroke="#fff" strokeWidth={2.5}/><circle cx={12} cy={12} r={2} fill="#fff"/></svg></div> },
  { name: "Taco Bell", color: "#702082", amount: 5, points: 500, tier: 1,
    tile: () => <div style={{ background: "#702082", borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#fff", boxShadow: "0 4px 16px #70208244" }}>TB</div> },
  { name: "Apple", color: "#1D1D1F", amount: 15, points: 1500, tier: 2,
    tile: () => <div style={{ background: "#1D1D1F", borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px #1D1D1F44" }}><svg viewBox="0 0 24 24" width={26} height={26} fill="#FFFFFF"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/><path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg></div> },
  { name: "Nike", color: "#111111", amount: 20, points: 2000, tier: 3,
    tile: () => <div style={{ background: "#111", borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px #11111144" }}><svg viewBox="0 0 100 40" width={38} height={16} fill="#FFFFFF"><path d="M0 30 Q30 0 100 10 Q60 25 40 35 Q20 42 0 30Z"/></svg></div> },
  { name: "Uber Eats", color: "#06C167", amount: 10, points: 1000, tier: 2,
    tile: () => <div style={{ background: "#06C167", borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 11, color: "#fff", boxShadow: "0 4px 16px #06C16744" }}>UE</div> },
];

const MAX_POINTS = 2000;
const ARC_CX = 170;
const ARC_CY = 185;
const ARC_RADIUS = 130;
const ARC_STROKE_W = 14;
const ICON_SZ = 32;

function SemiCircleArc({ points }: Readonly<{ points: number }>) {
  const animatedPoints = useCountUp(points, 1400);
  const phase = Math.min(points / MAX_POINTS, 1);
  const circumference = Math.PI * ARC_RADIUS;
  const dashOffset = circumference * (1 - phase);
  const ptsTilTier2 = Math.max(0, MAX_POINTS - points);

  const angle = Math.PI - phase * Math.PI;
  const tipX = ARC_CX + ARC_RADIUS * Math.cos(angle);
  const tipY = ARC_CY - ARC_RADIUS * Math.sin(angle);
  const unitX = Math.cos(angle);
  const unitY = -Math.sin(angle);
  const OFFSET = ICON_SZ / 2 + ARC_STROKE_W / 2 + 4;
  const iconLeft = tipX + unitX * OFFSET - ICON_SZ / 2;
  const iconTop = tipY + unitY * OFFSET - ICON_SZ / 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", marginBottom: 8 }}>
      <div style={{ padding: "0 32px", boxSizing: "border-box" }}>
        <svg width="100%" viewBox="0 0 340 210" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F7941D" />
              <stop offset="100%" stopColor="#E8830A" />
            </linearGradient>
          </defs>
          <path d={`M ${ARC_CX - ARC_RADIUS} ${ARC_CY} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${ARC_CX + ARC_RADIUS} ${ARC_CY}`}
            fill="none" stroke="#E4EDF6" strokeWidth={ARC_STROKE_W} strokeLinecap="round" />
          <path d={`M ${ARC_CX - ARC_RADIUS} ${ARC_CY} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${ARC_CX + ARC_RADIUS} ${ARC_CY}`}
            fill="none" stroke="url(#arcGrad)" strokeWidth={ARC_STROKE_W} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 1.4s ease" }} />

          <text x={8} y={200} textAnchor="start" fill="#4A6FA5" fontSize={12} fontWeight={600}>0</text>
          <text x={332} y={200} textAnchor="end" fill="#4A6FA5" fontSize={12} fontWeight={600}>2,000</text>

          <text x={ARC_CX} y={125} textAnchor="middle" fill="#002855" fontSize={52} fontWeight={800}>{animatedPoints.toLocaleString()}</text>
          <text x={ARC_CX} y={148} textAnchor="middle" fill="#4A6FA5" fontSize={14} fontWeight={600}>points</text>
          <text x={ARC_CX} y={168} textAnchor="middle" fill="#F7941D" fontSize={12} fontWeight={700}>
            {ptsTilTier2 > 0 ? `${ptsTilTier2} pts until Tier 2` : "Tier 2 unlocked!"}
          </text>

          <foreignObject x={iconLeft} y={iconTop} width={ICON_SZ} height={ICON_SZ} style={{ overflow: "visible" }}>
            <SunIcon phase={phase} size={ICON_SZ} />
          </foreignObject>
        </svg>
      </div>
    </div>
  );
}

function TierTimeline() {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0 40px", marginTop: 32, marginBottom: 8, boxSizing: "border-box" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: "50%", transform: "translateY(-50%)", height: 1, background: "rgba(0,40,85,0.15)", zIndex: 0 }} />
      {([1, 2, 3] as const).map((tier) => {
        const isActive = tier === 1;
        const phase = tier === 1 ? 0.05 : tier === 2 ? 0.5 : 1.0;
        return (
          <div key={tier} style={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", border: isActive ? "2px solid #F7941D" : "2px solid rgba(0,40,85,0.15)", background: isActive ? "rgba(247,148,29,0.1)" : "transparent", boxShadow: isActive ? "0 0 0 5px rgba(247,148,29,0.12), 0 0 20px rgba(247,148,29,0.35)" : "none", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <SunIcon phase={phase} size={36} style={{ opacity: isActive ? 1 : 0.2 }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#F7941D" : "rgba(0,40,85,0.25)" }}>Tier {tier}</span>
          </div>
        );
      })}
    </div>
  );
}

function RewardName({ name, hasJsx }: Readonly<{ name: string; hasJsx?: boolean }>) {
  if (!hasJsx) return <>{name}</>;
  return (
    <>Direct <span style={{ color: "#F7941D", fontWeight: 800, letterSpacing: "0.05em" }}>GROWTH</span> Contribution</>
  );
}

const BOX: React.CSSProperties = {
  height: 280, minHeight: 280, maxHeight: 280, boxSizing: "border-box",
  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
  padding: "28px 20px", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.85)",
  borderRadius: 20, boxShadow: "0 8px 32px rgba(0,40,85,0.12)", overflow: "hidden",
  transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease",
  position: "relative",
};

export default function RewardsPage() {
  const [points, setPoints] = useState(1240);
  const [redeemedId, setRedeemedId] = useState<string | null>(null);
  const [successReward, setSuccessReward] = useState<string | null>(null);
  const [giftCardOpen, setGiftCardOpen] = useState(false);
  const [tierInfoId, setTierInfoId] = useState<string | null>(null);

  const redeemingReward = REWARDS_DISPLAY.find((r) => r.id === redeemedId);

  const handleConfirmRedeem = () => {
    if (!redeemingReward) return;
    setPoints((prev) => prev - redeemingReward.points_required);
    setSuccessReward(redeemingReward.name);
    setRedeemedId(null);
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 48 }}>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 0" }}>
        <div className="glass fade-in-1" style={{ padding: "32px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 12 }}>
          <SemiCircleArc points={points} />
          <TierTimeline />
        </div>

        {/* Rewards Grid */}
        <div className="fade-in-2" style={{ marginTop: 28 }}>
          <h2 className="section-header" style={{ marginBottom: 24 }}>Redeemable Rewards</h2>

          {tierInfoId && (
            <button style={{ position: "fixed", inset: 0, zIndex: 15, background: "transparent", border: "none", cursor: "default" }}
              onClick={() => setTierInfoId(null)} aria-label="Close tier info" />
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, width: "100%", alignItems: "stretch" }}>
            {REWARDS_DISPLAY.map((reward) => {
              const canRedeem = points >= reward.points_required;
              const deficit = reward.points_required - points;
              const isGiftCard = reward.type === "gift_card";
              const btnLabel = isGiftCard ? (giftCardOpen ? "Hide Options" : "Browse Cards") : "Redeem";
              return (
                <div key={reward.id} style={{ position: "relative" }}>
                  <div style={BOX}>
                    <reward.Icon size={44} style={{ color: "#F7941D" }} />
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#002855", margin: 0, textAlign: "center", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      <RewardName name={reward.name} hasJsx={reward.nameJsx} />
                    </h3>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#F7941D", margin: 0 }}>${reward.dollar_value.toFixed(2)}</p>
                    <span style={{ fontSize: 13, color: "#94A3B8" }}>{reward.points_required} pts</span>
                    {canRedeem ? (
                      <button className="btn-primary" style={{ width: "100%", height: 44, fontSize: 14 }}
                        onClick={() => isGiftCard ? setGiftCardOpen(!giftCardOpen) : setRedeemedId(reward.id)}>{btnLabel}</button>
                    ) : (
                      <button disabled style={{ width: "100%", height: 44, fontSize: 14, fontWeight: 600, borderRadius: 14, border: "none", background: "rgba(0,40,85,0.08)", color: "rgba(0,40,85,0.35)", cursor: "not-allowed", fontFamily: "'Nunito Sans', sans-serif" }}>
                        Need {deficit} more pts
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); setTierInfoId(tierInfoId === reward.id ? null : reward.id); }}
                      style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", padding: 4, color: "#4A6FA5" }} aria-label="Tier info"><Info size={16} /></button>
                  </div>

                  {tierInfoId === reward.id && (
                    <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", width: 280, padding: 20, zIndex: 20, marginBottom: 8, background: "#FFFFFF", border: "1px solid rgba(0,40,85,0.15)", boxShadow: "0 8px 32px rgba(0,40,85,0.2)", borderRadius: 16 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#002855", margin: "0 0 8px" }}>Value by Tier</p>
                      <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                        <tbody>
                          {[1, 2, 3].map((t) => (
                            <tr key={t} style={{ borderBottom: "1px solid rgba(0,40,85,0.08)", background: t === 1 ? "#FFF3E0" : "transparent" }}>
                              <td style={{ padding: "6px 0", fontWeight: 600, color: t === 1 ? "#002855" : "#94A3B8", borderLeft: t === 1 ? "3px solid #F7941D" : "3px solid transparent", paddingLeft: 8 }}>Tier {t}</td>
                              <td style={{ padding: "6px 0", textAlign: "right", color: t === 1 ? "#002855" : "#94A3B8" }}>${(reward.dollar_value * t).toFixed(2)}</td>
                              <td style={{ padding: "6px 0", textAlign: "right", color: t === 1 ? "#002855" : "#94A3B8" }}>{reward.points_required * t} pts</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {isGiftCard && (
                    <div style={{ maxHeight: giftCardOpen ? 480 : 0, overflowY: giftCardOpen ? "auto" : "hidden", transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)", borderRadius: "0 0 16px 16px" }}>
                      <div style={{ background: "rgba(248,250,252,0.95)", border: giftCardOpen ? "1px solid rgba(0,40,85,0.1)" : "none", borderTop: "none", borderRadius: "0 0 16px 16px", padding: giftCardOpen ? 16 : "0 16px", transition: "padding 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
                        {GIFT_CARDS.map((gc) => {
                          const canAfford = points >= gc.points;
                          const gcDef = gc.points - points;
                          return (
                            <div key={gc.name} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.8)", marginBottom: 8, gap: 14, border: "1px solid rgba(0,40,85,0.08)", minHeight: 72 }}>
                              <div style={{ flexShrink: 0 }}>{gc.tile()}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, color: "#002855", fontSize: 15 }}>{gc.name}</div>
                                <div style={{ fontSize: 12, color: "#4A6FA5" }}>Tier {gc.tier} · {gc.points} pts</div>
                              </div>
                              <div style={{ fontWeight: 800, color: "#F7941D", fontSize: 18, marginRight: 12 }}>${gc.amount.toFixed(2)}</div>
                              <button disabled={!canAfford}
                                onClick={() => { setPoints((p) => p - gc.points); setSuccessReward(gc.name + " Gift Card"); setGiftCardOpen(false); }}
                                style={{ background: canAfford ? "linear-gradient(135deg, #F7941D, #E8830A)" : "#E2E8F0", color: canAfford ? "#fff" : "#94A3B8", border: "none", borderRadius: 10, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: canAfford ? "pointer" : "not-allowed", fontFamily: "'Nunito Sans', sans-serif", whiteSpace: "nowrap" }}>
                                {canAfford ? "Redeem" : `Need ${gcDef}`}
                              </button>
                            </div>
                          );
                        })}
                        <button onClick={() => setGiftCardOpen(false)} style={{ width: "100%", marginTop: 4, padding: "8px 0", background: "none", border: "none", fontSize: 13, fontWeight: 600, color: "#4A6FA5", cursor: "pointer" }}>▲ Hide options</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {redeemingReward && (
        <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setRedeemedId(null); }} onKeyDown={(e) => { if (e.key === "Escape") setRedeemedId(null); }}>
          <div style={{ background: "white", borderRadius: 24, padding: 32, maxWidth: 420, width: "90%", textAlign: "center", position: "relative", boxShadow: "0 24px 80px rgba(0,40,85,0.25)" }}>
            <button onClick={() => setRedeemedId(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", padding: 4, color: "#4A6FA5" }} aria-label="Close"><X size={24} /></button>
            <redeemingReward.Icon size={48} style={{ color: "#F7941D", margin: "0 auto 16px", display: "block" }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--navy)", margin: "0 0 8px" }}>Redeem {redeemingReward.name}?</h3>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: "0 0 24px" }}>This will cost <strong style={{ color: "var(--orange)" }}>{redeemingReward.points_required} pts</strong> from your balance.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="btn-secondary" onClick={() => setRedeemedId(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleConfirmRedeem}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {successReward && (
        <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
          onClick={() => setSuccessReward(null)} onKeyDown={(e) => { if (e.key === "Escape") setSuccessReward(null); }}>
          <div style={{ background: "white", borderRadius: 24, padding: 32, maxWidth: 400, width: "90%", textAlign: "center", boxShadow: "0 24px 80px rgba(0,40,85,0.25)" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(120,190,32,0.12)", color: "#78BE20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px" }}>✓</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--navy)", margin: "0 0 8px" }}>Redeemed!</h3>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: "0 0 20px" }}>Your {successReward} is on its way.</p>
            <button className="btn-primary" onClick={() => setSuccessReward(null)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
