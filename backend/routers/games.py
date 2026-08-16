import shutil
import uuid
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from models import Game, Playthrough  # Upewnij się, że masz tu Playthrough!
from schemas import GameResponse
from database import get_db

router = APIRouter()

@router.get("/games", response_model=list[GameResponse])
def get_games(db: Session = Depends(get_db)):
    games = db.query(Game).all()
    return games

@router.post("/games", response_model=GameResponse)
def create_game_and_playthrough(
    title: str = Form(...),
    cover_image: UploadFile = File(None),
    status: str = Form("Planned"),
    start_date: Optional[date] = Form(None),
    end_date: Optional[date] = Form(None),
    rating: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    # 1. Sprawdzamy, czy gra o tym tytule już istnieje
    game = db.query(Game).filter(Game.title == title).first()
    
    # 2. Jeśli gra nie istnieje, tworzymy nową i zapisujemy okładkę
    if not game:
        cover_url = None
        if cover_image:
            if not cover_image.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                raise HTTPException(status_code=400, detail="Dozwolone są tylko pliki .JPG oraz .PNG")
            
            file_extension = cover_image.filename.split('.')[-1]
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            file_path = f"static/covers/{unique_filename}"

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(cover_image.file, buffer)

            cover_url = f"http://127.0.0.1:8000/static/covers/{unique_filename}"

        game = Game(title=title, cover_url=cover_url)
        db.add(game)
        db.commit()
        db.refresh(game)

    # 3. Zabezpieczenie na poziomie backendu (Inteligentna Walidacja)
    if status in ["Planned", "In Progress"] and end_date is not None:
        raise HTTPException(status_code=400, detail="Gra oznaczona jako 'W trakcie' lub 'Planowana' nie może posiadać daty zakończenia.")

    # 4. Tworzymy nowy wpis "Przejścia" przypisany do tej gry
    new_playthrough = Playthrough(
        game_id=game.id,
        status=status,
        start_date=start_date,
        end_date=end_date,
        rating=rating
    )
    db.add(new_playthrough)
    db.commit()
    
    return game