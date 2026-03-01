from fastapi import APIRouter

from app.schemas import Reward

router = APIRouter()

# In-memory store for rewards - replace with real data source
REWARDS_STORE: list[Reward] = [
    Reward(
        id=1,
        name="$10 Amazon Gift Card",
        point_cost=1000,
    ),
    Reward(
        id=2,
        name="$25 Visa Prepaid",
        point_cost=2500,
    ),
    Reward(
        id=3,
        name="Free Coffee",
        point_cost=150,
    ),
]


@router.get("", response_model=list[Reward])
def list_rewards():
    """List all available rewards."""
    return REWARDS_STORE
