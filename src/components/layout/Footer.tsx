import React, { useState } from 'react';
import { 
  Lock, 
  Clock, 
  ShieldCheck, 
  BookOpen, 
  HelpCircle, 
  MessageSquare, 
  Award, 
  Coffee 
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        {/* Main 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-slate-800/70">
          
          {/* ========================================================= */}
          {/* COLUMNA 1: ACERCA DE CINES ARGÓN */}
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
                  SALA PRIVADA & HOME CINEMA
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              La primera sala exclusiva Home Cinema VIP de 25 butacas reclinables, con calibración acústica profesional Dolby Atmos y proyección láser de alta fidelidad.
            </p>

            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-amber-400" /> Acerca de Nosotros
              </h4>
              <ul className="text-xs space-y-1.5">
                <li>
                  <button
                    onClick={() => setActiveModal('about')}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    • Sobre Cines Argón & Nuestra Historia
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('private-events')}
                    className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                  >
                    <span>• Funciones Privadas & Alquiler de Sala</span>
                    <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[9px] font-bold rounded">VIP</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('about')}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    • Tecnología Acústica Dolby Atmos 7.1.4
                  </button>
                </li>
              </ul>
            </div>

            {/* Badge de Garantía VIP */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-slate-200 block">Experiencia VIP Garantizada</span>
                <span className="text-slate-400">Aforo exclusivo limitado a 25 personas</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMNA 2: CONVIVENCIA Y DULCERÍA */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2 mb-3">
                <Coffee className="w-3.5 h-3.5 text-amber-400" /> Protocolos & Convivencia
              </h4>
              <ul className="text-xs space-y-2 text-slate-400">
                <li>
                  <button
                    onClick={() => setActiveModal('rules')}
                    className="hover:text-cyan-400 transition-colors text-left block"
                  >
                    • Reglas de Convivencia y Silencio en Sala
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('snacks')}
                    className="hover:text-cyan-400 transition-colors text-left block"
                  >
                    • Lista de Snacks y Alimentos Permitidos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('rules')}
                    className="hover:text-cyan-400 transition-colors text-left block"
                  >
                    • Climatización y Confort Ergonómico
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('rules')}
                    className="hover:text-cyan-400 transition-colors text-left block"
                  >
                    • Política de Ingreso y Puntualidad
                  </button>
                </li>
              </ul>
            </div>

            {/* Horarios de Funciones Habituales */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Horarios de Funciones
              </span>
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Función Familiar:
                  </span>
                  <strong className="text-slate-200 font-mono">5:30 PM</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Función Estelar:
                  </span>
                  <strong className="text-slate-200 font-mono">8:00 PM</strong>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMNA 3: AYUDA Y CONTACTO */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Ayuda & Atención
            </h4>

            <ul className="text-xs space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => setActiveModal('faq')}
                  className="hover:text-cyan-400 transition-colors text-left block"
                >
                  • Centro de Ayuda & Preguntas Frecuentes (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('faq')}
                  className="hover:text-cyan-400 transition-colors text-left block"
                >
                  • ¿Cómo validar mis Boletos con Código QR?
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('reclamaciones')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 text-amber-300 font-semibold"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>• Libro de Reclamaciones Virtual</span>
                </button>
              </li>
            </ul>

            {/* Direct WhatsApp Contact Button */}
            <div className="pt-1">
              <a
                href="https://wa.me/51920569220?text=Hola%20Cines%20Argón,%20quisiera%20consultar%20sobre%20funciones%20o%20reservas"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 hover:border-emerald-500/60 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-center gap-2 transition-all group shadow-md"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>WhatsApp: +51 920 569 220</span>
              </a>
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* SUB-FOOTER: POLÍTICAS Y REGLAS LEGALES (Cineplanet Style) */}
        {/* ========================================================= */}
        <div className="py-6 border-b border-slate-800/60 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-slate-400">
          <button
            onClick={() => setActiveModal('privacy')}
            className="hover:text-white transition-colors"
          >
            Política de Protección de Datos Personales
          </button>
          <span className="text-slate-700 hidden sm:inline">•</span>

          <button
            onClick={() => setActiveModal('terms')}
            className="hover:text-white transition-colors"
          >
            Términos y Condiciones de Boletos
          </button>
          <span className="text-slate-700 hidden sm:inline">•</span>

          <button
            onClick={() => setActiveModal('rules')}
            className="hover:text-white transition-colors"
          >
            Reglas de Convivencia en Sala
          </button>
          <span className="text-slate-700 hidden sm:inline">•</span>

          <button
            onClick={() => setActiveModal('reclamaciones')}
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5 font-bold text-slate-300"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Libro de Reclamaciones</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM BAR: RAZÓN SOCIAL, REDES & ACCESO ADMINISTRATIVO */}
        {/* ========================================================= */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-slate-500 text-center sm:text-left">
            <span className="font-semibold text-slate-400">Cines Argón S.A.C.</span>
            <span className="hidden sm:inline">|</span>
            <span>RUC 20608941235</span>
            <span className="hidden sm:inline">|</span>
            <span>© {currentYear} Todos los derechos reservados.</span>
          </div>

          {/* Social & Admin Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-slate-400 hover:text-amber-400 transition-all font-mono text-[11px] group"
              title="Acceso administrativo restringido"
            >
              <Lock className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
              <span>Intranet</span>
            </button>
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
