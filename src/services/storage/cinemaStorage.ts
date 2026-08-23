import { Movie, Room, Showtime, Ticket, Sale, ScanLog, PricingTier, HeroSlide } from '../../core/types';
import {
  moviesApi,
  roomsApi,
  showtimesApi,
  pricingApi,
  heroSlidesApi,
  salesApi,
  ticketsApi,
  validatorApi,
} from '../api/cinemaApi';

const STORAGE_KEYS = {
  MOVIES: 'argon_movies_v1',
  ROOMS: 'argon_rooms_v1',
  SHOWTIMES: 'argon_showtimes_v1',
  TICKETS: 'argon_tickets_v1',
  SALES: 'argon_sales_v1',
  SCAN_LOGS: 'argon_scan_logs_v1',
  PRICING: 'argon_pricing_v1',
  HERO_SLIDES: 'argon_hero_slides_v1',
};

class CinemaStorageService {
  private isSyncing = false;

  constructor() {
    if (typeof window !== 'undefined') {
      setTimeout(() => this.syncFromBackend(), 100);
    }
  }

  private notifyChange(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('argon_storage_update'));
    }
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data !== null ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notifyChange();
    } catch (e) {
      console.error('Storage write error', e);
    }
  }

  async syncFromBackend(): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;
    try {
      const [movies, rooms, showtimes, pricing, heroSlides, sales, tickets, scanLogs] =
        await Promise.allSettled([
          moviesApi.getMovies(),
          roomsApi.getRooms(),
          showtimesApi.getShowtimes(),
          pricingApi.getPricing(),
          heroSlidesApi.getHeroSlides(),
          salesApi.getSales(),
          ticketsApi.getTickets(),
          validatorApi.getLogs(),
        ]);

      if (movies.status === 'fulfilled' && Array.isArray(movies.value)) {
        this.setItem(STORAGE_KEYS.MOVIES, movies.value);
      }
      if (rooms.status === 'fulfilled' && Array.isArray(rooms.value)) {
        this.setItem(STORAGE_KEYS.ROOMS, rooms.value);
      }
      if (showtimes.status === 'fulfilled' && Array.isArray(showtimes.value)) {
        this.setItem(STORAGE_KEYS.SHOWTIMES, showtimes.value);
      }
      if (pricing.status === 'fulfilled' && Array.isArray(pricing.value)) {
        this.setItem(STORAGE_KEYS.PRICING, pricing.value);
      }
      if (heroSlides.status === 'fulfilled' && Array.isArray(heroSlides.value)) {
        this.setItem(STORAGE_KEYS.HERO_SLIDES, heroSlides.value);
      }
      if (sales.status === 'fulfilled' && Array.isArray(sales.value)) {
        this.setItem(STORAGE_KEYS.SALES, sales.value);
      }
      if (tickets.status === 'fulfilled' && Array.isArray(tickets.value)) {
        this.setItem(STORAGE_KEYS.TICKETS, tickets.value);
      }
      if (scanLogs.status === 'fulfilled' && Array.isArray(scanLogs.value)) {
        this.setItem(STORAGE_KEYS.SCAN_LOGS, scanLogs.value);
      }
    } catch (err: any) {
      console.warn('Backend sync failed or server offline:', err.message);
    } finally {
      this.isSyncing = false;
    }
  }

  getMovies(): Movie[] {
    return this.getItem<Movie[]>(STORAGE_KEYS.MOVIES, []);
  }

  async saveMovie(movie: Movie): Promise<void> {
    const movies = this.getMovies();
    const index = movies.findIndex(m => m.id === movie.id);
    if (index >= 0) {
      movies[index] = movie;
    } else {
      movies.unshift(movie);
    }
    this.setItem(STORAGE_KEYS.MOVIES, movies);

    // Sync to backend MySQL
    try {
      if (index >= 0) {
        await moviesApi.updateMovie(movie.id, movie);
      } else {
        await moviesApi.createMovie(movie);
      }
    } catch (e: any) {
      console.warn('Could not sync movie to backend:', e.message);
    }
  }

  async deleteMovie(id: string): Promise<void> {
    const movies = this.getMovies().filter(m => m.id !== id);
    this.setItem(STORAGE_KEYS.MOVIES, movies);

    try {
      await moviesApi.deleteMovie(id);
    } catch (e: any) {
      console.warn('Could not delete movie on backend:', e.message);
    }
  }

  getRooms(): Room[] {
    return this.getItem<Room[]>(STORAGE_KEYS.ROOMS, []);
  }

  async saveRoom(room: Room): Promise<void> {
    const rooms = this.getRooms();
    const index = rooms.findIndex(r => r.id === room.id);
    if (index >= 0) {
      rooms[index] = room;
    } else {
      rooms.push(room);
    }
    this.setItem(STORAGE_KEYS.ROOMS, rooms);

    try {
      if (index >= 0) {
        await roomsApi.updateRoom(room.id, room);
      } else {
        await roomsApi.createRoom(room);
      }
    } catch (e: any) {
      console.warn('Could not sync room to backend:', e.message);
    }
  }

  async deleteRoom(id: string): Promise<void> {
    const rooms = this.getRooms().filter(r => r.id !== id);
    this.setItem(STORAGE_KEYS.ROOMS, rooms);

    try {
      await roomsApi.deleteRoom(id);
    } catch (e: any) {
      console.warn('Could not delete room on backend:', e.message);
    }
  }

  getShowtimes(): Showtime[] {
    return this.getItem<Showtime[]>(STORAGE_KEYS.SHOWTIMES, []);
  }

  async saveShowtime(showtime: Showtime): Promise<void> {
    const showtimes = this.getShowtimes();
    const index = showtimes.findIndex(s => s.id === showtime.id);
    if (index >= 0) {
      showtimes[index] = showtime;
    } else {
      showtimes.push(showtime);
    }
    this.setItem(STORAGE_KEYS.SHOWTIMES, showtimes);

    try {
      if (index >= 0) {
        await showtimesApi.updateShowtime(showtime.id, showtime);
      } else {
        await showtimesApi.createShowtime(showtime);
      }
    } catch (e: any) {
      console.warn('Could not sync showtime to backend:', e.message);
    }
  }

  async deleteShowtime(id: string): Promise<void> {
    const showtimes = this.getShowtimes().filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.SHOWTIMES, showtimes);

    try {
      await showtimesApi.deleteShowtime(id);
    } catch (e: any) {
      console.warn('Could not delete showtime on backend:', e.message);
    }
  }

  getPricing(): PricingTier[] {
    return this.getItem<PricingTier[]>(STORAGE_KEYS.PRICING, []);
  }

  async savePricing(pricing: PricingTier[]): Promise<void> {
    this.setItem(STORAGE_KEYS.PRICING, pricing);

    try {
      await pricingApi.savePricingBatch(pricing);
    } catch (e: any) {
      console.warn('Could not sync pricing to backend:', e.message);
    }
  }

  getTickets(): Ticket[] {
    return this.getItem<Ticket[]>(STORAGE_KEYS.TICKETS, []);
  }

  saveTicket(ticket: Ticket): void {
    const tickets = this.getTickets();
    const index = tickets.findIndex(t => t.id === ticket.id);
    if (index >= 0) {
      tickets[index] = ticket;
    } else {
      tickets.unshift(ticket);
    }
    this.setItem(STORAGE_KEYS.TICKETS, tickets);
  }

  saveBatchTickets(newTickets: Ticket[]): void {
    const tickets = this.getTickets();
    this.setItem(STORAGE_KEYS.TICKETS, [...newTickets, ...tickets]);
  }

  getTicketById(id: string): Ticket | undefined {
    return this.getTickets().find(t => t.id === id);
  }

  getSales(): Sale[] {
    return this.getItem<Sale[]>(STORAGE_KEYS.SALES, []);
  }

  saveSale(sale: Sale): void {
    const sales = this.getSales();
    sales.unshift(sale);
    this.setItem(STORAGE_KEYS.SALES, sales);
  }

  getScanLogs(): ScanLog[] {
    return this.getItem<ScanLog[]>(STORAGE_KEYS.SCAN_LOGS, []);
  }

  addScanLog(log: ScanLog): void {
    const logs = this.getScanLogs();
    logs.unshift(log);
    this.setItem(STORAGE_KEYS.SCAN_LOGS, logs.slice(0, 200));
  }

  getHeroSlides(): HeroSlide[] {
    const slides = this.getItem<HeroSlide[]>(STORAGE_KEYS.HERO_SLIDES, []);
    return slides.sort((a, b) => a.order - b.order);
  }

  async saveHeroSlide(slide: HeroSlide): Promise<void> {
    const slides = this.getHeroSlides();
    const index = slides.findIndex(s => s.id === slide.id);
    if (index >= 0) {
      slides[index] = slide;
    } else {
      slides.push(slide);
    }
    this.setItem(STORAGE_KEYS.HERO_SLIDES, slides);

    try {
      if (index >= 0) {
        await heroSlidesApi.updateHeroSlide(slide.id, slide);
      } else {
        await heroSlidesApi.createHeroSlide(slide);
      }
    } catch (e: any) {
      console.warn('Could not sync hero slide to backend:', e.message);
    }
  }

  async deleteHeroSlide(id: string): Promise<void> {
    const slides = this.getHeroSlides().filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.HERO_SLIDES, slides);

    try {
      await heroSlidesApi.deleteHeroSlide(id);
    } catch (e: any) {
      console.warn('Could not delete hero slide on backend:', e.message);
    }
  }

  async toggleHeroSlideStatus(id: string): Promise<void> {
    const slides = this.getHeroSlides();
    const slide = slides.find(s => s.id === id);
    if (slide) {
      slide.active = !slide.active;
      this.setItem(STORAGE_KEYS.HERO_SLIDES, slides);
    }

    try {
      await heroSlidesApi.toggleActive(id);
    } catch (e: any) {
      console.warn('Could not toggle hero slide on backend:', e.message);
    }
  }

  async saveHeroSlides(slides: HeroSlide[]): Promise<void> {
    this.setItem(STORAGE_KEYS.HERO_SLIDES, slides);
  }

  clearLocalCache(): void {
    localStorage.removeItem(STORAGE_KEYS.MOVIES);
    localStorage.removeItem(STORAGE_KEYS.ROOMS);
    localStorage.removeItem(STORAGE_KEYS.SHOWTIMES);
    localStorage.removeItem(STORAGE_KEYS.PRICING);
    localStorage.removeItem(STORAGE_KEYS.HERO_SLIDES);
    localStorage.removeItem(STORAGE_KEYS.TICKETS);
    localStorage.removeItem(STORAGE_KEYS.SALES);
    localStorage.removeItem(STORAGE_KEYS.SCAN_LOGS);
    this.notifyChange();
  }
}

export const cinemaStorage = new CinemaStorageService();
