import React, { useEffect, useState } from 'react';
import { Sale, Ticket } from '../../core/types';
import { paymentsApi } from '../../services/api/cinemaApi';
import { TicketPrintModal } from '../ticket/TicketPrintModal';
import { CheckCircle2, AlertCircle, Clock, RefreshCw, X } from 'lucide-react';

interface PaymentResultModalProps {
  onClose: () => void;
}

export const PaymentResultModal: React.FC<PaymentResultModalProps> = ({ onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<'success' | 'failure' | 'pending' | null>(null);
  const [sale, setSale] = useState<Sale | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_status') || urlParams.get('status');
    const paymentId =
      urlParams.get('payment_id') ||
      urlParams.get('collection_id') ||
      urlParams.get('data.id');

    if (!paymentStatus && !paymentId) {
      setLoading(false);
      return;
    }

    if (paymentStatus === 'failure' || paymentStatus === 'rejected') {
      setStatus('failure');
      setErrorMsg('El pago no pudo ser completado o fue rechazado por el emisor de la tarjeta.');
      setLoading(false);
      return;
    }

    if (paymentStatus === 'pending' || paymentStatus === 'in_process') {
      setStatus('pending');
      setLoading(false);
      return;
    }

    // Si status es success o tenemos paymentId
    if (paymentId) {
      paymentsApi
        .getSaleByPaymentId(paymentId)
        .then((resSale) => {
          setSale(resSale);
          setTickets(resSale.tickets || []);
          setStatus('success');
          setShowPrintModal(true);
        })
        .catch((err) => {
          console.error('Error al recuperar venta de Mercado Pago:', err);
          setStatus('success');
          // Si el webhook aún lo procesa en background, dar mensaje optimista
        })
        .finally(() => {
          setLoading(false);
          // Limpiar la URL sin recargar
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    } else {
      setStatus('success');
      setLoading(false);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (showPrintModal && sale && tickets.length > 0) {
    return (
      <TicketPrintModal
        sale={sale}
        tickets={tickets}
        onClose={() => {
          setShowPrintModal(false);
          onClose();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">

        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
          <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-white">Validando tu Pago...</h3>
          <p className="text-xs text-slate-400">
            Estamos confirmando la transacción con Mercado Pago y emitiendo tus boletos.
          </p>
        </div>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">

      <div className="bg-[#0c1017] border border-slate-700/80 rounded-3xl p-6 max-w-md w-full text-center space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        {status === 'failure' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Pago No Procesado</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {errorMsg || 'No se pudo completar la transacción. Por favor verifica tus datos o intenta con otro medio de pago.'}
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Volver a la Cartelera
              </button>
            </div>
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Pago en Proceso</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tu pago está siendo verificado por Mercado Pago o PagoEfectivo. Te enviaremos la confirmación tan pronto sea aprobado.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Entendido
              </button>
            </div>
          </>
        )}

        {status === 'success' && !showPrintModal && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">¡Pago Exitoso!</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tu compra ha sido confirmada con éxito. Revisa tu correo electrónico para ver el comprobante.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-colors shadow-lg shadow-amber-500/20"
              >
                Continuar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
