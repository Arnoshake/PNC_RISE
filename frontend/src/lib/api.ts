/**
 * API client - types match backend Pydantic models (_bmad-output spec)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const FETCH_TIMEOUT_MS = 3000;

async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

// A1 Budget / Pie Chart
export interface CategorySpending {
  category: string;
  label: string;
  amount: number;
  percentage: number;
  group: "basic_living" | "discretionary";
}

export interface BudgetBreakdown {
  total_spending: number;
  categories: CategorySpending[];
  period: string;
}

export async function fetchBudgetBreakdown(): Promise<BudgetBreakdown> {
  const res = await fetchWithTimeout(`${API_BASE}/api/budget/breakdown`);
  if (!res.ok) throw new Error("Failed to fetch budget breakdown");
  return res.json();
}

// A1 Cards
export interface Card {
  id: string;
  title: string;
  description: string;
  image_url: string;
  main_spending_category: string;
  total_spending: number;
  ai_suggestions?: string | null;
}

export async function fetchCards(): Promise<Card[]> {
  const res = await fetchWithTimeout(`${API_BASE}/api/cards`);
  if (!res.ok) throw new Error("Failed to fetch cards");
  return res.json();
}

// B2 Settings
export interface CardSettings {
  card_id: string;
  round_up_percentage: number;
  is_active: boolean;
}

export interface CardSettingsUpdate {
  round_up_percentage: number;
}

export async function fetchCardSettings(cardId: string): Promise<CardSettings> {
  const res = await fetch(`${API_BASE}/api/settings/${cardId}`);
  if (!res.ok) throw new Error("Failed to fetch card settings");
  return res.json();
}

export async function updateCardSettings(
  cardId: string,
  payload: CardSettingsUpdate
): Promise<CardSettings> {
  const res = await fetch(`${API_BASE}/api/settings/${cardId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update card settings");
  return res.json();
}
