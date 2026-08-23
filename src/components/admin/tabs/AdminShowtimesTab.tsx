import React from 'react';
import { Showtime, Movie, Room } from '../../../core/types';
import { Clock, Plus, Trash2 } from 'lucide-react';

interface AdminShowtimesTabProps {
  showtimes: Showtime[];
  movies: Movie[];
  rooms: Room[];
  onOpenCreate: () => void;
  onDelete: (showtimeId: string) => void;
}

export const AdminShowtimesTab: React.FC<AdminShowtimesTabProps> = ({
  showtimes,
  movies,
  rooms,
  onOpenCreate,
  onDelete
}) => {
  const getMovieTitle = (movieId: string) => {
    const m = movies.find(movie => movie.id === movieId);
    return m ? m.title : 'Película eliminada';
  };

  const getRoomName = (roomId: string) => {
    const r = rooms.find(room => room.id === roomId);
    return r ? `${r.name} (${r.type})` : 'Sala Principal';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Programación de Funciones y Horarios</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Asigna películas a las salas, define fecha y horarios de proyección.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Función</span>
        </button>
      </div>

      {showtimes.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800 space-y-3">
          <Clock className="w-10 h-10 text-amber-400/40 mx-auto" />
          <h4 className="text-base font-bold text-white">No hay funciones programadas</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Programa tu primera función seleccionando una película de la cartelera y una hora de inicio.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Película</th>
                  <th className="p-3.5">Sala</th>
                  <th className="p-3.5">Fecha</th>
                  <th className="p-3.5">Horario</th>
                  <th className="p-3.5 text-center">Butacas Disp.</th>
                  <th className="p-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {showtimes.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-white">
                      {getMovieTitle(st.movieId)}
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {getRoomName(st.roomId)}
                    </td>
                    <td className="p-3.5 font-mono text-amber-400">
                      {st.date}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-white">
                      {st.startTime} {st.endTime ? `- ${st.endTime}` : ''}
                    </td>
                    <td className="p-3.5 text-center font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        {st.availableSeats} disp.
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onDelete(st.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                        title="Eliminar función"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
