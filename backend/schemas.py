from pydantic import BaseModel
from typing import Optional
from datetime import date

class GameSchema(BaseModel):
    title: str
    cover_url: Optional[str] = None

class PlaythroughSchema(BaseModel):
    game_id: int  # Tego brakowało! Bez tego nie połączysz przejścia z grą
    status: str
    hours_played: float
    rating: Optional[int] = None
    review_notes: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class PlaythroughResponseSchema(PlaythroughSchema):
    id: int

    class Config:
        from_attributes = True

class GameResponse(GameSchema):
    id: int

    class Config:
        from_attributes = True