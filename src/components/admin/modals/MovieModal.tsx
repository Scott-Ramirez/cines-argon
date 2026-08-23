import React, { useState } from 'react';
import { Movie, MovieRating, MovieStatus } from '../../../core/types';
import { tmdbApi, TmdbSearchResult } from '../../../services/api/cinemaApi';
import { Film, Search, Loader2 } from 'lucide-react';

interface MovieModalProps {
  isOpen: boolean;
  editingMovie: Partial<Movie>;
  onClose: () => void;
  onSave: (movie: Partial<Movie>) => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({
  isOpen,
  editingMovie: initialMovie,
  onClose,
  onSave
}) => {
  const [editingMovie, setEditingMovie] = useState<Partial<Movie>>(initialMovie);
  const [tmdbSearchQuery, setTmdbSearchQuery] = useState<string>('');
  const [isSearchingTmdb, setIsSearchingTmdb] = useState<boolean>(false);
  const [tmdbSearchResults, setTmdbSearchResults] = useState<TmdbSearchResult[]>([]);

  if (!isOpen) return null;

  const handleSearchTmdb = async () => {
    if (!tmdbSearchQuery.trim()) return;
    setIsSearchingTmdb(true);
    try {
      const results = await tmdbApi.search(tmdbSearchQuery);
      setTmdbSearchResults(results);
    } catch (e) {
      console.error('Error buscando en TMDB:', e);
    } finally {
      setIsSearchingTmdb(false);
    }
  };

  const handleSelectTmdbMovie = async (movie: TmdbSearchResult) => {
    try {
      const details = await tmdbApi.getDetails(movie.id);
      setEditingMovie({
        ...editingMovie,
        title: details.title,
        originalTitle: details.originalTitle,
        synopsis: details.synopsis,
        durationMinutes: details.durationMinutes || 120,
        genre: details.genres || ['Acción'],
        posterUrl: details.posterUrl,
        backdropUrl: details.backdropUrl || details.posterUrl,
        trailerUrl: details.trailerUrl || '',
        director: details.director || '',
        rating: 'APT',
      });
      setTmdbSearchResults([]);
      setTmdbSearchQuery('');
    } catch (e) {
      console.error(e);
      setEditingMovie({
        ...editingMovie,
        title: movie.title,
        synopsis: movie.overview,
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl || movie.posterUrl,
      });
      setTmdbSearchResults([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovie.title || !editingMovie.posterUrl) {
      alert('Por favor ingresa al menos un título y la URL del póster.');
      return;
    }
    onSave(editingMovie);
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
              <Film className="w-5 h-5 text-amber-400" />
              <span>{editingMovie.id ? 'Editar Película' : 'Agregar Nueva Película'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Ingresa los datos o busca automáticamente en TheMovieDB</p>
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
          
          {/* TMDB Search Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>Búsqueda y Autocompletado en TheMovieDB (TMDB):</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Oficial API</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={tmdbSearchQuery}
                onChange={(e) => setTmdbSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearchTmdb(); }}}
                placeholder="Escribe el nombre (ej. Spider-Man, Moana, Gladiador 2)..."
                className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleSearchTmdb}
                disabled={isSearchingTmdb}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isSearchingTmdb ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Buscar</span>
              </button>
            </div>

            {/* TMDB Search Results dropdown */}
            {tmdbSearchResults.length > 0 && (
              <div className="mt-2 space-y-1.5 max-h-52 overflow-y-auto border-t border-slate-800 pt-2">
                <span className="text-[10px] text-slate-400 block mb-1">Selecciona un resultado para rellenar los datos:</span>
                {tmdbSearchResults.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => handleSelectTmdbMovie(res)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer flex gap-3 items-center transition-colors group"
                  >
                    <img
                      src={res.posterUrl}
                      alt={res.title}
                      className="w-8 h-12 object-cover rounded bg-slate-950 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate group-hover:text-amber-400">{res.title}</p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {res.releaseDate ? res.releaseDate.split('-')[0] : 'N/A'} • ⭐ {res.voteAverage.toFixed(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form */}
          <form id="movieForm" onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Título en Español:</label>
              <input
                type="text"
                required
                value={editingMovie.title || ''}
                onChange={(e) => setEditingMovie({ ...editingMovie, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl outline-none focus:border-amber-400 font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Título Original (Inglés/Origen):</label>
                <input
                  type="text"
                  value={editingMovie.originalTitle || ''}
                  onChange={(e) => setEditingMovie({ ...editingMovie, originalTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl font-mono outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Director:</label>
                <input
                  type="text"
                  value={editingMovie.director || ''}
                  onChange={(e) => setEditingMovie({ ...editingMovie, director: e.target.value })}
                  placeholder="Ej. Christopher Nolan"
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Duración (minutos):</label>
                <input
                  type="number"
                  required
                  value={editingMovie.durationMinutes || 120}
                  onChange={(e) => setEditingMovie({ ...editingMovie, durationMinutes: parseInt(e.target.value) || 120 })}
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl font-mono outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Clasificación:</label>
                <select
                  value={editingMovie.rating || 'APT'}
                  onChange={(e) => setEditingMovie({ ...editingMovie, rating: e.target.value as MovieRating })}
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl outline-none focus:border-amber-400"
                >
                  <option value="APT">APT (Todo Público)</option>
                  <option value="14+">14+ (Mayores de 14)</option>
                  <option value="18+">18+ (Adultos)</option>
                  <option value="TE">TE (Todos con guía)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Estado de Publicación:</label>
                <select
                  value={editingMovie.status || 'CARTELERA'}
                  onChange={(e) => setEditingMovie({ ...editingMovie, status: e.target.value as MovieStatus })}
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl outline-none focus:border-amber-400"
                >
                  <option value="CARTELERA">En Cartelera (Hoy)</option>
                  <option value="PROXIMAMENTE">Próximamente (Pronto)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Géneros (separados por coma):</label>
              <input
                type="text"
                value={editingMovie.genre ? editingMovie.genre.join(', ') : ''}
                onChange={(e) => setEditingMovie({ ...editingMovie, genre: e.target.value.split(',').map(g => g.trim()).filter(Boolean) })}
                placeholder="Ej. Acción, Aventura, Ciencia Ficción"
                className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">URL del Póster (Vertical):</label>
                <input
                  type="url"
                  required
                  value={editingMovie.posterUrl || ''}
                  onChange={(e) => setEditingMovie({ ...editingMovie, posterUrl: e.target.value })}
                  placeholder="https://image.tmdb.org/t/p/w500/..."
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl font-mono outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">URL de Fondo / Banner (Horizontal):</label>
                <input
                  type="url"
                  value={editingMovie.backdropUrl || ''}
                  onChange={(e) => setEditingMovie({ ...editingMovie, backdropUrl: e.target.value })}
                  placeholder="https://image.tmdb.org/t/p/original/..."
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl font-mono outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">URL del Tráiler Oficial (YouTube):</label>
              <input
                type="url"
                value={editingMovie.trailerUrl || ''}
                onChange={(e) => setEditingMovie({ ...editingMovie, trailerUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl font-mono outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Sinopsis Oficial:</label>
              <textarea
                rows={3}
                value={editingMovie.synopsis || ''}
                onChange={(e) => setEditingMovie({ ...editingMovie, synopsis: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-white p-2 rounded-xl outline-none focus:border-amber-400 resize-none"
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
            form="movieForm"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20"
          >
            Guardar Película
          </button>
        </div>

      </div>
    </div>
  );
};
