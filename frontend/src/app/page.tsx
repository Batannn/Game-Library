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
  const games = await getGames();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Nagłówek w stylu launchera */}
        <header className="mb-10 border-b border-zinc-800 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            My Game Library
          </h1>
          <p className="text-zinc-400 text-sm md:text-base">
            Steam Big Picture Experience • Track Your Playthroughs
          </p>
        </header>

        {/* Siatka gier (Grid) */}
        {games.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-lg">Brak gier w bazie lub backend jest wyłączony.</p>
            <p className="text-sm mt-2">Upewnij się, że FastAPI działa pod adresem http://127.0.0.1:8000</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game: { id: number; title: string; cover_url?: string }) => (
              <div
                key={game.id}
                className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-500 transition-all duration-300 hover:scale-105 shadow-2xl cursor-pointer"
              >
                {/* Okładka gry */}
                <div className="h-52 bg-zinc-800 relative overflow-hidden flex items-center justify-center">
                  {game.cover_url && game.cover_url.startsWith('http') ? (
                    <img
                      src={game.cover_url}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-zinc-600 font-bold text-sm px-4 text-center">
                      No Cover Image
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                </div>

                {/* Tytuł pod kafelkiem */}
                <div className="p-4">
                  <h2 className="text-base font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                    {game.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}