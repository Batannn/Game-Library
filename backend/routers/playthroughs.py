from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Playthrough
from schemas import PlaythroughBase, PlaythroughResponse
from database import get_db

router = APIRouter()

@router.get("/playthroughs", response_model=list[PlaythroughResponse])
def get_playthroughs(db: Session = Depends(get_db)):
    playthroughs = db.query(Playthrough).all()
    return playthroughs

@router.post("/playthroughs", response_model=PlaythroughResponse)
def create_playthrough(game_id: int, playthrough: PlaythroughBase, db: Session = Depends(get_db)):
    new_playthrough = Playthrough(**playthrough.dict(), game_id=game_id)
    db.add(new_playthrough)
    db.commit()
    db.refresh(new_playthrough)
    return new_playthrough
@router.put("/playthroughs/{playthrough_id}", response_model=PlaythroughResponse)
def update_playthrough(playthrough_id: int, updated_data: PlaythroughBase, db: Session = Depends(get_db)):
    # Szukamy przejścia w bazie
    pt = db.query(Playthrough).filter(Playthrough.id == playthrough_id).first()
    if not pt:
        raise HTTPException(status_code=404, detail="Nie znaleziono danych o przejściu gry.")
    
    # Aktualizujemy dane
    pt.status = updated_data.status
    pt.start_date = updated_data.start_date
    pt.end_date = updated_data.end_date
    pt.rating = updated_data.rating
    pt.hours = updated_data.hours
    pt.notes = updated_data.notes
    
    db.commit()
    db.refresh(pt)
    return pt