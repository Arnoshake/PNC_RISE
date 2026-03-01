from pydantic import BaseModel
from typing import Literal


class CategorySpending(BaseModel):
    """Single category for pie chart - matches frontend fetch expectations."""

    category: str
    label: str
    amount: float
    percentage: float
    group: Literal["basic_living", "discretionary"]


class BudgetBreakdown(BaseModel):
    """Budget analysis response for A1 pie chart."""

    total_spending: float
    categories: list[CategorySpending]
    period: str
