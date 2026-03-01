"""
Spending API - matches SpendingCategory types for /api/v1/spending
"""

from fastapi import APIRouter

from app.models.budget import BudgetBreakdown, CategorySpending

router = APIRouter()

# Matches mockData categories: Basic Living + Discretionary
MOCK_SPENDING = BudgetBreakdown(
    total_spending=4250.0,
    period="2025-02",
    categories=[
        CategorySpending(category="grocery", label="Grocery", amount=520, percentage=12.2, group="basic_living"),
        CategorySpending(category="housing", label="Housing", amount=1400, percentage=32.9, group="basic_living"),
        CategorySpending(category="childcare", label="Childcare", amount=0, percentage=0, group="basic_living"),
        CategorySpending(category="utilities", label="Utilities", amount=180, percentage=4.2, group="basic_living"),
        CategorySpending(category="transportation", label="Transportation", amount=320, percentage=7.5, group="basic_living"),
        CategorySpending(category="health", label="Health", amount=150, percentage=3.5, group="basic_living"),
        CategorySpending(category="eating_out", label="Eating Out", amount=450, percentage=10.6, group="discretionary"),
        CategorySpending(category="entertainment", label="Entertainment", amount=280, percentage=6.6, group="discretionary"),
        CategorySpending(category="clothes_shoes", label="Clothes & Shoes", amount=950, percentage=22.4, group="discretionary"),
    ],
)


@router.get("", response_model=BudgetBreakdown)
def get_spending():
    """Get spending breakdown for Budget Analysis (pie chart)."""
    return MOCK_SPENDING
