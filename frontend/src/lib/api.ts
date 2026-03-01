/**
 * API client — types match backend Pydantic models
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const FETCH_TIMEOUT_MS = 3000;

async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

/* ---------- Types ---------- */

export interface Purchase {
  id: string;
  cost: number;
  vendor: string;
  category: string;
}

export interface Card {
  id: string;
  name: string;
  spending_list: Purchase[];
  image_src?: string;
  image?: string;
}

export interface Points {
  value: number;
}

export interface Reward {
  id: string;
  name: string;
  points: number;
  points_required?: number;
  type?: string;
  tier?: number;
  dollar_value?: number;
}

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

export interface CardSettings {
  card_id: string;
  round_up_percentage: number;
  is_active: boolean;
}

export interface CardSettingsUpdate {
  round_up_percentage: number;
}

export interface SavingsSettings {
  card_id: string;
  percentage: number;
}

export interface UserProfile {
  name: string;
  savings_intensity: number;
  notification_frequency: string;
  savings_goal: string;
  goals: { label: string; value: number }[];
}

export interface GrowthDataPoint {
  month: string;
  balance: number;
}

export interface GrowthData {
  before: GrowthDataPoint[];
  after: GrowthDataPoint[];
}

/* ---------- Fetch helpers ---------- */

async function get<T>(path: string): Promise<T> {
  const res = await fetchWithTimeout(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetchWithTimeout(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed`);
  return res.json();
}

async function put<T>(path: string, body: unknown): Promise<T> {
  const res = await fetchWithTimeout(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} failed`);
  return res.json();
}

/* ---------- API calls ---------- */

export const fetchCards = () => get<Card[]>("/api/cards");
export const fetchPoints = () => get<Points>("/api/points");
export const fetchRewards = () => get<Reward[]>("/api/rewards");
export const fetchSpending = () => get<BudgetBreakdown>("/api/v1/spending");
export const fetchBudgetBreakdown = () => get<BudgetBreakdown>("/api/budget/breakdown");
export const fetchCardSettings = (id: string) => get<CardSettings>(`/api/settings/${id}`);
export const updateCardSettings = (id: string, p: CardSettingsUpdate) =>
  put<CardSettings>(`/api/settings/${id}`, p);

export const fetchSavingsSettings = () => get<SavingsSettings[]>("/api/savings-settings");
export const updateSavingsSettings = (cardId: string, pct: number) =>
  put<SavingsSettings>(`/api/savings-settings/${cardId}`, { percentage: pct });

export const fetchProfile = () => get<UserProfile>("/api/profile");
export const updateProfile = (data: Partial<UserProfile>) =>
  put<UserProfile>("/api/profile", data);

export const fetchGrowth = () => get<GrowthData>("/api/growth");

export const getAICardInsight = (cardId: string) =>
  post<{ insight: string }>("/api/ai/card-insight", { card_id: cardId });
export const getAIBudgetSuggestion = () =>
  post<{ suggestion: string; percentage: number }>("/api/ai/budget-suggestion", {});
