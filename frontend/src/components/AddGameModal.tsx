"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Wywoływane po udanym dodaniu gry, by odświeżyć listę
};

export default function AddGameModal({ isOpen, onClose, onSuccess }: ModalProps) {
  const [title, setTitle] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Planned");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rating, setRating] = useState("");
  
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inteligentna logika: Jeśli gra nie jest ukończona lub nie ma daty startu, czyścimy datę końca
  useEffect(() => {
    if (status === "Planned" || status === "In Progress" || !startDate) {
      setEndDate("");
    }
  }, [status, startDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Przygotowujemy dane jako multipart/form-data
      const formData = new FormData();
      formData.append("title", title);
      if (coverFile) {
        formData.append("cover_image", coverFile);
      }
      
      // UWAGA: Frontend wysyła już wszystkie dane, ale nasz FastAPI na ten moment 
      // zapisuje tylko tytuł i obrazek. Backend zaktualizujemy w następnym kroku!
      formData.append("status", status);
      if (startDate) formData.append("start_date", startDate);
      if (endDate) formData.append("end_date", endDate);
      if (rating) formData.append("rating", rating);

      const res = await fetch("http://127.0.0.1:8000/games", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Wystąpił błąd podczas dodawania gry.");
      }

      onSuccess();
      onClose();

      // Resetowanie formularza po udanym dodaniu
      setTitle("");
      setCoverFile(null);
      setStatus("Planned");
      setStartDate("");
      setEndDate("");
      setRating("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Warunek wyłączający pole daty zakończenia
  const isEndDateDisabled = status === "Planned" || status === "In Progress" || !startDate;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col"
          >
            {/* Nagłówek okienka */}
            <div className="p-6 border-b border-zinc-900 bg-zinc-900/50">
              <h2 className="text-2xl font-bold text-white tracking-tight">Dodaj nową grę</h2>
              <p className="text-zinc-400 text-sm mt-1">Uzupełnij szczegóły, aby dodać grę do swojej biblioteki.</p>
            </div>

            {/* Formularz */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Tytuł */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Tytuł gry *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="np. The Witcher 3: Wild Hunt"
                />
              </div>

              {/* Okładka */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Okładka (.jpg, .png)</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => setCoverFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 transition-colors"
                />
              </div>

              {/* Status i Ocena (Grid 2 kolumny) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="Planned">Planowane (Nieruszone)</option>
                    <option value="In Progress">W trakcie (In Progress)</option>
                    <option value="Completed">Ukończone (Completed)</option>
                    <option value="Dropped">Porzucone (Dropped)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Ocena (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Brak"
                  />
                </div>
              </div>

              {/* Daty (Grid 2 kolumny) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Data rozpoczęcia</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Data zakończenia
                    {isEndDateDisabled && <span className="text-zinc-600 text-xs ml-2">(Niedostępne)</span>}
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={isEndDateDisabled}
                    className={`w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none transition-colors ${
                      isEndDateDisabled ? "opacity-50 cursor-not-allowed" : "focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              {/* Przyciski na dole */}
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-medium text-zinc-300 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-zinc-950 bg-zinc-100 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Dodawanie..." : "Dodaj do biblioteki"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}