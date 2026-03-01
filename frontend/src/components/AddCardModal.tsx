"use client";

import { useState } from "react";
import { X } from "lucide-react";

const CARD_TYPES = ["Visa", "Mastercard", "Amex"];
const COLOR_SWATCHES = ["#002855", "#F7941D", "#78BE20", "#E74C3C", "#8E44AD"];

interface AddCardModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCardModal({ open, onClose, onSuccess }: Readonly<AddCardModalProps>) {
  const [nickname, setNickname] = useState("");
  const [cardType, setCardType] = useState("Visa");
  const [last4, setLast4] = useState("");
  const [color, setColor] = useState(COLOR_SWATCHES[0]);

  if (!open) return null;

  const handleSubmit = () => {
    onClose();
    onSuccess();
    setNickname("");
    setLast4("");
    setCardType("Visa");
    setColor(COLOR_SWATCHES[0]);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,85,0.4)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 24,
          padding: 40,
          maxWidth: 480,
          width: "90%",
          position: "relative",
          boxShadow: "0 24px 80px rgba(0,40,85,0.25)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16, background: "none",
            border: "none", cursor: "pointer", padding: 4, color: "#4A6FA5",
          }}
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#002855", margin: "0 0 4px" }}>
          Add a New Card
        </h2>
        <p style={{ fontSize: 14, color: "#4A6FA5", margin: "0 0 24px" }}>
          Connect a card to start tracking your spending
        </p>

        {/* Nickname */}
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#002855", marginBottom: 6 }}>
          Card Nickname
        </label>
        <input
          type="text"
          placeholder="e.g., My Chase Sapphire"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 12,
            border: "2px solid rgba(0,40,85,0.15)", fontSize: 15,
            fontFamily: "'Nunito Sans', sans-serif", outline: "none",
            boxSizing: "border-box", marginBottom: 16,
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#F7941D"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,40,85,0.15)"; }}
        />

        {/* Card Type */}
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#002855", marginBottom: 6 }}>
          Card Type
        </label>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {CARD_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setCardType(t)}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 9999, fontSize: 13,
                fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                border: "2px solid #002855",
                background: cardType === t ? "#002855" : "white",
                color: cardType === t ? "white" : "#002855",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Last 4 */}
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#002855", marginBottom: 6 }}>
          Last 4 Digits
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          placeholder="1234"
          value={last4}
          onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
          style={{
            width: 120, padding: "12px 16px", borderRadius: 12,
            border: "2px solid rgba(0,40,85,0.15)", fontSize: 20,
            fontWeight: 700, letterSpacing: 4, textAlign: "center",
            fontFamily: "'Nunito Sans', sans-serif", outline: "none",
            marginBottom: 16, transition: "border-color 0.2s",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#F7941D"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,40,85,0.15)"; }}
        />

        {/* Card Color */}
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#002855", marginBottom: 6 }}>
          Card Color
        </label>
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          {COLOR_SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              style={{
                width: 36, height: 36, borderRadius: "50%", background: c,
                border: color === c ? "3px solid #002855" : "3px solid transparent",
                cursor: "pointer", transition: "border-color 0.2s",
                boxShadow: color === c ? "0 0 0 2px white, 0 0 0 4px #002855" : "none",
              }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={handleSubmit}
          style={{ width: "100%", fontSize: 16, padding: "14px 0" }}
        >
          Connect Card
        </button>
        <p
          onClick={onClose}
          style={{
            textAlign: "center", color: "#4A6FA5", fontSize: 14,
            marginTop: 12, cursor: "pointer",
          }}
        >
          Cancel
        </p>
      </div>
    </div>
  );
}
