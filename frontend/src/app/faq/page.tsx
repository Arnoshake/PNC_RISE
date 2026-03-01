"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, Shield } from "lucide-react";

const FINANCIAL_FAQ = [
  {
    q: "What is an IRA and why should I care?",
    a: "An Individual Retirement Account lets you invest money tax-advantaged. Traditional IRA reduces taxable income now; Roth IRA grows tax-free.",
    link: { label: "Understanding Credit and Borrowing →", href: "https://www.pnc.com/en/personal-banking/borrowing.html" },
  },
  {
    q: "What is compound interest?",
    a: "Compound interest means you earn interest on your interest. $1,000 at 7% annually becomes $7,612 in 30 years without adding anything.",
    link: { label: "Investing and Growing Your Wealth →", href: "https://www.pnc.com/en/personal-banking/investments.html" },
  },
  {
    q: "How does the 50/30/20 budget rule work?",
    a: "50% needs, 30% wants, 20% savings. RISE helps automate the 20%.",
  },
  {
    q: "What is an HSA?",
    a: "Health Savings Account with triple tax advantage: pre-tax contributions, tax-free growth, tax-free withdrawals for medical expenses.",
  },
  {
    q: "How do I start investing if I have student loans?",
    a: "Pay minimum on low-interest loans, invest the rest. High-interest debt (>7%) should be paid first.",
    link: { label: "Retirement Planning with PNC →", href: "https://www.pnc.com/en/personal-banking/retirement.html" },
  },
];

const RISE_FAQ = [
  {
    q: "Why are we moving your money?",
    a: "RISE uses an Acorns-style percentage sweep. A small % of each purchase goes to a linked retirement or savings account of your choice.",
  },
  {
    q: "How are we linking your accounts?",
    a: "Bank-grade encryption with read-only access to transaction data. We never store full card numbers.",
  },
  {
    q: "How does RISE determine savings suggestions?",
    a: "AI analysis of your spending patterns, income, and goals set in your profile.",
  },
  {
    q: "Is my data secure?",
    a: "End-to-end encryption, SOC 2 compliant, never sold to third parties.",
  },
  {
    q: "Is my data safe with PNC RISE?",
    a: "Your security is our top priority. PNC RISE uses the same bank-grade encryption and security protocols as PNC Bank itself — the same institution trusted by millions of customers. We use read-only access to your transaction data, never store full card numbers, and never sell your information to third parties.",
    link: { label: "View PNC Security & Privacy Policy →", href: "https://www.pnc.com/en/about-pnc/security-and-privacy.html" },
    icon: "shield",
  },
];

const RESOURCES = [
  {
    label: "PNC Financial Literacy Center",
    href: "https://www.pnc.com/en/about-pnc/topics/pnc-agora.html",
  },
  {
    label: "PNC Personal Banking",
    href: "https://www.pnc.com/en/personal-banking/retirement.html",
  },
];

function AccordionSection({
  title,
  items,
  expandedIndex,
  onToggle,
}: Readonly<{
  title: string;
  items: { q: string; a: string; link?: { label: string; href: string }; icon?: string }[];
  expandedIndex: number | null;
  onToggle: (i: number) => void;
}>) {
  return (
    <section>
      <h2 className="section-header" style={{ marginBottom: 20 }}>
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item, i) => {
          const isOpen = expandedIndex === i;
          return (
            <div key={item.q} className="glass-sm" style={{ overflow: "hidden" }}>
              <button
                type="button"
                onClick={() => onToggle(i)}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  textAlign: "left",
                  fontWeight: 600,
                  fontSize: 16,
                  color: "#002855",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {item.icon === "shield" && <Shield size={18} style={{ color: "#F7941D", flexShrink: 0 }} />}
                <span style={{ flex: 1 }}>{item.q}</span>
                <ChevronDown
                  size={20}
                  style={{
                    color: "#F7941D",
                    transition: "transform 0.3s ease",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    flexShrink: 0,
                  }}
                />
              </button>
              {isOpen && (
                <div
                  style={{
                    padding: "0 18px 16px",
                    borderTop: "1px solid rgba(0,40,85,0.08)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 15,
                      color: "#4A6FA5",
                      margin: "12px 0 0",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.a}
                  </p>
                  {item.link && (
                    <a
                      href={item.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{
                        display: "inline-block",
                        marginTop: 12,
                        padding: "8px 16px",
                        fontSize: 13,
                      }}
                    >
                      {item.link.label}
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function FAQPage() {
  const [financialExpanded, setFinancialExpanded] = useState<number | null>(
    null
  );
  const [riseExpanded, setRiseExpanded] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 96 }}>
      <main
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "24px 24px 0",
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {/* Financial Resources Section */}
        <div className="fade-in-1">
          <AccordionSection
            title="Financial Resources"
            items={FINANCIAL_FAQ}
            expandedIndex={financialExpanded}
            onToggle={(i) =>
              setFinancialExpanded(financialExpanded === i ? null : i)
            }
          />
        </div>

        {/* About RISE & Your Data Section */}
        <div className="fade-in-2">
          <AccordionSection
            title="About RISE & Your Data"
            items={RISE_FAQ}
            expandedIndex={riseExpanded}
            onToggle={(i) =>
              setRiseExpanded(riseExpanded === i ? null : i)
            }
          />
        </div>

        {/* Resource Links */}
        <div className="fade-in-3">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {RESOURCES.map((r) => (
              <a
                key={r.label}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-sm"
                style={{
                  flex: "1 1 260px",
                  padding: "16px 20px",
                  borderLeft: "4px solid #F7941D",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
              >
                <ExternalLink
                  size={20}
                  style={{ color: "#F7941D", flexShrink: 0 }}
                />
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#002855",
                  }}
                >
                  {r.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
