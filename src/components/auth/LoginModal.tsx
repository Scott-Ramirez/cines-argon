import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { Lock, User as UserIcon, KeyRound, ShieldCheck, X, AlertCircle, Loader2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Por favor ingrese su usuario');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authService.login(username, password);
      if (res.success) {
        setError('');
        setUsername('');
        setPassword('');
        onLoginSuccess();
        onClose();
      } else {
        setError(res.error || 'Credenciales incorrectas');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in no-print">
      
      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-[#0c1017] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-7 sm:p-8 space-y-6">

          {/* Header Brand */}
          <div className="text-center space-y-3">
            <div className="relative inline-block">
              <div className="w-16 h-16 mx-auto rounded-full ring-2 ring-amber-500/50 p-1 bg-slate-900 overflow-hidden shadow-xl shadow-amber-500/20">
                <img
                  src="/logo.png"
                  alt="Cines Argón"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center font-bold text-[10px] ring-2 ring-[#0c1017]">
                <Lock className="w-3 h-3" />
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black text-white tracking-wide font-sans">
                ACCESO AL SISTEMA
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Panel de administración y control operativo de Cines Argón
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4 pt-1">
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-amber-400" /> Usuario
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ej. admin"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>{loading ? 'AUTENTICANDO...' : 'INGRESAR AL SISTEMA'}</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
