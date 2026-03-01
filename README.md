# PNC Rise

Financial literacy web app for young adults – understand how daily finances affect your future.

## Tech Stack

- **Frontend:** Next.js 15, React, Tailwind CSS
- **Backend:** FastAPI (Python)
- **Methodology:** MVC

## Project Structure

```
PNC_RISE/
├── frontend/                 # Next.js 15 app
│   └── src/
│       ├── app/              # App router pages
│       │   ├── page.tsx      # A1 Cards (home)
│       │   ├── daily-questions/
│       │   ├── settings/
│       │   ├── rewards/
│       │   ├── growth/
│       │   ├── faq/
│       │   └── profile/
│       ├── components/
│       │   └── Navigation/   # A–F nav menu
│       └── lib/
│           └── api.ts        # API client (matches backend Pydantic)
├── backend/                  # FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── models/           # Pydantic models
│   │   ├── schemas/
│   │   └── routers/          # budget, cards, settings
│   └── requirements.txt
└── _bmad-output/
    └── implementation-artifacts/
        └── pnc-rise-api-spec.md
```

## Design Tokens

- **River Bed (text):** `#424A56`
- **Christine (accent/buttons):** `#ED6E09`

## Run Locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # or `.venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Cards page (A1) is the default home.

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/budget/breakdown` | A1 pie chart data |
| `GET /api/cards` | A1 cards list |
| `GET /api/settings/{card_id}` | B2 card round-up % |
| `PUT /api/settings/{card_id}` | B2 update round-up % |

## Navigation (A–F)

- **A.** Cards / Home
- **B.** Settings
- **C.** Rewards
- **D.** Retirement Growth
- **E.** FAQ
- **F.** Profile
