from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict

from app.mock_data import (
    CARDS,
    REWARDS,
    USER_POINTS,
    SAVINGS_SETTINGS,
    USER_PROFILE,
    GROWTH_DATA,
)
from app.models import (
    Card,
    Points,
    Reward,
    SavingsSettings,
    SavingsSettingsUpdate,
    UserProfile,
    GrowthData,
    CategorySpending,
    BudgetBreakdown,
    AIRequest,
)
from app.routers import budget, cards, points, rewards, settings, spending

app = FastAPI(
    title="PNC Rise API",
    description="Financial literacy web app for young adults",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Backward-compat: keep existing routers
# ---------------------------------------------------------------------------
app.include_router(budget.router, prefix="/api/budget", tags=["budget"])
app.include_router(spending.router, prefix="/api/v1/spending", tags=["spending"])
app.include_router(cards.router, prefix="/api/cards", tags=["cards"])
app.include_router(points.router, prefix="/api/points", tags=["points"])
app.include_router(rewards.router, prefix="/api/rewards", tags=["rewards"])
app.include_router(settings.router, prefix="/api/settings", tags=["settings"])

# ---------------------------------------------------------------------------
# Category metadata for budget breakdown computation
# ---------------------------------------------------------------------------
CATEGORY_META = {
    "grocery": {"label": "Grocery", "group": "basic_living"},
    "housing": {"label": "Housing", "group": "basic_living"},
    "utilities": {"label": "Utilities", "group": "basic_living"},
    "transportation": {"label": "Transportation", "group": "basic_living"},
    "health": {"label": "Health", "group": "basic_living"},
    "childcare": {"label": "Childcare", "group": "basic_living"},
    "eating_out": {"label": "Eating Out", "group": "discretionary"},
    "entertainment": {"label": "Entertainment", "group": "discretionary"},
    "clothes_shoes": {"label": "Clothes & Shoes", "group": "discretionary"},
}


def _compute_budget_breakdown() -> BudgetBreakdown:
    totals: dict[str, float] = defaultdict(float)
    for card in CARDS:
        for p in card["spending_list"]:
            totals[p["category"]] += p["cost"]

    total_spending = sum(totals.values())
    categories = []
    for cat, amount in totals.items():
        meta = CATEGORY_META.get(cat, {"label": cat.replace("_", " ").title(), "group": "discretionary"})
        pct = round((amount / total_spending) * 100, 1) if total_spending else 0.0
        categories.append(
            CategorySpending(
                category=cat,
                label=meta["label"],
                amount=round(amount, 2),
                percentage=pct,
                group=meta["group"],
            )
        )

    return BudgetBreakdown(
        total_spending=round(total_spending, 2),
        categories=categories,
        period="2025-02",
    )


# ---------------------------------------------------------------------------
# New direct routes (take priority over router-mounted routes)
# ---------------------------------------------------------------------------


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/cards", response_model=list[Card], tags=["cards-v2"])
def get_cards():
    return CARDS


@app.get("/api/cards/{card_id}", response_model=Card, tags=["cards-v2"])
def get_card(card_id: str):
    for card in CARDS:
        if card["id"] == card_id:
            return card
    raise HTTPException(status_code=404, detail=f"Card {card_id} not found")


@app.get("/api/points", response_model=Points, tags=["points-v2"])
def get_points():
    return USER_POINTS


@app.get("/api/rewards", response_model=list[Reward], tags=["rewards-v2"])
def get_rewards():
    return REWARDS


@app.get("/api/savings-settings", response_model=list[SavingsSettings], tags=["savings"])
def get_savings_settings():
    return SAVINGS_SETTINGS


@app.put("/api/savings-settings/{card_id}", response_model=SavingsSettings, tags=["savings"])
def update_savings_settings(card_id: str, payload: SavingsSettingsUpdate):
    for entry in SAVINGS_SETTINGS:
        if entry["card_id"] == card_id:
            entry["percentage"] = payload.percentage
            return entry
    raise HTTPException(status_code=404, detail=f"No savings settings for card {card_id}")


@app.get("/api/profile", response_model=UserProfile, tags=["profile"])
def get_profile():
    return USER_PROFILE


@app.put("/api/profile", response_model=UserProfile, tags=["profile"])
def update_profile(payload: UserProfile):
    USER_PROFILE.update(payload.model_dump())
    return USER_PROFILE


@app.get("/api/growth", response_model=GrowthData, tags=["growth"])
def get_growth():
    return GROWTH_DATA


@app.get("/api/v1/spending", response_model=BudgetBreakdown, tags=["spending-v2"])
def get_spending_v2():
    return _compute_budget_breakdown()


@app.get("/api/budget/breakdown", response_model=BudgetBreakdown, tags=["budget-v2"])
def get_budget_breakdown_v2():
    return _compute_budget_breakdown()


@app.post("/api/ai/card-insight", tags=["ai"])
def ai_card_insight(payload: AIRequest):
    card_name = "your card"
    if payload.card_id:
        for card in CARDS:
            if card["id"] == payload.card_id:
                card_name = card["name"]
                break
    return {
        "insight": (
            f"Based on your {card_name} spending, your largest expense category is housing. "
            "Consider setting up automatic micro-savings of 5% on discretionary purchases "
            "to grow your retirement fund faster. You could save an additional $47/month "
            "by reducing eating-out expenses by 20%."
        )
    }


@app.post("/api/ai/budget-suggestion", tags=["ai"])
def ai_budget_suggestion(payload: AIRequest):
    return {
        "suggestion": (
            "Based on your spending patterns, we recommend setting aside "
            "6% of each purchase."
        ),
        "percentage": 0.06,
    }
