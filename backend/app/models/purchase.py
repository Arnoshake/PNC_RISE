from pydantic import BaseModel
from typing import Optional

class Purchase(BaseModel):
    """Model for a purchase transaction."""

    id: int
    cost: float
    category: str
    date: str  # ISO format date string
    description: Optional[str] = None