import React from 'react';
import { Room, Showtime } from '../../../core/types';
import { Tv, Plus, Edit2, Trash2, Users, Volume2, Calendar, Sparkles } from 'lucide-react';

interface AdminRoomsTabProps {
  rooms: Room[];
  showtimes: Showtime[];
  onOpenCreateRoom: () => void;
  onOpenEditRoom: (room: Room) => void;
  onDeleteRoom: (id: string, name: string) => void;
}

export const AdminRoomsTab: React.FC<AdminRoomsTabProps> = ({
  rooms,
  showtimes,
  onOpenCreateRoom,
  onOpenEditRoom,
  onDeleteRoom,
}) => {
  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Tv className="w-5 h-5 text-amber-400" />
            <span>Gestión de Salas & Espacios ({rooms.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configura el aforo de sillas, formato de pantalla y sistema de audio de tus salas
          </p>
        </div>

        <button
          onClick={onOpenCreateRoom}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Sala</span>
        </button>
      </div>

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <Tv className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No hay salas registradas</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Crea tu primera sala de proyección para comenzar a programar funciones y vender boletos.
          </p>
          <button
            onClick={onOpenCreateRoom}
            className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl font-black text-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Crear Sala</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const roomShowtimes = showtimes.filter((s) => s.roomId === room.id);

            return (
              <div
                key={room.id}
                className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Bar with Type & Capacity */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-[10px] rounded-lg tracking-wider uppercase">
                      {room.type}
                    </span>

                    <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{room.capacity} sillas</span>
                    </span>
                  </div>

                  {/* Room Name & ID */}
                  <div>
                    <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                      {room.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500">ID: {room.id}</span>
                  </div>

                  {/* Room Specs Info Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Acústica:
                      </span>
                      <strong className="text-white text-right truncate max-w-[150px]">
                        {room.soundSystem || 'Surround HD'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" /> Funciones:
                      </span>
                      <span className="font-mono text-slate-200 font-bold">
                        {roomShowtimes.length} programada{roomShowtimes.length === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenEditRoom(room)}
                    className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => onDeleteRoom(room.id, room.name)}
                    className="p-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 hover:border-rose-700 text-rose-400 hover:text-rose-200 rounded-xl text-xs font-bold transition-colors"
                    title="Eliminar Sala"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
