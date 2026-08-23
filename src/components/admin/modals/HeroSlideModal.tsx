import React, { useState, useEffect } from 'react';
import { HeroSlide, Movie } from '../../../core/types';
import { tmdbApi, TmdbSearchResult } from '../../../services/api/cinemaApi';
import { Sparkles, Search, Loader2 } from 'lucide-react';

interface HeroSlideModalProps {
  isOpen: boolean;
  editingSlide: Partial<HeroSlide>;
  movies: Movie[];
  onClose: () => void;
  onSave: (slide: Partial<HeroSlide>) => void;
}

export const HeroSlideModal: React.FC<HeroSlideModalProps> = ({
  isOpen,
  editingSlide: initialSlide,
  movies,
  onClose,
  onSave
}) => {
  const [editingHeroSlide, setEditingHeroSlide] = useState<Partial<HeroSlide>>(initialSlide);
  const [heroTmdbSearchQuery, setHeroTmdbSearchQuery] = useState<string>('');
  const [isSearchingHeroTmdb, setIsSearchingHeroTmdb] = useState<boolean>(false);
  const [heroTmdbResults, setHeroTmdbResults] = useState<TmdbSearchResult[]>([]);

  // Synchronize state when editingSlide prop changes
  useEffect(() => {
    if (isOpen) {
      setEditingHeroSlide(initialSlide || {});
      setHeroTmdbResults([]);
      setHeroTmdbSearchQuery('');
    }
  }, [initialSlide, isOpen]);

  if (!isOpen) return null;

  const handlePopulateFromMovie = (movieId: string) => {
    const movie = movies.find(m => m.id === movieId);
    if (movie) {
      setEditingHeroSlide(prev => ({
        ...prev,
        movieId: movie.id,
        title: movie.title,
        synopsis: movie.synopsis,
        backdropUrl: movie.backdropUrl || movie.posterUrl,
        posterUrl: movie.posterUrl,
        rating: movie.rating,
        durationMinutes: movie.durationMinutes,
        genres: movie.genre && movie.genre.length > 0 ? movie.genre : ['Cine'],
        tagline: movie.rating === 'APT' ? 'FUNCIÓN DE LA TARDE (FAMILIAR)' : 'ESTRENO ESTELAR DE LA NOCHE',
        time: movie.rating === 'APT' ? '5:30 PM' : '8:00 PM'
      }));
    }
  };

  const handleSearchHeroTmdb = async () => {
    if (!heroTmdbSearchQuery.trim()) return;
    setIsSearchingHeroTmdb(true);
    try {
      const results = await tmdbApi.search(heroTmdbSearchQuery);
      setHeroTmdbResults(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchingHeroTmdb(false);
    }
  };

  const handleSelectHeroTmdb = (item: TmdbSearchResult) => {
    setEditingHeroSlide(prev => ({
      ...prev,
      title: item.title,
      synopsis: item.overview,
      backdropUrl: item.backdropUrl || item.posterUrl,
      posterUrl: item.posterUrl,
      genres: ['Estreno'],
      rating: 'APT',
      tagline: 'ESTRENO DESTACADO',
      time: '8:00 PM'
    }));
    setHeroTmdbResults([]);
    setHeroTmdbSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHeroSlide.title || !editingHeroSlide.backdropUrl) {
      alert('Por favor ingresa al menos un título y la URL de la imagen de fondo.');
      return;
    }
    onSave(editingHeroSlide);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-hidden"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0 bg-slate-900">
          <div>
            <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{editingHeroSlide.id ? 'Editar Banner del Carrusel' : 'Nueva Diapositiva para el Hero'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Configura la imagen de fondo, textos, hora y películas destacadas</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
          {/* Quick Autorefill from Billboard */}
          {movies.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <label className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autorellenar desde Película de Cartelera:</span>
              </label>
              <select
                value={editingHeroSlide.movieId || ''}
                onChange={(e) => handlePopulateFromMovie(e.target.value)}
                className="w-full bg-slate-950 border border-amber-500/40 text-white p-2 rounded-xl text-xs outline-none focus:border-amber-400 font-sans"
              >
                <option value="">-- Seleccionar una película existente --</option>
                {movies.map(m => (
                  <option key={m.id} value={m.id}>{m.title} ({m.rating})</option>
                ))}
              </select>
            </div>
          )}

          {/* TMDB Quick Live Search for Hero */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-cyan-400 font-bold flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>O busca en TheMovieDB (TMDB) para extraer imágenes HD:</span>
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={heroTmdbSearchQuery}
                onChange={(e) => setHeroTmdbSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearchHeroTmdb(); }}}
                placeholder="Ej. Avatar, Inside Out 2, Dune..."
                className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={handleSearchHeroTmdb}
                disabled={isSearchingHeroTmdb}
                className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isSearchingHeroTmdb ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Buscar</span>
              </button>
            </div>

            {/* Results preview */}
            {heroTmdbResults.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 max-h-48 overflow-y-auto border-t border-slate-800">
                {heroTmdbResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectHeroTmdb(item)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/60 cursor-pointer flex gap-2.5 items-center transition-all group"
                  >
                    <img
                      src={item.backdropUrl || item.posterUrl}
                      alt={item.title}
                      className="w-16 h-10 object-cover rounded-lg bg-slate-950 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300">{item.title}</p>
                      <p className="text-[10px] text-slate-400 truncate">{item.releaseDate ? item.releaseDate.split('-')[0] : ''} • ⭐ {item.voteAverage.toFixed(1)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Fields */}
          <form id="heroSlideForm" onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Título Principal del Banner:</label>
              <input
                type="text"
                required
                value={editingHeroSlide.title || ''}
                onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, title: e.target.value })}
                placeholder="Ej. MOANA 2, SPIDER-MAN: UN NUEVO DÍA"
                className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl outline-none focus:border-amber-400 font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Etiqueta / Tagline:</label>
                <input
                  type="text"
                  value={editingHeroSlide.tagline || ''}
                  onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, tagline: e.target.value })}
                  placeholder="Ej. FUNCIÓN FAMILIAR, ESTRENO ESTELAR"
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Hora Destacada (en Banner):</label>
                <input
                  type="text"
                  value={editingHeroSlide.time || ''}
                  onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, time: e.target.value })}
                  placeholder="Ej. 5:30 PM, 8:00 PM"
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl font-mono outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Clasificación de Edad:</label>
                <input
                  type="text"
                  value={editingHeroSlide.rating || ''}
                  onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, rating: e.target.value })}
                  placeholder="Ej. APT (Niños), +14, 18+"
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Duración (minutos):</label>
                <input
                  type="number"
                  value={editingHeroSlide.durationMinutes || 120}
                  onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, durationMinutes: parseInt(e.target.value) || 120 })}
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl font-mono outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Géneros (separados por coma):</label>
              <input
                type="text"
                value={editingHeroSlide.genres ? editingHeroSlide.genres.join(', ') : ''}
                onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, genres: e.target.value.split(',').map(g => g.trim()).filter(Boolean) })}
                placeholder="Ej. Animación, Aventura, Fantasía"
                className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">URL de Imagen de Fondo (Backdrop HD 16:9):</label>
              <input
                type="url"
                required
                value={editingHeroSlide.backdropUrl || ''}
                onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, backdropUrl: e.target.value })}
                placeholder="https://image.tmdb.org/t/p/original/..."
                className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl font-mono outline-none focus:border-amber-400"
              />
            </div>

            {editingHeroSlide.backdropUrl && (
              <div className="aspect-[16/7] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                <img
                  src={editingHeroSlide.backdropUrl}
                  alt="Vista previa"
                  className="w-full h-full object-cover filter brightness-75"
                />
                <div className="absolute bottom-2 left-3 text-[11px] text-white font-bold bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                  Vista Previa del Fondo Hero
                </div>
              </div>
            )}

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Sinopsis corta o descripción impactante:</label>
              <textarea
                rows={3}
                value={editingHeroSlide.synopsis || ''}
                onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, synopsis: e.target.value })}
                placeholder="Breve reseña que enganche al espectador..."
                className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl outline-none focus:border-amber-400 resize-none"
              />
            </div>
          </form>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 p-4 border-t border-slate-800 shrink-0 bg-slate-950/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-slate-700 hover:bg-slate-800 rounded-xl text-slate-300 font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="heroSlideForm"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20"
          >
            Guardar Diapositiva
          </button>
        </div>

      </div>
    </div>
  );
};
