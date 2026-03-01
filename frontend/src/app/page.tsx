"use client";

import Link from "next/link";
import { CreditCard, TrendingUp, Gift, HelpCircle, Star, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: CreditCard,
    title: "Smart Card Tracking",
    desc: "See your spending across all cards in one place with AI-powered insights.",
    href: "/cards",
    color: "#0069AA",
  },
  {
    icon: TrendingUp,
    title: "Growth Journey",
    desc: "Visualize your financial trajectory before and after using RISE.",
    href: "/growth",
    color: "#78BE20",
  },
  {
    icon: Gift,
    title: "Earn Rewards",
    desc: "Answer questions, save money, and redeem points for real rewards.",
    href: "/rewards",
    color: "#F7941D",
  },
  {
    icon: HelpCircle,
    title: "Financial Literacy",
    desc: "Build your knowledge with daily questions and curated resources.",
    href: "/faq",
    color: "#3387BB",
  },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", paddingBottom: 96 }}>
      {/* Hero */}
      <section
        style={{
          padding: "60px 24px 48px",
          textAlign: "center",
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        <div className="fade-in-1">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(247,148,29,0.12)",
              padding: "6px 16px",
              borderRadius: 9999,
              marginBottom: 24,
            }}
          >
            <Star size={14} style={{ color: "#F7941D", fill: "#F7941D" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#F7941D" }}>
              1,240 points earned
            </span>
          </div>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#002855",
              margin: "0 0 12px",
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
            }}
          >
            Your finances,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #F7941D, #E8830A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              rising
            </span>
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "#4A6FA5",
              maxWidth: 460,
              margin: "0 auto 36px",
              lineHeight: 1.6,
            }}
          >
            RISE automatically saves a portion of every purchase toward your
            retirement — so your future grows while you live your life.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/cards"
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                fontSize: 16,
                padding: "14px 28px",
              }}
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/growth"
              className="btn-secondary"
              style={{ textDecoration: "none" }}
            >
              View My Growth
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {FEATURES.map((f, idx) => (
            <Link
              key={f.title}
              href={f.href}
              className={`glass fade-in-${idx + 2}`}
              style={{
                padding: 24,
                textDecoration: "none",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: `${f.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <f.icon size={24} style={{ color: f.color }} />
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#002855",
                  margin: "0 0 8px",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#4A6FA5",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {f.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section
        style={{ maxWidth: 900, margin: "48px auto 0", padding: "0 24px" }}
      >
        <div className="glass fade-in-5" style={{ padding: 28 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div style={{ flex: "1 1 140px" }}>
              <p
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#F7941D",
                  margin: 0,
                }}
              >
                $847
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#4A6FA5",
                  margin: "4px 0 0",
                }}
              >
                Total Saved
              </p>
            </div>
            <div style={{ flex: "1 1 140px" }}>
              <p
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#002855",
                  margin: 0,
                }}
              >
                5%
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#4A6FA5",
                  margin: "4px 0 0",
                }}
              >
                Avg Savings Rate
              </p>
            </div>
            <div style={{ flex: "1 1 140px" }}>
              <p
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#78BE20",
                  margin: 0,
                }}
              >
                +89%
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#4A6FA5",
                  margin: "4px 0 0",
                }}
              >
                Growth Projection
              </p>
            </div>
            <div style={{ flex: "1 1 140px" }}>
              <p
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#F7941D",
                  margin: 0,
                }}
              >
                18
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#4A6FA5",
                  margin: "4px 0 0",
                }}
              >
                Questions Answered
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
