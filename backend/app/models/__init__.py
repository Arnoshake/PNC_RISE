from pydantic import BaseModel
from typing import List, Optional

from app.models.budget import CategorySpending, BudgetBreakdown
from app.models.card import Card as LegacyCard, CardSettings, CardSettingsUpdate
from app.models.purchase import Purchase as LegacyPurchase, Points as LegacyPoints, Reward as LegacyReward


class Purchase(BaseModel):
    id: str
    cost: float
    vendor: str
    category: str


class Card(BaseModel):
    id: str
    name: str
    image: str
    spending_list: List[Purchase]


class Points(BaseModel):
    value: int


class Reward(BaseModel):
    id: str
    name: str
    points_required: int
    type: str
    tier: int
    dollar_value: float


class SavingsSettings(BaseModel):
    card_id: str
    percentage: float


class SavingsSettingsUpdate(BaseModel):
    percentage: float


class Goal(BaseModel):
    label: str
    value: float


class UserProfile(BaseModel):
    name: str
    savings_intensity: float
    notification_frequency: str
    savings_goal: str
    goals: List[Goal]


class GrowthPoint(BaseModel):
    month: str
    balance: float


class GrowthData(BaseModel):
    before: List[GrowthPoint]
    after: List[GrowthPoint]


class AIRequest(BaseModel):
    card_id: Optional[str] = None


__all__ = [
    "CategorySpending",
    "BudgetBreakdown",
    "LegacyCard",
    "CardSettings",
    "CardSettingsUpdate",
    "LegacyPurchase",
    "LegacyPoints",
    "LegacyReward",
    "Purchase",
    "Card",
    "Points",
    "Reward",
    "SavingsSettings",
    "SavingsSettingsUpdate",
    "Goal",
    "UserProfile",
    "GrowthPoint",
    "GrowthData",
    "AIRequest",
]
