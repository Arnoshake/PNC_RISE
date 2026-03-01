from fastapi import APIRouter

from app.models.card import Card
from app.models.purchase import Purchase

router = APIRouter()

# Dummy data - Card with Id, Name, Spending list (Purchases)
MOCK_PURCHASES_CARD1 = [
    Purchase(id="p1", cost=45.32, vendor="Whole Foods", category="grocery"),
    Purchase(id="p2", cost=28.50, vendor="Chipotle", category="eating_out"),
    Purchase(id="p3", cost=120.00, vendor="Netflix", category="entertainment"),
    Purchase(id="p4", cost=65.00, vendor="Target", category="clothes_shoes"),
]

MOCK_PURCHASES_CARD2 = [
    Purchase(id="p5", cost=52.00, vendor="Shell", category="transportation"),
    Purchase(id="p6", cost=89.00, vendor="Duke Energy", category="utilities"),
    Purchase(id="p7", cost=15.99, vendor="Spotify", category="entertainment"),
]

MOCK_CARDS = [
    Card(id="card-1", name="PNC Virtual Wallet", spending_list=MOCK_PURCHASES_CARD1, image_src="/images/PNCdebitcard.jpg"),
    Card(id="card-3", name="Capital One Savor", spending_list=MOCK_PURCHASES_CARD2, image_src="/images/captialonesavor.jpg"),
]


@router.get("", response_model=list[Card])
def list_cards():
    """Get user's cards with spending list."""
    return MOCK_CARDS
