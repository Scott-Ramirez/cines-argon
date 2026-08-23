import React, { useState, useEffect } from 'react';
import { Movie, Showtime, Room, PricingTier, MovieRating, MovieStatus, Sale, HeroSlide } from '../core/types';
import { cinemaStorage } from '../services/storage/cinemaStorage';
import { sanitizeInput } from '../core/security/crypto';
import { tmdbApi, TmdbSearchResult } from '../services/api/cinemaApi';
import {
  Film,
  Clock,
  Calendar,
  DollarSign,
  Database,
  Plus,
  Trash2,
  Edit,
  Check,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Sparkles,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Sliders,
  Search,
  Loader2,
  Globe,
  Star,
  Download,
  Play,
  CheckCircle2,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'movies' | 'showtimes' | 'hero' | 'pricing' | 'audit'>('hero');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});

  // Movie Form Modal State
  const [isMovieModalOpen, setIsMovieModalOpen] = useState<boolean>(false);
  const [editingMovie, setEditingMovie] = useState<Partial<Movie>>({
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

  // TMDB Integration States
  const [tmdbSearchQuery, setTmdbSearchQuery] = useState<string>('');
  const [isSearchingTmdb, setIsSearchingTmdb] = useState<boolean>(false);
  const [tmdbSearchResults, setTmdbSearchResults] = useState<TmdbSearchResult[]>([]);
  const [isTmdbExploreOpen, setIsTmdbExploreOpen] = useState<boolean>(false);
  const [tmdbExploreTab, setTmdbExploreTab] = useState<'now-playing' | 'popular'>('now-playing');
  const [tmdbExploreList, setTmdbExploreList] = useState<TmdbSearchResult[]>([]);
  const [isLoadingExplore, setIsLoadingExplore] = useState<boolean>(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string>('');


  // Showtime Form State
  const [isShowtimeModalOpen, setIsShowtimeModalOpen] = useState<boolean>(false);
  const [newShowtime, setNewShowtime] = useState({
    movieId: '',
    roomId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '17:30',
    endTime: '19:50',
    availableSeats: 25
  });

  // Hero Slide Form State
  const [isHeroModalOpen, setIsHeroModalOpen] = useState<boolean>(false);
  const [editingHeroSlide, setEditingHeroSlide] = useState<Partial<HeroSlide>>({
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
    order: 1,
    movieId: ''
  });

  const loadData = () => {
    setMovies(cinemaStorage.getMovies());
    setShowtimes(cinemaStorage.getShowtimes());
    setRooms(cinemaStorage.getRooms());
    const loadedPricing = cinemaStorage.getPricing();
    setPricing(loadedPricing);
    setPriceInputs(prev => {
      const next: Record<string, string> = { ...prev };
      loadedPricing.forEach(p => {
        if (next[p.type] === undefined) {
          next[p.type] = p.basePrice.toString();
        }
      });
      return next;
    });
    setSales(cinemaStorage.getSales());
    setHeroSlides(cinemaStorage.getHeroSlides());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('argon_storage_update', loadData);
    return () => window.removeEventListener('argon_storage_update', loadData);
  }, []);

  // --- Movie Handlers ---
  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovie.title || !editingMovie.synopsis) return;

    const movieToSave: Movie = {
      id: editingMovie.id || 'mov-' + Date.now(),
      title: sanitizeInput(editingMovie.title || ''),
      originalTitle: sanitizeInput(editingMovie.originalTitle || ''),
      synopsis: sanitizeInput(editingMovie.synopsis || ''),
      durationMinutes: Number(editingMovie.durationMinutes) || 120,
      rating: (editingMovie.rating as MovieRating) || 'APT',
      genre: typeof editingMovie.genre === 'string' ? (editingMovie.genre as string).split(',').map(s => s.trim()) : editingMovie.genre || ['General'],
      posterUrl: editingMovie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
      backdropUrl: editingMovie.backdropUrl || '',
      status: (editingMovie.status as MovieStatus) || 'CARTELERA'
    };

    cinemaStorage.saveMovie(movieToSave);
    setIsMovieModalOpen(false);
    setEditingMovie({
      title: '',
      originalTitle: '',
      synopsis: '',
      durationMinutes: 120,
      rating: 'APT',
      genre: ['Acción'],
      posterUrl: '',
      backdropUrl: '',
      status: 'CARTELERA'
    });
  };

  const handleDeleteMovie = (id: string) => {
    if (confirm('¿Está seguro de eliminar esta película de la cartelera?')) {
      cinemaStorage.deleteMovie(id);
    }
  };

  // --- TMDB Handlers ---
  const handleSearchTmdb = async (query: string) => {
    if (!query.trim()) return;
    setIsSearchingTmdb(true);
    try {
      const results = await tmdbApi.search(query);
      setTmdbSearchResults(results);
    } catch (err: any) {
      console.warn('TMDB search error:', err.message);
      setTmdbSearchResults([]);
    } finally {
      setIsSearchingTmdb(false);
    }
  };

  const handleSelectTmdbMovie = async (tmdbId: number) => {
    setIsSearchingTmdb(true);
    try {
      const details = await tmdbApi.getDetails(tmdbId);
      if (details) {
        setEditingMovie(prev => ({
          ...prev,
          title: details.title,
          originalTitle: details.originalTitle,
          synopsis: details.synopsis,
          durationMinutes: details.durationMinutes,
          rating: details.rating,
          genre: details.genres.length > 0 ? details.genres : ['Acción'],
          posterUrl: details.posterUrl,
          backdropUrl: details.backdropUrl,
          director: details.director || '',
          trailerUrl: details.trailerUrl || '',
        }));
        setTmdbSearchResults([]);
        setTmdbSearchQuery('');
      }
    } catch (err: any) {
      console.warn('Error fetching TMDB details:', err.message);
    } finally {
      setIsSearchingTmdb(false);
    }
  };

  const handleLoadExploreTmdb = async (tab: 'now-playing' | 'popular') => {
    setTmdbExploreTab(tab);
    setIsLoadingExplore(true);
    try {
      const data = tab === 'now-playing' ? await tmdbApi.getNowPlaying() : await tmdbApi.getPopular();
      setTmdbExploreList(data);
    } catch (err: any) {
      console.warn('Error loading TMDB explore:', err.message);
      setTmdbExploreList([]);
    } finally {
      setIsLoadingExplore(false);
    }
  };

  const handleDirectImportTmdb = async (tmdbId: number, status: MovieStatus = 'CARTELERA') => {
    try {
      const imported = await tmdbApi.importMovie(tmdbId, status);
      if (imported) {
        cinemaStorage.saveMovie(imported);
        setImportSuccessMessage(`¡"${imported.title}" importada con éxito!`);
        setTimeout(() => setImportSuccessMessage(''), 4000);
      }
    } catch (err: any) {
      alert('No se pudo importar la película: ' + err.message);
    }
  };


  // --- Showtime Handlers ---
  const handleSaveShowtime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShowtime.movieId || !newShowtime.roomId) return;

    const room = rooms.find(r => r.id === newShowtime.roomId);
    const showtimeToSave: Showtime = {
      id: 'st-' + Date.now(),
      movieId: newShowtime.movieId,
      roomId: newShowtime.roomId,
      date: newShowtime.date,
      startTime: newShowtime.startTime,
      endTime: newShowtime.endTime,
      availableSeats: room ? room.capacity : 25,
    };

    cinemaStorage.saveShowtime(showtimeToSave);
    setIsShowtimeModalOpen(false);
  };

  const handleDeleteShowtime = (id: string) => {
    if (confirm('¿Eliminar este horario de función?')) {
      cinemaStorage.deleteShowtime(id);
    }
  };

  // --- Hero Slide Handlers ---
  const handlePopulateFromMovie = (movieId: string) => {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return;

    setEditingHeroSlide(prev => ({
      ...prev,
      movieId: movie.id,
      title: movie.title,
      rating: movie.rating === 'APT' ? 'APT (Niños)' : movie.rating,
      durationMinutes: movie.durationMinutes,
      genres: movie.genre,
      synopsis: movie.synopsis,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl || movie.posterUrl,
      tagline: movie.rating === 'APT' ? 'FUNCIÓN DE LA TARDE (FAMILIAR / NIÑOS)' : 'FUNCIÓN ESTELAR (+12 / ADULTOS)',
      time: movie.rating === 'APT' ? '5:30 PM' : '8:00 PM',
    }));
  };

  const handleSaveHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHeroSlide.title || !editingHeroSlide.backdropUrl) {
      alert('Por favor ingrese el título y la URL de la imagen de fondo.');
      return;
    }

    const slideToSave: HeroSlide = {
      id: editingHeroSlide.id || 'hero-' + Date.now(),
      title: sanitizeInput(editingHeroSlide.title || ''),
      tagline: sanitizeInput(editingHeroSlide.tagline || 'ESTRENO DESTACADO'),
      time: sanitizeInput(editingHeroSlide.time || '5:30 PM'),
      rating: sanitizeInput(editingHeroSlide.rating || 'APT'),
      durationMinutes: Number(editingHeroSlide.durationMinutes) || 120,
      genres: Array.isArray(editingHeroSlide.genres) 
        ? editingHeroSlide.genres 
        : typeof editingHeroSlide.genres === 'string' 
          ? (editingHeroSlide.genres as string).split(',').map(s => s.trim()) 
          : ['Cine'],
      synopsis: sanitizeInput(editingHeroSlide.synopsis || ''),
      backdropUrl: editingHeroSlide.backdropUrl || '',
      posterUrl: editingHeroSlide.posterUrl || '',
      active: editingHeroSlide.active ?? true,
      order: editingHeroSlide.order ?? (heroSlides.length + 1),
      movieId: editingHeroSlide.movieId || undefined
    };

    cinemaStorage.saveHeroSlide(slideToSave);
    setIsHeroModalOpen(false);
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
      order: 1,
      movieId: ''
    });
  };

  const handleDeleteHeroSlide = (id: string) => {
    if (confirm('¿Desea eliminar esta diapositiva del carrusel hero?')) {
      cinemaStorage.deleteHeroSlide(id);
    }
  };

  const handleToggleHeroSlide = (id: string) => {
    cinemaStorage.toggleHeroSlideStatus(id);
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...heroSlides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;

    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    // Update order numbers
    newSlides.forEach((s, idx) => {
      s.order = idx + 1;
    });

    cinemaStorage.saveHeroSlides(newSlides);
    setHeroSlides(newSlides);
  };

  // --- Pricing Handlers ---
  const handlePriceInputChange = (index: number, type: string, rawVal: string) => {
    setPriceInputs(prev => ({ ...prev, [type]: rawVal }));
    const parsed = parseFloat(rawVal);
    if (!isNaN(parsed) && parsed >= 0) {
      const updated = [...pricing];
      updated[index].basePrice = parsed;
      cinemaStorage.savePricing(updated);
      setPricing(updated);
    }
  };

  const handlePriceInputBlur = (index: number, type: string) => {
    const rawVal = priceInputs[type];
    const parsed = parseFloat(rawVal);
    if (isNaN(parsed) || parsed < 0) {
      const fallback = pricing[index]?.basePrice ?? 0;
      setPriceInputs(prev => ({ ...prev, [type]: fallback.toString() }));
    }
  };

  // --- Limpiar Cache y Re-sincronizar con MySQL ---
  const handleResetData = async () => {
    if (confirm('¿Desea limpiar el caché local y re-sincronizar con la base de datos de Cines Argón?')) {
      cinemaStorage.clearLocalCache();
      await cinemaStorage.syncFromBackend();
      loadData();
      alert('Caché sincronizado con la base de datos.');
    }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalTicketsSold = sales.reduce((sum, s) => sum + s.totalTickets, 0);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 p-4 lg:p-8 animate-fade-in no-print">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white font-sans">PANEL DE ADMINISTRACIÓN GENERAL</h1>
              <p className="text-xs text-slate-400">Gestión de carrusel hero, cartelera, horarios, sala y auditoría</p>
            </div>
          </div>

          {/* Factory Reset */}
          <button
            onClick={handleResetData}
            className="px-3.5 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-600/40 text-rose-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restablecer Datos Demo</span>
          </button>
        </div>

        {/* Admin Tabs */}
        <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto">
          
          {/* TAB: HERO CAROUSEL */}
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'hero'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Carrusel Hero ({heroSlides.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('movies')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'movies'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Películas ({movies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('showtimes')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'showtimes'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Funciones & Horarios ({showtimes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Tarifas & Precios</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Auditoría & Ventas</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB: HERO CAROUSEL MANAGER */}
        {/* ========================================================= */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Configuración del Banner / Carrusel Principal (Hero)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Personaliza los títulos, horarios (ej. 5:30 PM / 8:00 PM), imágenes de fondo y etiquetas que ven los clientes en el inicio.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingHeroSlide({
                    title: '',
                    tagline: 'FUNCIÓN DE LA TARDE (FAMILIAR)',
                    time: '5:30 PM',
                    rating: 'APT',
                    durationMinutes: 120,
                    genres: ['Animación', 'Familiar'],
                    synopsis: '',
                    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1600&auto=format&fit=crop',
                    posterUrl: '',
                    active: true,
                    order: heroSlides.length + 1,
                    movieId: movies[0]?.id || ''
                  });
                  setIsHeroModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Diapositiva al Hero</span>
              </button>
            </div>

            {/* Hero Slides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-xl transition-all ${
                    slide.active ? 'border-slate-800 hover:border-amber-500/50' : 'border-slate-800/50 opacity-60'
                  }`}
                >
                  {/* Backdrop Preview */}
                  <div className="relative aspect-[16/8] w-full bg-slate-950 overflow-hidden">
                    <img
                      src={slide.backdropUrl || slide.posterUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover filter brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                    {/* Overlay Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1 shadow">
                        <Clock className="w-3 h-3" /> {slide.time}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur border border-slate-700 text-amber-300 font-bold text-[10px]">
                        {slide.tagline}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-950/90 text-slate-300 font-mono text-[10px]">
                        {slide.rating}
                      </span>
                    </div>

                    {/* Active/Inactive Status Switch */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleToggleHeroSlide(slide.id)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1.5 shadow transition-all ${
                          slide.active
                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-950/80 border border-slate-700 text-slate-400'
                        }`}
                      >
                        {slide.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{slide.active ? 'ACTIVO' : 'PAUSADO'}</span>
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] font-mono text-slate-400 block">Orden #{slide.order}</span>
                      <h3 className="text-lg font-black text-white truncate drop-shadow-md">{slide.title}</h3>
                    </div>
                  </div>

                  {/* Body & Actions */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {slide.synopsis}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      
                      {/* Reorder Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveSlide(idx, 'up')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Subir posición"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === heroSlides.length - 1}
                          onClick={() => handleMoveSlide(idx, 'down')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Bajar posición"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Edit and Delete */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingHeroSlide(slide);
                            setIsHeroModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <Edit className="w-3 h-3 text-amber-400" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteHeroSlide(slide.id)}
                          className="px-3 py-1.5 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Eliminar</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {heroSlides.length === 0 && (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
                <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-60" />
                <p className="text-sm text-slate-300 font-bold">No hay diapositivas en el Carrusel Hero</p>
                <p className="text-xs text-slate-500 mt-1">Crea una diapositiva para personalizar el banner de inicio con tus horarios de función.</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: MOVIES */}
        {/* ========================================================= */}
        {activeTab === 'movies' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Film className="w-5 h-5 text-amber-400" />
                  <span>Catálogo de Películas</span>
                </h2>
                <p className="text-xs text-slate-400">Administra los títulos de cartelera y próximos estrenos</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsTmdbExploreOpen(true);
                    handleLoadExploreTmdb('now-playing');
                  }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-md"
                >
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Explorar en TMDB</span>
                </button>

                <button
                  onClick={() => {
                    setEditingMovie({
                      title: '',
                      originalTitle: '',
                      synopsis: '',
                      durationMinutes: 120,
                      rating: 'APT',
                      genre: ['Acción', 'Aventura'],
                      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
                      backdropUrl: '',
                      status: 'CARTELERA',
                      director: '',
                      trailerUrl: '',
                    });
                    setTmdbSearchResults([]);
                    setTmdbSearchQuery('');
                    setIsMovieModalOpen(true);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-md shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Película</span>
                </button>
              </div>
            </div>

            {importSuccessMessage && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{importSuccessMessage}</span>
              </div>
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {movies.map((m) => (
                <div key={m.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex gap-3">
                  <img
                    src={m.posterUrl}
                    alt={m.title}
                    className="w-16 h-24 object-cover rounded-xl bg-slate-950 shrink-0"
                  />
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-800 text-amber-400 rounded">
                          {m.rating}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          m.status === 'CARTELERA' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white truncate mt-1">{m.title}</h3>
                      <p className="text-[10px] text-slate-400 font-mono">{m.durationMinutes} min</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          setEditingMovie(m);
                          setIsMovieModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Edit className="w-3 h-3" /> Editar
                      </button>
                      <button
                        onClick={() => handleDeleteMovie(m.id)}
                        className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SHOWTIMES */}
        {/* ========================================================= */}
        {activeTab === 'showtimes' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-white">Programación de Funciones</h2>
                <p className="text-xs text-slate-400">Funciones vespertinas de 5:30 PM y estelares de 8:00 PM</p>
              </div>
              <button
                onClick={() => {
                  if (movies.length > 0 && rooms.length > 0) {
                    setNewShowtime({
                      movieId: movies[0].id,
                      roomId: rooms[0].id,
                      date: new Date().toISOString().split('T')[0],
                      startTime: '17:30',
                      endTime: '19:50',
                      availableSeats: rooms[0].capacity
                    });
                    setIsShowtimeModalOpen(true);
                  }
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Función</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Película</th>
                    <th className="p-3.5">Sala</th>
                    <th className="p-3.5">Fecha</th>
                    <th className="p-3.5">Horario</th>
                    <th className="p-3.5">Capacidad / Disponibles</th>
                    <th className="p-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {showtimes.map((st) => {
                    const movie = movies.find(m => m.id === st.movieId);
                    const room = rooms.find(r => r.id === st.roomId);
                    return (
                      <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-bold text-white">{movie?.title || 'Desconocida'}</td>
                        <td className="p-3.5 text-amber-400 font-semibold">{room?.name || 'Sala Única'}</td>
                        <td className="p-3.5 font-mono text-slate-300">{st.date}</td>
                        <td className="p-3.5 font-mono font-bold text-emerald-400 text-sm">{st.startTime}</td>
                        <td className="p-3.5 font-mono text-slate-300">{st.availableSeats} / {room?.capacity || 25}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteShowtime(st.id)}
                            className="p-1.5 text-rose-400 hover:bg-rose-950/60 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PRICING */}
        {/* ========================================================= */}
        {activeTab === 'pricing' && (
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-base font-bold text-white">Tarifas y Precios de Entrada</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              {pricing.map((p, idx) => (
                <div key={p.type} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="font-bold text-sm text-white">{p.label}</h3>
                    <p className="text-xs text-slate-400">{p.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-400 font-mono font-bold">S/.</span>
                    <input
                      type="number"
                      step="0.50"
                      min="0"
                      value={priceInputs[p.type] !== undefined ? priceInputs[p.type] : p.basePrice}
                      onChange={(e) => handlePriceInputChange(idx, p.type, e.target.value)}
                      onBlur={() => handlePriceInputBlur(idx, p.type)}
                      placeholder="0.00"
                      className="w-24 bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm px-3 py-1.5 rounded-lg outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: AUDIT & SALES */}
        {/* ========================================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-mono">INGRESOS TOTALES</span>
                <p className="text-2xl font-black text-amber-400 font-mono mt-1">S/. {totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-mono">BOLETOS VENDIDOS</span>
                <p className="text-2xl font-black text-emerald-400 font-mono mt-1">{totalTicketsSold}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-mono">TRANSACCIONES</span>
                <p className="text-2xl font-black text-cyan-400 font-mono mt-1">{sales.length}</p>
              </div>
            </div>

            {/* Sales Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">ID Venta</th>
                    <th className="p-3.5">Película</th>
                    <th className="p-3.5">Boletos</th>
                    <th className="p-3.5">Total</th>
                    <th className="p-3.5">Cajero</th>
                    <th className="p-3.5 text-right">Fecha / Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {sales.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40">
                      <td className="p-3.5 font-bold text-amber-400">{s.id}</td>
                      <td className="p-3.5 font-sans font-semibold text-white">{s.movieTitle}</td>
                      <td className="p-3.5 text-slate-300">{s.totalTickets}</td>
                      <td className="p-3.5 font-bold text-emerald-400">S/. {s.totalAmount.toFixed(2)}</td>
                      <td className="p-3.5 text-slate-400 font-sans">{s.cashierName}</td>
                      <td className="p-3.5 text-right text-slate-400 text-[11px]">
                        {new Date(s.createdAt).toLocaleString('es-PE')}
                      </td>
                    </tr>
                  ))}
                  {sales.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500 italic">No hay ventas registradas aún.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT HERO SLIDE */}
      {/* ========================================================= */}
      {isHeroModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-white font-sans">
                  {editingHeroSlide.id ? 'Editar Diapositiva del Hero' : 'Nueva Diapositiva en Carrusel'}
                </h3>
              </div>
            </div>
            
            <form onSubmit={handleSaveHeroSlide} className="space-y-3.5 text-xs">
              
              {/* Quick autofill from existing movies */}
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <label className="text-amber-400 font-bold block mb-1.5 flex items-center gap-1 font-mono text-[11px]">
                  <Film className="w-3 h-3" /> Autorellenar desde Película de Cartelera:
                </label>
                <select
                  value={editingHeroSlide.movieId || ''}
                  onChange={(e) => handlePopulateFromMovie(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-lg text-xs"
                >
                  <option value="">-- Seleccionar Película para Autocompletar --</option>
                  {movies.map(m => (
                    <option key={m.id} value={m.id}>{m.title} ({m.rating})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Título de la Película / Función:</label>
                  <input
                    type="text"
                    required
                    value={editingHeroSlide.title || ''}
                    onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, title: e.target.value })}
                    placeholder="ej. Spider-Man: Beyond the Spider-Verse"
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Hora de la Función (ej. 5:30 PM, 8:00 PM):</label>
                  <input
                    type="text"
                    required
                    value={editingHeroSlide.time || ''}
                    onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, time: e.target.value })}
                    placeholder="ej. 5:30 PM o 8:00 PM"
                    className="w-full bg-slate-950 border border-slate-700 text-amber-400 font-bold p-2.5 rounded-lg font-mono outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Etiqueta / Subtítulo Destacado:</label>
                <input
                  type="text"
                  required
                  value={editingHeroSlide.tagline || ''}
                  onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, tagline: e.target.value })}
                  placeholder="ej. FUNCIÓN DE LA TARDE (FAMILIAR / NIÑOS)"
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Clasificación:</label>
                  <input
                    type="text"
                    value={editingHeroSlide.rating || 'APT'}
                    onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, rating: e.target.value })}
                    placeholder="APT, +12, +14"
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Duración (min):</label>
                  <input
                    type="number"
                    value={editingHeroSlide.durationMinutes !== undefined ? editingHeroSlide.durationMinutes : ''}
                    onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, durationMinutes: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Orden / Posición:</label>
                  <input
                    type="number"
                    value={editingHeroSlide.order !== undefined ? editingHeroSlide.order : ''}
                    onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, order: e.target.value === '' ? undefined : parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">URL de Imagen de Fondo (Backdrop HD Horizontal):</label>
                <input
                  type="url"
                  required
                  value={editingHeroSlide.backdropUrl || ''}
                  onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, backdropUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-lg text-xs font-mono"
                />
              </div>

              {/* Backdrop preview thumbnail */}
              {editingHeroSlide.backdropUrl && (
                <div className="relative aspect-[16/6] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={editingHeroSlide.backdropUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-slate-300 font-mono">
                    Vista previa de imagen
                  </span>
                </div>
              )}

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Sinopsis / Descripción:</label>
                <textarea
                  rows={3}
                  value={editingHeroSlide.synopsis || ''}
                  onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, synopsis: e.target.value })}
                  placeholder="Breve reseña que aparecerá en el banner principal..."
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="slideActiveCheck"
                  checked={editingHeroSlide.active ?? true}
                  onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, active: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <label htmlFor="slideActiveCheck" className="text-slate-200 font-semibold cursor-pointer select-none">
                  Mostrar esta diapositiva activamente en el carrusel público
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsHeroModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-700 hover:bg-slate-800 rounded-xl text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20"
                >
                  Guardar Diapositiva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT MOVIE WITH TMDB AUTO-FILL */}
      {/* ========================================================= */}
      {isMovieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl my-8">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white font-sans flex items-center gap-2">
                  <Film className="w-5 h-5 text-amber-400" />
                  <span>{editingMovie.id ? 'Editar Película' : 'Agregar Nueva Película'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Ingresa los datos manualmente o usa el buscador inteligente de TMDB</p>
              </div>
              <button
                onClick={() => setIsMovieModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* TMDB Autocomplete Search Bar */}
            <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  Búsqueda en TheMovieDB (Auto-completar 1-Clic)
                </span>
                <span className="text-[10px] text-slate-400">Póster HD, Sinopsis, Duración</span>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={tmdbSearchQuery}
                    onChange={(e) => setTmdbSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchTmdb(tmdbSearchQuery);
                      }
                    }}
                    placeholder="Escribe el nombre (ej. Avatar, Gladiador, Dune...)"
                    className="w-full bg-slate-900 border border-slate-700 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 rounded-xl outline-none focus:border-cyan-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSearchTmdb(tmdbSearchQuery)}
                  disabled={isSearchingTmdb || !tmdbSearchQuery.trim()}
                  className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  {isSearchingTmdb ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  <span>Buscar</span>
                </button>
              </div>

              {/* TMDB Dropdown Results */}
              {tmdbSearchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto space-y-1.5 pt-1 pr-1">
                  {tmdbSearchResults.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleSelectTmdbMovie(t.id)}
                      className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors"
                    >
                      <img
                        src={t.posterUrl}
                        alt={t.title}
                        className="w-8 h-12 object-cover rounded-lg bg-slate-950 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-white truncate">{t.title}</h4>
                          <span className="text-[10px] text-amber-400 font-bold shrink-0">⭐ {t.voteAverage.toFixed(1)}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {t.releaseDate ? t.releaseDate.split('-')[0] : 'Estreno'} • {t.overview || 'Sin descripción'}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-[10px] font-bold rounded-lg shrink-0">
                        Usar
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSaveMovie} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Título:</label>
                  <input
                    type="text"
                    required
                    value={editingMovie.title || ''}
                    onChange={(e) => setEditingMovie({ ...editingMovie, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Título Original (Opcional):</label>
                  <input
                    type="text"
                    value={editingMovie.originalTitle || ''}
                    onChange={(e) => setEditingMovie({ ...editingMovie, originalTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Sinopsis Oficial:</label>
                <textarea
                  required
                  rows={3}
                  value={editingMovie.synopsis || ''}
                  onChange={(e) => setEditingMovie({ ...editingMovie, synopsis: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Duración (min):</label>
                  <input
                    type="number"
                    value={editingMovie.durationMinutes !== undefined ? editingMovie.durationMinutes : ''}
                    onChange={(e) => setEditingMovie({ ...editingMovie, durationMinutes: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Clasificación:</label>
                  <select
                    value={editingMovie.rating || 'APT'}
                    onChange={(e) => setEditingMovie({ ...editingMovie, rating: e.target.value as MovieRating })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl font-semibold"
                  >
                    <option value="APT">APT (Todo Público)</option>
                    <option value="14+">14+</option>
                    <option value="18+">18+</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Estado:</label>
                  <select
                    value={editingMovie.status || 'CARTELERA'}
                    onChange={(e) => setEditingMovie({ ...editingMovie, status: e.target.value as MovieStatus })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl font-semibold"
                  >
                    <option value="CARTELERA">En Cartelera</option>
                    <option value="PROXIMAMENTE">Próximamente</option>
                    <option value="ARCHIVADA">Archivada</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">URL de Póster (Vertical HD):</label>
                  <input
                    type="url"
                    value={editingMovie.posterUrl || ''}
                    onChange={(e) => setEditingMovie({ ...editingMovie, posterUrl: e.target.value })}
                    placeholder="https://image.tmdb.org/..."
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">URL de Fondo (Backdrop HD):</label>
                  <input
                    type="url"
                    value={editingMovie.backdropUrl || ''}
                    onChange={(e) => setEditingMovie({ ...editingMovie, backdropUrl: e.target.value })}
                    placeholder="https://image.tmdb.org/..."
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMovieModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-700 hover:bg-slate-800 rounded-xl text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20"
                >
                  Guardar Película
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TMDB WORLDWIDE EXPLORER & 1-CLICK IMPORT */}
      {/* ========================================================= */}
      {isTmdbExploreOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full p-6 sm:p-7 space-y-5 shadow-2xl my-8">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white font-sans flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <span>Explorador de Estrenos y Cartelera Mundial (TMDB)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Explora títulos mundiales e impórtalos a Cines Argón con 1 solo clic</p>
              </div>
              <button
                onClick={() => setIsTmdbExploreOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => handleLoadExploreTmdb('now-playing')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  tmdbExploreTab === 'now-playing'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                🍿 En Cines / Cartelera Actual
              </button>
              <button
                onClick={() => handleLoadExploreTmdb('popular')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  tmdbExploreTab === 'popular'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                🔥 Más Populares del Momento
              </button>
            </div>

            {/* List */}
            {isLoadingExplore ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
                <p className="text-xs">Consultando base de datos de TheMovieDB...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
                {tmdbExploreList.map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex gap-3">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded-xl bg-slate-900 shrink-0 shadow-md"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-amber-400 font-bold">⭐ {movie.voteAverage.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-500">{movie.releaseDate ? movie.releaseDate.split('-')[0] : ''}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1 line-clamp-2">{movie.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                          {movie.overview || 'Sin descripción disponible.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1.5 pt-1 border-t border-slate-900">
                      <button
                        onClick={() => handleDirectImportTmdb(movie.id, 'CARTELERA')}
                        className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 shadow-md"
                      >
                        <Download className="w-3 h-3" />
                        <span>A Cartelera</span>
                      </button>
                      <button
                        onClick={() => handleDirectImportTmdb(movie.id, 'PROXIMAMENTE')}
                        className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] rounded-lg"
                      >
                        Próximamente
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}


      {/* ========================================================= */}
      {/* MODAL: ADD SHOWTIME */}
      {/* ========================================================= */}
      {isShowtimeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-sans">Programar Nueva Función</h3>
            
            <form onSubmit={handleSaveShowtime} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Película:</label>
                <select
                  value={newShowtime.movieId}
                  onChange={(e) => setNewShowtime({ ...newShowtime, movieId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-lg"
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
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-lg"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Fecha:</label>
                  <input
                    type="date"
                    value={newShowtime.date}
                    onChange={(e) => setNewShowtime({ ...newShowtime, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Hora Inicio:</label>
                  <input
                    type="time"
                    value={newShowtime.startTime}
                    onChange={(e) => setNewShowtime({ ...newShowtime, startTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsShowtimeModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold"
                >
                  Programar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
