from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import budget, cards, settings

app = FastAPI(
    title="PNC Rise API",
    description="Financial literacy web app for young adults",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(budget.router, prefix="/api/budget", tags=["budget"])
app.include_router(cards.router, prefix="/api/cards", tags=["cards"])
app.include_router(settings.router, prefix="/api/settings", tags=["settings"])


@app.get("/health")
def health():
    return {"status": "ok"}
