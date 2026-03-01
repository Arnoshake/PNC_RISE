CARDS = [
    {
        "id": "pnc-1",
        "name": "PNC Virtual Wallet",
        "image": "PNCdebitcard.jpg",
        "spending_list": [
            {"id": "p1", "cost": 45.20, "vendor": "Giant Eagle", "category": "grocery"},
            {"id": "p2", "cost": 1200.00, "vendor": "Landlord", "category": "housing"},
            {"id": "p3", "cost": 89.99, "vendor": "Duquesne Light", "category": "utilities"},
            {"id": "p4", "cost": 34.50, "vendor": "Chipotle", "category": "eating_out"},
            {"id": "p5", "cost": 22.00, "vendor": "Spotify + Netflix", "category": "entertainment"},
            {"id": "p6", "cost": 67.30, "vendor": "Giant Eagle", "category": "grocery"},
            {"id": "p7", "cost": 120.00, "vendor": "UPMC", "category": "health"},
            {"id": "p8", "cost": 55.00, "vendor": "Shell Gas", "category": "transportation"},
            {"id": "p9", "cost": 38.99, "vendor": "H&M", "category": "clothes_shoes"},
            {"id": "p10", "cost": 25.00, "vendor": "Starbucks", "category": "eating_out"},
        ],
    },
    {
        "id": "cap1-1",
        "name": "Capital One Savor",
        "image": "captialonesavor.jpg",
        "spending_list": [
            {"id": "p11", "cost": 89.00, "vendor": "Whole Foods", "category": "grocery"},
            {"id": "p12", "cost": 44.00, "vendor": "Uber Eats", "category": "eating_out"},
            {"id": "p13", "cost": 15.00, "vendor": "AMC Theaters", "category": "entertainment"},
            {"id": "p14", "cost": 200.00, "vendor": "Anthropologie", "category": "clothes_shoes"},
            {"id": "p15", "cost": 30.00, "vendor": "BP Gas", "category": "transportation"},
        ],
    },
]

REWARDS = [
    {"id": "r1", "name": "Amazon Gift Card", "points_required": 500, "type": "gift_card", "tier": 1, "dollar_value": 5.0},
    {"id": "r2", "name": "Starbucks Gift Card", "points_required": 500, "type": "gift_card", "tier": 1, "dollar_value": 5.0},
    {"id": "r3", "name": "Cash Back", "points_required": 1000, "type": "cash_back", "tier": 2, "dollar_value": 10.0},
    {"id": "r4", "name": "Taco Bell Gift Card", "points_required": 750, "type": "gift_card", "tier": 1, "dollar_value": 7.5},
    {"id": "r5", "name": "Direct IRA Contribution", "points_required": 2000, "type": "direct_contribution", "tier": 3, "dollar_value": 25.0},
    {"id": "r6", "name": "Target Gift Card", "points_required": 1500, "type": "gift_card", "tier": 2, "dollar_value": 15.0},
]

USER_POINTS = {"value": 1240}

SAVINGS_SETTINGS = [
    {"card_id": "pnc-1", "percentage": 0.05},
    {"card_id": "cap1-1", "percentage": 0.03},
]

USER_PROFILE = {
    "name": "Jordan Casey",
    "savings_intensity": 0.6,
    "notification_frequency": "weekly",
    "savings_goal": "ira",
    "goals": [
        {"label": "Retirement Comfortability", "value": 0.7},
        {"label": "Emergency Fund Priority", "value": 0.5},
        {"label": "Short-term Savings", "value": 0.4},
    ],
}

GROWTH_DATA = {
    "before": [
        {"month": "Aug 24", "balance": 1200},
        {"month": "Sep 24", "balance": 1180},
        {"month": "Oct 24", "balance": 1100},
        {"month": "Nov 24", "balance": 1050},
        {"month": "Dec 24", "balance": 980},
        {"month": "Jan 25", "balance": 920},
    ],
    "after": [
        {"month": "Feb 25", "balance": 1050},
        {"month": "Mar 25", "balance": 1180},
        {"month": "Apr 25", "balance": 1340},
        {"month": "May 25", "balance": 1520},
        {"month": "Jun 25", "balance": 1720},
        {"month": "Jul 25", "balance": 1960},
        {"month": "Aug 25", "balance": 2240},
    ],
}
