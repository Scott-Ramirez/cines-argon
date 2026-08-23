import React from 'react';
import { Movie, Showtime } from '../../core/types';
import { Clock } from 'lucide-react';

interface BillboardMovieCardProps {
  movie: Movie;
  showtimes: Showtime[];
  onClick: () => void;
}

export const BillboardMovieCard: React.FC<BillboardMovieCardProps> = ({
  movie,
  showtimes,
  onClick
}) => {
  const formatDuration = (mins: number) => {
    if (!mins) return '120 min';
    const hrs = Math.floor(mins / 60);
    const remainder = mins % 60;
    return hrs > 0 ? `${hrs} hrs ${remainder > 0 ? `${remainder} min` : ''}` : `${remainder} min`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Poster and Badges */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          
          {/* Corner Ribbon */}
          <div className="absolute top-0 left-0">
            <div className="bg-rose-600 text-white font-black text-[9px] px-2.5 py-0.5 shadow-md uppercase tracking-wider rounded-br-lg">
              DOB
            </div>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">
              {movie.rating}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur border border-slate-700 text-slate-300 font-bold text-[10px] flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> {formatDuration(movie.durationMinutes)}
            </span>
          </div>
        </div>

        {/* Info Body */}
        <div className="p-5 space-y-2">
          <h3 className="text-lg font-black text-white font-sans group-hover:text-amber-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {movie.genre.map((g) => (
              <span
                key={g}
                className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60"
              >
                {g}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed pt-1">
            {movie.synopsis}
          </p>
        </div>
      </div>

      {/* Showtimes Pill Row */}
      <div className="p-5 pt-0 border-t border-slate-800/80 mt-2">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
          Horarios Disponibles
        </span>
        
        {showtimes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {showtimes.map((st) => (
              <div
                key={st.id}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-500/50 text-slate-200 transition-colors flex items-center gap-2"
              >
                <Clock className="w-3 h-3 text-amber-400" />
                <span className="font-bold text-xs font-mono">{st.startTime}</span>
                <span className="text-[10px] text-slate-400">({st.availableSeats} disp.)</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-2">Sin funciones programadas para hoy</p>
        )}
      </div>

    </div>
  );
};
