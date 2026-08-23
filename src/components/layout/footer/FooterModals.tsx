import React, { useState } from 'react';
import { 
  Film, 
  Sparkles, 
  ShieldCheck, 
  Coffee, 
  HelpCircle, 
  FileText, 
  BookOpen, 
  CheckCircle2, 
  Volume2, 
  AlertTriangle, 
  MessageSquare, 
  Send,
  MapPin,
  Users,
  Tv
} from 'lucide-react';

export type FooterModalType = 
  | 'about' 
  | 'private-events' 
  | 'rules' 
  | 'snacks' 
  | 'faq' 
  | 'privacy' 
  | 'terms' 
  | 'reclamaciones' 
  | null;

interface FooterModalsProps {
  activeModal: FooterModalType;
  onClose: () => void;
}

export const FooterModals: React.FC<FooterModalsProps> = ({ activeModal, onClose }) => {
  const [reclamacionSubmitted, setReclamacionSubmitted] = useState<boolean>(false);
  const [reclamacionForm, setReclamacionForm] = useState({
    nombre: '',
    dni: '',
    email: '',
    telefono: '',
    tipo: 'RECLAMO',
    detalle: '',
    pedido: ''
  });

  if (!activeModal) return null;

  const handleReclamacionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReclamacionSubmitted(true);
    setTimeout(() => {
      setReclamacionSubmitted(false);
      onClose();
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
    <>
      {/* MODAL 1: SOBRE CINES ARGÓN */}
      {activeModal === 'about' && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-400" />
                <span>Sobre Cines Argón & Propósito</span>
              </h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
              <p>
                <strong className="text-white">Cines Argón</strong> es una iniciativa cinematográfica familiar y comunitaria impulsada por <em>Multiservicios Argón</em> en el <strong>Centro Poblado Tamanco Viejo, Distrito de Emilio San Martín</strong>.
              </p>

              <p>
                Acondicionamos un espacio cálido y acogedor en nuestro local residencial, equipado con proyección en pantalla gigante de alta definición y un potente sistema de sonido surround envolvente, para que nuestros vecinos, jóvenes y familias vivan la emoción del cine sin necesidad de trasladarse a otras ciudades.
              </p>
              
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                  <Tv className="w-4 h-4" /> Características de Nuestro Espacio:
                </h4>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex items-start gap-2">
                    <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Aforo y Comodidad:</strong> Capacidad para 25 personas con sillas cómodas organizadas para brindar visibilidad óptima a todos los asistentes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Sonido Envolvente:</strong> Sistema acústico surround multicanal calibrado para diálogos nítidos y efectos vibrantes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Ubicación:</strong> Centro Poblado Tamanco Viejo, Distrito de Emilio San Martín (Loreto).</span>
                  </li>
                </ul>
              </div>

              <p>
                Priorizamos la buena convivencia, la puntualidad y el trato respetuoso para que cada función sea un momento especial entre amigos y familia.
              </p>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={onClose}
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
          onClick={onClose}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Funciones Privadas & Alquiler del Espacio</span>
              </h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
              <p>
                ¿Deseas tener la sala exclusivamente para tu familia o grupo de amigos? En <strong>Cines Argón</strong> puedes reservar el espacio completo (hasta 25 personas) para:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    🎂 Cumpleaños y Celebraciones
                  </h4>
                  <p className="text-[11px] text-slate-400">Proyección especial de la película favorita del agasajado con canchita y refrescos.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    🎮 Tardes de Videojuegos
                  </h4>
                  <p className="text-[11px] text-slate-400">Conecta tu consola a la pantalla gigante y sonido envolvente para torneos con amigos.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    👨‍👩‍👧‍👦 Reuniones Familiares
                  </h4>
                  <p className="text-[11px] text-slate-400">Una función privada y tranquila solo para tu familia en un ambiente cómodo y seguro.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    🎬 Maratones de Sagas
                  </h4>
                  <p className="text-[11px] text-slate-400">Proyecciones de sagas completas, series o clásicos del cine.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                💬 <strong>Reservas y Coordinación:</strong> Escríbenos con anticipación a nuestro WhatsApp para verificar fechas y horarios disponibles.
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-between items-center shrink-0">
              <a
                href="https://wa.me/51920569220?text=Hola%20Cines%20Argón,%20quisiera%20cotizar%20la%20reserva%20privada%20de%20la%20sala%20en%20Tamanco%20Viejo"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Consultar por WhatsApp (+51 920 569 220)</span>
              </a>

              <button
                onClick={onClose}
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
          onClick={onClose}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Reglas de Convivencia y Respeto en Sala</span>
              </h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
              <p>Para que todos los asistentes disfruten de la función en armonía y tranquilidad, agradecemos seguir estas pautas:</p>

              <div className="space-y-3">
                <div className="flex gap-3 items-start p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-amber-400 font-bold text-base">1.</span>
                  <div>
                    <strong className="text-white block mb-0.5">Puntualidad de Ingreso</strong>
                    <span className="text-slate-400">El acceso se abre 10 minutos antes del inicio. Por respeto a los demás, una vez iniciada la película se debe ingresar en silencio.</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-cyan-400 font-bold text-base">2.</span>
                  <div>
                    <strong className="text-white block mb-0.5">Silencio y Celulares</strong>
                    <span className="text-slate-400">Por favor, silencia tu teléfono y evita llamadas o luces intensas de pantalla durante la proyección.</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-emerald-400 font-bold text-base">3.</span>
                  <div>
                    <strong className="text-white block mb-0.5">Cuidado del Mobiliario y Limpieza</strong>
                    <span className="text-slate-400">Cuidemos las sillas y el espacio que es para todos. Deposita las bolsas y botellas vacías en el tacho de basura al finalizar.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={onClose}
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
          onClick={onClose}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-400" />
                <span>Snacks y Alimentos Permitidos</span>
              </h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
              <p>
                Para mantener limpia la sala y asegurar la comodidad de todos, contamos con las siguientes recomendaciones:
              </p>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <h4 className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Permitidos en Sala:
                </h4>
                <ul className="space-y-1 text-slate-300">
                  <li>• Canchita / Popcorn dulce o salado en bolsa o balde.</li>
                  <li>• Gaseosas, jugos, agua embotellada y refrescos cerrados.</li>
                  <li>• Galletas, chocolates, golosinas y snacks secos.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                <h4 className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> No Permitidos:
                </h4>
                <ul className="space-y-1 text-slate-300">
                  <li>• Comidas preparadas calientes o con olores penetrantes.</li>
                  <li>• Bebidas alcohólicas.</li>
                  <li>• Envases de vidrio que puedan romperse.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={onClose}
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
          onClick={onClose}
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
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3.5 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-white block">¿Dónde se encuentra ubicado el cine?</strong>
                <p className="text-slate-400">Estamos ubicados en el Centro Poblado Tamanco Viejo, en el Distrito de Emilio San Martín.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-white block">¿Cómo es la sala y los asientos?</strong>
                <p className="text-slate-400">Es un espacio casero y familiar acondicionado con pantalla gigante, sonido surround y 25 sillas cómodas organizadas para una óptima visión.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-white block">¿Cómo compro o separo mis entradas?</strong>
                <p className="text-slate-400">Puedes adquirir tu boleto directamente en la taquilla presencial o comunicarte por WhatsApp al +51 920 569 220 para separar tus sillas con anticipación.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-white block">¿Cómo funciona la validación con Código QR?</strong>
                <p className="text-slate-400">Cada boleto emitido tiene un código QR único que nuestro encargado escanea en la entrada para registrar tu ingreso de manera rápida y ordenada.</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: TÉRMINOS Y CONDICIONES */}
      {(activeModal === 'privacy' || activeModal === 'terms') && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>{activeModal === 'privacy' ? 'Protección de Datos Personales' : 'Términos y Condiciones del Servicio'}</span>
              </h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
              {activeModal === 'privacy' ? (
                <>
                  <p>En <strong>MULTISERVICIOS ARGON (Ramirez Gonzales Alfredo)</strong> respetamos tu privacidad:</p>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
                    <li>Los datos solicitados (nombre, teléfono) para la reserva o emisión de boletos se utilizan exclusivamente para la gestión del servicio.</li>
                    <li>No compartimos tu información personal con terceros.</li>
                    <li>Operamos con transparencia y respeto en nuestra comunidad.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p><strong>Condiciones del Servicio de Proyección:</strong></p>
                  <ul className="space-y-2 list-disc pl-4 text-slate-400">
                    <li><strong>Ubicación del Servicio:</strong> Centro Poblado Tamanco Viejo, Distrito de Emilio San Martín.</li>
                    <li><strong>Naturaleza de la Sala:</strong> Sala íntima/casera comunitaria con capacidad máxima para 25 personas en sillas organizadas.</li>
                    <li><strong>Validez del Boleto:</strong> El boleto da derecho a una silla para la película, fecha y horario indicados.</li>
                    <li><strong>Orden de Llegada:</strong> La ubicación de las sillas se ocupa por orden de llegada al momento del ingreso.</li>
                    <li><strong>Derecho de Convivencia:</strong> Nos reservamos el derecho de pedir el retiro a personas que alteren el orden o falten el respeto a los demás asistentes.</li>
                  </ul>
                </>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: LIBRO DE RECLAMACIONES VIRTUAL */}
      {activeModal === 'reclamaciones' && (
        <div 
          onClick={onClose}
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
                  <span className="text-[10px] text-slate-400 font-mono">MULTISERVICIOS ARGON • RUC 10058605692</span>
                </div>
              </div>
              <button 
                onClick={onClose}
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
                    Establecimiento: CP Tamanco Viejo, Distrito de Emilio San Martín. Razón Comercial: MULTISERVICIOS ARGON.
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
    </>
  );
};
