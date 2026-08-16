import LibraryView from "@/components/LibraryView";

// Przenosimy zapytanie tak, żeby serwer się nie uśpił
export const dynamic = 'force-dynamic';

async function getGames() {
  try {
    const res = await fetch('http://127.0.0.1:8000/games', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch games');
    return res.json();
  } catch (error) {
    console.error('Błąd pobierania gier:', error);
    return [];
  }
}

export default async function Home() {
  // Pobieramy dane z FastAPI po stronie serwera Next.js
  const games = await getGames();

  // Przekazujemy je w całości do naszego nowego, interaktywnego widoku
  return <LibraryView initialGames={games} />;
}