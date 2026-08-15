import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles # <-- Nowy import do plików
from routers import games, playthroughs
from database import engine
import models

# Tworzymy folder na dysku, jeśli jeszcze nie istnieje
os.makedirs("static/covers", exist_ok=True)

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Mówimy FastAPI, żeby folder "static" był widoczny publicznie
app.mount("/static", StaticFiles(directory="static"), name="static")

origins = [
    "http://localhost:3000",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(games.router)
app.include_router(playthroughs.router)