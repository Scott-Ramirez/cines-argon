import { apiClient } from './apiClient';
import {
  Movie,
  Room,
  Showtime,
  PricingTier,
  HeroSlide,
  Ticket,
  Sale,
  ScanLog,
  ScanResult,
  User,
  TicketStatus,
  MovieStatus,
} from '../../core/types';

export interface TmdbSearchResult {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  releaseDate: string;
  posterUrl: string;
  backdropUrl: string;
  voteAverage: number;
  genreIds: number[];
}

export interface TmdbMovieDetails {
  id: number;
  title: string;
  originalTitle: string;
  synopsis: string;
  durationMinutes: number;
  rating: 'APT' | '14+' | '18+' | 'TE';
  genres: string[];
  posterUrl: string;
  backdropUrl: string;
  trailerUrl?: string;
  director?: string;
  releaseDate: string;
}

export const authApi = {
  login: (username: string, password?: string) =>
    apiClient.post<{ accessToken: string; user: User }>('/auth/login', { username, password }),

  registerAdmin: (data: { name: string; username: string; password: string; assignedTerminal?: string }) =>
    apiClient.post<User>('/auth/register-admin', data),

  getProfile: () => apiClient.get<User>('/auth/profile'),
};

export const moviesApi = {
  getMovies: (status?: MovieStatus) => {
    const query = status ? `?status=${status}` : '';
    return apiClient.get<Movie[]>(`/movies${query}`);
  },
  getMovie: (id: string) => apiClient.get<Movie>(`/movies/${id}`),
  createMovie: (data: Partial<Movie>) => apiClient.post<Movie>('/movies', data),
  updateMovie: (id: string, data: Partial<Movie>) => apiClient.put<Movie>(`/movies/${id}`, data),
  deleteMovie: (id: string) => apiClient.delete<{ success: boolean; message: string }>(`/movies/${id}`),
};

export const tmdbApi = {
  search: (query: string, language: string = 'es-MX') => {
    const params = new URLSearchParams({ query, language });
    return apiClient.get<TmdbSearchResult[]>(`/tmdb/search?${params.toString()}`);
  },
  getNowPlaying: (language: string = 'es-MX') => {
    const params = new URLSearchParams({ language });
    return apiClient.get<TmdbSearchResult[]>(`/tmdb/now-playing?${params.toString()}`);
  },
  getPopular: (language: string = 'es-MX') => {
    const params = new URLSearchParams({ language });
    return apiClient.get<TmdbSearchResult[]>(`/tmdb/popular?${params.toString()}`);
  },
  getDetails: (tmdbId: number | string, language: string = 'es-MX') => {
    const params = new URLSearchParams({ language });
    return apiClient.get<TmdbMovieDetails>(`/tmdb/details/${tmdbId}?${params.toString()}`);
  },
  importMovie: (tmdbId: number | string, status: MovieStatus = 'CARTELERA', language: string = 'es-MX') => {
    const params = new URLSearchParams({ language });
    return apiClient.post<Movie>(`/tmdb/import/${tmdbId}?${params.toString()}`, { status });
  },
};

export const roomsApi = {
  getRooms: () => apiClient.get<Room[]>('/rooms'),
  getRoom: (id: string) => apiClient.get<Room>(`/rooms/${id}`),
  createRoom: (data: Partial<Room>) => apiClient.post<Room>('/rooms', data),
  updateRoom: (id: string, data: Partial<Room>) => apiClient.put<Room>(`/rooms/${id}`, data),
  deleteRoom: (id: string) => apiClient.delete<{ success: boolean; message: string }>(`/rooms/${id}`),
};

export const showtimesApi = {
  getShowtimes: (date?: string, movieId?: string) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (movieId) params.append('movieId', movieId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<Showtime[]>(`/showtimes${query}`);
  },
  getShowtime: (id: string) => apiClient.get<Showtime>(`/showtimes/${id}`),
  createShowtime: (data: Partial<Showtime>) => apiClient.post<Showtime>('/showtimes', data),
  updateShowtime: (id: string, data: Partial<Showtime>) => apiClient.put<Showtime>(`/showtimes/${id}`, data),
  deleteShowtime: (id: string) => apiClient.delete<{ success: boolean; message: string }>(`/showtimes/${id}`),
};

export const pricingApi = {
  getPricing: () => apiClient.get<PricingTier[]>('/pricing'),
  savePricingBatch: (tiers: PricingTier[]) => apiClient.put<PricingTier[]>('/pricing', { tiers }),
  savePricingTier: (tier: PricingTier) => apiClient.post<PricingTier>('/pricing', tier),
};

export const heroSlidesApi = {
  getHeroSlides: (activeOnly?: boolean) => {
    const query = activeOnly ? '?activeOnly=true' : '';
    return apiClient.get<HeroSlide[]>(`/hero-slides${query}`);
  },
  getHeroSlide: (id: string) => apiClient.get<HeroSlide>(`/hero-slides/${id}`),
  createHeroSlide: (data: Partial<HeroSlide>) => apiClient.post<HeroSlide>('/hero-slides', data),
  updateHeroSlide: (id: string, data: Partial<HeroSlide>) => apiClient.put<HeroSlide>(`/hero-slides/${id}`, data),
  toggleActive: (id: string) => apiClient.patch<HeroSlide>(`/hero-slides/${id}/toggle`),
  deleteHeroSlide: (id: string) => apiClient.delete<{ success: boolean; message: string }>(`/hero-slides/${id}`),
};

export const salesApi = {
  getSales: () => apiClient.get<Sale[]>('/sales'),
  getSale: (id: string) => apiClient.get<Sale>(`/sales/${id}`),
  processSale: (data: {
    showtimeId: string;
    items: { type: string; quantity: number }[];
    cashierName?: string;
    paidAmount: number;
  }) => apiClient.post<{ sale: Sale; tickets: Ticket[] }>('/sales', data),
};

export const ticketsApi = {
  getTickets: (status?: TicketStatus, showtimeId?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (showtimeId) params.append('showtimeId', showtimeId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<Ticket[]>(`/tickets${query}`);
  },
  getTicket: (id: string) => apiClient.get<Ticket>(`/tickets/${id}`),
  getTicketsBySale: (saleId: string) => apiClient.get<Ticket[]>(`/tickets/sale/${saleId}`),
  cancelTicket: (id: string) => apiClient.patch<Ticket>(`/tickets/${id}/cancel`),
};

export const validatorApi = {
  validateScan: (data: {
    rawScanString: string;
    scanType?: 'USB_SCANNER' | 'CAMERA' | 'MANUAL';
    validatedBy?: string;
  }) => apiClient.post<ScanResult>('/validator/scan', data),
  getLogs: (limit?: number) => {
    const query = limit ? `?limit=${limit}` : '';
    return apiClient.get<ScanLog[]>(`/validator/logs${query}`);
  },
};

export const dashboardApi = {
  getStats: () => apiClient.get<any>('/dashboard/stats'),
};

export const paymentsApi = {
  createPreference: (data: {
    showtimeId: string;
    items: { type: string; quantity: number }[];
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
  }) =>
    apiClient.post<{ preferenceId: string; initPoint: string; sandboxInitPoint: string }>(
      '/payments/mercadopago/preference',
      data,
    ),

  getSaleByPaymentId: (paymentId: string) =>
    apiClient.get<Sale>(`/payments/sales/by-payment/${paymentId}`),

  refundPayment: (saleId: string, reason?: string) =>
    apiClient.post<{ success: boolean; message: string }>('/payments/mercadopago/refund', {
      saleId,
      reason,
    }),
};

