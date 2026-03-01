from decimal import Decimal
from uuid import UUID, uuid4

from fastapi import APIRouter, HTTPException

from app.models.card import Card
from app.schemas import (
    DebitCreditCard,
    PointsSummary,
    Purchase,
    PurchaseCreate,
    Points,
)

router = APIRouter()

# Mock data for A1 cards - replace with real data source
MOCK_CARDS = [
    Card(
        id="card-1",
        title="Chase Sapphire",
        description="Primary spending: groceries, dining out",
        image_url="/cards/chase-sapphire.svg",
        main_spending_category="eating_out",
        total_spending=1250.0,
        ai_suggestions="Consider meal prepping to reduce dining out by 15%.",
    ),
    Card(
        id="card-2",
        title="Discover Cashback",
        description="Gas, utilities, subscriptions",
        image_url="/cards/discover.svg",
        main_spending_category="transportation",
        total_spending=680.0,
        ai_suggestions="Your gas spending is 12% below average. Keep it up!",
    ),
]

# In-memory store for DebitCreditCard (new implementation) - keyed by card UUID
CARDS_STORE: dict[UUID, DebitCreditCard] = {
    UUID("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"): DebitCreditCard(
        id=UUID("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"),
        name="Chase Sapphire",
        spending_list=[
            Purchase(
                id=uuid4(),
                cost=Decimal("45.99"),
                vendor="Whole Foods",
                category="grocery",
            ),
            Purchase(
                id=uuid4(),
                cost=Decimal("28.50"),
                vendor="Chipotle",
                category="dining",
            ),
        ],
    ),
    UUID("b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22"): DebitCreditCard(
        id=UUID("b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22"),
        name="Discover Cashback",
        spending_list=[],
    ),
}


def _get_card(card_id: UUID) -> DebitCreditCard:
    """Raise 404 if card not found."""
    if card_id not in CARDS_STORE:
        raise HTTPException(status_code=404, detail="Card not found")
    return CARDS_STORE[card_id]


@router.get("", response_model=list[Card])
def list_cards():
    """Get user's cards for A1 Cards page."""
    return MOCK_CARDS


@router.get("/{card_id}", response_model=DebitCreditCard)
def get_card(card_id: UUID):
    """Return the card and its nested spending_list."""
    return _get_card(card_id)


@router.post("/{card_id}/purchases", response_model=Purchase, status_code=201)
def add_purchase(card_id: UUID, payload: PurchaseCreate):
    """Add a new purchase to a card."""
    card = _get_card(card_id)
    purchase = Purchase(
        id=uuid4(),
        cost=payload.cost,
        vendor=payload.vendor,
        category=payload.category,
    )
    card.spending_list.append(purchase)
    return purchase


@router.get("/{card_id}/points", response_model=PointsSummary)
def get_card_points(card_id: UUID):
    """Calculate total points: sum(cost) * Points.value for all purchases on the card."""
    card = _get_card(card_id)
    total_spend = sum(p.cost for p in card.spending_list)
    total_points = total_spend * Points.value
    return PointsSummary(
        card_id=card_id,
        total_points=total_points,
        total_spend=total_spend,
    )
