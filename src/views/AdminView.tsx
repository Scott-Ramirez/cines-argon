import React, { useState, useEffect } from 'react';
import { Movie, Showtime, Room, PricingTier, Sale, HeroSlide } from '../core/types';
import { cinemaStorage } from '../services/storage/cinemaStorage';
import { tmdbApi } from '../services/api/cinemaApi';
import {
  Film,
  Clock,
  DollarSign,
  BarChart3,
  Sparkles
} from 'lucide-react';

// Subcomponents
import { AdminHeroTab } from '../components/admin/tabs/AdminHeroTab';
import { AdminMoviesTab } from '../components/admin/tabs/AdminMoviesTab';
import { AdminShowtimesTab } from '../components/admin/tabs/AdminShowtimesTab';
import { AdminPricingTab } from '../components/admin/tabs/AdminPricingTab';
import { AdminAuditTab } from '../components/admin/tabs/AdminAuditTab';

// Modals
import { HeroSlideModal } from '../components/admin/modals/HeroSlideModal';
import { MovieModal } from '../components/admin/modals/MovieModal';
import { TmdbExploreModal } from '../components/admin/modals/TmdbExploreModal';
import { ShowtimeModal } from '../components/admin/modals/ShowtimeModal';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'movies' | 'showtimes' | 'pricing' | 'audit'>('hero');
  
  // Data States
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});

  // Modals Visibility States
  const [isHeroModalOpen, setIsHeroModalOpen] = useState<boolean>(false);
  const [editingHeroSlide, setEditingHeroSlide] = useState<Partial<HeroSlide>>({});

  const [isMovieModalOpen, setIsMovieModalOpen] = useState<boolean>(false);
  const [editingMovie, setEditingMovie] = useState<Partial<Movie>>({});

  const [isTmdbExploreOpen, setIsTmdbExploreOpen] = useState<boolean>(false);
  const [isShowtimeModalOpen, setIsShowtimeModalOpen] = useState<boolean>(false);

  // Toast message
  const [pricingSavedMessage, setPricingSavedMessage] = useState<string>('');

  const loadData = () => {
    setMovies(cinemaStorage.getMovies());
    setShowtimes(cinemaStorage.getShowtimes());
    setRooms(cinemaStorage.getRooms());
    const loadedPricing = cinemaStorage.getPricing();
    setPricing(loadedPricing);
    const nextInputs: Record<string, string> = {};
    loadedPricing.forEach(p => {
      nextInputs[p.type] = p.basePrice.toString();
    });
    setPriceInputs(nextInputs);
    setSales(cinemaStorage.getSales());
    setHeroSlides(cinemaStorage.getHeroSlides());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('argon_storage_update', loadData);
    return () => window.removeEventListener('argon_storage_update', loadData);
  }, []);

  // -------------------------------------------------------------
  // HERO SLIDES HANDLERS
  // -------------------------------------------------------------
  const handleOpenCreateHeroSlide = () => {
    const firstMovie = movies[0];
    if (firstMovie) {
      setEditingHeroSlide({
        movieId: firstMovie.id,
        title: firstMovie.title,
        tagline: firstMovie.rating === 'APT' ? 'FUNCIÓN DE LA TARDE (FAMILIAR)' : 'ESTRENO ESTELAR DE LA NOCHE',
        time: firstMovie.rating === 'APT' ? '5:30 PM' : '8:00 PM',
        rating: firstMovie.rating,
        durationMinutes: firstMovie.durationMinutes,
        genres: firstMovie.genre && firstMovie.genre.length > 0 ? firstMovie.genre : ['Cine'],
        synopsis: firstMovie.synopsis,
        backdropUrl: firstMovie.backdropUrl || firstMovie.posterUrl,
        posterUrl: firstMovie.posterUrl,
        active: true,
        order: heroSlides.length + 1
      });
    } else {
      setEditingHeroSlide({
        title: '',
        tagline: 'FUNCIÓN DE LA TARDE (FAMILIAR)',
        time: '5:30 PM',
        rating: 'APT',
        durationMinutes: 120,
        genres: ['Animación', 'Familiar'],
        synopsis: '',
        backdropUrl: '',
        posterUrl: '',
        active: true,
        order: heroSlides.length + 1,
        movieId: ''
      });
    }
    setIsHeroModalOpen(true);
  };

  const handleOpenEditHeroSlide = (slide: HeroSlide) => {
    setEditingHeroSlide(slide);
    setIsHeroModalOpen(true);
  };

  const handleSaveHeroSlide = (slideData: Partial<HeroSlide>) => {
    const newSlide: HeroSlide = {
      id: slideData.id || crypto.randomUUID(),
      title: slideData.title || '',
      tagline: slideData.tagline || '',
      time: slideData.time || '',
      rating: slideData.rating || 'APT',
      durationMinutes: slideData.durationMinutes || 120,
      genres: slideData.genres || [],
      synopsis: slideData.synopsis || '',
      backdropUrl: slideData.backdropUrl || '',
      posterUrl: slideData.posterUrl || '',
      active: slideData.active ?? true,
      order: slideData.order ?? (heroSlides.length + 1),
      movieId: slideData.movieId || undefined
    };

    cinemaStorage.saveHeroSlide(newSlide);
    setIsHeroModalOpen(false);
  };

  const handleToggleActiveHeroSlide = (slide: HeroSlide) => {
    cinemaStorage.saveHeroSlide({ ...slide, active: !slide.active });
  };

  const handleDeleteHeroSlide = (slideId: string) => {
    if (confirm('¿Estás seguro de eliminar esta diapositiva del carrusel?')) {
      cinemaStorage.deleteHeroSlide(slideId);
    }
  };

  const handleMoveSlideOrder = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= heroSlides.length) return;

    const list = [...heroSlides];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;

    list.forEach((slide, idx) => {
      cinemaStorage.saveHeroSlide({ ...slide, order: idx + 1 });
    });
  };

  // -------------------------------------------------------------
  // MOVIES HANDLERS
  // -------------------------------------------------------------
  const handleOpenCreateMovie = () => {
    setEditingMovie({
      title: '',
      originalTitle: '',
      synopsis: '',
      durationMinutes: 120,
      rating: 'APT',
      genre: ['Acción'],
      posterUrl: '',
      backdropUrl: '',
      status: 'CARTELERA',
      director: '',
      trailerUrl: '',
    });
    setIsMovieModalOpen(true);
  };

  const handleOpenEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setIsMovieModalOpen(true);
  };

  const handleSaveMovie = (movieData: Partial<Movie>) => {
    const movieToSave: Movie = {
      id: movieData.id || crypto.randomUUID(),
      title: movieData.title || '',
      originalTitle: movieData.originalTitle || '',
      synopsis: movieData.synopsis || '',
      durationMinutes: movieData.durationMinutes || 120,
      rating: movieData.rating || 'APT',
      genre: movieData.genre || ['Acción'],
      posterUrl: movieData.posterUrl || '',
      backdropUrl: movieData.backdropUrl || '',
      status: movieData.status || 'CARTELERA',
      director: movieData.director || '',
      trailerUrl: movieData.trailerUrl || '',
    };

    cinemaStorage.saveMovie(movieToSave);
    setIsMovieModalOpen(false);
  };

  const handleDeleteMovie = (movieId: string) => {
    if (confirm('¿Estás seguro de eliminar esta película?')) {
      cinemaStorage.deleteMovie(movieId);
    }
  };

  const handleDirectImportTmdb = async (tmdbId: number, targetStatus: 'CARTELERA' | 'PROXIMAMENTE') => {
    try {
      const details = await tmdbApi.getDetails(tmdbId);
      const newMovie: Movie = {
        id: crypto.randomUUID(),
        title: details.title,
        originalTitle: details.originalTitle,
        synopsis: details.synopsis,
        durationMinutes: details.durationMinutes || 120,
        genre: details.genres || ['Cine'],
        posterUrl: details.posterUrl,
        backdropUrl: details.backdropUrl || details.posterUrl,
        trailerUrl: details.trailerUrl || '',
        director: details.director || '',
        rating: 'APT',
        status: targetStatus,
      };

      cinemaStorage.saveMovie(newMovie);
      setIsTmdbExploreOpen(false);
      alert(`"${details.title}" fue importada exitosamente.`);
    } catch (e) {
      console.error(e);
      alert('Error importando película desde TMDB');
    }
  };

  // -------------------------------------------------------------
  // SHOWTIMES HANDLERS
  // -------------------------------------------------------------
  const handleOpenCreateShowtime = () => {
    if (movies.length === 0) {
      alert('Primero debes agregar al menos una película en la cartelera.');
      return;
    }
    setIsShowtimeModalOpen(true);
  };

  const handleSaveShowtime = (showtimeData: {
    movieId: string;
    roomId: string;
    date: string;
    startTime: string;
    endTime?: string;
    availableSeats: number;
  }) => {
    const movie = movies.find(m => m.id === showtimeData.movieId);
    const duration = movie ? movie.durationMinutes : 120;
    
    // Auto calculate end time
    const [startH, startM] = showtimeData.startTime.split(':').map(Number);
    const totalMinutes = startH * 60 + startM + duration;
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    const calculatedEndTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const newSt: Showtime = {
      id: crypto.randomUUID(),
      movieId: showtimeData.movieId,
      roomId: showtimeData.roomId,
      date: showtimeData.date,
      startTime: showtimeData.startTime,
      endTime: calculatedEndTime,
      availableSeats: showtimeData.availableSeats,
    };

    cinemaStorage.saveShowtime(newSt);
    setIsShowtimeModalOpen(false);
  };

  const handleDeleteShowtime = (showtimeId: string) => {
    if (confirm('¿Eliminar esta función?')) {
      cinemaStorage.deleteShowtime(showtimeId);
    }
  };

  // -------------------------------------------------------------
  // PRICING HANDLERS
  // -------------------------------------------------------------
  const handlePriceInputChange = (type: string, value: string) => {
    setPriceInputs(prev => ({ ...prev, [type]: value }));
  };

  const handleSavePrice = async (type: string) => {
    const val = parseFloat(priceInputs[type]);
    if (isNaN(val) || val <= 0) {
      alert('Por favor ingresa un precio válido mayor a 0');
      return;
    }
    const updatedPricing = pricing.map(p => p.type === type ? { ...p, basePrice: val } : p);
    await cinemaStorage.savePricing(updatedPricing);
    setPricing(updatedPricing);
    setPriceInputs(prev => ({ ...prev, [type]: val.toString() }));
    setPricingSavedMessage(`Tarifa ${type} actualizada a S/. ${val.toFixed(2)} correctamente.`);
    setTimeout(() => setPricingSavedMessage(''), 4000);
  };

  const handleSaveAllPrices = async () => {
    const updatedPricing = pricing.map(p => {
      const val = parseFloat(priceInputs[p.type]);
      return !isNaN(val) && val > 0 ? { ...p, basePrice: val } : p;
    });
    await cinemaStorage.savePricing(updatedPricing);
    setPricing(updatedPricing);
    setPricingSavedMessage('¡Todas las tarifas y precios fueron actualizados exitosamente!');
    setTimeout(() => setPricingSavedMessage(''), 4000);
  };

  const handleResetStandardPricing = () => {
    const standardTiers: PricingTier[] = [
      { id: crypto.randomUUID(), type: 'GENERAL', label: 'General', description: 'Entrada General (Adulto)', basePrice: 18.00 },
      { id: crypto.randomUUID(), type: 'NINO', label: 'Niños', description: 'Niños (Menores de 12 años)', basePrice: 13.50 },
      { id: crypto.randomUUID(), type: 'ADULTO_MAYOR', label: 'Adulto Mayor', description: 'Adulto Mayor (+60 años / Conadis)', basePrice: 13.50 },
      { id: crypto.randomUUID(), type: 'PROMO_DUO', label: 'Promo Dúo', description: 'Combo Dúo (2 Entradas Generales)', basePrice: 30.00 },
    ];
    cinemaStorage.savePricing(standardTiers);
    setPricing(standardTiers);
    setPricingSavedMessage('Tarifas estándar cargadas con éxito.');
    setTimeout(() => setPricingSavedMessage(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in">
      
      {/* Admin Top Header & Navigation Tabs */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
              Panel Administrativo de Control
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-sans text-white mt-1">
              GESTIÓN DE CINES ARGÓN
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sala Única (VIP 25 Butacas)</span>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'hero'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Carrusel Hero ({heroSlides.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('movies')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'movies'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Películas & TMDB ({movies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('showtimes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'showtimes'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Horarios & Funciones ({showtimes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Tarifas y Precios</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Auditoría de Ventas</span>
          </button>
        </div>

        {/* Dynamic Tab Content Renderer */}
        {activeTab === 'hero' && (
          <AdminHeroTab
            heroSlides={heroSlides}
            onOpenCreate={handleOpenCreateHeroSlide}
            onOpenEdit={handleOpenEditHeroSlide}
            onToggleActive={handleToggleActiveHeroSlide}
            onDelete={handleDeleteHeroSlide}
            onMoveOrder={handleMoveSlideOrder}
          />
        )}

        {activeTab === 'movies' && (
          <AdminMoviesTab
            movies={movies}
            onOpenCreate={handleOpenCreateMovie}
            onOpenTmdbExplore={() => setIsTmdbExploreOpen(true)}
            onOpenEdit={handleOpenEditMovie}
            onDelete={handleDeleteMovie}
          />
        )}

        {activeTab === 'showtimes' && (
          <AdminShowtimesTab
            showtimes={showtimes}
            movies={movies}
            rooms={rooms}
            onOpenCreate={handleOpenCreateShowtime}
            onDelete={handleDeleteShowtime}
          />
        )}

        {activeTab === 'pricing' && (
          <AdminPricingTab
            pricing={pricing}
            priceInputs={priceInputs}
            pricingSavedMessage={pricingSavedMessage}
            onPriceInputChange={handlePriceInputChange}
            onSavePrice={handleSavePrice}
            onSaveAllPrices={handleSaveAllPrices}
            onResetStandardPricing={handleResetStandardPricing}
          />
        )}

        {activeTab === 'audit' && (
          <AdminAuditTab sales={sales} />
        )}

      </div>

      {/* Admin Modals */}
      <HeroSlideModal
        isOpen={isHeroModalOpen}
        editingSlide={editingHeroSlide}
        movies={movies}
        onClose={() => setIsHeroModalOpen(false)}
        onSave={handleSaveHeroSlide}
      />

      <MovieModal
        isOpen={isMovieModalOpen}
        editingMovie={editingMovie}
        onClose={() => setIsMovieModalOpen(false)}
        onSave={handleSaveMovie}
      />

      <TmdbExploreModal
        isOpen={isTmdbExploreOpen}
        onClose={() => setIsTmdbExploreOpen(false)}
        onDirectImport={handleDirectImportTmdb}
      />

      <ShowtimeModal
        isOpen={isShowtimeModalOpen}
        movies={movies}
        rooms={rooms}
        onClose={() => setIsShowtimeModalOpen(false)}
        onSave={handleSaveShowtime}
      />

    </div>
  );
};
