from pydantic import BaseModel
from typing import Literal

class Reward(BaseModel):
    """Model for reward option"""

    id: int
    title: str
    description: str
    points_required: int
    image_url: str