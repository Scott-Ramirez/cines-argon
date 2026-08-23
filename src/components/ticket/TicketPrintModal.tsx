import React, { useEffect } from 'react';
import { Sale, Ticket } from '../../core/types';
import { QRCodeSVG } from 'qrcode.react';
import { formatQrPayload } from '../../core/security/crypto';
import { Printer, X, CheckCircle2, Film } from 'lucide-react';
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
    // Generate Code128 barcodes for each ticket
    tickets.forEach((ticket) => {
      try {
        const element = document.getElementById(`barcode-${ticket.id}`);
        if (element) {
          JsBarcode(element, ticket.id, {
            format: 'CODE128',
            lineColor: '#000000',
            width: 1.1,
            height: 22,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in ticket-modal-overlay">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 ticket-modal-container">
        
        {/* Header - Screen only */}
        <div className="no-print p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2 font-sans">
                VENTA COMPLETADA CON ÉXITO
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Comprobante #{sale.id.slice(0, 8)} • {tickets.length} {tickets.length === 1 ? 'boleto generado' : 'boletos generados'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions Bar - Screen only */}
        <div className="no-print px-6 py-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px]">
              Formato: 6 cm x 12 cm
            </span>
            <span className="text-slate-400 hidden sm:inline">
              (60 mm × 120 mm)
            </span>
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>IMPRIMIR ({tickets.length})</span>
          </button>
        </div>

        {/* Printable Tickets Area */}
        <div id="thermal-print-area" className="p-6 max-h-[62vh] overflow-y-auto space-y-6 bg-[#0c1017]">
          {tickets.map((ticket, index) => {
            const qrPayload = formatQrPayload(ticket);

            return (
              <div
                key={ticket.id}
                className="ticket-print-box mx-auto w-[240px] min-h-[480px] bg-white text-slate-950 p-4 rounded-xl shadow-2xl border-2 border-slate-300 font-mono text-[11px] flex flex-col justify-between relative overflow-hidden"
              >
                {/* 1. Cinema Header */}
                <div className="text-center border-b border-dashed border-slate-400 pb-2 space-y-0.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <img
                      src="/logo.png"
                      alt="Cines Argón"
                      className="w-6 h-6 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="text-sm font-black tracking-wider text-slate-950 font-sans">
                      CINES ARGÓN
                    </span>
                  </div>
                  <p className="text-[8.5px] text-slate-600 font-sans font-semibold tracking-wide">
                    CINE CASERO & COMUNITARIO
                  </p>
                  <p className="text-[8px] text-slate-500 font-mono">
                    RUC: 10058605692 • MULTISERVICIOS ARGON
                  </p>
                  <p className="text-[7.5px] text-slate-500 font-sans">
                    CP Tamanco Viejo, Emilio San Martín
                  </p>
                </div>

                {/* 2. Movie & Showtime Details */}
                <div className="py-2 space-y-1.5">
                  <div className="text-center border-b border-slate-200 pb-1.5">
                    <span className="text-[8px] text-slate-500 uppercase font-sans font-bold block">
                      PELÍCULA
                    </span>
                    <h3 className="text-xs font-black text-slate-950 font-sans uppercase leading-tight">
                      {ticket.movieTitle}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[10px] pt-0.5 leading-tight">
                    <div>
                      <span className="text-[8px] text-slate-500 block">SALA:</span>
                      <strong className="text-slate-900 font-bold">{ticket.roomName}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-slate-500 block">FORMATO:</span>
                      <strong className="text-slate-900 font-bold">{ticket.roomType}</strong>
                    </div>

                    <div>
                      <span className="text-[8px] text-slate-500 block">FECHA:</span>
                      <strong className="text-slate-900 font-bold">{ticket.showtimeDate}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-slate-500 block">HORA:</span>
                      <strong className="text-slate-950 font-black text-amber-800">{ticket.showtimeHour}</strong>
                    </div>

                    <div>
                      <span className="text-[8px] text-slate-500 block">TARIFA:</span>
                      <strong className="text-slate-900 font-bold">{ticket.ticketType}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-slate-500 block">PRECIO:</span>
                      <strong className="text-slate-950 font-black text-xs">S/. {ticket.price.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                {/* 3. QR & Barcode Section */}
                <div className="border-t border-b border-dashed border-slate-400 py-2 flex flex-col items-center justify-center space-y-1.5">
                  <div className="bg-white p-1 rounded border border-slate-300">
                    <QRCodeSVG
                      value={qrPayload}
                      size={86}
                      level="M"
                      includeMargin={false}
                    />
                  </div>

                  <div className="text-center w-full">
                    <svg id={`barcode-${ticket.id}`} className="mx-auto" />
                    <span className="text-[8px] font-mono tracking-widest text-slate-700 block font-bold mt-0.5">
                      {ticket.id}
                    </span>
                  </div>
                </div>

                {/* 4. Security & Footer Info */}
                <div className="text-center text-[7.5px] text-slate-500 space-y-0.5 pt-1 leading-tight">
                  <div className="flex items-center justify-between text-[8px] font-mono text-slate-700 font-semibold">
                    <span>Silla: Orden de llegada</span>
                    <span>Boleto {index + 1} de {tickets.length}</span>
                  </div>
                  <p className="font-sans text-[7.5px] text-slate-600">
                    Presenta este código en puerta para ingresar a la sala.
                  </p>
                  <p className="text-[7px] text-slate-400">
                    Emitido: {new Date(ticket.issuedAt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} • Cajero: {sale.cashierName}
                  </p>
                </div>

                {/* Side Notch Cutouts for Ticket aesthetic (Screen only) */}
                <div className="no-print absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#0c1017] border border-slate-700" />
                <div className="no-print absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#0c1017] border border-slate-700" />
              </div>
            );
          })}
        </div>

        {/* Modal Footer - Screen only */}
        <div className="no-print p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            Total Cobrado: <strong className="text-emerald-400 font-mono">S/. {sale.totalAmount.toFixed(2)}</strong> | Vuelto: <strong className="text-slate-200 font-mono">S/. {sale.changeAmount.toFixed(2)}</strong>
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Boletos</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
