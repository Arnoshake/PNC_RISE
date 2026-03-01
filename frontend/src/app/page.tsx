"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { fetchBudgetBreakdown, fetchCards } from "@/lib/api";
import type { BudgetBreakdown, Card } from "@/lib/api";

const BudgetPieChart = dynamic(
  () => import("@/components/BudgetPieChart").then((m) => m.BudgetPieChart),
  { ssr: false }
);

const MOCK_BUDGET: BudgetBreakdown = {
  total_spending: 4250,
  period: "2025-02",
  categories: [
    { category: "grocery", label: "Grocery", amount: 520, percentage: 12.2, group: "basic_living" },
    { category: "housing", label: "Housing", amount: 1400, percentage: 32.9, group: "basic_living" },
    { category: "utilities", label: "Utilities", amount: 180, percentage: 4.2, group: "basic_living" },
    { category: "transportation", label: "Transportation", amount: 320, percentage: 7.5, group: "basic_living" },
    { category: "health", label: "Health", amount: 150, percentage: 3.5, group: "basic_living" },
    { category: "eating_out", label: "Eating Out", amount: 450, percentage: 10.6, group: "discretionary" },
    { category: "entertainment", label: "Entertainment", amount: 280, percentage: 6.6, group: "discretionary" },
    { category: "clothes_shoes", label: "Clothes & Shoes", amount: 950, percentage: 22.4, group: "discretionary" },
  ],
};

const MOCK_CARDS: Card[] = [
  { id: "card-1", title: "Chase Sapphire", description: "Primary spending: groceries, dining out", image_url: "", main_spending_category: "eating_out", total_spending: 1250, ai_suggestions: "Consider meal prepping to reduce dining out by 15%." },
  { id: "card-2", title: "Discover Cashback", description: "Gas, utilities, subscriptions", image_url: "", main_spending_category: "transportation", total_spending: 680, ai_suggestions: "Your gas spending is 12% below average. Keep it up!" },
];

export default function CardsPage() {
  const [budget, setBudget] = useState<BudgetBreakdown | null>(MOCK_BUDGET);
  const [cards, setCards] = useState<Card[]>(MOCK_CARDS);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [b, c] = await Promise.all([
          fetchBudgetBreakdown(),
          fetchCards(),
        ]);
        setBudget(b);
        setCards(c);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load data");
        setBudget(MOCK_BUDGET);
        setCards(MOCK_CARDS);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#424A56] pb-24">
      <header className="border-b border-[#424A56]/15 bg-white/95 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <h1 className="text-xl font-semibold text-[#424A56]">PNC Rise</h1>
          <p className="text-sm text-[#424A56]/80 mt-0.5">
            Budget Analysis
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-8">
        {error && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-amber-800 text-sm">
            {error}. Using mock data for demo.
          </div>
        )}

        <>
            {/* A1 Pie Chart */}
            <section aria-labelledby="budget-chart-heading">
              <h2 id="budget-chart-heading" className="text-lg font-semibold text-[#424A56] mb-4">
                Spending by Category
              </h2>
              <div className="rounded-xl border border-[#424A56]/15 bg-white p-4 shadow-sm">
                {budget && <BudgetPieChart categories={budget.categories} />}
                {budget && (
                  <p className="text-sm text-[#424A56]/70 mt-2 text-center">
                    Total: ${budget.total_spending.toLocaleString()} • {budget.period}
                  </p>
                )}
              </div>
            </section>

            {/* Daily Questions CTA */}
            <Link
              href="/daily-questions"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-semibold text-white bg-[#ED6E09] hover:bg-[#d66308] transition-colors shadow-md"
            >
              Daily Questions
            </Link>

            {/* Your Cards */}
            <section aria-labelledby="cards-heading">
              <h2 id="cards-heading" className="text-lg font-semibold text-[#424A56] mb-4">
                Your Cards
              </h2>
              <ul className="space-y-4">
                {cards.map((card) => (
                  <li key={card.id}>
                    <article className="flex gap-4 rounded-xl border border-[#424A56]/15 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-16 h-24 rounded-lg bg-gradient-to-br from-[#424A56]/20 to-[#ED6E09]/20 flex items-center justify-center">
                        <span className="text-2xl">💳</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#424A56]">{card.title}</h3>
                        <p className="text-sm text-[#424A56]/80 mt-0.5 line-clamp-2">
                          {card.description}
                        </p>
                        <p className="text-xs text-[#424A56]/60 mt-1">
                          ${card.total_spending.toLocaleString()} this month
                        </p>
                        {card.ai_suggestions && (
                          <p className="text-xs text-[#ED6E09] mt-1 italic">
                            {card.ai_suggestions}
                          </p>
                        )}
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
        </>
      </main>
    </div>
  );
}
