/**
 * Mock data matching FastAPI SpendingCategory types.
 * Categories: Basic Living (Grocery, Housing, etc.) and Discretionary (Eating out, Entertainment).
 */

export type SpendingGroup = "basic_living" | "discretionary";

export interface SpendingCategory {
  category: string;
  label: string;
  amount: number;
  percentage: number;
  group: SpendingGroup;
}

export interface SpendingBreakdown {
  total_spending: number;
  categories: SpendingCategory[];
  period: string;
}

export interface Purchase {
  id: string;
  cost: number;
  vendor: string;
  category: string;
}

export interface CardData {
  id: string;
  name: string;
  behaviorDescription: string;
  spendingList: Purchase[];
  imageSrc: string;
}

// Basic Living: Grocery, Housing, Childcare, Utilities, Transportation, Health
// Discretionary: Eating out, Entertainment, Clothes and shoes
export const MOCK_SPENDING_CATEGORIES: SpendingCategory[] = [
  { category: "grocery", label: "Grocery", amount: 520, percentage: 12.2, group: "basic_living" },
  { category: "housing", label: "Housing", amount: 1400, percentage: 32.9, group: "basic_living" },
  { category: "childcare", label: "Childcare", amount: 0, percentage: 0, group: "basic_living" },
  { category: "utilities", label: "Utilities", amount: 180, percentage: 4.2, group: "basic_living" },
  { category: "transportation", label: "Transportation", amount: 320, percentage: 7.5, group: "basic_living" },
  { category: "health", label: "Health", amount: 150, percentage: 3.5, group: "basic_living" },
  { category: "eating_out", label: "Eating Out", amount: 450, percentage: 10.6, group: "discretionary" },
  { category: "entertainment", label: "Entertainment", amount: 280, percentage: 6.6, group: "discretionary" },
  { category: "clothes_shoes", label: "Clothes & Shoes", amount: 950, percentage: 22.4, group: "discretionary" },
];

export const MOCK_SPENDING_BREAKDOWN: SpendingBreakdown = {
  total_spending: 4250,
  period: "2025-02",
  categories: MOCK_SPENDING_CATEGORIES,
};

export const MOCK_CARDS: CardData[] = [
  {
    id: "card-1",
    name: "PNC Virtual Wallet",
    behaviorDescription: "Main spending: Groceries, dining out",
    spendingList: [
      { id: "p1", cost: 45.32, vendor: "Whole Foods", category: "grocery" },
      { id: "p2", cost: 28.5, vendor: "Chipotle", category: "eating_out" },
      { id: "p3", cost: 120, vendor: "Netflix", category: "entertainment" },
      { id: "p4", cost: 65, vendor: "Target", category: "clothes_shoes" },
    ],
    imageSrc: "/images/PNCdebitcard.jpg",
  },
  {
    id: "card-3",
    name: "Capital One Savor",
    behaviorDescription: "Main spending: Dining, entertainment",
    spendingList: [],
    imageSrc: "/images/captialonesavor.jpg",
  },
];

export const MOCK_AI_SUMMARY =
  "Your spending this month shows a healthy balance between essentials and discretionary spending. Housing (33%) and Clothes & Shoes (22%) are your largest categories. Consider setting a monthly cap on discretionary spending to accelerate savings. Your grocery and dining-out patterns suggest meal prepping could save ~15% in food costs.";
