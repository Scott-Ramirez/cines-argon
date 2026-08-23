import React from 'react';
import { Movie } from '../../../core/types';
import { Film, Plus, Globe, Edit, Trash2 } from 'lucide-react';

interface AdminMoviesTabProps {
  movies: Movie[];
  onOpenCreate: () => void;
  onOpenTmdbExplore: () => void;
  onOpenEdit: (movie: Movie) => void;
  onDelete: (movieId: string) => void;
}

export const AdminMoviesTab: React.FC<AdminMoviesTabProps> = ({
  movies,
  onOpenCreate,
  onOpenTmdbExplore,
  onOpenEdit,
  onDelete
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <span>Películas en Cartelera y Próximos Estrenos</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Administra los títulos, sinopsis, duración, clasificación e imágenes oficiales de tus proyecciones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTmdbExplore}
            className="px-3.5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all shrink-0"
          >
            <Globe className="w-4 h-4" />
            <span>Explorador TMDB (Mundial)</span>
          </button>

          <button
            onClick={onOpenCreate}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Película</span>
          </button>
        </div>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800 space-y-3">
          <Film className="w-10 h-10 text-amber-400/40 mx-auto" />
          <h4 className="text-base font-bold text-white">No hay películas registradas</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Comienza agregando tu primera película o utiliza el explorador mundial de TMDB para importar con 1 solo clic.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex gap-4 hover:border-slate-700 transition-all group"
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-xl bg-slate-950 shrink-0 shadow"
              />

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      movie.status === 'CARTELERA'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}>
                      {movie.status === 'CARTELERA' ? 'En Cartelera' : 'Próximamente'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{movie.rating}</span>
                  </div>

                  <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                    {movie.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2">
                    {movie.synopsis}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-2">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {movie.durationMinutes} min • {movie.genre[0] || 'Cine'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEdit(movie)}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs"
                      title="Editar"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(movie.id)}
                      className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
