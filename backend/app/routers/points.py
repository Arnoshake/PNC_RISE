from fastapi import APIRouter

from app.models.purchase import Points

router = APIRouter()

# Points - Value (static)
MOCK_POINTS = Points(value=1240)


@router.get("", response_model=Points)
def get_points():
    """Get user's points balance."""
    return MOCK_POINTS
