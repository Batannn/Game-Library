from pydantic import BaseModel
from typing import Optional, List
from datetime import date

# --- Schematy dla Playthrough ---

class PlaythroughBase(BaseModel):
    status: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    rating: Optional[int] = None
    hours: Optional[float] = None
    notes: Optional[str] = None

class PlaythroughResponse(PlaythroughBase):
    id: int
    game_id: int

    class Config:
        from_attributes = True


# --- Schematy dla Game ---

class GameSchema(BaseModel):
    title: str
    cover_url: Optional[str] = None

class GameResponse(GameSchema):
    id: int
    # Tutaj dodajemy relację – API zwróci grę wraz ze wszystkimi jej przejściami
    playthroughs: List[PlaythroughResponse] = []

    class Config:
        from_attributes = True