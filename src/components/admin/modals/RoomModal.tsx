import React, { useState, useEffect } from 'react';
import { Room, RoomType } from '../../../core/types';
import { Tv, X, Save, Volume2, Users, Layers, ShieldCheck } from 'lucide-react';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Room) => Promise<void> | void;
  initialRoom?: Partial<Room>;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRoom,
}) => {
  const [formData, setFormData] = useState<Partial<Room>>({
    name: '',
    type: '2D Estándar',
    capacity: 25,
    soundSystem: 'Surround 7.1 HD Multicanal',
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      if (initialRoom && initialRoom.id) {
        setFormData({
          id: initialRoom.id,
          name: initialRoom.name || '',
          type: initialRoom.type || '2D Estándar',
          capacity: initialRoom.capacity || 25,
          soundSystem: initialRoom.soundSystem || 'Surround 7.1 HD Multicanal',
        });
      } else {
        setFormData({
          name: '',
          type: '2D Estándar',
          capacity: 25,
          soundSystem: 'Surround 7.1 HD Multicanal',
        });
      }
    }
  }, [isOpen, initialRoom]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Por favor ingresa un nombre para la sala');
      return;
    }

    if (!formData.capacity || formData.capacity <= 0) {
      alert('Por favor ingresa una capacidad válida mayor a 0');
      return;
    }

    setIsSaving(true);
    try {
      const roomToSave: Room = {
        id: formData.id || `room-${Date.now()}`,
        name: formData.name.trim(),
        type: (formData.type as RoomType) || '2D Estándar',
        capacity: Number(formData.capacity) || 25,
        soundSystem: formData.soundSystem?.trim() || 'Surround HD',
      };
      await onSave(roomToSave);
      onClose();
    } catch (err: any) {
      alert('Error al guardar la sala: ' + (err.message || 'Error desconocido'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in text-slate-100">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#0c1017] border border-slate-700/80 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-in"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {formData.id ? 'Editar Sala de Cine' : 'Nueva Sala de Cine'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Configura los parámetros de proyección, aforo y acústica
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Nombre de la Sala */}
          <div>
            <label className="text-slate-300 font-bold block mb-1.5 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-amber-400" /> Nombre de la Sala *
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. Sala 1 - Principal Tamanco"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Formato / Tipo de Sala */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-bold block mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Formato / Tipo
              </label>
              <select
                value={formData.type || '2D Estándar'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as RoomType })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="2D Estándar">2D Estándar (Home Cinema)</option>
                <option value="3D Dolby">3D Dolby</option>
                <option value="VIP Premium">VIP Premium</option>
                <option value="IMAX Laser">IMAX Laser</option>
              </select>
            </div>

            {/* Capacidad / Cantidad de Sillas */}
            <div>
              <label className="text-slate-300 font-bold block mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> Capacidad (Sillas) *
              </label>
              <input
                type="number"
                min="1"
                max="500"
                required
                value={formData.capacity || 25}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Sistema de Sonido Acústico */}
          <div>
            <label className="text-slate-300 font-bold block mb-1.5 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" /> Sistema Acústico / Sonido
            </label>
            <input
              type="text"
              value={formData.soundSystem || ''}
              onChange={(e) => setFormData({ ...formData, soundSystem: e.target.value })}
              placeholder="Ej. Surround 7.1 HD Multicanal / Dolby Atmos"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Info Card */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> Configuración de Taquilla
            </div>
            <p>
              Las funciones programadas en esta sala utilizarán automáticamente la capacidad de <strong>{formData.capacity || 25} sillas</strong> para el control de aforo y venta de boletos.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Sala'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
