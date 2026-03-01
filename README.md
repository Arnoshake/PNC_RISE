# PNC Rise

Financial literacy web app for young adults – *planning your finances until the sunsets on your retirement*.

## Tech Stack

- **Frontend:** Next.js 15, React, Tailwind CSS
- **Backend:** FastAPI (Python)
- **Methodology:** MVC

## Flow (per PDF + _bmad)

1. **Landing (/**) – Retirement Growth / Your Journey. Menu pop-out.
2. **Cards** – Card data, spending list, points, pie chart, Daily Questions button.
3. **Rewards** – Points, redeemable rewards.
4. **Settings** – All card settings, slider (suggested amount based on user data).
5. **FAQ** – Scroll feature, suggestions based on card & spending data.
6. **Profile** – Saving settings, notification frequency, decision suggestions.

## Data Models

| Model    | Fields                                      |
|----------|---------------------------------------------|
| Card     | id, name, spending_list                      |
| Purchase | id, cost, vendor, category                   |
| Points   | value (static)                              |
| Reward   | id, name, points                             |

## Run Locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/cards` | Cards with spending list |
| `GET /api/points` | Points balance |
| `GET /api/rewards` | Redeemable rewards |
| `GET /api/budget/breakdown` | Pie chart data |
| `GET /api/settings/{card_id}` | Card round-up % |
| `PUT /api/settings/{card_id}` | Update round-up % |

## Navigation

- ① Growth (landing)
- A Cards
- B Rewards
- C Settings
- E FAQ
- F Profile
