from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Game, Base

engine = create_engine("sqlite:///./games.db")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_data():
    # Tworzymy tabele na wszelki wypadek, gdyby baza była pusta
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Sprawdzamy, czy gry już tam są, żeby nie duplikować
        existing_games = db.query(Game).count()
        if existing_games > 0:
            print("Baza danych ma już w sobie jakieś gry. Pomijam seedowanie.")
            return

        game1 = Game(title="Resident Evil 1 HD Remake", cover_url="https://example.com/resident-evil-1-cover.jpg")
        game2 = Game(title="League of Legends", cover_url="https://example.com/league-of-legends-cover.jpg")
        game3 = Game(title="Apex Legends", cover_url="https://example.com/apex-legends-cover.jpg")
        
        db.add_all([game1, game2, game3])
        db.commit()
        print("Initial example games inserted successfully!")
    except Exception as e:
        print("Error while seeding data:", str(e))
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()