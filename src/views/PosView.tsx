import React, { useState, useEffect } from 'react';
import { Movie, Showtime, Room, PricingTier, TicketType, Ticket, Sale } from '../core/types';
import { cinemaStorage } from '../services/storage/cinemaStorage';
import { ticketService, CartItem } from '../services/ticketService';
import { TicketPrintModal } from '../components/ticket/TicketPrintModal';
import { Film, Ticket as TicketIcon, ShoppingBag, CreditCard, DollarSign, Sparkles, Check, AlertCircle, Plus, Minus, Search } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PosView: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  
  // Selection state
  const [selectedMovieId, setSelectedMovieId] = useState<string>('');
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string>('');
  const [cartQuantities, setCartQuantities] = useState<Record<TicketType, number>>({
    GENERAL: 1,
    NINO: 0,
    ADULTO_MAYOR: 0,
    PROMO_DUO: 0,
  });
  const [cashierName, setCashierName] = useState<string>('Taquilla 1');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sale result modal
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [lastTickets, setLastTickets] = useState<Ticket[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const loadData = () => {
    const m = cinemaStorage.getMovies();
    const s = cinemaStorage.getShowtimes();
    const r = cinemaStorage.getRooms();
    const p = cinemaStorage.getPricing();
    setMovies(m);
    setShowtimes(s);
    setRooms(r);
    setPricing(p);

    if (m.length > 0 && !selectedMovieId) {
      const activeMovie = m.find(x => x.status === 'CARTELERA') || m[0];
      setSelectedMovieId(activeMovie.id);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('argon_storage_update', loadData);
    return () => window.removeEventListener('argon_storage_update', loadData);
  }, []);

  // Update selected showtime when movie changes
  useEffect(() => {
    const movieShowtimes = showtimes.filter(s => s.movieId === selectedMovieId);
    if (movieShowtimes.length > 0) {
      setSelectedShowtimeId(movieShowtimes[0].id);
    } else {
      setSelectedShowtimeId('');
    }
  }, [selectedMovieId, showtimes]);

  const selectedMovie = movies.find(m => m.id === selectedMovieId);
  const selectedShowtime = showtimes.find(s => s.id === selectedShowtimeId);
  const selectedRoom = selectedShowtime ? rooms.find(r => r.id === selectedShowtime.roomId) : null;
  const availableShowtimes = showtimes.filter(s => s.movieId === selectedMovieId);

  // Price Calculation
  const priceMap = new Map(pricing.map(p => [p.type, p.basePrice]));
  const totalAmount = Object.entries(cartQuantities).reduce((sum, [type, qty]) => {
    const price = priceMap.get(type as TicketType) || 18.0;
    return sum + (price * qty);
  }, 0);

  const totalTicketsCount = Object.values(cartQuantities).reduce((a, b) => a + b, 0);
  const numCashReceived = parseFloat(cashReceived) || totalAmount;
  const changeAmount = Math.max(0, numCashReceived - totalAmount);

  const handleQtyChange = (type: TicketType, delta: number) => {
    setCartQuantities(prev => ({
      ...prev,
      [type]: Math.max(0, (prev[type] || 0) + delta)
    }));
  };

  const handleQuickCash = (amount: number) => {
    setCashReceived(amount.toString());
  };

  const handleProcessSale = async () => {
    if (!selectedShowtimeId) {
      setErrorMessage('Por favor seleccione una función y horario');
      return;
    }
    if (totalTicketsCount <= 0) {
      setErrorMessage('Debe agregar al menos 1 entrada');
      return;
    }
    if (numCashReceived < totalAmount) {
      setErrorMessage(`El monto recibido (S/. ${numCashReceived}) es menor al total a pagar (S/. ${totalAmount})`);
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const items: CartItem[] = Object.entries(cartQuantities).map(([type, qty]) => ({
        type: type as TicketType,
        quantity: qty
      }));

      const result = await ticketService.processSale(
        selectedShowtimeId,
        items,
        cashierName,
        numCashReceived
      );

      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setLastSale(result.sale);
      setLastTickets(result.tickets);
      
      // Reset quantities for next sale
      setCartQuantities({
        GENERAL: 1,
        NINO: 0,
        ADULTO_MAYOR: 0,
        PROMO_DUO: 0,
      });
      setCashReceived('');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al procesar la venta');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredMovies = movies.filter(m => 
    m.status === 'CARTELERA' && 
    (m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     m.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-[#090c13] text-slate-100 p-4 lg:p-8 animate-fade-in no-print">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top POS Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <TicketIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white font-sans">TAQUILLA & PUNTO DE VENTA (POS)</h1>
              <p className="text-xs text-slate-400">Emisión rápida de boletos e impresión térmica con QR firmado</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">Cajero:</span>
            <input
              type="text"
              value={cashierName}
              onChange={(e) => setCashierName(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-amber-300 font-semibold px-3 py-1.5 rounded-lg outline-none focus:border-amber-400 w-32"
            />
          </div>
        </div>

        {/* POS Grid: Selection Area (Left) & Checkout Cart (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT 7-COLS: Movie & Showtime & Ticket Counters */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Select Movie */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-bold flex items-center justify-center">1</span>
                  Seleccionar Película
                </h2>
                {/* Search */}
                <div className="relative w-48">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar película..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-8 pr-2.5 py-1.5 rounded-lg outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Movies Horizontal/Grid list */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[280px] overflow-y-auto pr-1">
                {filteredMovies.map((movie) => {
                  const isSelected = movie.id === selectedMovieId;
                  return (
                    <button
                      key={movie.id}
                      onClick={() => setSelectedMovieId(movie.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all duration-200 flex gap-2.5 items-center ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded-lg shrink-0 bg-slate-900"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-800 text-amber-400 rounded">
                          {movie.rating}
                        </span>
                        <h3 className={`text-xs font-bold truncate mt-1 leading-tight ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                          {movie.title}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{movie.durationMinutes} min</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Showtime */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-bold flex items-center justify-center">2</span>
                Horarios Disponibles para "{selectedMovie?.title || 'Película'}"
              </h2>

              {availableShowtimes.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {availableShowtimes.map((st) => {
                    const isSelected = st.id === selectedShowtimeId;
                    const room = rooms.find(r => r.id === st.roomId);
                    return (
                      <button
                        key={st.id}
                        onClick={() => setSelectedShowtimeId(st.id)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-lg shadow-amber-500/20 scale-[1.02]'
                            : 'bg-slate-950/70 border-slate-800 hover:border-amber-500/40 text-slate-300'
                        }`}
                      >
                        <span className={`font-mono text-xl font-black block ${isSelected ? 'text-slate-950' : 'text-amber-400'}`}>
                          {st.startTime}
                        </span>
                        <span className={`text-[10px] block mt-0.5 truncate font-semibold ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                          {room?.name || 'Sala'}
                        </span>
                        <span className={`text-[9px] block font-mono ${isSelected ? 'text-slate-800' : 'text-emerald-400'}`}>
                          {st.availableSeats} disp.
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-center text-slate-400 text-xs">
                  No hay funciones programadas para esta película hoy.
                </div>
              )}
            </div>

            {/* Step 3: Select Ticket Quantities */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-bold flex items-center justify-center">3</span>
                Cantidad de Boletos
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pricing.map((tier) => {
                  const qty = cartQuantities[tier.type] || 0;
                  return (
                    <div
                      key={tier.type}
                      className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-white">{tier.label}</h4>
                          <span className="text-xs font-mono font-black text-amber-400">
                            S/. {tier.basePrice.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{tier.description}</p>
                      </div>

                      {/* Counter Controls */}
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(tier.type, -1)}
                          disabled={qty <= 0}
                          className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white flex items-center justify-center font-black transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-sm text-amber-300">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(tier.type, 1)}
                          className="w-7 h-7 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-black transition-colors shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT 5-COLS: Checkout Summary & Cash Calculator */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-black text-base text-white font-sans flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                Resumen de Venta
              </h3>
              <span className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-md font-mono font-bold">
                {totalTicketsCount} {totalTicketsCount === 1 ? 'Boleto' : 'Boletos'}
              </span>
            </div>

            {/* Selected Movie Summary Badge */}
            {selectedMovie && (
              <div className="flex gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <img
                  src={selectedMovie.posterUrl}
                  alt={selectedMovie.title}
                  className="w-12 h-16 object-cover rounded-lg shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-white truncate">{selectedMovie.title}</h4>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">
                    {selectedRoom?.name || 'Sala'} • {selectedShowtime?.startTime || '--:--'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Formato: {selectedRoom?.type}</p>
                </div>
              </div>
            )}

            {/* Itemized list */}
            <div className="space-y-2 border-b border-slate-800 pb-4 text-xs font-mono">
              {pricing.map((tier) => {
                const qty = cartQuantities[tier.type] || 0;
                if (qty <= 0) return null;
                const sub = tier.basePrice * qty;
                return (
                  <div key={tier.type} className="flex justify-between text-slate-300">
                    <span>{qty}x {tier.label}</span>
                    <span className="text-white font-bold">S/. {sub.toFixed(2)}</span>
                  </div>
                );
              })}
              {totalTicketsCount === 0 && (
                <div className="text-slate-500 italic text-center py-2">Ningún boleto seleccionado</div>
              )}
            </div>

            {/* Total Grand Amount */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-4 rounded-xl border border-amber-500/30 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-300">TOTAL A COBRAR:</span>
              <span className="text-3xl font-black text-amber-400 font-mono text-shadow-gold">
                S/. {totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Cash Payment & Change Return Calculator */}
            <div className="space-y-3 pt-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Efectivo Recibido (S/.):</span>
                <span className="text-[10px] text-slate-400">Atajos rápidos:</span>
              </label>

              {/* Fast Cash Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickCash(totalAmount)}
                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-[11px] font-bold rounded-lg text-amber-300 border border-slate-700"
                >
                  Exacto
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCash(20)}
                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-[11px] font-bold rounded-lg text-slate-200 border border-slate-700 font-mono"
                >
                  S/. 20
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCash(50)}
                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-[11px] font-bold rounded-lg text-slate-200 border border-slate-700 font-mono"
                >
                  S/. 50
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCash(100)}
                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-[11px] font-bold rounded-lg text-slate-200 border border-slate-700 font-mono"
                >
                  S/. 100
                </button>
              </div>

              <input
                type="number"
                step="0.5"
                placeholder={`S/. ${totalAmount.toFixed(2)}`}
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-lg font-mono font-bold text-white px-4 py-2.5 rounded-xl outline-none focus:border-amber-400"
              />

              {/* Change Output */}
              {numCashReceived >= totalAmount && totalAmount > 0 && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-emerald-300 font-semibold">Vuelto a entregar:</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    S/. {changeAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Process Sale Button */}
            <button
              onClick={handleProcessSale}
              disabled={isProcessing || totalTicketsCount === 0}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-base tracking-wide shadow-xl shadow-amber-500/25 transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-[0.99]"
            >
              <CreditCard className="w-5 h-5" />
              <span>{isProcessing ? 'Generando Tickets...' : 'COBRAR E IMPRIMIR BOLETOS'}</span>
            </button>

          </div>

        </div>

      </div>

      {/* Ticket Print Modal */}
      {lastSale && (
        <TicketPrintModal
          sale={lastSale}
          tickets={lastTickets}
          onClose={() => setLastSale(null)}
        />
      )}
    </div>
  );
};
