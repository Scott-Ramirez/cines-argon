import React, { useState, useEffect } from 'react';
import { Film, Calendar, Sparkles, Clock, Lock, Tv, Shield } from 'lucide-react';

export type PublicSection = 'billboard' | 'upcoming' | 'experiences';

interface NavbarProps {
  activeSection: PublicSection;
  onSectionChange: (section: PublicSection) => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSectionChange,
  onOpenLogin,
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    {
      id: 'billboard' as PublicSection,
      label: 'En Cartelera',
      icon: Film,
      badge: 'HOY',
    },
    {
      id: 'upcoming' as PublicSection,
      label: 'Próximos Estrenos',
      icon: Calendar,
      badge: 'PRONTO',
    },
    {
      id: 'experiences' as PublicSection,
      label: 'Salas & Experiencias',
      icon: Tv,
      badge: 'IMAX / 3D',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#07090e]/95 backdrop-blur-md border-b border-slate-800/80 shadow-2xl no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Public Brand Logo & Title */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group" 
            onClick={() => onSectionChange('billboard')}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full ring-2 ring-amber-500/50 p-0.5 bg-slate-900 overflow-hidden shadow-lg shadow-amber-500/20 group-hover:ring-amber-400 group-hover:scale-105 transition-all">
                <img 
                  src="/logo.png" 
                  alt="Cines Argón" 
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 rounded-full ring-2 ring-[#07090e] flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-slate-950" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 font-sans">
                  CINES ARGÓN
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                La mejor experiencia de cine en tu ciudad
              </p>
            </div>
          </div>

          {/* Public Client Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 text-xs font-bold ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-extrabold ${
                      isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header: Clock & Private Cinema Tag */}
          <div className="flex items-center gap-3">
            
            {/* Private Home Cinema Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-300 font-sans tracking-wide">
                SALA 1 • EN VIVO
              </span>
            </div>

            {/* Live Clock */}
            <div className="hidden xs:flex flex-col items-end px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] uppercase font-mono text-slate-400 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-amber-400" /> HORA ACTUAL
              </span>
              <span className="text-xs font-mono font-bold text-slate-200">
                {time || '--:--:--'}
              </span>
            </div>

            {/* Intranet Staff Button */}
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-mono font-bold transition-all shadow-sm group"
              title="Acceso para el personal / Taquilla"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors"/>
              <span className="hidden sm:inline"></span>
            </button>

          </div>

        </div>

        {/* Mobile Public Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/80">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`py-1.5 px-3 rounded-lg text-center transition-all flex items-center gap-1.5 text-xs font-bold ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
