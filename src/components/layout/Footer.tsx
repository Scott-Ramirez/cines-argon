import React, { useState } from 'react';
import { 
  Lock, 
  Sparkles, 
  Film, 
  Clock, 
  ShieldCheck, 
  BookOpen, 
  HelpCircle, 
  Phone, 
  MessageSquare, 
  FileText, 
  Award, 
  Coffee, 
  Volume2, 
  Users, 
  X, 
  CheckCircle2,
  Tv,
  Send,
  AlertTriangle
} from 'lucide-react';

interface FooterProps {
  onOpenLogin: () => void;
}

type FooterModalType = 
  | 'about' 
  | 'private-events' 
  | 'rules' 
  | 'snacks' 
  | 'faq' 
  | 'privacy' 
  | 'terms' 
  | 'reclamaciones' 
  | null;

export const Footer: React.FC<FooterProps> = ({ onOpenLogin }) => {
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState<FooterModalType>(null);

  // Form state for Libro de Reclamaciones
  const [reclamacionSubmitted, setReclamacionSubmitted] = useState<boolean>(false);
  const [reclamacionForm, setReclamacionForm] = useState({
    nombre: '',
    dni: '',
    email: '',
    telefono: '',
    tipo: 'RECLAMO', // RECLAMO o QUEJA
    detalle: '',
    pedido: ''
  });

  const handleReclamacionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReclamacionSubmitted(true);
    setTimeout(() => {
      setReclamacionSubmitted(false);
      setActiveModal(null);
      setReclamacionForm({
        nombre: '',
        dni: '',
        email: '',
        telefono: '',
        tipo: 'RECLAMO',
        detalle: '',
        pedido: ''
      });
    }, 3000);
  };

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
                href="https://wa.me/51999999999?text=Hola%20Cines%20Argón,%20quisiera%20consultar%20sobre%20funciones%20o%20reservas"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 hover:border-emerald-500/60 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-center gap-2 transition-all group shadow-md"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Atención por WhatsApp / Taquilla</span>
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
            {/* Discreet Intranet / Admin Access Link */}
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

      {/* ========================================================= */}
      {/* MODALES INFORMATIVOS (FOOTER POPUPS) */}
      {/* ========================================================= */}

      {/* MODAL 1: SOBRE CINES ARGÓN */}
      {activeModal === 'about' && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-400" />
                <span>Sobre Cines Argón</span>
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
              <p>
                <strong className="text-white">Cines Argón</strong> nace como un concepto exclusivo de <em>Home Cinema Boutique</em>, diseñado para ofrecer la experiencia cinematográfica más inmersiva, íntima y de alta tecnología para cinéfilos y familias.
              </p>
              
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4" /> Especificaciones de la Sala
                </h4>
                <ul className="space-y-1.5 text-slate-300">
                  <li>• <strong>Capacidad:</strong> 1 sala VIP única para 25 butacas ergonómicas reclinables.</li>
                  <li>• <strong>Acústica:</strong> Sistema surround Dolby Atmos 7.1.4 con calibración DSP digital.</li>
                  <li>• <strong>Proyección:</strong> Resolución 4K HDR con pantalla acústicamente transparente.</li>
                </ul>
              </div>

              <p>
                Garantizamos un ambiente controlado, seguro y con la máxima fidelidad sonora para disfrutar de los mejores títulos de cartelera y clásicos del cine.
              </p>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FUNCIONES PRIVADAS & ALQUILER DE SALA */}
      {activeModal === 'private-events' && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Funciones Privadas & Alquiler de Sala</span>
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
              <p>
                ¿Deseas tener la sala completa para ti y tus invitados? En <strong>Cines Argón</strong> puedes alquilar la sala en exclusiva (hasta 25 personas) para:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    🎂 Cumpleaños y Fiestas
                  </h4>
                  <p className="text-[11px] text-slate-400">Celebra tu fecha especial con tu película favorita y snacks.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    🎮 Torneos de Gaming
                  </h4>
                  <p className="text-[11px] text-slate-400">Conecta tu consola en pantalla gigante 4K y sonido envolvente.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    💼 Eventos Corporativos
                  </h4>
                  <p className="text-[11px] text-slate-400">Presentaciones privadas y jornadas de integración para equipos.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    🎬 Maratones & Clásicos
                  </h4>
                  <p className="text-[11px] text-slate-400">Proyecciones de sagas completas con tus amigos.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                💬 <strong>Reservas y Cotizaciones:</strong> Escríbenos directamente a nuestro WhatsApp de atención para coordinar fechas y disponibilidad.
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-between items-center shrink-0">
              <a
                href="https://wa.me/51999999999?text=Hola%20Cines%20Argón,%20quisiera%20cotizar%20el%20alquiler%20de%20la%20sala%20completa"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Cotizar por WhatsApp</span>
              </a>

              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REGLAS DE CONVIVENCIA EN SALA */}
      {activeModal === 'rules' && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Reglas de Convivencia y Silencio en Sala</span>
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
              <p>Para asegurar una experiencia de primer nivel para todos los asistentes, solicitamos respetar las siguientes normas:</p>

              <div className="space-y-3">
                <div className="flex gap-3 items-start p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-amber-400 font-bold text-base">1.</span>
                  <div>
                    <strong className="text-white block mb-0.5">Puntualidad de Ingreso</strong>
                    <span className="text-slate-400">El acceso a sala se abre 10 minutos antes del inicio. Una vez comenzada la función, el ingreso debe realizarse en silencio.</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-cyan-400 font-bold text-base">2.</span>
                  <div>
                    <strong className="text-white block mb-0.5">Celulares en Modo Silencio / Cine</strong>
                    <span className="text-slate-400">Por respeto a los demás espectadores, silencia tu móvil y evita el brillo de pantallas durante la proyección.</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-emerald-400 font-bold text-base">3.</span>
                  <div>
                    <strong className="text-white block mb-0.5">Cuidado de las Butacas y Equipamiento</strong>
                    <span className="text-slate-400">Nuestras 25 butacas son de cuero reclinable. Se prohíbe apoyar calzado sobre los asientos o manipular los paneles acústicos.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs"
              >
                Comprendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: SNACKS Y ALIMENTOS PERMITIDOS */}
      {activeModal === 'snacks' && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-400" />
                <span>Política de Snacks y Alimentos Permitidos</span>
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
              <p>
                Para mantener la higiene de la sala y evitar olores fuertes o ruidos durante la película, contamos con la siguiente política de alimentos:
              </p>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <h4 className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Alimentos y Bebidas Permitidos:
                </h4>
                <ul className="space-y-1 text-slate-300">
                  <li>• Canchita / Popcorn dulce o salado en envase adecuado.</li>
                  <li>• Bebidas no alcohólicas, agua embotellada, jugos y gaseosas con tapa.</li>
                  <li>• Chocolates, gomitas y golosinas secas.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                <h4 className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Alimentos NO Permitidos:
                </h4>
                <ul className="space-y-1 text-slate-300">
                  <li>• Comidas calientes con olor penetrante (hamburguesas, pizzas, pollo, etc.).</li>
                  <li>• Bebidas alcohólicas no autorizadas expresamente.</li>
                  <li>• Envases de vidrio o elementos punzocortantes.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PREGUNTAS FRECUENTES (FAQ) */}
      {activeModal === 'faq' && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <span>Preguntas Frecuentes (FAQ)</span>
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3.5 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-white block">¿Cómo compro mis boletos?</strong>
                <p className="text-slate-400">Puedes adquirir tus entradas en la taquilla presencial de Cines Argón o coordinar tu reserva anticipada vía WhatsApp.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-white block">¿Cómo funciona la validación con Código QR?</strong>
                <p className="text-slate-400">Cada boleto emitido cuenta con un código QR único y seguro (UUID v4). Al ingresar a la sala, nuestro personal escanea tu código en la puerta para darte acceso inmediato.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-white block">¿Se pueden elegir butacas?</strong>
                <p className="text-slate-400">Las 25 butacas son de primera categoría reclinables y se asignan por orden de llegada y confirmación de reserva.</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: POLÍTICA DE PROTECCIÓN DE DATOS & TÉRMINOS */}
      {(activeModal === 'privacy' || activeModal === 'terms') && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>{activeModal === 'privacy' ? 'Protección de Datos Personales' : 'Términos y Condiciones'}</span>
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
              {activeModal === 'privacy' ? (
                <>
                  <p>En cumplimiento de la <strong>Ley N° 29733 (Ley de Protección de Datos Personales de Perú)</strong>, Cines Argón S.A.C. informa:</p>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
                    <li>Los datos personales recopilados para emisión de boletos o comprobantes se tratan con absoluta confidencialidad.</li>
                    <li>No compartimos ni comercializamos información con terceros no autorizados.</li>
                    <li>Puedes ejercer tus derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) contactando a nuestra administración.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p><strong>Condiciones Generales del Servicio:</strong></p>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
                    <li>Los boletos son válidos únicamente para la película, fecha y horario indicados.</li>
                    <li>El código QR es intransferible una vez validado en puerta.</li>
                    <li>La administración se reserva el derecho de admisión en caso de incumplimiento de las normas de convivencia.</li>
                  </ul>
                </>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: LIBRO DE RECLAMACIONES VIRTUAL */}
      {activeModal === 'reclamaciones' && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">Libro de Reclamaciones Virtual</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Cines Argón S.A.C. • RUC 20608941235</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto flex-1 min-h-0">
              {reclamacionSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-base font-bold text-white">Reclamo / Queja Registrado</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Tu solicitud ha sido ingresada a nuestro registro conforme a ley. Recibirás una copia de constancia a tu correo electrónico.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReclamacionSubmit} className="space-y-3 text-xs">
                  <p className="text-[11px] text-slate-400">
                    Conforme a lo establecido en el Código de Protección y Defensa del Consumidor (Ley N° 29571).
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Nombre Completo:</label>
                      <input
                        type="text"
                        required
                        value={reclamacionForm.nombre}
                        onChange={(e) => setReclamacionForm({ ...reclamacionForm, nombre: e.target.value })}
                        placeholder="Ej. Juan Pérez"
                        className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">DNI / CE:</label>
                      <input
                        type="text"
                        required
                        value={reclamacionForm.dni}
                        onChange={(e) => setReclamacionForm({ ...reclamacionForm, dni: e.target.value })}
                        placeholder="8 dígitos"
                        className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl font-mono outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Correo Electrónico:</label>
                      <input
                        type="email"
                        required
                        value={reclamacionForm.email}
                        onChange={(e) => setReclamacionForm({ ...reclamacionForm, email: e.target.value })}
                        placeholder="tu@correo.com"
                        className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Teléfono:</label>
                      <input
                        type="tel"
                        required
                        value={reclamacionForm.telefono}
                        onChange={(e) => setReclamacionForm({ ...reclamacionForm, telefono: e.target.value })}
                        placeholder="999 999 999"
                        className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl font-mono outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Tipo de Registro:</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tipo"
                          value="RECLAMO"
                          checked={reclamacionForm.tipo === 'RECLAMO'}
                          onChange={() => setReclamacionForm({ ...reclamacionForm, tipo: 'RECLAMO' })}
                          className="text-amber-500 focus:ring-amber-400"
                        />
                        <span><strong>Reclamo</strong> (Disconformidad con el servicio)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tipo"
                          value="QUEJA"
                          checked={reclamacionForm.tipo === 'QUEJA'}
                          onChange={() => setReclamacionForm({ ...reclamacionForm, tipo: 'QUEJA' })}
                          className="text-amber-500 focus:ring-amber-400"
                        />
                        <span><strong>Queja</strong> (Malestar en la atención)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Detalle del Reclamo / Queja:</label>
                    <textarea
                      required
                      rows={3}
                      value={reclamacionForm.detalle}
                      onChange={(e) => setReclamacionForm({ ...reclamacionForm, detalle: e.target.value })}
                      placeholder="Describe lo sucedido detalladamente..."
                      className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Pedido o Solución Esperada:</label>
                    <input
                      type="text"
                      required
                      value={reclamacionForm.pedido}
                      onChange={(e) => setReclamacionForm({ ...reclamacionForm, pedido: e.target.value })}
                      placeholder="¿Qué solución solicitas a la administración?"
                      className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Hoja de Reclamación</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </footer>
  );
};
