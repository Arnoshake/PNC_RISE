from fastapi import APIRouter

from app.models.budget import BudgetBreakdown, CategorySpending

router = APIRouter()

# Mock data for A1 pie chart - replace with real data source
MOCK_BUDGET = BudgetBreakdown(
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


@router.get("/breakdown", response_model=BudgetBreakdown)
def get_budget_breakdown():
    """Get budget breakdown for A1 pie chart."""
    return MOCK_BUDGET
