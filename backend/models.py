from sqlalchemy import Column, ForeignKey, Integer, String, Text, Enum, Float, Date
from sqlalchemy.orm import relationship
from enum import Enum as PythonEnum
from database import Base # Importujemy Base z bazy, zamiast tworzyć nowe

class Status(PythonEnum):
    Planned = "Planned"
    InProgress = "In Progress"
    Completed = "Completed"
    Dropped = "Dropped"

class Game(Base):
    __tablename__ = "games"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    cover_url = Column(String, nullable=True)
    playthroughs = relationship("Playthrough", back_populates="game")

class Playthrough(Base):
    __tablename__ = "playthroughs"
    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("games.id"), index=True)
    status = Column(Enum(Status), nullable=False)
    hours_played = Column(Float, default=0.0, nullable=True)
    rating = Column(Integer, nullable=True)
    review_notes = Column(Text, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    game = relationship("Game", back_populates="playthroughs")