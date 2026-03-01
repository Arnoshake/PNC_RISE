import json
from collections import Counter
from decimal import Decimal

from fastapi import APIRouter, HTTPException
from openai import AsyncOpenAI

from app.config import OPENAI_API_KEY
from app.models.card import Card
from app.schemas import (
    CardAnalytics,
    DebitCreditCard,
    Insight,
    Purchase,
    PurchaseCreate,
    Points,
)

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

# Next id for new purchases (increment when assigning)
_purchase_id_counter = 1000

# In-memory store for DebitCreditCard (new implementation) - keyed by card id (int)
CARDS_STORE: dict[int, DebitCreditCard] = {
    1: DebitCreditCard(
        id=1,
        name="Chase Sapphire",
        spending_list=[
            Purchase(
                id=1,
                cost=Decimal("45.99"),
                vendor="Whole Foods",
                category="grocery",
            ),
            Purchase(
                id=2,
                cost=Decimal("28.50"),
                vendor="Chipotle",
                category="dining",
            ),
        ],
    ),
    2: DebitCreditCard(
        id=2,
        name="Discover Cashback",
        spending_list=[],
    ),
}

# Insight engine config (Decimal for precision)
CATEGORY_SPENDING_THRESHOLD = Decimal("100")  # alert when category spend exceeds this
SAVING_SUGGESTION_PCT = Decimal("0.15")  # suggest reducing by 15%
POINT_MILESTONE = Decimal("1000")  # milestone to compare against

# OpenAI response format: JSON array of {"type": "alert"|"tip", "message": "text", "impact_value": number}
INSIGHT_SCHEMA_INSTRUCTION = (
    'Return only a valid JSON array of exactly 3 objects. Each object must have: '
    '"type" (string, one of "alert" or "tip"), "message" (string), "impact_value" (number). '
    'Example: [{"type": "alert", "message": "You spent a lot on dining.", "impact_value": 25.5}]'
)


async def get_ai_insights(spending_list: list[Purchase]) -> list[Insight] | None:
    """
    Call OpenAI to generate 3 actionable insights from the card's spending list.
    Returns None if API key is missing or the request fails (caller should fall back to static insights).
    """
    if not OPENAI_API_KEY or OPENAI_API_KEY.strip() == "PASTE_YOUR_KEY_HERE":
        return None
    purchases_json = json.dumps(
        [p.model_dump(mode="json") for p in spending_list],
        indent=2,
    )
    system_content = (
        "You are a specialized financial assistant for college students. "
        "Analyze the provided JSON list of card purchases and return 3 actionable, data-driven insights. "
        + INSIGHT_SCHEMA_INSTRUCTION
    )
    try:
        client = AsyncOpenAI(api_key=OPENAI_API_KEY)
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_content},
                {"role": "user", "content": f"Card purchases (JSON):\n{purchases_json}"},
            ],
            temperature=0.3,
        )
        content = response.choices[0].message.content
        if not content:
            return None
        # Strip markdown code fence if present
        text = content.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines)
        raw = json.loads(text)
        if not isinstance(raw, list) or len(raw) == 0:
            return None
        insights: list[Insight] = []
        for item in raw[:3]:
            if not isinstance(item, dict):
                continue
            t = item.get("type") or "tip"
            msg = item.get("message") or ""
            try:
                impact = Decimal(str(item.get("impact_value", 0)))
            except Exception:
                impact = Decimal("0")
            insights.append(Insight(type=t, message=msg, impact_value=impact))
        return insights if insights else None
    except Exception:
        return None


def _generate_insights(spending_list: list[Purchase], total_points: Decimal) -> list[Insight]:
    """Generate data-driven insights from spending_list. Uses Decimal for all financial logic."""
    insights: list[Insight] = []

    if not spending_list:
        return insights

    # Category thresholds: spending_alert when a category exceeds threshold
    category_spend: dict[str, Decimal] = {}
    for p in spending_list:
        category_spend[p.category] = category_spend.get(p.category, Decimal("0")) + p.cost

    for category, spend in category_spend.items():
        if spend >= CATEGORY_SPENDING_THRESHOLD:
            suggested_saving = (spend * SAVING_SUGGESTION_PCT).quantize(Decimal("0.01"))
            insights.append(
                Insight(
                    type="spending_alert",
                    message=f"Spending in '{category}' is ${spend} (over ${CATEGORY_SPENDING_THRESHOLD}). Consider reducing by {int(SAVING_SUGGESTION_PCT * 100)}% to save ~${suggested_saving}.",
                    impact_value=suggested_saving,
                )
            )

    # Vendor frequency: loyalty_tip for most frequent vendor
    vendor_counts = Counter(p.vendor for p in spending_list)
    if vendor_counts:
        top_vendor, count = vendor_counts.most_common(1)[0]
        vendor_spend = sum(p.cost for p in spending_list if p.vendor == top_vendor)
        insights.append(
            Insight(
                type="loyalty_tip",
                message=f"You shopped at {top_vendor} {count} time(s) (${vendor_spend}). Check for a loyalty or rewards program.",
                impact_value=vendor_spend,
            )
        )

    # Point milestones: how close to POINT_MILESTONE
    points_int = int(total_points)
    if points_int < int(POINT_MILESTONE):
        gap = int(POINT_MILESTONE) - points_int
        insights.append(
            Insight(
                type="point_milestone",
                message=f"You're {gap} points away from the {int(POINT_MILESTONE)}-point milestone. Keep spending to unlock rewards.",
                impact_value=Decimal(gap),
            )
        )
    else:
        insights.append(
            Insight(
                type="point_milestone",
                message=f"You've reached the {int(POINT_MILESTONE)}-point milestone. Consider redeeming rewards.",
                impact_value=Decimal("0"),
            )
        )

    return insights


def _get_card(card_id: int) -> DebitCreditCard:
    """Raise 404 if card not found."""
    if card_id not in CARDS_STORE:
        raise HTTPException(status_code=404, detail="Card not found")
    return CARDS_STORE[card_id]


def _next_purchase_id() -> int:
    """Return next unique purchase id and increment."""
    global _purchase_id_counter
    _purchase_id_counter += 1
    return _purchase_id_counter


@router.get("", response_model=list[Card])
def list_cards():
    """Get user's cards for A1 Cards page."""
    return MOCK_CARDS


@router.get("/{card_id}", response_model=DebitCreditCard)
def get_card(card_id: int):
    """Return the card and its nested spending_list."""
    return _get_card(card_id)


@router.post("/{card_id}/purchases", response_model=Purchase, status_code=201)
def add_purchase(card_id: int, payload: PurchaseCreate):
    """Add a new purchase to a card."""
    card = _get_card(card_id)
    purchase = Purchase(
        id=_next_purchase_id(),
        cost=payload.cost,
        vendor=payload.vendor,
        category=payload.category,
    )
    card.spending_list.append(purchase)
    return purchase


@router.get("/{card_id}/points", response_model=CardAnalytics)
async def get_card_points(card_id: int):
    """Card analytics: total points/spend plus AI or static insights from spending_list."""
    card = _get_card(card_id)
    total_spend = sum(p.cost for p in card.spending_list)
    total_points = total_spend * Points.value
    insights = await get_ai_insights(card.spending_list)
    if insights is None:
        insights = _generate_insights(card.spending_list, total_points)
    return CardAnalytics(
        card_id=card_id,
        total_points=total_points,
        total_spend=total_spend,
        insights=insights,
    )
