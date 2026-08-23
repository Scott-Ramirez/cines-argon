import React from 'react';
import { Lock, Sparkles, Film, Clock, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLogin }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#05070a] text-slate-400 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800/60">
          
          {/* Brand & Project Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full ring-2 ring-amber-500/40 p-0.5 bg-slate-900 overflow-hidden shadow-lg shadow-amber-500/10">
                <img
                  src="/logo.png"
                  alt="Cines Argón"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <span className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 font-sans">
                  CINES ARGÓN
                </span>
                <span className="block text-[10px] text-amber-500/90 font-mono font-bold tracking-wider">
                  SALA PRIVADA & HOME CINEMA
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Tu sala de cine en casa autorizada para estrenos selectos. Proyección en alta definición y sonido envolvente de máxima fidelidad.
            </p>
          </div>

          {/* Schedule & Rules Info */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Horarios de Funciones
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span><strong className="text-slate-200">5:30 PM:</strong> Función Familiar / Niños</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span><strong className="text-slate-200">8:00 PM:</strong> Función Estelar (+12 / Adultos)</span>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">
                * Días de proyección programados semanalmente.
              </li>
            </ul>
          </div>

          {/* Capacity & Experience Info */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Sala Exclusiva
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Equipada con <strong className="text-slate-200">1 sola sala de 25 butacas</strong> con calibración acústica Dolby Atmos para una experiencia inmersiva e íntima.
            </p>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Discreet Intranet Padlock Link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center gap-2 text-slate-500">
            <span>© {currentYear} Cines Argón. Todos los derechos reservados.</span>
          </div>

          {/* Discreet Intranet / Admin Access Link */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-slate-400 hover:text-amber-400 transition-all font-mono text-[11px] group"
              title="Acceso administrativo restringido"
            >
              <Lock className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
              <span>Acceso Intranet / Administración</span>
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
};
