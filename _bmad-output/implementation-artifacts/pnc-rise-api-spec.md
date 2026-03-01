# PNC Rise API Specification

## Data Models (Pydantic)

### A1 Cards / Budget Analysis

**CategorySpending** - For pie chart breakdown
```python
{
  "category": str,      # e.g. "grocery", "housing", "eating_out"
  "label": str,         # Display label e.g. "Grocery"
  "amount": float,      # Dollar amount
  "percentage": float,  # Share of total
  "group": str          # "basic_living" | "discretionary"
}
```

**BudgetBreakdownResponse**
```python
{
  "total_spending": float,
  "categories": List[CategorySpending],
  "period": str         # e.g. "2025-02"
}
```

**Card** - User's card with spending overview
```python
{
  "id": str,
  "title": str,
  "description": str,
  "image_url": str,
  "main_spending_category": str,
  "total_spending": float,
  "ai_suggestions": Optional[str]
}
```

### B2 Settings / Retirement Round-up

**CardSettings**
```python
{
  "card_id": str,
  "round_up_percentage": float,  # 0-100
  "is_active": bool
}
```

**CardSettingsUpdate**
```python
{
  "round_up_percentage": float  # 0-100
}
```
