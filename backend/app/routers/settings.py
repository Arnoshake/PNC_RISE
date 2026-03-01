from fastapi import APIRouter

from app.models.card import CardSettings, CardSettingsUpdate

router = APIRouter()

# Mock data for B2 settings - replace with real data source
MOCK_SETTINGS: dict[int, CardSettings] = {
    1: CardSettings(card_id=1, round_up_percentage=5.0, is_active=True),
    2: CardSettings(card_id=2, round_up_percentage=5.0, is_active=True),
}


@router.get("/{card_id}", response_model=CardSettings)
def get_card_settings(card_id: int):
    """Get round-up settings for a card (B2 slider)."""
    if card_id not in MOCK_SETTINGS:
        return CardSettings(card_id=card_id, round_up_percentage=5.0, is_active=True)
    return MOCK_SETTINGS[card_id]


@router.put("/{card_id}", response_model=CardSettings)
def update_card_settings(card_id: int, payload: CardSettingsUpdate):
    """Update round-up percentage (B2 slider)."""
    existing = MOCK_SETTINGS.get(card_id, CardSettings(card_id=card_id, round_up_percentage=5.0))
    updated = CardSettings(
        card_id=card_id,
        round_up_percentage=payload.round_up_percentage,
        is_active=existing.is_active,
    )
    MOCK_SETTINGS[card_id] = updated
    return updated
