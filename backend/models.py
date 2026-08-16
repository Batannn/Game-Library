from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date # dodaj Float do importu
from sqlalchemy.orm import relationship
from database import Base

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    cover_url = Column(String, nullable=True)

    # Relacja: Jedna gra może mieć wiele przejść (playthroughs)
    playthroughs = relationship("Playthrough", back_populates="game", cascade="all, delete-orphan")

class Playthrough(Base):
    __tablename__ = "playthroughs"

    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("games.id"))
    status = Column(String, default="Planned")
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    rating = Column(Integer, nullable=True)
    
    # NOWE POLA
    hours = Column(Float, nullable=True)
    notes = Column(String, nullable=True)

    game = relationship("Game", back_populates="playthroughs")