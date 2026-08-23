import React, { useEffect } from 'react';
import { Sale, Ticket } from '../../core/types';
import { QRCodeSVG } from 'qrcode.react';
import { formatQrPayload } from '../../core/security/crypto';
import { Printer, X, CheckCircle2, Film, Ticket as TicketIcon, Sparkles } from 'lucide-react';
import JsBarcode from 'jsbarcode';

interface TicketPrintModalProps {
  sale: Sale;
  tickets: Ticket[];
  onClose: () => void;
}

export const TicketPrintModal: React.FC<TicketPrintModalProps> = ({
  sale,
  tickets,
  onClose,
}) => {

  useEffect(() => {
    // Generate standard Code128 barcodes for each ticket
    tickets.forEach((ticket) => {
      try {
        const element = document.getElementById(`barcode-${ticket.id}`);
        if (element) {
          JsBarcode(element, ticket.id, {
            format: 'CODE128',
            lineColor: '#000000',
            width: 1.8,
            height: 40,
            displayValue: false,
            margin: 0,
          });
        }
      } catch (err) {
        console.error('Barcode generation error:', err);
      }
    });
  }, [tickets]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header - Screen only */}
        <div className="no-print p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                ¡VENTA COMPLETADA CON ÉXITO!
              </h2>
              <p className="text-xs text-slate-400">
                Comprobante #{sale.id} • {tickets.length} {tickets.length === 1 ? 'entrada emitida' : 'entradas emitidas'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions Bar - Screen only */}
        <div className="no-print px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-300">
            Vista previa de boletos térmicos (80mm) con QR & Código de Barras
          </span>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Printer className="w-4 h-4" />
            IMPRIMIR TODOS ({tickets.length})
          </button>
        </div>

        {/* Printable Tickets Area */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6 bg-[#0c1017]">
          {tickets.map((ticket, index) => {
            const qrPayload = formatQrPayload(ticket);

            return (
              <div
                key={ticket.id}
                className="ticket-print-box mx-auto max-w-[340px] bg-white text-slate-900 p-5 rounded-xl shadow-xl border-2 border-slate-300 font-mono text-xs space-y-3 relative overflow-hidden"
              >
                {/* Cinema Header */}
                <div className="text-center border-b border-dashed border-slate-400 pb-3 space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <img
                      src="/logo.png"
                      alt="Cines Argón"
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="text-base font-black tracking-wider text-slate-900 font-sans">
                      CINES ARGÓN
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-sans font-medium">
                    EXPERIENCIA CINEMATOGRÁFICA DE ALTA DEFINICIÓN
                  </p>
                  <p className="text-[9px] text-slate-500">
                    RUC: 20608941231 • Av. Central 450
                  </p>
                </div>

                {/* Ticket Details */}
                <div className="space-y-2 py-1">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">PELÍCULA</span>
                    <h3 className="text-sm font-black text-slate-900 font-sans uppercase leading-tight">
                      {ticket.movieTitle}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-[9px] text-slate-500 block">SALA:</span>
                      <strong className="text-slate-900 font-bold">{ticket.roomName}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 block">FORMATO:</span>
                      <strong className="text-slate-900 font-bold">{ticket.roomType}</strong>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-500 block">FECHA:</span>
                      <strong className="text-slate-900 font-bold">{ticket.showtimeDate}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 block">HORA:</span>
                      <strong className="text-slate-900 font-black text-amber-700">{ticket.showtimeHour}</strong>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-500 block">TIPO:</span>
                      <strong className="text-slate-900 font-bold">{ticket.ticketType}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 block">PRECIO:</span>
                      <strong className="text-slate-900 font-black text-sm">S/. {ticket.price.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                {/* QR & Barcode Section */}
                <div className="border-t border-b border-dashed border-slate-400 py-3 flex flex-col items-center justify-center space-y-2">
                  <div className="bg-white p-1.5 rounded border border-slate-300 shadow-sm">
                    <QRCodeSVG
                      value={qrPayload}
                      size={120}
                      level="M"
                      includeMargin={false}
                    />
                  </div>

                  <div className="text-center w-full">
                    <svg id={`barcode-${ticket.id}`} className="mx-auto" />
                    <span className="text-[10px] font-mono tracking-widest text-slate-700 block font-bold mt-0.5">
                      {ticket.id}
                    </span>
                  </div>
                </div>

                {/* Security and Footer */}
                <div className="text-center text-[8px] text-slate-500 space-y-0.5 pt-1">
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-600">
                    <span>Fila: Asignada por orden</span>
                    <span>Ticket {index + 1} de {tickets.length}</span>
                  </div>
                  <p className="font-mono text-[7px] text-slate-400 truncate">
                    HASH: {ticket.signature}
                  </p>
                  <p className="font-sans text-[8px] text-slate-600 pt-1">
                    Presente este código en la puerta para ingresar a la sala.
                  </p>
                  <p className="text-[7px] text-slate-400">
                    Emitido: {new Date(ticket.issuedAt).toLocaleString('es-PE')} • Cajero: {sale.cashierName}
                  </p>
                </div>

                {/* Side Notch Cutouts for Ticket aesthetic */}
                <div className="no-print absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0c1017] border border-slate-700" />
                <div className="no-print absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0c1017] border border-slate-700" />
              </div>
            );
          })}
        </div>

        {/* Modal Footer - Screen only */}
        <div className="no-print p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Monto cobrado: <strong className="text-emerald-400">S/. {sale.totalAmount.toFixed(2)}</strong> | Vuelto: <strong className="text-slate-200">S/. {sale.changeAmount.toFixed(2)}</strong>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
