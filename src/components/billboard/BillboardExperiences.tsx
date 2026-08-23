import React from 'react';
import { Room } from '../../core/types';
import { Award, Tv, Volume2, ShieldCheck } from 'lucide-react';

interface BillboardExperiencesProps {
  rooms: Room[];
}

export const BillboardExperiences: React.FC<BillboardExperiencesProps> = ({ rooms }) => {
  return (
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
  );
};
