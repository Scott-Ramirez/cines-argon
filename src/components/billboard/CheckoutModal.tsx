import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Movie, Showtime, Room, PricingTier } from '../../core/types';
import { paymentsApi } from '../../services/api/cinemaApi';
import { GoogleMapsCard } from '../common/GoogleMapsCard';

import {
  MapPin,
  AlertTriangle,
  CreditCard,
  CheckCircle2,
  Users,
  Clock,
  Calendar,
  ShieldCheck,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Ticket,
  Mail,
  User,
  Phone,
  Film,
  QrCode,
  Copy,
  Check,
  MessageSquare,
} from 'lucide-react';

interface CheckoutModalProps {
  movie: Movie | null;
  showtime: Showtime | null;
  room?: Room | null;
  pricingTiers?: PricingTier[];
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  movie,
  showtime,
  room,
  pricingTiers = [],
  onClose,
}) => {
  // Current Step: 1 -> 2 -> 3 -> 4
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form States
  const [confirmedTamanco, setConfirmedTamanco] = useState(false);
  const [ticketCounts, setTicketCounts] = useState<{ [key: string]: number }>({
    GENERAL: 1,
    NINO: 0,
    ADULTO_MAYOR: 0,
  });
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'YAPE' | 'MERCADOPAGO'>('YAPE');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const yapeNumber = '920569220';
  const yapeHolder = 'Anthony Scott Ramirez Sias';


  useEffect(() => {
    document.body.classList.add('has-modal-open');
    return () => {
      document.body.classList.remove('has-modal-open');
    };
  }, []);


  if (!movie || !showtime) return null;

  // Precios base por defecto si no vienen cargados
  const defaultPrices: { [key: string]: number } = {
    GENERAL: 18.0,
    NINO: 14.0,
    ADULTO_MAYOR: 14.0,
  };

  const getTierPrice = (type: string) => {
    const tier = pricingTiers.find((p) => p.type === type);
    const base = tier ? tier.basePrice : defaultPrices[type] || 18.0;
    return Number((base * (showtime.priceMultiplier || 1.0)).toFixed(2));
  };

  const totalTickets = Object.values(ticketCounts).reduce((a, b) => a + b, 0);

  const totalPrice = Object.entries(ticketCounts).reduce((acc, [type, count]) => {
    return acc + count * getTierPrice(type);
  }, 0);

  const handleQuantityChange = (type: string, delta: number) => {
    const current = ticketCounts[type] || 0;
    const nextVal = Math.max(0, current + delta);
    const nextTotal = totalTickets - current + nextVal;

    if (nextTotal > showtime.availableSeats) {
      setErrorMessage(`Solo quedan ${showtime.availableSeats} butacas disponibles para esta función.`);
      return;
    }

    setErrorMessage(null);
    setTicketCounts((prev) => ({ ...prev, [type]: nextVal }));
  };

  // Helpers de validación
  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
  };

  const isValidPhone = (phone: string) => {
    return /^\d{9}$/.test(phone.trim());
  };

  // Validaciones antes de avanzar de paso
  const handleNextStep = () => {
    setErrorMessage(null);

    if (currentStep === 1) {
      if (!confirmedTamanco) {
        setErrorMessage('Debes confirmar que asistirás presencialmente a la sala en Tamanco Viejo.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (totalTickets <= 0) {
        setErrorMessage('Debes seleccionar al menos una entrada para continuar.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!customerName.trim() || customerName.trim().length < 3) {
        setErrorMessage('Ingresa tus nombres y apellidos completos (mínimo 3 caracteres).');
        return;
      }
      if (!isValidEmail(customerEmail)) {
        setErrorMessage('Ingresa un correo electrónico válido (ejemplo: tunombre@gmail.com).');
        return;
      }
      if (customerPhone.trim() && !isValidPhone(customerPhone)) {
        setErrorMessage('El número de celular debe tener exactamente 9 dígitos numéricos.');
        return;
      }
      setCurrentStep(4);
    }
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handlePayWithMercadoPago = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const items = Object.entries(ticketCounts)
        .filter(([_, count]) => count > 0)
        .map(([type, count]) => ({
          type,
          quantity: count,
        }));

      const res = await paymentsApi.createPreference({
        showtimeId: showtime.id,
        items,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
      });

      const targetUrl = res.initPoint || res.sandboxInitPoint;
      if (targetUrl) {
        window.location.href = targetUrl;
      } else {
        throw new Error('No se recibió la URL de pago de Mercado Pago.');
      }
    } catch (err: any) {
      console.error('Error al procesar pago:', err);
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          'Ocurrió un problema al conectar con Mercado Pago. Intenta nuevamente.',
      );
      setIsLoading(false);
    }
  };

  const handleYapeWhatsAppConfirm = () => {

    const message =
      `*COMPRA DE ENTRADAS - CINES ARGÓN*\n\n` +
      `🎬 *Película:* ${movie.title}\n` +
      `📅 *Función:* ${showtime.date} - ${showtime.startTime}\n` +
      `📍 *Sala:* ${room?.name || 'Sala Principal'} (Tamanco Viejo)\n` +
      `🎟️ *Entradas:* ${totalTickets} ${totalTickets === 1 ? 'boleto' : 'boletos'}\n` +
      `👤 *Titular:* ${customerName}\n` +
      `📧 *Correo:* ${customerEmail}\n` +
      (customerPhone ? `📱 *Teléfono:* ${customerPhone}\n` : '') +
      `💰 *Monto Yapeado:* S/ ${totalPrice.toFixed(2)}\n\n` +
      `_Adjunto la captura de mi comprobante Yape para emitir mis boletos oficiales con QR._`;

    const url = `https://wa.me/51920569220?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const stepsConfig = [
    { num: 1, label: 'Ubicación' },
    { num: 2, label: 'Entradas' },
    { num: 3, label: 'Tus Datos' },
    { num: 4, label: 'Pagar' },
  ];

  return createPortal(
    <div
      onClick={onClose}
      data-modal="true"
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/90 backdrop-blur-md p-3 pt-6 pb-6 sm:p-6 flex items-start sm:items-center justify-center animate-fade-in text-slate-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#0b0e14] border border-slate-700/80 rounded-3xl max-w-lg sm:max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
      >
        {/* Header with Title & Close */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0 bg-[#080a0f]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight leading-none">
                Compra de Boletos
              </h3>
              <span className="text-[10px] text-amber-400/90 font-mono font-bold">
                CINES ARGÓN • PASO {currentStep} DE 4
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* STEPPER BAR (1 -- 2 -- 3 -- 4) */}
        <div className="px-6 py-3.5 bg-slate-950/70 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center justify-between relative max-w-sm mx-auto">
            {/* Progress line background */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
            {/* Active progress fill */}
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-amber-500 -translate-y-1/2 transition-all duration-300 z-0"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />

            {stepsConfig.map((s) => {
              const isCompleted = s.num < currentStep;
              const isCurrent = s.num === currentStep;

              return (
                <div key={s.num} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isCompleted
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                        : isCurrent
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 ring-4 ring-amber-500/20 font-black'
                        : 'bg-slate-900 border border-slate-700 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓' : s.num}
                  </div>
                  <span
                    className={`text-[10px] font-semibold mt-1 transition-colors ${
                      isCurrent
                        ? 'text-amber-400 font-bold'
                        : isCompleted
                        ? 'text-slate-300'
                        : 'text-slate-600'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* ================================================================= */}
          {/* PASO 1: UBICACIÓN & FUNCIÓN (TAMANCO) */}
          {/* ================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              {/* Resumen de la película */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5">
                <div className="w-14 h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-sm font-bold text-white truncate">{movie.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    <span className="flex items-center gap-1 font-mono text-amber-400">
                      <Clock className="w-3.5 h-3.5" /> {showtime.startTime}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" /> {showtime.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-mono font-bold">
                    {room?.name || 'Sala Principal'} • {showtime.availableSeats} butacas disponibles
                  </p>
                </div>
              </div>

              {/* Alerta de Ubicación Exclusiva en Tamanco */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <strong className="text-amber-300 font-bold block">
                      UBICACIÓN EXCLUSIVA: Sala en Tamanco Viejo (Loreto)
                    </strong>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Esta función es <strong>100% presencial</strong> en nuestra sala ubicada en el <strong>Centro Poblado Tamanco Viejo, Distrito de Emilio San Martín</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cuadrito de Google Maps */}
              <GoogleMapsCard compact={true} />

              {/* Checkbox de Confirmación */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={confirmedTamanco}
                    onChange={(e) => setConfirmedTamanco(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700 focus:ring-amber-500 cursor-pointer"
                  />
                  <span className="leading-snug">
                    <strong>Confirmo que asistiré a la sala en Tamanco Viejo</strong> y estoy de acuerdo con la ubicación presencial.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PASO 2: SELECCIÓN DE ENTRADAS */}
          {/* ================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-amber-400" /> Cantidad de Entradas
                </h4>
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  {showtime.availableSeats} disponibles
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Boleto General */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-white">Boleto General</div>
                    <div className="text-[10px] text-slate-400">Acceso para adultos</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      S/ {getTierPrice('GENERAL').toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange('GENERAL', -1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-xs font-bold w-5 text-center">
                        {ticketCounts['GENERAL'] || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange('GENERAL', 1)}
                        className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Boleto Niños */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-white">Boleto Niños (Hasta 12 años)</div>
                    <div className="text-[10px] text-slate-400">Tarifa especial para menores</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      S/ {getTierPrice('NINO').toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange('NINO', -1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-xs font-bold w-5 text-center">
                        {ticketCounts['NINO'] || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange('NINO', 1)}
                        className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtotal preview */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">{totalTickets} {totalTickets === 1 ? 'entrada seleccionada' : 'entradas seleccionadas'}</span>
                <span className="font-mono font-black text-amber-400 text-sm">
                  Subtotal: S/ {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PASO 3: DATOS DE CONTACTO */}
          {/* ================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" /> Información del Titular
                </h4>
                <p className="text-[11px] text-slate-400">
                  Tus boletos digitales con código QR serán enviados a este correo.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {/* Nombre */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 text-[11px] font-semibold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" /> Nombre Completo *
                    </label>
                    {customerName.trim().length >= 3 && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Válido
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ingresa tus nombres y apellidos"
                    className={`w-full bg-slate-950 border rounded-xl p-3 text-white outline-none transition-all placeholder:text-slate-600 ${
                      customerName.trim().length >= 3
                        ? 'border-emerald-500/60 focus:border-emerald-400'
                        : 'border-slate-800 focus:border-amber-500'
                    }`}
                  />
                </div>

                {/* Correo Electrónico */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 text-[11px] font-semibold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> Correo Electrónico *
                    </label>
                    {customerEmail.trim().length > 0 && (
                      isValidEmail(customerEmail) ? (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Correo válido
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-400 font-semibold">
                          Formato no válido
                        </span>
                      )
                    )}
                  </div>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value.trim())}
                    placeholder="Ingresa tu correo para recibir tus entradas (ej. correo@gmail.com)"
                    className={`w-full bg-slate-950 border rounded-xl p-3 text-white outline-none transition-all placeholder:text-slate-600 ${
                      customerEmail.trim().length > 0
                        ? isValidEmail(customerEmail)
                          ? 'border-emerald-500/60 focus:border-emerald-400'
                          : 'border-rose-500/60 focus:border-rose-400'
                        : 'border-slate-800 focus:border-amber-500'
                    }`}
                  />
                </div>

                {/* Celular / WhatsApp */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 text-[11px] font-semibold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Celular / WhatsApp (Opcional)
                    </label>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        customerPhone.length === 9
                          ? 'text-emerald-400'
                          : customerPhone.length > 0
                          ? 'text-amber-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {customerPhone.length}/9 dígitos
                    </span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={9}
                    value={customerPhone}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 9);
                      setCustomerPhone(onlyDigits);
                    }}
                    placeholder="Número de celular o WhatsApp (ej. 987654321)"
                    className={`w-full bg-slate-950 border rounded-xl p-3 text-white outline-none font-mono transition-all placeholder:text-slate-600 ${
                      customerPhone.length === 9
                        ? 'border-emerald-500/60 focus:border-emerald-400'
                        : customerPhone.length > 0
                        ? 'border-amber-500/60 focus:border-amber-400'
                        : 'border-slate-800 focus:border-amber-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PASO 4: RESUMEN FINAL & ELECCIÓN DE MEDIO DE PAGO */}
          {/* ================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Resumen de Compra
              </h4>

              {/* Card de resumen */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Película:</span>
                  <strong className="text-white text-right">{movie.title}</strong>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Función:</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {showtime.date} • {showtime.startTime}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Titular / Envío:</span>
                  <span className="text-slate-200 truncate max-w-[200px]">{customerName}</span>
                </div>

                <div className="flex items-center justify-between pt-1 text-sm font-black">
                  <span className="text-white">Total ({totalTickets} entradas):</span>
                  <span className="text-emerald-400 font-mono text-base">
                    S/ {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Selector de Método de Pago */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono block">
                  Selecciona tu Medio de Pago:
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {/* Opción 1: Yape Directo */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('YAPE')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      selectedPaymentMethod === 'YAPE'
                        ? 'bg-[#742284]/25 border-[#9B2FAD] ring-2 ring-[#9B2FAD]/40'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-[#742284] text-white text-[10px] font-black flex items-center justify-center">
                        Y
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                        DIRECTO
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Yape Directo (QR)</div>
                      <div className="text-[10px] text-slate-400">Escanear QR o celular</div>
                    </div>
                  </button>

                  {/* Opción 2: Mercado Pago */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('MERCADOPAGO')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      selectedPaymentMethod === 'MERCADOPAGO'
                        ? 'bg-sky-500/15 border-sky-500 ring-2 ring-sky-500/40'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard className="w-5 h-5 text-sky-400" />
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono">
                        ONLINE
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Tarjetas (Online)</div>
                      <div className="text-[10px] text-slate-400">Visa, Mastercard, etc.</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Contenido según método seleccionado */}
              {selectedPaymentMethod === 'YAPE' ? (
                <div className="p-4 rounded-2xl bg-[#140b1a] border border-[#742284]/50 space-y-3 animate-fade-in text-xs">
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    {/* QR Image */}
                    <div className="w-32 h-32 bg-white p-1.5 rounded-2xl shadow-xl shrink-0 flex items-center justify-center overflow-hidden border border-[#9B2FAD]">
                      <img
                        src="/yape-qr.png"
                        alt="Yape QR Anthony Scott Ramirez Sias"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div>
                        <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">
                          Titular de la cuenta
                        </span>
                        <strong className="text-white text-xs sm:text-sm block">{yapeHolder}</strong>
                      </div>

                      <div>
                        <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">
                          Número de Yape
                        </span>
                        <div className="flex items-center justify-center sm:justify-start gap-2 pt-0.5">
                          <span className="font-mono text-sm sm:text-base font-black text-amber-400 tracking-wider">
                            {yapeNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(yapeNumber);
                              setCopiedNumber(true);
                              setTimeout(() => setCopiedNumber(false), 2000);
                            }}
                            className="px-2 py-0.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedNumber ? '¡Copiado!' : 'Copiar'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-300 bg-purple-950/60 border border-purple-800/50 p-2 rounded-xl">
                        Monto a transferir: <strong className="text-emerald-400 font-mono font-black">S/ {totalPrice.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed text-center sm:text-left">
                    💡 Escanea el código QR desde tu app Yape o transfiere al número. Al terminar, haz clic en el botón verde inferior para enviar tu constancia por WhatsApp.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-2 text-xs text-sky-200 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                    <strong className="text-white">Pasarela Mercado Pago Perú</strong>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Paga de forma segura con tu tarjeta de débito o crédito (Visa, Mastercard, American Express, Diners).
                  </p>
                </div>
              )}

            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

        </div>

        {/* MODAL FOOTER WITH STEPPER BUTTONS */}
        <div className="p-4 bg-[#080a0f] border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={isLoading}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : selectedPaymentMethod === 'YAPE' ? (
            <button
              type="button"
              onClick={handleYapeWhatsAppConfirm}
              className="px-5 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-[#25D366] to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-xl shadow-emerald-500/25 active:scale-[0.99] cursor-pointer transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirmar por WhatsApp (S/ {totalPrice.toFixed(2)})</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePayWithMercadoPago}
              disabled={isLoading}
              className={`px-6 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer ${
                isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-blue-500/25 active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Conectando con Mercado Pago...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 text-sky-200" />
                  <span>Pagar con Tarjeta (S/ {totalPrice.toFixed(2)})</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
};


