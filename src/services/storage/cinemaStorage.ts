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

const INITIAL_MOVIES: Movie[] = [
  {
    id: 'mov-1',
    title: 'Dune: Parte Dos',
    originalTitle: 'Dune: Part Two',
    synopsis: 'Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.',
    durationMinutes: 166,
    rating: '14+',
    genre: ['Ciencia Ficción', 'Aventura', 'Acción'],
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    status: 'CARTELERA',
    director: 'Denis Villeneuve'
  },
  {
    id: 'mov-2',
    title: 'Spider-Man: Beyond the Spider-Verse',
    originalTitle: 'Spider-Man: Beyond the Spider-Verse',
    synopsis: 'Miles Morales es catapultado a través del Multiverso, donde se encuentra con un equipo de Spider-Personas encargadas de proteger su existencia.',
    durationMinutes: 140,
    rating: 'APT',
    genre: ['Animación', 'Acción', 'Superhéroes'],
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1600&auto=format&fit=crop',
    status: 'CARTELERA',
    director: 'Joaquim Dos Santos'
  },
  {
    id: 'mov-3',
    title: 'Gladiador II',
    originalTitle: 'Gladiator II',
    synopsis: 'Años después de presenciar la muerte del venerado héroe Máximo a manos de su tío, Lucio debe entrar en el Coliseo.',
    durationMinutes: 148,
    rating: '18+',
    genre: ['Acción', 'Drama', 'Histórico'],
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1600&auto=format&fit=crop',
    status: 'CARTELERA',
    director: 'Ridley Scott'
  },
  {
    id: 'mov-4',
    title: 'Intensamente 2',
    originalTitle: 'Inside Out 2',
    synopsis: 'Riley entra a la adolescencia y el cuartel general sufre una repentina demolición para hacer sitio a nuevas emociones inesperadas.',
    durationMinutes: 96,
    rating: 'APT',
    genre: ['Animación', 'Comedia', 'Familiar'],
    posterUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    status: 'CARTELERA',
    director: 'Kelsey Mann'
  },
  {
    id: 'mov-5',
    title: 'Oppenheimer',
    originalTitle: 'Oppenheimer',
    synopsis: 'La historia del científico estadounidense J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica.',
    durationMinutes: 180,
    rating: '18+',
    genre: ['Drama', 'Historia', 'Biografía'],
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
    status: 'CARTELERA',
    director: 'Christopher Nolan'
  },
  {
    id: 'mov-6',
    title: 'Avatar: El Fuego y las Cenizas',
    originalTitle: 'Avatar: Fire and Ash',
    synopsis: 'El próximo capítulo en el viaje de Jake Sully y Neytiri explorando nuevas tribus de Pandora.',
    durationMinutes: 190,
    rating: '14+',
    genre: ['Aventura', 'Ciencia Ficción'],
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    status: 'PROXIMAMENTE',
    director: 'James Cameron'
  }
];

const INITIAL_ROOMS: Room[] = [
  { id: 'room-1', name: 'Sala Única - Home Cinema Argón', type: 'VIP Premium', capacity: 25, soundSystem: 'Dolby Atmos 7.1.4 Surround' },
];

const todayStr = new Date().toISOString().split('T')[0];

const INITIAL_SHOWTIMES: Showtime[] = [
  { id: 'st-1', movieId: 'mov-2', roomId: 'room-1', date: todayStr, startTime: '17:30', endTime: '19:50', availableSeats: 25 },
  { id: 'st-2', movieId: 'mov-1', roomId: 'room-1', date: todayStr, startTime: '20:00', endTime: '22:46', availableSeats: 25 },
];

const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-1',
    title: 'Spider-Man: Beyond the Spider-Verse',
    tagline: 'FUNCIÓN DE LA TARDE (NIÑOS & FAMILIA)',
    time: '5:30 PM',
    rating: 'APT (Todo Público)',
    durationMinutes: 140,
    genres: ['Animación', 'Acción', 'Familiar'],
    synopsis: 'Miles Morales emprende una emocionante travesía a través del multiverso junto a Gwen Stacy y nuevos aliados.',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop',
    active: true,
    order: 1,
    movieId: 'mov-2'
  },
  {
    id: 'hero-2',
    title: 'Dune: Parte Dos',
    tagline: 'FUNCIÓN ESTELAR (+12 / ADULTOS)',
    time: '8:00 PM',
    rating: '+14 / +12',
    durationMinutes: 166,
    genres: ['Ciencia Ficción', 'Aventura', 'Acción'],
    synopsis: 'El mítico viaje de Paul Atreides mientras se une a Chani y a los Fremen en una guerra de proporciones épicas.',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    active: true,
    order: 2,
    movieId: 'mov-1'
  }
];

const INITIAL_PRICING: PricingTier[] = [
  { type: 'GENERAL', label: 'Boleto General', description: 'Acceso para adultos', basePrice: 18.00 },
  { type: 'NINO', label: 'Niños (Hasta 11 años)', description: 'Tarifa infantil reducida', basePrice: 13.50 },
  { type: 'ADULTO_MAYOR', label: 'Adulto Mayor (60+)', description: 'Descuento con documento', basePrice: 13.50 },
  { type: 'PROMO_DUO', label: 'Promo Pareja (2x)', description: 'Paquete 2 entradas generales', basePrice: 30.00 },
];

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
      return data ? JSON.parse(data) : defaultValue;
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

      if (movies.status === 'fulfilled' && movies.value?.length) {
        this.setItem(STORAGE_KEYS.MOVIES, movies.value);
      }
      if (rooms.status === 'fulfilled' && rooms.value?.length) {
        this.setItem(STORAGE_KEYS.ROOMS, rooms.value);
      }
      if (showtimes.status === 'fulfilled' && showtimes.value?.length) {
        this.setItem(STORAGE_KEYS.SHOWTIMES, showtimes.value);
      }
      if (pricing.status === 'fulfilled' && pricing.value?.length) {
        this.setItem(STORAGE_KEYS.PRICING, pricing.value);
      }
      if (heroSlides.status === 'fulfilled' && heroSlides.value?.length) {
        this.setItem(STORAGE_KEYS.HERO_SLIDES, heroSlides.value);
      }
      if (sales.status === 'fulfilled' && sales.value?.length) {
        this.setItem(STORAGE_KEYS.SALES, sales.value);
      }
      if (tickets.status === 'fulfilled' && tickets.value?.length) {
        this.setItem(STORAGE_KEYS.TICKETS, tickets.value);
      }
      if (scanLogs.status === 'fulfilled' && scanLogs.value?.length) {
        this.setItem(STORAGE_KEYS.SCAN_LOGS, scanLogs.value);
      }
    } catch (err: any) {
      console.warn('Backend sync failed or server offline:', err.message);
    } finally {
      this.isSyncing = false;
    }
  }

  getMovies(): Movie[] {
    const movies = this.getItem<Movie[]>(STORAGE_KEYS.MOVIES, []);
    if (!movies || movies.length === 0) {
      this.setItem(STORAGE_KEYS.MOVIES, INITIAL_MOVIES);
      return INITIAL_MOVIES;
    }
    return movies;
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

    // Sync to backend
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
    const rooms = this.getItem<Room[]>(STORAGE_KEYS.ROOMS, []);
    if (!rooms || rooms.length === 0) {
      this.setItem(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
      return INITIAL_ROOMS;
    }
    return rooms;
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
    const showtimes = this.getItem<Showtime[]>(STORAGE_KEYS.SHOWTIMES, []);
    if (!showtimes || showtimes.length === 0) {
      this.setItem(STORAGE_KEYS.SHOWTIMES, INITIAL_SHOWTIMES);
      return INITIAL_SHOWTIMES;
    }
    return showtimes;
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
    const pricing = this.getItem<PricingTier[]>(STORAGE_KEYS.PRICING, []);
    if (!pricing || pricing.length === 0) {
      this.setItem(STORAGE_KEYS.PRICING, INITIAL_PRICING);
      return INITIAL_PRICING;
    }
    return pricing;
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
    if (!slides || slides.length === 0) {
      this.setItem(STORAGE_KEYS.HERO_SLIDES, INITIAL_HERO_SLIDES);
      return INITIAL_HERO_SLIDES;
    }
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

  resetToDemo(): void {
    localStorage.clear();
    this.setItem(STORAGE_KEYS.MOVIES, INITIAL_MOVIES);
    this.setItem(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
    this.setItem(STORAGE_KEYS.SHOWTIMES, INITIAL_SHOWTIMES);
    this.setItem(STORAGE_KEYS.PRICING, INITIAL_PRICING);
    this.setItem(STORAGE_KEYS.HERO_SLIDES, INITIAL_HERO_SLIDES);
    this.setItem(STORAGE_KEYS.TICKETS, []);
    this.setItem(STORAGE_KEYS.SALES, []);
    this.setItem(STORAGE_KEYS.SCAN_LOGS, []);
    this.notifyChange();
  }
}

export const cinemaStorage = new CinemaStorageService();
