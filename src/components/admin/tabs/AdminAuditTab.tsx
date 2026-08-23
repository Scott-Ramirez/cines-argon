import React from 'react';
import { Sale } from '../../../core/types';
import { BarChart3 } from 'lucide-react';

interface AdminAuditTabProps {
  sales: Sale[];
}

export const AdminAuditTab: React.FC<AdminAuditTabProps> = ({ sales }) => {
  const totalRevenue = sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
  const totalTickets = sales.reduce((acc, s) => acc + (s.totalTickets || s.ticketIds?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Auditoría de Ventas e Ingresos de Taquilla</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro histórico de transacciones, tickets emitidos y montos recaudados.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-[11px] text-slate-400 font-mono uppercase">Ventas Totales</span>
          <p className="text-2xl font-black text-white font-mono">{sales.length}</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-[11px] text-slate-400 font-mono uppercase">Boletos Emitidos</span>
          <p className="text-2xl font-black text-amber-400 font-mono">{totalTickets}</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-[11px] text-slate-400 font-mono uppercase">Recaudación Total</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">S/. {totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Transactions Table */}
      {sales.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800 space-y-3">
          <BarChart3 className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No hay ventas registradas</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Las ventas procesadas en el módulo POS aparecerán automáticamente en esta tabla de auditoría.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3.5">ID Transacción</th>
                  <th className="p-3.5">Fecha / Hora</th>
                  <th className="p-3.5">Película</th>
                  <th className="p-3.5">Cajero</th>
                  <th className="p-3.5 text-center">Boletos</th>
                  <th className="p-3.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono text-[11px] text-slate-400">
                      {sale.id.slice(0, 8)}...
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">
                      {new Date(sale.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3.5 font-semibold text-white">
                      {sale.movieTitle || 'Función de Cine'}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-mono text-[10px]">
                        {sale.cashierName || 'Cajero'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold">
                      {sale.totalTickets || sale.ticketIds?.length || 1}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                      S/. {sale.totalAmount.toFixed(2)}
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
