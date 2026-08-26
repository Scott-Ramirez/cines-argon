import React from 'react';
import { HeroSlide, Showtime, Room, Movie } from '../../core/types';
import { Clock, Sparkles, Calendar } from 'lucide-react';

interface BillboardHeroMarqueeProps {
  currentSlide: HeroSlide | null;
  showtimes: Showtime[];
  rooms: Room[];
  movies?: Movie[];
}

export const BillboardHeroMarquee: React.FC<BillboardHeroMarqueeProps> = ({
  currentSlide,
  showtimes,
  rooms,
  movies = []
}) => {
  if (!currentSlide) return null;

  const linkedMovie = movies.find(m => m.id === currentSlide.movieId);
  const isUpcoming =
    linkedMovie?.status === 'PROXIMAMENTE' ||
    currentSlide.tagline?.toUpperCase().includes('PROXIM') ||
    currentSlide.tagline?.toUpperCase().includes('PRÓXIM') ||
    currentSlide.tagline?.toUpperCase().includes('PRONTO');

  const getMovieShowtimes = (movieId?: string) => {
    if (!movieId) return [];
    return showtimes.filter(s => s.movieId === movieId);
  };

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Sala Principal';
  };

  return (
    <div className="relative w-full h-[480px] lg:h-[540px] overflow-hidden border-b border-slate-800/80 shadow-2xl">
      {/* Backdrop Image with Dark Gradient Overlays */}
      <img
        key={currentSlide.id}
        src={currentSlide.backdropUrl || currentSlide.posterUrl}
        alt={currentSlide.title}
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] scale-105 transition-transform duration-1000 ease-out animate-fade-in"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-[#07090e]/85 to-transparent w-full lg:w-3/4" />

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto h-full px-6 lg:px-8 flex items-end pb-12">
        <div className="max-w-2xl space-y-4">
          
          {/* Badges: Custom Hour + Tagline + Rating */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Status / Screening Hour Badge */}
            {isUpcoming ? (
              <span className="px-3.5 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider shadow-lg shadow-cyan-500/30 flex items-center gap-1.5 ring-1 ring-cyan-400">
                <Sparkles className="w-3.5 h-3.5" /> PRÓXIMO ESTRENO
              </span>
            ) : (
              currentSlide.time && currentSlide.time.trim() !== '' && (
                <span className="px-3.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider shadow-lg shadow-amber-500/40 flex items-center gap-1.5 ring-1 ring-amber-400">
                  <Clock className="w-3.5 h-3.5" /> HOY • {currentSlide.time}
                </span>
              )
            )}

            {/* Tagline / Audience type (if not duplicating upcoming badge) */}
            {currentSlide.tagline && (!isUpcoming || (!currentSlide.tagline.toUpperCase().includes('PROXIM') && !currentSlide.tagline.toUpperCase().includes('PRÓXIM') && !currentSlide.tagline.toUpperCase().includes('PRONTO'))) && (
              <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-md border border-amber-500/50 text-amber-300 font-bold text-xs rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {currentSlide.tagline}
              </span>
            )}

            {currentSlide.rating && (
              <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-amber-400 font-bold text-xs rounded-md">
                {currentSlide.rating}
              </span>
            )}

            {currentSlide.durationMinutes && (
              <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 font-semibold text-xs rounded-md flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> {currentSlide.durationMinutes} min
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-white drop-shadow-md">
            {currentSlide.title}
          </h1>

          {currentSlide.genres && currentSlide.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {currentSlide.genres.map(g => (
                <span key={g} className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700">
                  {g}
                </span>
              ))}
            </div>
          )}

          <p className="text-slate-300 text-sm line-clamp-3 leading-relaxed drop-shadow">
            {currentSlide.synopsis}
          </p>

          {/* Showtimes for Featured Movie if in Cartelera */}
          {!isUpcoming && currentSlide.movieId && getMovieShowtimes(currentSlide.movieId).length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-2 font-mono">
                HORARIOS HOY EN SALA ÚNICA:
              </span>
              <div className="flex flex-wrap gap-2">
                {getMovieShowtimes(currentSlide.movieId).map(st => (
                  <div
                    key={st.id}
                    className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/40 text-amber-400 font-mono font-bold text-xs flex items-center gap-2 backdrop-blur shadow"
                  >
                    <span className="text-white font-bold">{st.startTime}</span>
                    <span className="text-[10px] text-slate-400">({getRoomName(st.roomId)})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Info Pill */}
          {isUpcoming && (
            <div className="pt-2 flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-sans text-xs shadow-md">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold">Próximamente en cartelera • Horarios por anunciar</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
