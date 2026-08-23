import { Ticket, Sale, TicketType, ScanResult, ScanLog } from '../core/types';
import { cinemaStorage } from './storage/cinemaStorage';
import { generateTicketSignature, parseScannedPayload } from '../core/security/crypto';
import { soundService } from './soundService';

export interface CartItem {
  type: TicketType;
  quantity: number;
}

class TicketService {
  async processSale(
    showtimeId: string,
    items: CartItem[],
    cashierName: string,
    paidAmount: number
  ): Promise<{ sale: Sale; tickets: Ticket[] }> {
    const showtimes = cinemaStorage.getShowtimes();
    const showtime = showtimes.find(s => s.id === showtimeId);
    if (!showtime) throw new Error('Función no encontrada');

    const movies = cinemaStorage.getMovies();
    const movie = movies.find(m => m.id === showtime.movieId);
    if (!movie) throw new Error('Película no encontrada');

    const rooms = cinemaStorage.getRooms();
    const room = rooms.find(r => r.id === showtime.roomId);
    if (!room) throw new Error('Sala no encontrada');

    const pricing = cinemaStorage.getPricing();
    const priceMap = new Map(pricing.map(p => [p.type, p.basePrice]));

    const saleId = 'VNT-' + Date.now().toString().slice(-6);
    const nowIso = new Date().toISOString();
    const generatedTickets: Ticket[] = [];
    let totalAmount = 0;
    let totalTicketsCount = 0;

    for (const item of items) {
      if (item.quantity <= 0) continue;
      const unitPrice = priceMap.get(item.type) || 18.00;

      for (let i = 0; i < item.quantity; i++) {
        const ticketId = 'TKT-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + (generatedTickets.length + 1);
        const signature = await generateTicketSignature(ticketId, showtime.id, unitPrice, nowIso);

        const ticket: Ticket = {
          id: ticketId,
          saleId: saleId,
          showtimeId: showtime.id,
          movieId: movie.id,
          movieTitle: movie.title,
          roomName: room.name,
          roomType: room.type,
          showtimeDate: showtime.date,
          showtimeHour: showtime.startTime,
          ticketType: item.type,
          price: unitPrice,
          status: 'ISSUED',
          issuedAt: nowIso,
          signature: signature,
        };

        generatedTickets.push(ticket);
        totalAmount += unitPrice;
        totalTicketsCount += 1;
      }
    }

    if (generatedTickets.length === 0) {
      throw new Error('Debe seleccionar al menos una entrada');
    }

    const sale: Sale = {
      id: saleId,
      ticketIds: generatedTickets.map(t => t.id),
      movieTitle: movie.title,
      showtimeId: showtime.id,
      totalAmount: totalAmount,
      paidAmount: paidAmount > totalAmount ? paidAmount : totalAmount,
      changeAmount: Math.max(0, paidAmount - totalAmount),
      cashierName: cashierName || 'Taquilla 1',
      createdAt: nowIso,
      totalTickets: totalTicketsCount,
    };

    showtime.availableSeats = Math.max(0, showtime.availableSeats - totalTicketsCount);
    cinemaStorage.saveShowtime(showtime);

    cinemaStorage.saveBatchTickets(generatedTickets);
    cinemaStorage.saveSale(sale);

    return { sale, tickets: generatedTickets };
  }

  async validateTicket(rawScanString: string, scanType: 'USB_SCANNER' | 'CAMERA' | 'MANUAL' = 'USB_SCANNER'): Promise<ScanResult> {
    const timestamp = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const parsed = parseScannedPayload(rawScanString);
    const ticketId = parsed.ticketId.trim();

    if (!ticketId) {
      soundService.playWarning();
      return {
        success: false,
        reason: 'Código vacío o formato ilegible',
        scanType,
        timestamp,
      };
    }

    const ticket = cinemaStorage.getTicketById(ticketId);

    if (!ticket) {
      soundService.playError();
      const log: ScanLog = {
        id: 'LOG-' + Date.now(),
        ticketId: ticketId,
        timestamp,
        result: 'NOT_FOUND',
        message: 'Boleto inexistente en la base de datos',
      };
      cinemaStorage.addScanLog(log);
      return {
        success: false,
        reason: `Boleto '${ticketId}' no encontrado en el sistema`,
        scanType,
        timestamp,
      };
    }

    if (ticket.status === 'USED') {
      soundService.playError();
      const usedTime = ticket.usedAt ? new Date(ticket.usedAt).toLocaleTimeString('es-PE') : 'previamente';
      const log: ScanLog = {
        id: 'LOG-' + Date.now(),
        ticketId: ticket.id,
        timestamp,
        result: 'ALREADY_USED',
        message: `Boleto ya fue utilizado a las ${usedTime}`,
        movieTitle: ticket.movieTitle,
        roomName: ticket.roomName,
      };
      cinemaStorage.addScanLog(log);
      return {
        success: false,
        ticket,
        reason: `⚠️ BOLETO YA UTILIZADO (Ingresó a las ${usedTime})`,
        scanType,
        timestamp,
      };
    }

    if (ticket.status === 'CANCELLED') {
      soundService.playError();
      return {
        success: false,
        ticket,
        reason: 'Boleto anulado/cancelado por administración',
        scanType,
        timestamp,
      };
    }

    const expectedSignature = await generateTicketSignature(
      ticket.id,
      ticket.showtimeId,
      ticket.price,
      ticket.issuedAt
    );

    if (ticket.signature !== expectedSignature) {
      soundService.playError();
      const log: ScanLog = {
        id: 'LOG-' + Date.now(),
        ticketId: ticket.id,
        timestamp,
        result: 'INVALID_SIGNATURE',
        message: 'Firma criptográfica inválida o adulterada',
        movieTitle: ticket.movieTitle,
      };
      cinemaStorage.addScanLog(log);
      return {
        success: false,
        ticket,
        reason: '🚨 ALERTA: Boleto adulterado o firma digital inválida',
        scanType,
        timestamp,
      };
    }

    ticket.status = 'USED';
    ticket.usedAt = new Date().toISOString();
    ticket.validatedBy = 'Portería Principal';
    cinemaStorage.saveTicket(ticket);

    soundService.playSuccess();

    const log: ScanLog = {
      id: 'LOG-' + Date.now(),
      ticketId: ticket.id,
      timestamp,
      result: 'VALID',
      message: 'Ingreso Autorizado',
      movieTitle: ticket.movieTitle,
      roomName: ticket.roomName,
    };
    cinemaStorage.addScanLog(log);

    return {
      success: true,
      ticket,
      reason: '✅ ACCESO AUTORIZADO',
      scanType,
      timestamp,
    };
  }
}

export const ticketService = new TicketService();
