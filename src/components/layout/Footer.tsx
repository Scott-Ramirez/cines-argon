import React, { useState } from 'react';
import { 
  Lock, 
  Clock, 
  MapPin, 
  Users, 
  BookOpen, 
  HelpCircle, 
  MessageSquare, 
  Coffee, 
  FileText, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { FooterModals, FooterModalType } from './footer/FooterModals';

interface FooterProps {
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLogin }) => {
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState<FooterModalType>(null);

  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#040609] text-slate-400 no-print relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-800/70">
          
          {/* ========================================================= */}
          {/* COLUMNA 1: IDENTIDAD, CONCEPTO Y UBICACIÓN */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full ring-2 ring-amber-500/40 p-0.5 bg-slate-900 overflow-hidden shadow-lg shadow-amber-500/10 shrink-0">
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
                  CINE CASERO & COMUNITARIO
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Un espacio acogedor y familiar acondicionado en nuestro local residencial, equipado con proyección en alta definición y sonido envolvente para brindar a nuestros vecinos la magia del cine en un ambiente cercano y seguro.
            </p>

            {/* Badges de Ubicación y Aforo */}
            <div className="space-y-2 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5 text-xs">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300 font-medium">
                  CP Tamanco Viejo, Distrito de Emilio San Martín
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5 text-xs">
                <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300 font-medium">
                  Sala acondicionada con sillas cómodas (Aforo: 25 personas)
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMNA 2: HORARIOS Y GUÍA DE SALA */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Funciones & Convivencia
            </h4>

            {/* Horarios habituales */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 font-mono block">
                Horarios de Proyección Habituales:
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Función Familiar:
                  </span>
                  <strong className="text-slate-200 font-mono">5:30 PM</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Función Estelar:
                  </span>
                  <strong className="text-slate-200 font-mono">8:00 PM</strong>
                </div>
              </div>
            </div>

            {/* Enlaces informativos */}
            <ul className="text-xs space-y-2 text-slate-400 pt-1">
              <li>
                <button
                  onClick={() => setActiveModal('about')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sobre Nuestro Cine & Propósito Comunitario</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('snacks')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-2"
                >
                  <Coffee className="w-3.5 h-3.5 text-amber-400" />
                  <span>Snacks y Alimentos Permitidos</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('rules')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reglas de Convivencia y Respeto en Sala</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('private-events')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-2"
                >
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Funciones Privadas & Alquiler del Espacio</span>
                </button>
              </li>
            </ul>
          </div>

          {/* ========================================================= */}
          {/* COLUMNA 3: ATENCIÓN AL CLIENTE & LEGAL */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Atención & Legal
            </h4>

            <p className="text-xs text-slate-400">
              ¿Deseas consultar la cartelera del día o separar tus sillas anticipadamente?
            </p>

            {/* Direct WhatsApp Contact Button */}
            <a
              href="https://wa.me/51920569220?text=Hola%20Cines%20Argón,%20quisiera%20consultar%20sobre%20las%20funciones%20o%20separar%20sillas"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 hover:border-emerald-500/60 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-center gap-2 transition-all group shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>WhatsApp: +51 920 569 220</span>
            </a>

            <ul className="text-xs space-y-2 text-slate-400 pt-1">
              <li>
                <button
                  onClick={() => setActiveModal('faq')}
                  className="hover:text-cyan-400 transition-colors text-left flex items-center gap-2"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span>Preguntas Frecuentes (FAQ)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('terms')}
                  className="hover:text-cyan-400 transition-colors text-left flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Términos y Condiciones del Servicio</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('reclamaciones')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-2 text-amber-300 font-semibold"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Libro de Reclamaciones Virtual</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* ========================================================= */}
        {/* BOTTOM BAR: RAZÓN SOCIAL, UBICACIÓN & ACCESO INTRANET */}
        {/* ========================================================= */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-slate-500 text-center sm:text-left">
            <span className="font-semibold text-slate-300">MULTISERVICIOS ARGON</span>
            <span className="hidden sm:inline">•</span>
            <span>RAMIREZ GONZALES ALFREDO</span>
            <span className="hidden sm:inline">•</span>
            <span className="font-mono text-slate-400 font-bold">RUC 10058605692</span>
            <span className="hidden sm:inline">•</span>
            <span>Tamanco Viejo, Emilio San Martín</span>
            <span className="hidden sm:inline">•</span>
            <span>© {currentYear}</span>
          </div>

        </div>

      </div>

      {/* Modal Dialogs Renderer */}
      <FooterModals 
        activeModal={activeModal} 
        onClose={() => setActiveModal(null)} 
      />

    </footer>
  );
};
