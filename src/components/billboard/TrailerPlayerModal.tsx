import React from 'react';

interface TrailerPlayerModalProps {
  trailerUrl: string | null;
  onClose: () => void;
}

export const TrailerPlayerModal: React.FC<TrailerPlayerModalProps> = ({
  trailerUrl,
  onClose
}) => {
  if (!trailerUrl) return null;

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('embed/')) return url;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in"
    >

      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-black border border-slate-800 rounded-3xl overflow-hidden shadow-2xl aspect-video"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold backdrop-blur border border-slate-700 transition-colors"
        >
          ✕
        </button>
        <iframe
          src={getYouTubeEmbedUrl(trailerUrl)}
          title="Movie Trailer"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};
