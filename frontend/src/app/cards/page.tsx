"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  BarChart3,
  Settings,
  Plus,
  DollarSign,
  X,
} from "lucide-react";
import AddCardModal from "@/components/AddCardModal";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchCards, fetchPoints } from "@/lib/api";
import type { Card as CardType, Points } from "@/lib/api";
import { MOCK_CARDS } from "@/data/mockData";
import { CardDisplay } from "@/components/CardDisplay";
import styles from "./Cards.module.css";

const MOCK_POINTS: Points = { value: 1240 };

const ITEMIZED_DATA: Record<string, { id: number; vendor: string; category: string; amount: number; time?: string; date?: string }[]> = {
  day: [
    { id: 1, vendor: "Chipotle", category: "Eating Out", amount: 14.75, time: "12:32 PM" },
    { id: 2, vendor: "Giant Eagle", category: "Grocery", amount: 28.97, time: "9:15 AM" },
    { id: 3, vendor: "Shell Gas", category: "Transportation", amount: 16.00, time: "8:02 AM" },
    { id: 4, vendor: "Spotify", category: "Entertainment", amount: 10.00, time: "12:00 AM" },
    { id: 5, vendor: "Starbucks", category: "Eating Out", amount: 6.45, time: "7:48 AM" },
    { id: 6, vendor: "CVS Pharmacy", category: "Health", amount: 13.30, time: "2:15 PM" },
  ],
  week: [
    { id: 1, vendor: "Giant Eagle", category: "Grocery", amount: 67.40, date: "Mon Feb 24" },
    { id: 2, vendor: "Chipotle", category: "Eating Out", amount: 14.75, date: "Mon Feb 24" },
    { id: 3, vendor: "Shell Gas", category: "Transportation", amount: 42.50, date: "Tue Feb 25" },
    { id: 4, vendor: "Landlord", category: "Housing", amount: 300.00, date: "Wed Feb 26" },
    { id: 5, vendor: "Netflix", category: "Entertainment", amount: 15.99, date: "Wed Feb 26" },
    { id: 6, vendor: "Starbucks", category: "Eating Out", amount: 18.45, date: "Thu Feb 27" },
    { id: 7, vendor: "Giant Eagle", category: "Grocery", amount: 89.00, date: "Thu Feb 27" },
    { id: 8, vendor: "UPMC", category: "Health", amount: 60.00, date: "Fri Feb 28" },
    { id: 9, vendor: "Uber Eats", category: "Eating Out", amount: 32.80, date: "Fri Feb 28" },
    { id: 10, vendor: "H&M", category: "Clothes", amount: 55.00, date: "Sat Mar 1" },
  ],
  month: [
    { id: 1, vendor: "Landlord", category: "Housing", amount: 1200.00, date: "Feb 1" },
    { id: 2, vendor: "Duquesne Light", category: "Utilities", amount: 89.99, date: "Feb 2" },
    { id: 3, vendor: "Giant Eagle", category: "Grocery", amount: 112.40, date: "Feb 3" },
    { id: 4, vendor: "Chipotle", category: "Eating Out", amount: 14.75, date: "Feb 3" },
    { id: 5, vendor: "Shell Gas", category: "Transportation", amount: 55.00, date: "Feb 5" },
    { id: 6, vendor: "Netflix", category: "Entertainment", amount: 15.99, date: "Feb 7" },
    { id: 7, vendor: "Spotify", category: "Entertainment", amount: 10.00, date: "Feb 7" },
    { id: 8, vendor: "UPMC", category: "Health", amount: 120.00, date: "Feb 8" },
    { id: 9, vendor: "Giant Eagle", category: "Grocery", amount: 98.60, date: "Feb 10" },
    { id: 10, vendor: "Starbucks", category: "Eating Out", amount: 24.75, date: "Feb 11" },
    { id: 11, vendor: "H&M", category: "Clothes", amount: 89.99, date: "Feb 12" },
    { id: 12, vendor: "Taco Bell", category: "Eating Out", amount: 18.45, date: "Feb 13" },
    { id: 13, vendor: "BP Gas", category: "Transportation", amount: 60.00, date: "Feb 14" },
    { id: 14, vendor: "Giant Eagle", category: "Grocery", amount: 134.20, date: "Feb 17" },
    { id: 15, vendor: "Anthropologie", category: "Clothes", amount: 200.00, date: "Feb 18" },
    { id: 16, vendor: "Uber Eats", category: "Eating Out", amount: 38.50, date: "Feb 19" },
    { id: 17, vendor: "UPMC", category: "Health", amount: 260.00, date: "Feb 21" },
    { id: 18, vendor: "AMC Theaters", category: "Entertainment", amount: 28.50, date: "Feb 22" },
    { id: 19, vendor: "Giant Eagle", category: "Grocery", amount: 145.80, date: "Feb 24" },
    { id: 20, vendor: "Nike", category: "Clothes", amount: 130.00, date: "Feb 28" },
  ],
};

const PERIOD_TOTALS: Record<string, { total: number; label: string }> = {
  day: { total: 89.47, label: "Today — March 1, 2026" },
  week: { total: 623.18, label: "This Week — Feb 23 – Mar 1" },
  month: { total: 4250.00, label: "February 2026" },
};

const CAT_COLORS: Record<string, string> = {
  "Housing": "#002855", "Grocery": "#003D62", "Eating Out": "#0069AA",
  "Transportation": "#3387BB", "Health": "#66A5CC", "Clothes": "#EF9D52",
  "Entertainment": "#F7941D", "Utilities": "#E8830A", "Childcare": "#BC6A1F",
};

type DisplayCard = {
  id: string;
  name: string;
  behaviorDescription: string;
  spendingList: { id: string; cost: number; vendor: string; category: string }[];
  total: number;
  imageSrc: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

function CardItem({ card, index }: { card: DisplayCard; index: number }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className={styles.cardTile}
    >
      <CardDisplay
        src={card.imageSrc}
        alt={card.name}
        width={220}
        height={138}
      />
      <div style={{ marginTop: 16, textAlign: "center", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 4 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#002855", lineHeight: 1.3, margin: 0 }}>
            {card.name}
          </h3>
          <AdjustSpendingButton cardId={card.id} cardName={card.name} />
          <Link
            href="/settings"
            style={{ padding: 4, color: "#4A6FA5", borderRadius: 6, display: "inline-flex" }}
            aria-label="Card settings"
          >
            <Settings style={{ width: 16, height: 16 }} />
          </Link>
        </div>
        <p style={{ fontSize: 14, color: "#4A6FA5", margin: "4px 0" }}>
          {card.behaviorDescription}
        </p>
        <p style={{ fontSize: 18, fontWeight: 700, color: "#F7941D", margin: "8px 0 0" }}>
          ${card.total.toFixed(2)} this month
        </p>
      </div>
    </motion.div>
  );
}

function AdjustSpendingButton({ cardName }: { cardId: string; cardName: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          style={{
            padding: 4,
            borderRadius: 6,
            color: "#4A6FA5",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "inline-flex",
          }}
          aria-label="Adjust spending"
        >
          <DollarSign style={{ width: 16, height: 16 }} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm" style={{ background: "#002855", borderColor: "rgba(255,255,255,0.2)" }}>
        <DialogHeader>
          <DialogTitle style={{ color: "white", fontSize: 20 }}>
            Adjust spending · {cardName}
          </DialogTitle>
        </DialogHeader>
        <p style={{ fontSize: 14, color: "#A8C4E0" }}>
          Set round-up percentage or spending limits for this card. Configure in Settings.
        </p>
        <Link
          href="/settings"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            background: "#F7941D",
            color: "white",
            padding: "8px 16px",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            transition: "background 0.2s",
          }}
        >
          Go to Settings
        </Link>
      </DialogContent>
    </Dialog>
  );
}

function mapApiCardToDisplay(card: CardType) {
  const total = card.spending_list.reduce((s, p) => s + p.cost, 0);
  const topCategory =
    card.spending_list.length > 0
      ? card.spending_list.reduce(
          (acc, p) => {
            acc[p.category] = (acc[p.category] ?? 0) + p.cost;
            return acc;
          },
          {} as Record<string, number>
        )
      : {};
  const mainCategory = Object.entries(topCategory).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];
  const labels: Record<string, string> = {
    grocery: "Groceries",
    eating_out: "Dining out",
    entertainment: "Entertainment",
    clothes_shoes: "Clothes & shoes",
    transportation: "Transportation",
    utilities: "Utilities",
  };
  return {
    id: card.id,
    name: card.name,
    behaviorDescription: mainCategory
      ? `Main spending: ${labels[mainCategory] ?? mainCategory}`
      : "No recent spending",
    spendingList: card.spending_list,
    total,
    imageSrc: card.image_src ?? "/images/PNCdebitcard.jpg",
  };
}

const BudgetAnalysisHeroDynamic = dynamic(
  () =>
    import("@/components/BudgetAnalysisHero").then((m) => ({
      default: m.BudgetAnalysisHero,
    })),
  { ssr: false }
);

export default function CardsPage() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [points, setPoints] = useState<Points>(MOCK_POINTS);
  const [error, setError] = useState<string | null>(null);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [breakdownPeriod, setBreakdownPeriod] = useState("month");

  useEffect(() => {
    async function load() {
      try {
        const [c, p] = await Promise.all([
          fetchCards(),
          fetchPoints(),
        ]);
        setCards(c);
        setPoints(p);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch");
        setCards(
          MOCK_CARDS.map((mc) => ({
            id: mc.id,
            name: mc.name,
            spending_list: mc.spendingList,
            image_src: mc.imageSrc,
          }))
        );
        setPoints(MOCK_POINTS);
      }
    }
    load();
  }, []);

  const displayCards = cards.length
    ? cards.map(mapApiCardToDisplay)
    : MOCK_CARDS.map((mc) => ({
        id: mc.id,
        name: mc.name,
        behaviorDescription: mc.behaviorDescription,
        spendingList: mc.spendingList,
        total: mc.spendingList.reduce((s, p) => s + p.cost, 0),
        imageSrc: mc.imageSrc,
      }));

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 96 }}>
      {/* Page sub-header */}
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "16px 24px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#002855", margin: 0 }}>Cards</h1>
          <p style={{ fontSize: 14, color: "#4A6FA5", margin: "2px 0 0" }}>
            Card data · Spending · Points
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#F7941D", margin: 0 }}>
            {points.value.toLocaleString()}
          </p>
          <p style={{ fontSize: 12, color: "#4A6FA5", margin: 0 }}>points</p>
        </div>
      </div>

      {error && (
        <div
          style={{
            margin: "80px 24px 0",
            borderRadius: 8,
            background: "rgba(247,148,29,0.1)",
            border: "1px solid rgba(247,148,29,0.3)",
            padding: "8px 16px",
            color: "#002855",
            fontSize: 14,
          }}
        >
          {error}. Using mock data.
        </div>
      )}

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "16px 24px 0", display: "flex", flexDirection: "column", gap: 48 }}>
        {/* Budget Analysis */}
        <section aria-labelledby="budget-heading">
          <h2 id="budget-heading" className={styles.sectionHeader}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BarChart3 style={{ width: 24, height: 24 }} />
              Budget Analysis
            </span>
          </h2>
          <div style={{ marginTop: 16 }}>
            <BudgetAnalysisHeroDynamic />
          </div>
        </section>

        <button type="button" onClick={() => setShowBreakdown(true)}
          style={{ width: "100%", padding: "14px 0", borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s ease", border: "2px solid #002855", background: "white", color: "#002855", fontFamily: "'Nunito Sans', sans-serif" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#002855"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#002855"; }}
        >
          View Itemized Breakdown
        </button>

        {/* Daily Questions */}
        <Link href="/cards/daily-questions" className={styles.dailyQuestionsBtn}>
          Daily Questions
        </Link>

        {/* Your Cards */}
        <section aria-labelledby="your-cards-heading">
          <h2 id="your-cards-heading" className={styles.sectionHeader}>
            Your Cards
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 16 }}>
            {displayCards.map((card, i) => (
              <CardItem key={card.id} card={card} index={i} />
            ))}
            <button type="button" onClick={() => setAddCardOpen(true)} className={styles.addCardTile}>
              <Plus style={{ width: 40, height: 40, color: "#F7941D" }} />
              <span style={{ fontWeight: 700, fontSize: 18, color: "#002855" }}>Add a Card</span>
            </button>
          </div>
        </section>
      </main>

      <AddCardModal
        open={addCardOpen}
        onClose={() => setAddCardOpen(false)}
        onSuccess={() => {
          setToast(true);
          setTimeout(() => setToast(false), 3000);
        }}
      />

      {toast && (
        <div
          style={{
            position: "fixed",
            top: 80,
            right: 24,
            zIndex: 300,
            background: "#78BE20",
            color: "white",
            padding: "12px 24px",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 15,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            animation: "fadeSlideUp 0.3s ease forwards",
          }}
        >
          Card added successfully!
        </div>
      )}

      {showBreakdown && (() => {
        const items = ITEMIZED_DATA[breakdownPeriod] ?? ITEMIZED_DATA.month;
        const info = PERIOD_TOTALS[breakdownPeriod] ?? PERIOD_TOTALS.month;
        return (
          <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,20,50,0.6)", backdropFilter: "blur(4px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowBreakdown(false); }} onKeyDown={(e) => { if (e.key === "Escape") setShowBreakdown(false); }}>
            <div style={{ background: "#FFFFFF", borderRadius: 24, width: "min(600px, 90vw)", maxHeight: "75vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,85,0.25)" }}>
              <div style={{ padding: "24px 28px 16px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: "#002855", margin: 0 }}>Itemized Breakdown</h3>
                  <p style={{ fontSize: 13, color: "#4A6FA5", margin: "4px 0 0" }}>{info.label} — {items.length} transactions</p>
                  <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                    {(["day", "week", "month"] as const).map((pk) => (
                      <button key={pk} type="button" onClick={() => setBreakdownPeriod(pk)}
                        style={{ padding: "4px 14px", borderRadius: 9999, fontWeight: 600, fontSize: 12, cursor: "pointer", border: "2px solid #002855", background: breakdownPeriod === pk ? "#002855" : "white", color: breakdownPeriod === pk ? "white" : "#002855", fontFamily: "'Nunito Sans', sans-serif" }}>
                        {pk === "day" ? "Day" : pk === "week" ? "Week" : "Month"}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setShowBreakdown(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#4A6FA5" }} aria-label="Close"><X size={24} /></button>
              </div>
              <div style={{ overflowY: "auto", padding: "16px 28px 24px", flex: 1 }}>
                {items.map((item, idx) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", padding: "12px 0", borderBottom: idx < items.length - 1 ? "1px solid #F0F4F9" : "none", gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: CAT_COLORS[item.category] ?? "#94A3B8", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#002855" }}>{item.vendor}</div>
                      <div style={{ fontSize: 12, color: "#4A6FA5" }}>{item.category}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{item.time ?? item.date}</div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#002855" }}>-${item.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "16px 28px", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: "#4A6FA5" }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: "#002855" }}>${info.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
