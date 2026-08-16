# Game Library

A full-stack game tracking application for managing a personal library and playthrough history. It combines a FastAPI backend with a Next.js frontend to let users add games, upload cover art, track progress, and keep notes and ratings for each playthrough.

## Features

- Add games to a personal library
- Upload a cover image for each game
- Track multiple playthrough entries per game
- Set status such as Planned, In Progress, Completed, or Dropped
- Record start and end dates, ratings, hours played, and notes
- Browse games by status using a library dashboard
- Open a detail modal to review or update existing playthrough data

## Tech Stack

- Backend: FastAPI, SQLAlchemy, SQLite
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Animation: Framer Motion

## Project Structure

- `backend/` – API, database models, and SQLite persistence
- `frontend/` – Next.js UI and client components
- `backend/static/covers/` – uploaded cover images

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Batannn/Game-Library.git
cd Game-Library
```

### 2. Start the backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy python-multipart
uvicorn main:app --reload
```

The API will run at:

- http://127.0.0.1:8000

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will run at:

- http://localhost:3000

## API Overview

### Game endpoints

- `GET /games` – fetch all games
- `POST /games` – create a game and initial playthrough

### Playthrough endpoints

- `GET /playthroughs` – fetch all playthrough entries
- `POST /playthroughs` – create a playthrough for a specific game
- `PUT /playthroughs/{playthrough_id}` – update an existing playthrough

## Notes

- SQLite is used for local persistence.
- Uploaded cover images are stored under `backend/static/covers/` and served through the FastAPI static route.
- The frontend fetches game data directly from the backend on the server side.

## License

This project is for personal use and local development.
