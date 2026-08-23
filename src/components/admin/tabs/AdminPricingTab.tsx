import React from 'react';
import { PricingTier } from '../../../core/types';
import { DollarSign, Check, CheckCircle2 } from 'lucide-react';

interface AdminPricingTabProps {
  pricing: PricingTier[];
  priceInputs: Record<string, string>;
  pricingSavedMessage: string;
  onPriceInputChange: (type: string, value: string) => void;
  onSavePrice: (type: string) => void;
  onSaveAllPrices: () => void;
  onResetStandardPricing: () => void;
}

export const AdminPricingTab: React.FC<AdminPricingTabProps> = ({
  pricing,
  priceInputs,
  pricingSavedMessage,
  onPriceInputChange,
  onSavePrice,
  onSaveAllPrices,
  onResetStandardPricing
}) => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Tarifas y Precios de Entrada</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configura el costo en Soles (S/.) para cada categoría de boleto en el sistema POS y web.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pricing.length === 0 && (
            <button
              onClick={onResetStandardPricing}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
            >
              Cargar Tarifas Estándar
            </button>
          )}

          <button
            onClick={onSaveAllPrices}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
          >
            <Check className="w-4 h-4" />
            <span>Guardar Todos los Precios</span>
          </button>
        </div>
      </div>

      {pricingSavedMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in font-bold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{pricingSavedMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pricing.map((tier) => (
          <div
            key={tier.type}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  {tier.type}
                </span>
                <span className="text-[10px] text-slate-400">
                  PEN (S/.)
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">{tier.label || tier.description}</h4>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono font-bold">S/.</span>
                <input
                  type="number"
                  step="0.50"
                  min="1"
                  value={priceInputs[tier.type] ?? tier.basePrice}
                  onChange={(e) => onPriceInputChange(tier.type, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white pl-9 pr-3 py-2 rounded-xl text-xs font-mono font-bold outline-none focus:border-emerald-400"
                />
              </div>

              <button
                onClick={() => onSavePrice(tier.type)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 border border-slate-700 hover:border-emerald-500/50 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                title="Actualizar este precio"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Actualizar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
