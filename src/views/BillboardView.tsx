import React, { useState, useEffect } from 'react';
import { Movie, Showtime, Room, HeroSlide } from '../core/types';
import { cinemaStorage } from '../services/storage/cinemaStorage';
import { Film, Clock, Calendar, Sparkles, Tv, Volume2, ShieldCheck, ChevronRight, Play, Star, Award, Layers } from 'lucide-react';
import { PublicSection } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

interface BillboardViewProps {
  activeSection?: PublicSection;
  onOpenLogin?: () => void;
}

export const BillboardView: React.FC<BillboardViewProps> = ({ 
  activeSection = 'billboard',
  onOpenLogin = () => {}
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('TODOS');

  // Movie Detail Modal States
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState<boolean>(false);
  const [trailerUrlToPlay, setTrailerUrlToPlay] = useState<string | null>(null);

  const loadData = () => {
    setMovies(cinemaStorage.getMovies());
    setShowtimes(cinemaStorage.getShowtimes());
    setRooms(cinemaStorage.getRooms());
    setHeroSlides(cinemaStorage.getHeroSlides());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('argon_storage_update', loadData);
    return () => window.removeEventListener('argon_storage_update', loadData);
  }, []);

  const billboardMovies = movies.filter(m => m.status === 'CARTELERA');
  const upcomingMovies = movies.filter(m => m.status === 'PROXIMAMENTE');
  const activeSlides = heroSlides.filter(s => s.active);

  // Auto carousel for lobby TV
  useEffect(() => {
    if (!autoRotate || activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % activeSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [autoRotate, activeSlides.length]);

  const currentSlide: HeroSlide | null = activeSlides[featuredIndex] || activeSlides[0] || null;

  const getMovieShowtimes = (movieId?: string) => {
    if (!movieId) return [];
    return showtimes.filter(s => s.movieId === movieId);
  };

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Sala Principal';
  };

  const formatDuration = (mins: number) => {
    if (!mins) return '120 min';
    const hrs = Math.floor(mins / 60);
    const remainder = mins % 60;
    return hrs > 0 ? `${hrs} hrs ${remainder > 0 ? `${remainder} min` : ''}` : `${remainder} min`;
  };

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes('embed/')) return url;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
  };

  // Get list of unique genres
  const allGenres = ['TODOS', ...Array.from(new Set(billboardMovies.flatMap(m => m.genre)))];

  const filteredBillboard = selectedGenre === 'TODOS'
    ? billboardMovies
    : billboardMovies.filter(m => m.genre.includes(selectedGenre));

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 pb-0 space-y-10 animate-fade-in flex flex-col justify-between">
      <div>
      
      {/* Top Billboard Hero Marquee (Configured dynamically from Admin Panel) */}
      {currentSlide && activeSection !== 'experiences' && (
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
                
                {/* Specific Screening Hour Badge */}
                {currentSlide.time && (
                  <span className="px-3.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider shadow-lg shadow-amber-500/40 flex items-center gap-1.5 ring-1 ring-amber-400">
                    <Clock className="w-3.5 h-3.5" /> HOY • {currentSlide.time}
                  </span>
                )}

                {/* Tagline / Audience type */}
                {currentSlide.tagline && (
                  <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-md border border-amber-500/50 text-amber-300 font-bold text-xs rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> {currentSlide.tagline}
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

              {/* Showtimes for Featured Movie if associated */}
              {currentSlide.movieId && getMovieShowtimes(currentSlide.movieId).length > 0 && (
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

            </div>
          </div>

          {/* Carousel Selector Bullets */}
          {activeSlides.length > 1 && (
            <div className="absolute bottom-5 right-6 flex items-center gap-2 z-10">
              {activeSlides.map((slide, i) => (
                <button
                  key={slide.id}
                  onClick={() => {
                    setFeaturedIndex(i);
                    setAutoRotate(false);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    featuredIndex === i ? 'w-8 bg-amber-400' : 'w-2.5 bg-slate-600 hover:bg-slate-400'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* SECTION 1: CARTELERA DE HOY (Shown if section is 'billboard' or general) */}
        {activeSection === 'billboard' && (
          <div className="space-y-6">
            
            {/* Header & Genre Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white font-sans tracking-tight">
                    PELÍCULAS EN CARTELERA
                  </h2>
                  <p className="text-xs text-slate-400">
                    Disfruta de los mejores estrenos en pantalla gigante
                  </p>
                </div>
              </div>

              {/* Genre Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {allGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      selectedGenre === genre
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Movies Grid */}
            {filteredBillboard.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBillboard.map((movie) => {
                  const movieShowtimes = getMovieShowtimes(movie.id);

                  return (
                    <div
                      key={movie.id}
                      onClick={() => {
                        setSelectedMovie(movie);
                        setIsSynopsisExpanded(false);
                      }}
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
                        
                        {movieShowtimes.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {movieShowtimes.map((st) => (
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
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 space-y-3">
                <Film className="w-10 h-10 text-amber-400/60 mx-auto animate-pulse" />
                <h3 className="text-lg font-bold text-white">Cartelera en Preparación</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Actualmente no hay películas en la base de datos. Ingresa a la Intranet de Administración para importar películas desde TheMovieDB o programar nuevas funciones.
                </p>
                <button
                  onClick={onOpenLogin}
                  className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Acceder como Administrador</span>
                </button>
              </div>
            )}

          </div>
        )}

        {/* SECTION 2: PRÓXIMOS ESTRENOS (Shown if section is 'upcoming' or always bottom of billboard) */}
        {(activeSection === 'upcoming' || activeSection === 'billboard') && upcomingMovies.length > 0 && (
          <div className="border-t border-slate-800/80 pt-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white font-sans tracking-tight">PRÓXIMAMENTE EN CINES ARGÓN</h3>
                <p className="text-xs text-slate-400">Los estrenos más esperados que llegarán a nuestras salas</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {upcomingMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => {
                    setSelectedMovie(movie);
                    setIsSynopsisExpanded(false);
                  }}
                  className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden group shadow-lg flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[2/3] w-full overflow-hidden bg-slate-950 relative">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-cyan-500 text-slate-950 font-black text-[9px] rounded-full uppercase tracking-wider shadow">
                      PRONTO
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <h4 className="font-bold text-xs text-slate-200 truncate group-hover:text-cyan-400 transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-[10px] text-slate-400">{movie.genre[0] || 'Estreno'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: SALAS & EXPERIENCIAS (Shown when activeSection === 'experiences') */}
        {activeSection === 'experiences' && (
          <div className="space-y-8 pt-4">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black text-xs rounded-full uppercase tracking-widest inline-flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> TECNOLOGÍA DE ÚLTIMA GENERACIÓN
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
                NUESTRAS SALAS Y FORMATOS
              </h2>
              <p className="text-sm text-slate-400">
                Disfruta de sonido envolvente calibrado y proyección láser de máxima resolución
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Tv className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">{room.name}</h3>
                        <span className="text-xs text-amber-400 font-bold">{room.type}</span>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs font-bold">
                      {room.capacity} butacas
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Volume2 className="w-4 h-4 text-cyan-400" /> Sistema Acústico:
                      </span>
                      <strong className="font-mono text-white">{room.soundSystem}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Confort:
                      </span>
                      <strong className="text-slate-200">Butacas reclinables ergonómicas</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: CINEMA MOVIE DETAIL (Cineplanet / Cinemark Style) */}
      {/* ========================================================= */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-hidden animate-fade-in">
          <div className="bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in text-slate-100">
            
            {/* Header with Title and Close Button */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0 bg-[#0c1017]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[11px] uppercase tracking-wider">
                  {selectedMovie.status === 'CARTELERA' ? 'En Cartelera' : 'Próximo Estreno'}
                </span>
                <span className="text-xs text-slate-400 font-mono font-semibold">Cines Argón</span>
              </div>
              <button
                onClick={() => setSelectedMovie(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Top Section: Poster + Movie Details */}
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
                
                {/* Poster with DOB ribbon & Ver Trailer under */}
                <div className="shrink-0 flex flex-col items-center sm:items-start gap-3">
                  <div className="relative w-40 sm:w-48 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 group">
                    <img
                      src={selectedMovie.posterUrl}
                      alt={selectedMovie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* DOB / SUB Ribbon Badge */}
                    <div className="absolute top-0 left-0">
                      <div className="bg-rose-600 text-white font-black text-[10px] px-3 py-1 shadow-lg uppercase tracking-wider rounded-br-xl">
                        DOB
                      </div>
                    </div>

                    {/* Rating badge bottom right */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-950/90 border border-slate-700 rounded text-amber-400 font-bold text-[10px]">
                      {selectedMovie.rating}
                    </div>
                  </div>

                  {/* Ver Trailer Button under Poster */}
                  {selectedMovie.trailerUrl && (
                    <button
                      onClick={() => setTrailerUrlToPlay(selectedMovie.trailerUrl || null)}
                      className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 rounded-xl text-xs font-bold text-amber-400 flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>Ver tráiler oficial</span>
                    </button>
                  )}
                </div>

                {/* Movie Info Column */}
                <div className="flex-1 space-y-3">
                  
                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-black text-white font-sans uppercase tracking-tight">
                    {selectedMovie.title} {selectedMovie.title.toUpperCase().includes('(DOB)') ? '' : '(DOB)'}
                  </h2>

                  {/* Duration | Rating */}
                  <div className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <span>{formatDuration(selectedMovie.durationMinutes)}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-amber-400 font-bold">{selectedMovie.rating}</span>
                    {selectedMovie.director && (
                      <>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-400 font-normal">Dir. {selectedMovie.director}</span>
                      </>
                    )}
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {selectedMovie.genre.map((g) => (
                      <span
                        key={g}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-medium"
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  {/* Synopsis with Ver Más / Ver Menos */}
                  <div className="pt-2">
                    <p className={`text-xs sm:text-sm text-slate-300 leading-relaxed ${!isSynopsisExpanded ? 'line-clamp-4' : ''}`}>
                      {selectedMovie.synopsis}
                    </p>
                    
                    {selectedMovie.synopsis && selectedMovie.synopsis.length > 180 && (
                      <button
                        onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
                        className="mt-2 text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded transition-colors inline-block"
                      >
                        {isSynopsisExpanded ? 'Ver menos' : 'Ver más'}
                      </button>
                    )}
                  </div>

                  {/* Ver Trailer link icon (styled exactly as Cineplanet reference) */}
                  {selectedMovie.trailerUrl && (
                    <div className="pt-2">
                      <button
                        onClick={() => setTrailerUrlToPlay(selectedMovie.trailerUrl || null)}
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
              {selectedMovie.status === 'CARTELERA' && (
                <div className="border-t border-slate-800 pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>Funciones y Horarios Disponibles</span>
                      </h4>
                      <p className="text-xs text-slate-400">Funciones para el día de hoy en Cines Argón</p>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                      Sala VIP Premium
                    </span>
                  </div>

                  {getMovieShowtimes(selectedMovie.id).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {getMovieShowtimes(selectedMovie.id).map((st) => (
                        <div
                          key={st.id}
                          className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all shadow-md"
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

                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-emerald-400 block">
                              {st.availableSeats} disp.
                            </span>
                            <span className="text-[10px] text-slate-500 font-sans">Aforo 25 butacas</span>
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
                onClick={() => setSelectedMovie(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: YOUTUBE TRAILER POPUP PLAYER */}
      {/* ========================================================= */}
      {trailerUrlToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-black border border-slate-800 rounded-3xl overflow-hidden shadow-2xl aspect-video">
            <button
              onClick={() => setTrailerUrlToPlay(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold backdrop-blur border border-slate-700 transition-colors"
            >
              ✕
            </button>
            <iframe
              src={getYouTubeEmbedUrl(trailerUrlToPlay) || trailerUrlToPlay}
              title="Movie Trailer"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Public Footer with Discreet Intranet Padlock Link */}
      <Footer onOpenLogin={onOpenLogin} />

    </div>
  );
};
