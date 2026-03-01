from pydantic import BaseModel
from typing import Literal


class RewardsPoints(BaseModel):
    """Model for rewards points information."""

    total_points: int

