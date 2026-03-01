from pydantic import BaseModel


class Purchase(BaseModel):
    """Single purchase - links to Card spending list. DATA: Id, Cost, Vendor, Category."""

    id: str
    cost: float
    vendor: str
    category: str


class Points(BaseModel):
    """User's points balance. DATA: Value (static)."""

    value: int


class Reward(BaseModel):
    """Redeemable reward. DATA: Id, Name, points."""

    id: str
    name: str
    points: int
