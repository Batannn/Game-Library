from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Game, Playthrough
from schemas import PlaythroughSchema
from database import get_db

router = APIRouter()

@router.post("/playthroughs", response_model=PlaythroughSchema)
def create_playthrough(playthrough: PlaythroughSchema, db: Session = Depends(get_db)):
    # Szukamy gry po prawidłowym game_id ze schematu
    game = db.query(Game).filter(Game.id == playthrough.game_id).first()
    
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
        
    new_playthrough = Playthrough(**playthrough.dict())
    db.add(new_playthrough)
    db.commit()
    db.refresh(new_playthrough) # Odświeżamy, żeby upewnić się, że baza nadała ID
    
    return new_playthrough # Zwracamy prawidłowy obiekt


from schemas import PlaythroughSchema, PlaythroughResponseSchema
from models import Game, Playthrough

@router.get("/playthroughs", response_model=list[PlaythroughResponseSchema])
def get_playthroughs(db: Session = Depends(get_db)):
    playthroughs = db.query(Playthrough).all()
    return playthroughs