import React from 'react';
import { HeroSlide } from '../../../core/types';
import { Sparkles, Plus, Eye, EyeOff, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface AdminHeroTabProps {
  heroSlides: HeroSlide[];
  onOpenCreate: () => void;
  onOpenEdit: (slide: HeroSlide) => void;
  onToggleActive: (slide: HeroSlide) => void;
  onDelete: (slideId: string) => void;
  onMoveOrder: (index: number, direction: 'up' | 'down') => void;
}

export const AdminHeroTab: React.FC<AdminHeroTabProps> = ({
  heroSlides,
  onOpenCreate,
  onOpenEdit,
  onToggleActive,
  onDelete,
  onMoveOrder
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Carrusel Principal de la Web (Marquee Hero)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configura los banners de bienvenida, imágenes de fondo, etiquetas, hora y sinopsis de las películas destacadas.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Diapositiva</span>
        </button>
      </div>

      {heroSlides.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800 space-y-3">
          <Sparkles className="w-10 h-10 text-amber-400/40 mx-auto" />
          <h4 className="text-base font-bold text-white">No hay diapositivas en el carrusel</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Crea tu primera diapositiva para el carrusel de la página principal agregando una imagen de fondo y título.
          </p>
          <button
            onClick={onOpenCreate}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Diapositiva</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`rounded-2xl border overflow-hidden transition-all bg-slate-900/80 flex flex-col justify-between ${
                slide.active ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/40 opacity-60'
              }`}
            >
              <div>
                {/* Backdrop Image Preview */}
                <div className="relative aspect-[16/8] w-full bg-slate-950 overflow-hidden">
                  <img
                    src={slide.backdropUrl || slide.posterUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover filter brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  
                  {/* Badges on preview */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    {slide.time && (
                      <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded uppercase shadow">
                        {slide.time}
                      </span>
                    )}
                    {slide.rating && (
                      <span className="px-2 py-0.5 bg-slate-900/90 text-amber-400 font-bold text-[10px] rounded border border-slate-700">
                        {slide.rating}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      slide.active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {slide.active ? 'Activo' : 'Pausado'}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-3 right-3">
                    <span className="text-[10px] text-amber-400 font-bold tracking-wider uppercase block">
                      {slide.tagline || 'FUNCIÓN DESTACADA'}
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-white truncate drop-shadow">
                      {slide.title}
                    </h4>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-2 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {slide.genres?.map(g => (
                      <span key={g} className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md border border-slate-700/50">
                        {g}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">
                    {slide.synopsis || 'Sin descripción.'}
                  </p>
                </div>
              </div>

              {/* Bottom Actions Toolbar */}
              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onMoveOrder(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
                    title="Mover arriba"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onMoveOrder(index, 'down')}
                    disabled={index === heroSlides.length - 1}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
                    title="Mover abajo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onToggleActive(slide)}
                    className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                      slide.active
                        ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={slide.active ? 'Ocultar del carrusel' : 'Mostrar en carrusel'}
                  >
                    {slide.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{slide.active ? 'Activo' : 'Oculto'}</span>
                  </button>

                  <button
                    onClick={() => onOpenEdit(slide)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center gap-1 text-xs font-semibold"
                    title="Editar diapositiva"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => onDelete(slide.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                    title="Eliminar diapositiva"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
