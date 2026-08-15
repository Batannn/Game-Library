import shutil
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from models import Game
from schemas import GameResponse
from database import get_db

router = APIRouter()

@router.get("/games", response_model=list[GameResponse])
def get_games(db: Session = Depends(get_db)):
    games = db.query(Game).all()
    return games

@router.post("/games", response_model=GameResponse)
def create_game(
    # Zamiast GameSchema używamy Form(), żeby obsługiwać formularze z plikami
    title: str = Form(...),
    cover_image: UploadFile = File(None), 
    db: Session = Depends(get_db)
):
    # 1. Sprawdzamy, czy gra o tym tytule już istnieje
    existing_game = db.query(Game).filter(Game.title == title).first()
    if existing_game:
        raise HTTPException(status_code=400, detail="Gra o tym tytule już istnieje w bazie!")

    cover_url = None

    # 2. Jeśli użytkownik wgrał plik, obsługujemy go
    if cover_image:
        # Sprawdzamy rozszerzenie
        if not cover_image.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            raise HTTPException(status_code=400, detail="Dozwolone są tylko pliki .JPG oraz .PNG")
        
        # Generujemy losową nazwę pliku, żeby okładki się nie nadpisywały, gdy dwie gry mają plik "okladka.jpg"
        file_extension = cover_image.filename.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"static/covers/{unique_filename}"

        # Zapisujemy plik na dysku w folderze static/covers
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(cover_image.file, buffer)

        # Tworzymy adres URL, po którym frontend będzie widział obrazek
        cover_url = f"http://127.0.0.1:8000/static/covers/{unique_filename}"

    # 3. Zapisujemy nową grę w bazie danych
    new_game = Game(title=title, cover_url=cover_url)
    db.add(new_game)
    db.commit()
    db.refresh(new_game)
    
    return new_game