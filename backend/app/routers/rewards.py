from uuid import UUID

from fastapi import APIRouter

from app.schemas import Reward

router = APIRouter()

# In-memory store for rewards - replace with real data source
REWARDS_STORE: list[Reward] = [
    Reward(
        id=UUID("c2eedd11-be2d-6fa0-dd8f-8dd1df502c33"),
        name="$10 Amazon Gift Card",
        point_cost=1000,
    ),
    Reward(
        id=UUID("d3ffe222-cf3e-70b1-ee90-9ee2e0613d44"),
        name="$25 Visa Prepaid",
        point_cost=2500,
    ),
    Reward(
        id=UUID("e400ff33-3d04-f81c-2ff0-10ff3f0724e5"),
        name="Free Coffee",
        point_cost=150,
    ),
]


@router.get("", response_model=list[Reward])
def list_rewards():
    """List all available rewards."""
    return REWARDS_STORE
