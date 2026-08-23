export type MovieRating = 'APT' | '14+' | '18+' | 'TE';
export type MovieStatus = 'CARTELERA' | 'PROXIMAMENTE' | 'ARCHIVADA';
export type RoomType = '2D Estándar' | '3D Dolby' | 'IMAX Laser' | 'VIP Premium';
export type TicketType = 'GENERAL' | 'NINO' | 'ADULTO_MAYOR' | 'PROMO_DUO';
export type TicketStatus = 'ISSUED' | 'USED' | 'CANCELLED';

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  synopsis: string;
  durationMinutes: number;
  rating: MovieRating;
  genre: string[];
  posterUrl: string;
  backdropUrl?: string;
  trailerUrl?: string;
  status: MovieStatus;
  director?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  tagline: string; // ej. "FUNCIÓN INFANTIL / FAMILIAR", "ESTRENO ESTELAR"
  time: string; // ej. "5:30 PM", "8:00 PM"
  rating: string; // ej. "APT (Niños)", "+12", "+14", "18+"
  durationMinutes?: number;
  genres: string[];
  synopsis: string;
  backdropUrl: string;
  posterUrl?: string;
  active: boolean;
  order: number;
  movieId?: string;
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  soundSystem: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  roomId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  priceMultiplier?: number;
  availableSeats: number;
}

export interface PricingTier {
  type: TicketType;
  label: string;
  description: string;
  basePrice: number;
}

export interface Ticket {
  id: string;
  saleId: string;
  showtimeId: string;
  movieId: string;
  movieTitle: string;
  roomName: string;
  roomType: RoomType;
  showtimeDate: string;
  showtimeHour: string;
  ticketType: TicketType;
  price: number;
  status: TicketStatus;
  issuedAt: string;
  usedAt?: string;
  validatedBy?: string;
  signature: string;
}

export interface Sale {
  id: string;
  ticketIds: string[];
  movieTitle: string;
  showtimeId: string;
  totalAmount: number;
  paidAmount: number;
  changeAmount: number;
  cashierName: string;
  createdAt: string;
  totalTickets: number;
}

export interface ScanResult {
  success: boolean;
  ticket?: Ticket;
  reason: string;
  scanType: 'USB_SCANNER' | 'CAMERA' | 'MANUAL';
  timestamp: string;
}

export interface ScanLog {
  id: string;
  ticketId: string;
  timestamp: string;
  result: 'VALID' | 'ALREADY_USED' | 'INVALID_SIGNATURE' | 'NOT_FOUND' | 'WRONG_DATE';
  message: string;
  movieTitle?: string;
  roomName?: string;
}

export type UserRole = 'ADMIN' | 'CASHIER' | 'PORTER';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  avatar?: string;
  assignedTerminal?: string;
}
