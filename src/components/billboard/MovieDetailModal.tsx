import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Movie, Showtime, Room } from '../../core/types';
import { Play, Clock, Film } from 'lucide-react';

interface MovieDetailModalProps {
  movie: Movie | null;
  showtimes: Showtime[];
  rooms: Room[];
  onClose: () => void;
  onOpenTrailer: (trailerUrl: string) => void;
  onSelectShowtime?: (showtime: Showtime) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  showtimes,
  rooms,
  onClose,
  onOpenTrailer,
  onSelectShowtime,
}) => {

  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState<boolean>(false);

  useEffect(() => {
    document.body.classList.add('has-modal-open');
    return () => {
      document.body.classList.remove('has-modal-open');
    };
  }, []);


  if (!movie) return null;

  const formatDuration = (mins: number) => {
    if (!mins) return '120 min';
    const hrs = Math.floor(mins / 60);
    const remainder = mins % 60;
    return hrs > 0 ? `${hrs} hrs ${remainder > 0 ? `${remainder} min` : ''}` : `${remainder} min`;
  };

  const getMovieShowtimes = (movieId?: string) => {
    if (!movieId) return [];
    return showtimes.filter(s => s.movieId === movieId);
  };

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Sala Principal';
  };

  return createPortal(
    <div 
      onClick={onClose}
      data-modal="true"
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/90 backdrop-blur-md p-3 pt-6 pb-6 sm:p-6 flex items-start sm:items-center justify-center animate-fade-in text-slate-100"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
      >

        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0 bg-[#0c1017]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[11px] uppercase tracking-wider">
              {movie.status === 'CARTELERA' ? 'En Cartelera' : 'Próximo Estreno'}
            </span>
            <span className="text-xs text-slate-400 font-mono font-semibold">Cines Argón</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 min-h-0">
          
          {/* Top Section: Poster + Movie Details */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
            
            {/* Poster with DOB ribbon & Ver Trailer under */}
            <div className="shrink-0 w-32 sm:w-44 flex flex-col gap-2.5 mx-auto sm:mx-0">
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 group">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* DOB / SUB Ribbon Badge */}
                <div className="absolute top-0 left-0">
                  <div className="bg-rose-600 text-white font-black text-[10px] px-2.5 py-0.5 shadow-lg uppercase tracking-wider rounded-br-lg">
                    DOB
                  </div>
                </div>

                {/* Rating badge bottom right */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-950/90 border border-slate-700 rounded text-amber-400 font-bold text-[10px]">
                  {movie.rating}
                </div>
              </div>

              {/* Ver Trailer Button under Poster */}
              {movie.trailerUrl && (
                <button
                  onClick={() => onOpenTrailer(movie.trailerUrl || '')}
                  className="w-full py-1.5 px-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 rounded-xl text-[11px] font-bold text-amber-400 flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <Play className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>Ver tráiler</span>
                </button>
              )}
            </div>

            {/* Movie Info Column */}
            <div className="flex-1 space-y-2.5 w-full">
              
              {/* Title */}
              <h2 className="text-lg sm:text-2xl font-black text-white font-sans uppercase tracking-tight leading-snug">
                {movie.title} {movie.title.toUpperCase().includes('(DOB)') ? '' : '(DOB)'}
              </h2>

              {/* Duration | Rating */}
              <div className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2">
                <span>{formatDuration(movie.durationMinutes)}</span>
                <span className="text-slate-600">|</span>
                <span className="text-amber-400 font-bold">{movie.rating}</span>
                {movie.director && (
                  <>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-400 font-normal">Dir. {movie.director}</span>
                  </>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {movie.genre.map((g) => (
                  <span
                    key={g}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-medium"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Synopsis with Ver Más / Ver Menos */}
              <div className="pt-1.5 space-y-1">
                <p className={`text-xs sm:text-sm text-slate-300 leading-relaxed ${!isSynopsisExpanded ? 'line-clamp-4 sm:line-clamp-5' : ''}`}>
                  {movie.synopsis}
                </p>
                
                {movie.synopsis && movie.synopsis.length > 180 && (
                  <button
                    onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded transition-colors inline-block"
                  >
                    {isSynopsisExpanded ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </div>

              {/* Ver Trailer link icon (styled exactly as Cineplanet reference) */}
              {movie.trailerUrl && (
                <div className="pt-1">
                  <button
                    onClick={() => onOpenTrailer(movie.trailerUrl || '')}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 group transition-colors"
                  >
                    <Film className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="underline decoration-cyan-500/50 underline-offset-4">Ver trailer</span>
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Bottom Section: Horarios y Funciones de la Película */}
          {movie.status === 'CARTELERA' && (
            <div className="border-t border-slate-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Funciones y Horarios Disponibles</span>
                  </h4>
                  <p className="text-xs text-slate-400">Funciones para el día de hoy en Cines Argón</p>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg">
                  Sala VIP Premium
                </span>
              </div>

              {getMovieShowtimes(movie.id).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {getMovieShowtimes(movie.id).map((st) => (
                    <div
                      key={st.id}
                      className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all shadow-md"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-black text-white">{st.startTime}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-900 text-amber-400 rounded font-semibold border border-slate-800">
                            {st.endTime ? `hasta ${st.endTime}` : '2D VIP'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                          {getRoomName(st.roomId)} • {st.date}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-left sm:text-right">
                          <span className="text-xs font-mono font-bold text-emerald-400 block">
                            {st.availableSeats} disp.
                          </span>
                          <span className="text-[10px] text-slate-500 font-sans">Aforo 25 butacas</span>
                        </div>

                        {onSelectShowtime && st.availableSeats > 0 && (
                          <button
                            onClick={() => {
                              onSelectShowtime(st);
                              onClose();
                            }}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
                          >
                            <span>Comprar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-dashed border-slate-800 text-center text-xs text-slate-400">
                  No hay funciones programadas para hoy. Consulta en boletería o regresa pronto para los nuevos horarios.
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-slate-800 shrink-0 bg-[#0c1017]">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

