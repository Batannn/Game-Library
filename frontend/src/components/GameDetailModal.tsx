"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

type Props = {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  onSuccess: () => void;
};

export default function GameDetailModal({ isOpen, onClose, game, onSuccess }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stany formularza edycji
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rating, setRating] = useState("");
  const [hours, setHours] = useState("");
  const [notes, setNotes] = useState("");

  // Wczytanie danych do formularza po otwarciu
  useEffect(() => {
    if (game && game.playthroughs.length > 0) {
      const currentPt = game.playthroughs[game.playthroughs.length - 1];
      setStatus(currentPt.status || "Planned");
      setStartDate(currentPt.start_date || "");
      setEndDate(currentPt.end_date || "");
      setRating(currentPt.rating ? currentPt.rating.toString() : "");
      setHours(currentPt.hours ? currentPt.hours.toString() : "");
      setNotes(currentPt.notes || "");
      setIsEditing(false); // Zawsze zaczynamy od trybu podglądu
    }
  }, [game]);

  if (!game) return null;

  const currentPlaythrough = game.playthroughs[game.playthroughs.length - 1];

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const ptId = currentPlaythrough.id;
      const payload = {
        status,
        start_date: startDate || null,
        end_date: endDate || null,
        rating: rating ? parseInt(rating) : null,
        hours: hours ? parseFloat(hours) : null,
        notes: notes || null,
      };

      const res = await fetch(`http://127.0.0.1:8000/playthroughs/${ptId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Błąd podczas zapisywania");
      
      onSuccess();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Nie udało się zapisać zmian.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header z obrazkiem i tytułem */}
            <div className="relative h-64 bg-zinc-900 shrink-0">
              {game.cover_url ? (
                <img src={game.cover_url} alt={game.title} className="w-full h-full object-cover opacity-60" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700">Brak okładki</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <h2 className="text-3xl font-extrabold text-white drop-shadow-md">{game.title}</h2>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600/20 text-blue-400 font-bold rounded-lg border border-blue-500/30 hover:bg-blue-600/40 transition-colors">
                    Edytuj statystyki
                  </button>
                )}
              </div>
            </div>

            {/* Content (Scrollowalny) */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {!isEditing ? (
                /* TRYB PODGLĄDU */
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                    <div>
                      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Status</p>
                      <p className="text-white font-medium">{currentPlaythrough.status}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Czas gry</p>
                      <p className="text-white font-medium">{currentPlaythrough.hours ? `${currentPlaythrough.hours}h` : "-"}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Ocena</p>
                      <p className="text-white font-medium">{currentPlaythrough.rating ? `★ ${currentPlaythrough.rating}/10` : "-"}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Czas trwania</p>
                      <p className="text-zinc-300 text-sm">Od: {currentPlaythrough.start_date || "-"}</p>
                      <p className="text-zinc-300 text-sm">Do: {currentPlaythrough.end_date || "-"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">Moje Notatki</p>
                    <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-xl text-zinc-300 min-h-[100px] whitespace-pre-wrap">
                      {currentPlaythrough.notes || <span className="text-zinc-600 italic">Brak notatek dla tej gry. Kliknij edytuj, aby je dodać.</span>}
                    </div>
                  </div>
                </div>
              ) : (
                /* TRYB EDYCJI */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Status</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500">
                        <option value="Planned">Planowane</option>
                        <option value="In Progress">W trakcie</option>
                        <option value="Completed">Ukończone</option>
                        <option value="Dropped">Porzucone</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Czas gry (godziny)</label>
                      <input type="number" step="0.1" min="0" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500" placeholder="np. 45.5" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Ocena (1-10)</label>
                      <input type="number" min="1" max="10" value={rating} onChange={(e) => setRating(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Start</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-2.5 text-white text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">Koniec</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-2.5 text-white text-sm" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Notatki / Przemyślenia</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 custom-scrollbar" placeholder="Zapisz swoje wrażenia z gry..."></textarea>
                  </div>
                </div>
              )}
            </div>

            {/* Przyciski (Footer) */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-900 flex justify-end gap-3 shrink-0">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="px-5 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                    Anuluj
                  </button>
                  <button onClick={handleSave} disabled={isSubmitting} className="px-6 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50">
                    {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
                  </button>
                </>
              ) : (
                <button onClick={onClose} className="px-6 py-2 text-sm font-bold bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors">
                  Zamknij
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}