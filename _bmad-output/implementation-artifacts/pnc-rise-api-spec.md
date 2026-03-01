# PNC Rise API Specification

## Data Models (per user spec)

### Card
- **id**: str
- **name**: str
- **spending_list**: list[Purchase]

### Purchase
- **id**: str
- **cost**: float
- **vendor**: str
- **category**: str

### Points
- **value**: int (static)

### Reward
- **id**: str
- **name**: str
- **points**: int

### CardSettings (B2)
- **card_id**: str
- **round_up_percentage**: float
- **is_active**: bool

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/cards | List cards with spending list |
| GET | /api/points | Get points balance |
| GET | /api/rewards | List redeemable rewards |
| GET | /api/budget/breakdown | Budget pie chart (derived) |
| GET | /api/settings/{card_id} | Get card round-up % |
| PUT | /api/settings/{card_id} | Update card round-up % |
