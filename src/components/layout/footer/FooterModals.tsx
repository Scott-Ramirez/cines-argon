import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  Tv,
  X
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

  useEffect(() => {
    if (activeModal) {
      document.body.classList.add('has-modal-open');
      return () => {
        document.body.classList.remove('has-modal-open');
      };
    }
  }, [activeModal]);


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

  return createPortal(
    <>

      {/* MODAL 1: SOBRE CINES ARGÓN */}
      {activeModal === 'about' && (
        <div 
          onClick={onClose}
          data-modal="true"
          className="fixed inset-0 z-[9999] overflow-y-auto bg-black/90 backdrop-blur-md p-3 pt-6 pb-6 sm:p-6 flex items-start sm:items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0 bg-[#0c1017]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-400" />
                <span>Sobre Cines Argón & Propósito</span>
              </h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
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

            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0 bg-[#0c1017]">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-colors"
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
          data-modal="true"
          className="fixed inset-0 z-[9999] overflow-y-auto bg-black/90 backdrop-blur-md p-3 pt-6 pb-6 sm:p-6 flex items-start sm:items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0 bg-[#0c1017]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Funciones Privadas & Alquiler del Espacio</span>
              </h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
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

            <div className="p-4 border-t border-slate-800 flex justify-between items-center shrink-0 bg-[#0c1017]">
              <a
                href="https://wa.me/51920569220?text=Hola%20Cines%20Argón,%20quisiera%20cotizar%20la%20reserva%20privada%20de%20la%20sala%20en%20Tamanco%20Viejo"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Consultar por WhatsApp (+51 920 569 220)</span>
              </a>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-colors"
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
          data-modal="true"
          className="fixed inset-0 z-[9999] overflow-y-auto bg-black/90 backdrop-blur-md p-3 pt-6 pb-6 sm:p-6 flex items-start sm:items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0 bg-[#0c1017]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Reglas de Convivencia y Respeto en Sala</span>
              </h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
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

            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0 bg-[#0c1017]">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-colors"
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
          data-modal="true"
          className="fixed inset-0 z-[9999] overflow-y-auto bg-black/90 backdrop-blur-md p-3 pt-6 pb-6 sm:p-6 flex items-start sm:items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0 bg-[#0c1017]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-400" />
                <span>Snacks y Alimentos Permitidos</span>
              </h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
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

            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0 bg-[#0c1017]">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-colors"
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
          data-modal="true"
          className="fixed inset-0 z-[9999] overflow-y-auto bg-black/90 backdrop-blur-md p-3 pt-6 pb-6 sm:p-6 flex items-start sm:items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0 bg-[#0c1017]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <span>Preguntas Frecuentes (FAQ)</span>
              </h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-3.5 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-white block">¿Dónde se encuentra ubicado el cine?</strong>
                <p className="text-slate-400">Estamos ubicados en el Centro Poblado Tamanco Viejo, en el Distrito de Emilio San Martín (-5.794191, -74.283966).</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-white block">¿Cómo es la sala y los asientos?</strong>
                <p className="text-slate-400">Es un espacio casero y familiar acondicionado con pantalla gigante, sonido surround y 25 sillas cómodas organizadas para una óptima visión.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-white block">¿Cómo compro o separo mis entradas?</strong>
                <p className="text-slate-400">Puedes comprar online directamente con Mercado Pago (Tarjeta o Yape) desde esta web, o en taquilla presencial.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-white block">¿Cómo funciona la validación con Código QR?</strong>
                <p className="text-slate-400">Cada boleto emitido tiene un código QR único que nuestro encargado escanea en la entrada para registrar tu ingreso de manera rápida y ordenada.</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0 bg-[#0c1017]">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: TÉRMINOS Y CONDICIONES / PRIVACIDAD */}
      {(activeModal === 'privacy' || activeModal === 'terms') && (
        <div 
          onClick={onClose}
          data-modal="true"
          className="fixed inset-0 z-[9999] overflow-y-auto bg-black/90 backdrop-blur-md p-3 pt-6 pb-6 sm:p-6 flex items-start sm:items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0 bg-[#0c1017]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>{activeModal === 'privacy' ? 'Protección de Datos Personales' : 'Términos y Condiciones del Servicio'}</span>
              </h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-3.5 text-xs text-slate-300 leading-relaxed overflow-y-auto flex-1 min-h-0">
              {activeModal === 'privacy' ? (
                <>
                  <p>En <strong>MULTISERVICIOS ARGON</strong> (RUC 10058605692) tratamos tus datos conforme a la <em>Ley N° 29733 (Ley de Protección de Datos Personales en el Perú)</em>:</p>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
                    <li>Los datos solicitados (nombre, correo electrónico, teléfono) para la compra online o reserva de boletos se utilizan exclusivamente para la emisión, validación de acceso y envío de comprobantes digitales.</li>
                    <li>Las transacciones monetarias son procesadas con cifrado de alta seguridad por <strong>Mercado Pago Perú</strong>. Nosotros no almacenamos números de tarjeta de crédito ni claves secretas.</li>
                    <li>No compartimos ni comercializamos tu información personal con terceros.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p><strong>Términos y Condiciones Generales de Compra y Servicio:</strong></p>
                  <ul className="space-y-2 list-disc pl-4 text-slate-400">
                    <li><strong>Titularidad y Razón Social:</strong> El servicio es operado por <strong>MULTISERVICIOS ARGON</strong> con RUC <strong>10058605692</strong>.</li>
                    <li><strong>Territorialidad y Ubicación Exclusiva:</strong> La sala de proyección es <strong>exclusivamente física y presencial en el Centro Poblado Tamanco Viejo, Distrito de Emilio San Martín (Loreto, Perú)</strong>. La adquisición de boletos digitales es válida única y estrictamente para ingresar a dicha sala física.</li>
                    <li><strong>Aforo y Naturaleza de la Sala:</strong> Sala acondicionada con proyección HD, sonido envolvente y capacidad máxima para 25 personas. La ubicación de sillas es por orden de llegada al momento de la función.</li>
                    <li><strong>Políticas de Reembolso y Cancelación:</strong> El cliente puede solicitar la anulación y reembolso de su compra vía WhatsApp (+51 920 569 220) hasta <strong>2 horas antes</strong> del horario de inicio programado de la función. Una vez iniciada la función o proyectada la película (no-show), no se admitirán devoluciones.</li>
                    <li><strong>Control de Edad y Restricciones:</strong> De acuerdo con la clasificación de cada película (APT, 14+, 18+), la administración se reserva el derecho de exigir documento de identidad en puerta. Si un menor de edad no cumple la edad mínima, no podrá ingresar.</li>
                    <li><strong>Atención y Reclamos:</strong> Conforme al Código de Protección y Defensa del Consumidor de INDECOPI, ponemos a disposición nuestro <em>Libro de Reclamaciones Virtual</em> accesible las 24 horas desde este sitio web.</li>
                  </ul>
                </>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0 bg-[#0c1017]">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-colors"
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
          data-modal="true"
          className="fixed inset-0 z-[9999] overflow-y-auto bg-black/90 backdrop-blur-md p-3 pt-6 pb-6 sm:p-6 flex items-start sm:items-center justify-center animate-fade-in text-slate-100"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0 bg-[#0c1017]">
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
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
              {reclamacionSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-base font-bold text-white">Reclamo / Queja Registrado</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Tu solicitud ha sido ingresada a nuestro registro conforme a ley. Recibirás una copia de constancia a tu correo electrónico.
                  </p>
                </div>
              ) : (
                <form id="reclamaciones-form" onSubmit={handleReclamacionSubmit} className="space-y-3.5 text-xs">
                  <p className="text-[11px] text-slate-400">
                    Establecimiento: CP Tamanco Viejo, Distrito de Emilio San Martín. Razón Comercial: MULTISERVICIOS ARGON.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        value={reclamacionForm.nombre}
                        onChange={(e) => setReclamacionForm({ ...reclamacionForm, nombre: e.target.value })}
                        placeholder="Nombres y apellidos"
                        className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">DNI / CE (8 dígitos) *</label>
                      <input
                        type="tel"
                        maxLength={8}
                        inputMode="numeric"
                        required
                        value={reclamacionForm.dni}
                        onChange={(e) => setReclamacionForm({ ...reclamacionForm, dni: e.target.value.replace(/\D/g, '').slice(0, 8) })}
                        placeholder="Número de DNI"
                        className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl font-mono outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        value={reclamacionForm.email}
                        onChange={(e) => setReclamacionForm({ ...reclamacionForm, email: e.target.value })}
                        placeholder="correo@ejemplo.com"
                        className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Teléfono (9 dígitos) *</label>
                      <input
                        type="tel"
                        maxLength={9}
                        inputMode="numeric"
                        required
                        value={reclamacionForm.telefono}
                        onChange={(e) => setReclamacionForm({ ...reclamacionForm, telefono: e.target.value.replace(/\D/g, '').slice(0, 9) })}
                        placeholder="Número de celular"
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
                    <label className="text-slate-300 font-semibold block mb-1">Detalle del Reclamo / Queja *</label>
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
                    <label className="text-slate-300 font-semibold block mb-1">Pedido o Solución Esperada *</label>
                    <input
                      type="text"
                      required
                      value={reclamacionForm.pedido}
                      onChange={(e) => setReclamacionForm({ ...reclamacionForm, pedido: e.target.value })}
                      placeholder="¿Qué solución solicitas a la administración?"
                      className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400"
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Footer with Actions */}
            {!reclamacionSubmitted && (
              <div className="p-4 bg-[#080a0f] border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  form="reclamaciones-form"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-xs transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Hoja de Reclamación</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>,
    document.body
  );
};

