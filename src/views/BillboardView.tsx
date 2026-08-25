import React, { useState, useEffect } from 'react';
import { Movie, Showtime, Room, HeroSlide, PricingTier } from '../core/types';
import { cinemaStorage } from '../services/storage/cinemaStorage';
import { pricingApi } from '../services/api/cinemaApi';
import { Film, Calendar, Sparkles, CreditCard } from 'lucide-react';
import { PublicSection } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { BillboardHeroMarquee } from '../components/billboard/BillboardHeroMarquee';
import { BillboardMovieCard } from '../components/billboard/BillboardMovieCard';
import { BillboardExperiences } from '../components/billboard/BillboardExperiences';
import { MovieDetailModal } from '../components/billboard/MovieDetailModal';
import { TrailerPlayerModal } from '../components/billboard/TrailerPlayerModal';
import { CheckoutModal } from '../components/billboard/CheckoutModal';
import { PaymentResultModal } from '../components/billboard/PaymentResultModal';

interface BillboardViewProps {
  activeSection?: PublicSection;
}

export const BillboardView: React.FC<BillboardViewProps> = ({ 
  activeSection = 'billboard',
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('TODOS');

  // Modal States
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [trailerUrlToPlay, setTrailerUrlToPlay] = useState<string | null>(null);

  // Checkout States
  const [checkoutShowtime, setCheckoutShowtime] = useState<Showtime | null>(null);
  const [checkoutMovie, setCheckoutMovie] = useState<Movie | null>(null);
  const [showPaymentResult, setShowPaymentResult] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    return !!(params.get('payment_status') || params.get('payment_id') || params.get('collection_id'));
  });

  const loadData = () => {
    setMovies(cinemaStorage.getMovies());
    setShowtimes(cinemaStorage.getShowtimes());
    setRooms(cinemaStorage.getRooms());
    setHeroSlides(cinemaStorage.getHeroSlides());

    pricingApi.getPricing().then(setPricingTiers).catch(() => {});
  };

  useEffect(() => {
    loadData();
    window.addEventListener('argon_storage_update', loadData);
    return () => window.removeEventListener('argon_storage_update', loadData);
  }, []);

  const billboardMovies = movies.filter(m => m.status === 'CARTELERA');
  const upcomingMovies = movies.filter(m => m.status === 'PROXIMAMENTE');
  const activeSlides = heroSlides.filter(s => s.active);

  // Auto carousel for lobby marquee
  useEffect(() => {
    if (!autoRotate || activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % activeSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [autoRotate, activeSlides.length]);

  const currentSlide: HeroSlide | null = activeSlides[featuredIndex] || activeSlides[0] || null;

  const getMovieShowtimes = (movieId?: string) => {
    if (!movieId) return [];
    return showtimes.filter(s => s.movieId === movieId);
  };

  const handleStartCheckout = (movie: Movie, showtime: Showtime) => {
    setCheckoutMovie(movie);
    setCheckoutShowtime(showtime);
    setSelectedMovie(null);
  };

  // Unique genres
  const allGenres = ['TODOS', ...Array.from(new Set(billboardMovies.flatMap(m => m.genre)))];

  const filteredBillboard = selectedGenre === 'TODOS'
    ? billboardMovies
    : billboardMovies.filter(m => m.genre.includes(selectedGenre));

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 pb-0 space-y-10 animate-fade-in flex flex-col justify-between">
      <div>
        {/* Top Billboard Hero Marquee */}
        {currentSlide && activeSection !== 'experiences' && (
          <BillboardHeroMarquee
            currentSlide={currentSlide}
            showtimes={showtimes}
            rooms={rooms}
          />
        )}

        {/* Billboard Main Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
          
          {/* SECTION 1: CARTELERA PRINCIPAL */}
          {activeSection !== 'experiences' && (
            <div className="space-y-6">
              
              {/* Header with Title & Filter Pills */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white font-sans tracking-tight">EN CARTELERA HOY</h2>
                    <p className="text-xs text-slate-400">
                      Disfruta de los mejores estrenos en pantalla gigante en Tamanco Viejo
                    </p>
                  </div>
                </div>

                {/* Genre Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {allGenres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        selectedGenre === genre
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Movies Grid */}
              {filteredBillboard.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBillboard.map((movie) => (
                    <BillboardMovieCard
                      key={movie.id}
                      movie={movie}
                      showtimes={getMovieShowtimes(movie.id)}
                      onClick={() => setSelectedMovie(movie)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 space-y-3">
                  <Film className="w-10 h-10 text-amber-400/60 mx-auto animate-pulse" />
                  <h3 className="text-lg font-bold text-white">Cartelera en Preparación</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Actualmente no hay funciones programadas para hoy. Muy pronto publicaremos nuevos horarios y estrenos.
                  </p>
                </div>
              )}

            </div>
          )}

          {/* SECTION 2: PRÓXIMOS ESTRENOS */}
          {(activeSection === 'upcoming' || activeSection === 'billboard') && upcomingMovies.length > 0 && (
            <div className="border-t border-slate-800/80 pt-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white font-sans tracking-tight">PRÓXIMAMENTE EN CINES ARGÓN</h3>
                  <p className="text-xs text-slate-400">Los estrenos más esperados que llegarán a nuestras salas en Tamanco</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {upcomingMovies.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => setSelectedMovie(movie)}
                    className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden group shadow-lg flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-[2/3] w-full overflow-hidden bg-slate-950 relative">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-cyan-500 text-slate-950 font-black text-[9px] rounded-full uppercase tracking-wider shadow">
                        PRONTO
                      </div>
                    </div>
                    <div className="p-3 space-y-1">
                      <h4 className="font-bold text-xs text-slate-200 truncate group-hover:text-cyan-400 transition-colors">
                        {movie.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">{movie.genre[0] || 'Estreno'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: SALAS & EXPERIENCIAS */}
          {activeSection === 'experiences' && (
            <BillboardExperiences rooms={rooms} />
          )}

        </div>
      </div>

      {/* Modal Dialogs */}
      <MovieDetailModal
        movie={selectedMovie}
        showtimes={showtimes}
        rooms={rooms}
        onClose={() => setSelectedMovie(null)}
        onOpenTrailer={(url) => setTrailerUrlToPlay(url)}
        onSelectShowtime={(st) => selectedMovie && handleStartCheckout(selectedMovie, st)}
      />

      <TrailerPlayerModal
        trailerUrl={trailerUrlToPlay}
        onClose={() => setTrailerUrlToPlay(null)}
      />

      {/* Checkout Modal */}
      {checkoutShowtime && checkoutMovie && (
        <CheckoutModal
          movie={checkoutMovie}
          showtime={checkoutShowtime}
          room={rooms.find((r) => r.id === checkoutShowtime.roomId)}
          pricingTiers={pricingTiers}
          onClose={() => {
            setCheckoutShowtime(null);
            setCheckoutMovie(null);
          }}
        />
      )}

      {/* Payment Result Modal (After returning from Mercado Pago) */}
      {showPaymentResult && (
        <PaymentResultModal
          onClose={() => setShowPaymentResult(false)}
        />
      )}

      {/* Public Footer */}
      <Footer />

    </div>
  );
};
