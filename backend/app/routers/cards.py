from fastapi import APIRouter

from app.models.card import Card

router = APIRouter()

# Mock data for A1 cards - replace with real data source
MOCK_CARDS = [
    Card(
        id=1,
        title="Chase Sapphire",
        description="Primary spending: groceries, dining out",
        image_url="/cards/chase-sapphire.svg",
        main_spending_category="eating_out",
        total_spending=1250.0,
        ai_suggestions="Consider meal prepping to reduce dining out by 15%.",
    ),
    Card(
        id=2,
        title="Discover Cashback",
        description="Gas, utilities, subscriptions",
        image_url="/cards/discover.svg",
        main_spending_category="transportation",
        total_spending=680.0,
        ai_suggestions="Your gas spending is 12% below average. Keep it up!",
    ),
]


@router.get("", response_model=list[Card])
def list_cards():
    """Get user's cards for A1 Cards page."""
    return MOCK_CARDS
