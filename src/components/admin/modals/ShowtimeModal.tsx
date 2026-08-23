import React, { useState } from 'react';
import { Movie, Room } from '../../../core/types';
import { Clock } from 'lucide-react';

interface ShowtimeModalProps {
  isOpen: boolean;
  movies: Movie[];
  rooms: Room[];
  onClose: () => void;
  onSave: (showtimeData: {
    movieId: string;
    roomId: string;
    date: string;
    startTime: string;
    endTime?: string;
    availableSeats: number;
  }) => void;
}

export const ShowtimeModal: React.FC<ShowtimeModalProps> = ({
  isOpen,
  movies,
  rooms,
  onClose,
  onSave
}) => {
  const [newShowtime, setNewShowtime] = useState({
    movieId: movies[0]?.id || '',
    roomId: rooms[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    startTime: '17:30',
    endTime: '19:50',
    availableSeats: rooms[0]?.capacity || 25
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShowtime.movieId) {
      alert('Debes seleccionar una película');
      return;
    }
    const selectedRoom = rooms.find(r => r.id === newShowtime.roomId) || rooms[0];
    onSave({
      ...newShowtime,
      roomId: selectedRoom?.id || 'room-1',
      availableSeats: selectedRoom?.capacity || 25
    });
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-hidden"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0 bg-slate-900">
          <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Programar Nueva Función</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Form */}
        <form id="showtimeForm" onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs overflow-y-auto flex-1 min-h-0">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Película:</label>
            <select
              value={newShowtime.movieId}
              onChange={(e) => setNewShowtime({ ...newShowtime, movieId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl outline-none focus:border-amber-400"
            >
              {movies.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Sala:</label>
            <select
              value={newShowtime.roomId}
              onChange={(e) => setNewShowtime({ ...newShowtime, roomId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl outline-none focus:border-amber-400"
            >
              {rooms.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
              ))}
              {rooms.length === 0 && (
                <option value="">Sala Única - Home Cinema (VIP Premium)</option>
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Fecha:</label>
              <input
                type="date"
                value={newShowtime.date}
                onChange={(e) => setNewShowtime({ ...newShowtime, date: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl font-mono outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Hora Inicio:</label>
              <input
                type="time"
                value={newShowtime.startTime}
                onChange={(e) => setNewShowtime({ ...newShowtime, startTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl font-mono outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-slate-800 shrink-0 bg-slate-950/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-700 rounded-xl text-slate-300 font-semibold hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="showtimeForm"
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold shadow-md shadow-amber-500/20"
          >
            Programar Función
          </button>
        </div>

      </div>
    </div>
  );
};
