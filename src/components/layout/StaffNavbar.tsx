import React from 'react';
import { User, UserRole } from '../../core/types';
import { Ticket, ScanLine, Settings, LogOut, Eye, ShieldCheck, User as UserIcon, Sparkles } from 'lucide-react';

export type StaffTab = 'pos' | 'validator' | 'admin' | 'public_preview';

interface StaffNavbarProps {
  currentUser: User;
  activeStaffTab: StaffTab;
  onStaffTabChange: (tab: StaffTab) => void;
  onLogout: () => void;
  onViewPublic: () => void;
}

export const StaffNavbar: React.FC<StaffNavbarProps> = ({
  currentUser,
  activeStaffTab,
  onStaffTabChange,
  onLogout,
  onViewPublic,
}) => {

  const getAvailableTabs = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return [
          {
            id: 'pos' as StaffTab,
            label: 'Taquilla (POS)',
            sub: 'Venta & Boletos',
            icon: Ticket,
            color: 'text-emerald-400 border-emerald-500 bg-emerald-500/10',
          },
          {
            id: 'validator' as StaffTab,
            label: 'Control de Acceso',
            sub: 'Portería & Escáner',
            icon: ScanLine,
            color: 'text-cyan-400 border-cyan-500 bg-cyan-500/10',
          },
          {
            id: 'admin' as StaffTab,
            label: 'Administración',
            sub: 'Películas, salas y precios',
            icon: Settings,
            color: 'text-amber-400 border-amber-500 bg-amber-500/10',
          },
        ];
      case 'CASHIER':
        return [
          {
            id: 'pos' as StaffTab,
            label: 'Taquilla (POS)',
            sub: 'Venta de boletos e impresión',
            icon: Ticket,
            color: 'text-emerald-400 border-emerald-500 bg-emerald-500/10',
          },
        ];
      case 'PORTER':
        return [
          {
            id: 'validator' as StaffTab,
            label: 'Control de Acceso',
            sub: 'Validación de tickets y aforo',
            icon: ScanLine,
            color: 'text-cyan-400 border-cyan-500 bg-cyan-500/10',
          },
        ];
    }
  };

  const tabs = getAvailableTabs(currentUser.role);

  return (
    <div className="bg-[#0b0e17] border-b border-slate-800 shadow-xl no-print">
      
      {/* Top Operations Header Bar */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          
          {/* Logo & Operational System Tag */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full ring-2 ring-amber-500/40 p-0.5 bg-slate-900 overflow-hidden">
              <img src="/logo.png" alt="Cines Argón" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-slate-200 font-mono">
                SISTEMA OPERATIVO INTRANET
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                SESIÓN ACTIVA
              </span>
            </div>
          </div>

          {/* User Profile Info & Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* User Badge */}
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-white leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <span className="text-amber-400 font-bold">
                    {currentUser.role === 'ADMIN' ? 'Admin' : currentUser.role === 'CASHIER' ? 'Taquilla' : 'Portería'}
                  </span>
                  • {currentUser.assignedTerminal || 'Terminal 1'}
                </div>
              </div>
            </div>

            {/* View Public Billboard Button */}
            <button
              onClick={onViewPublic}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Ver cómo ven los clientes la cartelera"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Ver Cartelera Pública</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-400 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Cerrar sesión de personal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>

          </div>

        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeStaffTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onStaffTabChange(tab.id)}
                className={`px-5 py-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2.5 shadow-sm ${
                  isActive
                    ? tab.color + ' shadow-md'
                    : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                <div className="text-left">
                  <div className="text-xs font-black">{tab.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{tab.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
