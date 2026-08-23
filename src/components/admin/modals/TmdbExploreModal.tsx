import React, { useState, useEffect } from 'react';
import { tmdbApi, TmdbSearchResult } from '../../../services/api/cinemaApi';
import { Globe, Play, Sparkles, Loader2, Download } from 'lucide-react';

interface TmdbExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDirectImport: (tmdbId: number, targetStatus: 'CARTELERA' | 'PROXIMAMENTE') => Promise<void>;
}

export const TmdbExploreModal: React.FC<TmdbExploreModalProps> = ({
  isOpen,
  onClose,
  onDirectImport
}) => {
  const [tmdbExploreTab, setTmdbExploreTab] = useState<'now-playing' | 'popular'>('now-playing');
  const [tmdbExploreList, setTmdbExploreList] = useState<TmdbSearchResult[]>([]);
  const [isLoadingExplore, setIsLoadingExplore] = useState<boolean>(false);

  const loadExploreList = async (tab: 'now-playing' | 'popular') => {
    setTmdbExploreTab(tab);
    setIsLoadingExplore(true);
    try {
      if (tab === 'now-playing') {
        const list = await tmdbApi.getNowPlaying();
        setTmdbExploreList(list);
      } else {
        const list = await tmdbApi.getPopular();
        setTmdbExploreList(list);
      }
    } catch (e) {
      console.error('Error cargando catálogo TMDB:', e);
    } finally {
      setIsLoadingExplore(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadExploreList(tmdbExploreTab);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-hidden"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0 bg-slate-900">
          <div>
            <h3 className="text-lg font-black text-white font-sans flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span>Explorador de Estrenos y Cartelera Mundial (TMDB)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Explora títulos mundiales e impórtalos a Cines Argón con 1 solo clic</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 min-h-0">
          {/* Tabs: En Cartelera vs Populares */}
          <div className="flex gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => loadExploreList('now-playing')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                tmdbExploreTab === 'now-playing'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>En Cartelera Mundial (Now Playing)</span>
            </button>

            <button
              onClick={() => loadExploreList('popular')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                tmdbExploreTab === 'popular'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Populares & Taquilleras</span>
            </button>
          </div>

          {/* Grid or Loader */}
          {isLoadingExplore ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-xs font-medium">Consultando API oficial de TheMovieDB...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {tmdbExploreList.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between gap-3 hover:border-slate-700 transition-all group"
                >
                  <div className="flex gap-3">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded-xl bg-slate-900 shrink-0 group-hover:scale-105 transition-transform"
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
                      onClick={() => onDirectImport(movie.id, 'CARTELERA')}
                      className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 shadow-md"
                    >
                      <Download className="w-3 h-3" />
                      <span>A Cartelera</span>
                    </button>
                    <button
                      onClick={() => onDirectImport(movie.id, 'PROXIMAMENTE')}
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

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-slate-800 shrink-0 bg-slate-950/80">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-200 text-xs font-bold"
          >
            Cerrar Explorador
          </button>
        </div>
      </div>
    </div>
  );
};
