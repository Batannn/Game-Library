"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AddGameModal from "./AddGameModal";
import GameDetailModal from "./GameDetailModal";
// Aktualizacja typów zgodnie z nowym backendem
type Playthrough = {
  id: number;
  status: string;
  start_date?: string;
  end_date?: string;
  rating?: number;
  hours?: number;
  notes?: string;
};
type Game = {
  id: number;
  title: string;
  cover_url?: string;
  playthroughs: Playthrough[];
};

const TABS = [
  { id: "All", label: "Wszystkie" },
  { id: "In Progress", label: "W trakcie" },
  { id: "Planned", label: "Planowane" },
  { id: "Completed", label: "Ukończone" },
  { id: "Dropped", label: "Porzucone" },
];

export default function LibraryView({ initialGames }: { initialGames: Game[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const router = useRouter();

  const handleGameAdded = () => {
    router.refresh();
  };

  // Funkcja pomocnicza: pobiera najnowszy status gry
  const getGameStatus = (game: Game) => {
    if (!game.playthroughs || game.playthroughs.length === 0) return "Planned";
    // Zakładamy, że ostatnie przejście na liście to aktualny status
    return game.playthroughs[game.playthroughs.length - 1].status;
  };

  // Filtrowanie gier na podstawie wybranej zakładki
  const filteredGames = activeTab === "All" 
    ? initialGames 
    : initialGames.filter(game => getGameStatus(game) === activeTab);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Nagłówek i Przycisk */}
        <header className="mb-8 border-b border-zinc-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
              My Game Library
            </h1>
            <p className="text-zinc-400 text-sm md:text-base">
              Steam Big Picture Experience • Track Your Playthroughs
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-zinc-100 text-zinc-950 font-bold rounded-lg hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
          >
            + Dodaj Grę
          </button>
        </header>

        {/* Menu Zakładek (Półki) */}
        <div className="flex gap-6 mb-8 border-b border-zinc-800/50 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                activeTab === tab.id ? "text-blue-400" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Siatka gier */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-lg">Brak gier na tej półce.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game) => (
                <motion.div
                  onClick={() => setSelectedGame(game)}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={game.id}
                  className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-500 transition-colors shadow-2xl cursor-pointer"
                >
                  <div className="h-52 bg-zinc-800 relative overflow-hidden flex items-center justify-center">
                    {game.cover_url ? (
                      <img
                        src={game.cover_url}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-zinc-600 font-bold text-sm px-4 text-center">
                        No Cover
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-90" />
                    
                    {/* Plakietka z oceną (jeśli gra ją posiada) */}
                    {game.playthroughs?.length > 0 && game.playthroughs[game.playthroughs.length - 1].rating && (
                      <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md border border-zinc-700 text-white text-xs font-bold px-2 py-1 rounded-md">
                        ★ {game.playthroughs[game.playthroughs.length - 1].rating}/10
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="text-base font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                      {game.title}
                    </h2>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <AddGameModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleGameAdded}
        />
        <GameDetailModal 
  isOpen={!!selectedGame} 
  onClose={() => setSelectedGame(null)} 
  game={selectedGame}
  onSuccess={() => {
    handleGameAdded(); // Odświeży dane z backendu
    setSelectedGame(null); // Zamknie modal po zapisie
  }}
/> 
      </div>
    </main>
  );
}