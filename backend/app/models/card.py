from pydantic import BaseModel
from typing import Optional

from app.models.purchase import Purchase


class Card(BaseModel):
    """User card with spending list - matches DATA spec."""

    id: str
    name: str
    spending_list: list[Purchase] = []
    image_src: str = "/images/pnc.jpg"


class CardSettings(BaseModel):
    """B2 Settings - round-up percentage per card."""

    card_id: str
    round_up_percentage: float
    is_active: bool = True


class CardSettingsUpdate(BaseModel):
    """Update payload for B2 slider."""

    round_up_percentage: float
