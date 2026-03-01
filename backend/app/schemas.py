"""
Pydantic schemas for cards, purchases, points, and rewards.
Used for request/response validation and API contract.
"""

from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Points (static configuration)
# ---------------------------------------------------------------------------


class Points:
    """Static points configuration. Value = points earned per unit of spending (e.g. 1 = 1 point per dollar)."""

    value: Decimal = Decimal("1")


# Alias for use in calculations
POINTS_PER_UNIT = Points.value


# ---------------------------------------------------------------------------
# Purchase
# ---------------------------------------------------------------------------


class Purchase(BaseModel):
    """A single purchase on a card."""

    id: UUID
    cost: Decimal
    vendor: str
    category: str

    model_config = {"json_encoders": {Decimal: str}}


class PurchaseCreate(BaseModel):
    """Request body for adding a purchase (id is assigned by backend)."""

    cost: Decimal
    vendor: str
    category: str

    model_config = {"json_encoders": {Decimal: str}}


# ---------------------------------------------------------------------------
# DebitCreditCard
# ---------------------------------------------------------------------------


class DebitCreditCard(BaseModel):
    """Card with nested list of purchases."""

    id: UUID
    name: str
    spending_list: list[Purchase] = Field(default_factory=list, alias="spending_list")

    model_config = {"json_encoders": {Decimal: str}, "populate_by_name": True}


# ---------------------------------------------------------------------------
# Reward
# ---------------------------------------------------------------------------


class Reward(BaseModel):
    """Redeemable reward with a point cost."""

    id: UUID
    name: str
    point_cost: int


# ---------------------------------------------------------------------------
# Response helpers
# ---------------------------------------------------------------------------


class PointsSummary(BaseModel):
    """Total points for a card (sum of purchase costs × Points.value)."""

    card_id: UUID
    total_points: Decimal
    total_spend: Decimal

    model_config = {"json_encoders": {Decimal: str}}
