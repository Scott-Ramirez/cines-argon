import React from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

interface GoogleMapsCardProps {
  compact?: boolean;
  className?: string;
}

export const GoogleMapsCard: React.FC<GoogleMapsCardProps> = ({
  compact = false,
  className = '',
}) => {
  // Coordenadas exactas: C.P. Tamanco (-5.794191, -74.283966) - Vista Satelital
  const mapUrl = 'https://maps.google.com/maps?q=-5.794191,-74.283966&hl=es&z=18&t=k&output=embed';
  const directLink = 'https://www.google.com/maps/search/?api=1&query=-5.794191,-74.283966';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[#090d14] border border-amber-500/30 shadow-xl ${className}`}
    >
      {/* Header / Info Badge */}
      <div className="p-3 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h4 className="text-xs font-bold text-white tracking-tight truncate">
              Cines Argón - C.P. Tamanco
            </h4>
            <p className="text-[10px] text-amber-300/80 font-mono truncate">
              -5.794191, -74.283966 • Emilio San Martín
            </p>
          </div>
        </div>


        <a
          href={directLink}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-lg text-[10px] font-bold text-amber-300 flex items-center gap-1 transition-all"
        >
          <Navigation className="w-3 h-3" />
          <span>Abrir Mapa</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      </div>


      {/* Embedded Map Frame */}
      <div className={`w-full relative ${compact ? 'h-36' : 'h-48 sm:h-56'}`}>
        <iframe
          title="Ubicación Cines Argón en Tamanco"
          src={mapUrl}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
        />

        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/85 backdrop-blur-md border border-slate-700 text-[9px] text-slate-300 font-mono pointer-events-none">
          📍 Sala física y presencial en Tamanco
        </div>
      </div>
    </div>
  );
};
