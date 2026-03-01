from pydantic import BaseModel
from typing import Optional


class Card(BaseModel):
    """User card with spending overview for A1 Cards page."""

    id: str
    title: str
    description: str
    image_url: str
    main_spending_category: str
    total_spending: float
    ai_suggestions: Optional[str] = None


class CardSettings(BaseModel):
    """B2 Settings - round-up percentage per card."""

    card_id: str
    round_up_percentage: float
    is_active: bool = True


class CardSettingsUpdate(BaseModel):
    """Update payload for B2 slider."""

    round_up_percentage: float
