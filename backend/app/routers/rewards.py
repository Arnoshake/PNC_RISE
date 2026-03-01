from fastapi import APIRouter

from app.models.purchase import Reward

router = APIRouter()

# Dummy rewards - Id, Name, points
MOCK_REWARDS = [
    Reward(id="r1", name="$5 Amazon Gift Card", points=500),
    Reward(id="r2", name="$10 Starbucks", points=1000),
    Reward(id="r3", name="$25 Cash Back", points=2500),
    Reward(id="r4", name="Direct Contribution $50", points=5000),
]


@router.get("", response_model=list[Reward])
def list_rewards():
    """Get redeemable rewards."""
    return MOCK_REWARDS
