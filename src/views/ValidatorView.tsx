import React, { useState, useEffect, useRef } from 'react';
import { Ticket, ScanLog, ScanResult } from '../core/types';
import { cinemaStorage } from '../services/storage/cinemaStorage';
import { ticketService } from '../services/ticketService';
import { useUsbScanner } from '../services/scannerService';
import { CameraScanner } from '../components/scanner/CameraScanner';
import { ScanLine, CheckCircle2, XCircle, AlertTriangle, QrCode, Keyboard, Camera, RefreshCw, History, ShieldCheck, UserCheck } from 'lucide-react';

export const ValidatorView: React.FC = () => {
  const [manualCode, setManualCode] = useState<string>('');
  const [lastScanResult, setLastScanResult] = useState<ScanResult | null>(null);
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
  const [useCamera, setUseCamera] = useState<boolean>(false);
  const [todayValidatedCount, setTodayValidatedCount] = useState<number>(0);
  const [totalIssuedCount, setTotalIssuedCount] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadData = () => {
    const logs = cinemaStorage.getScanLogs();
    const tickets = cinemaStorage.getTickets();
    setScanLogs(logs);
    setTodayValidatedCount(tickets.filter(t => t.status === 'USED').length);
    setTotalIssuedCount(tickets.length);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('argon_storage_update', loadData);
    return () => window.removeEventListener('argon_storage_update', loadData);
  }, []);

  // Process any scanned string (from USB scanner, camera or manual input)
  const handleProcessScan = async (rawCode: string, scanType: 'USB_SCANNER' | 'CAMERA' | 'MANUAL' = 'USB_SCANNER') => {
    if (!rawCode) return;
    const result = await ticketService.validateTicket(rawCode, scanType);
    setLastScanResult(result);
    setManualCode('');
  };

  // USB Barcode/QR Scanner Hook (intercepts rapid keystrokes automatically)
  useUsbScanner((code) => {
    handleProcessScan(code, 'USB_SCANNER');
  }, true);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleProcessScan(manualCode.trim(), 'MANUAL');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 p-4 lg:p-8 animate-fade-in no-print">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ScanLine className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white font-sans flex items-center gap-2">
                CONTROL DE ACCESO & PORTERÍA
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> EN VIVO
                </span>
              </h1>
              <p className="text-xs text-slate-400">Validación instantánea con lector USB, cámara web o código manual</p>
            </div>
          </div>

          {/* Live Attendance Stats Counter */}
          <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
            <div className="text-right px-2">
              <span className="text-[10px] text-slate-400 block font-mono">INGRESADOS HOY</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {todayValidatedCount} / {totalIssuedCount}
              </span>
            </div>
          </div>
        </div>

        {/* Big Live Scan Result Status Board */}
        <div className="relative">
          {lastScanResult ? (
            <div
              className={`p-6 sm:p-8 rounded-3xl border-2 shadow-2xl transition-all duration-300 animate-slide-up flex flex-col md:flex-row items-center justify-between gap-6 ${
                lastScanResult.success
                  ? 'bg-emerald-950/50 border-emerald-500/80 shadow-emerald-500/20'
                  : lastScanResult.reason.includes('YA UTILIZADO')
                  ? 'bg-rose-950/60 border-rose-500/80 shadow-rose-500/20'
                  : 'bg-amber-950/50 border-amber-500/80 shadow-amber-500/20'
              }`}
            >
              {/* Status Icon & Main Title */}
              <div className="flex items-center gap-5 text-center md:text-left">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                    lastScanResult.success
                      ? 'bg-emerald-500 text-slate-950'
                      : lastScanResult.reason.includes('YA UTILIZADO')
                      ? 'bg-rose-600 text-white animate-bounce'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {lastScanResult.success ? (
                    <CheckCircle2 className="w-12 h-12" />
                  ) : lastScanResult.reason.includes('YA UTILIZADO') ? (
                    <XCircle className="w-12 h-12" />
                  ) : (
                    <AlertTriangle className="w-12 h-12" />
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
                    Resultado del Escaneo ({lastScanResult.timestamp}):
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white">
                    {lastScanResult.reason}
                  </h2>
                  {lastScanResult.ticket && (
                    <p className="text-sm font-medium text-slate-200">
                      Película: <strong className="text-white">{lastScanResult.ticket.movieTitle}</strong> • {lastScanResult.ticket.roomName} ({lastScanResult.ticket.showtimeHour})
                    </p>
                  )}
                </div>
              </div>

              {/* Ticket Details Pill */}
              {lastScanResult.ticket && (
                <div className="bg-slate-950/80 border border-slate-700/60 p-4 rounded-2xl text-left space-y-1.5 font-mono text-xs shrink-0 w-full md:w-64">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ticket ID:</span>
                    <span className="text-amber-400 font-bold">{lastScanResult.ticket.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tipo:</span>
                    <span className="text-white">{lastScanResult.ticket.ticketType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Importe:</span>
                    <span className="text-emerald-400 font-bold">S/. {lastScanResult.ticket.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Método Escaneo:</span>
                    <span className="text-slate-300 font-semibold">{lastScanResult.scanType}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Idle Ready Banner */
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white font-sans">Listo para escanear</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Dispare su pistola lectora USB / Bluetooth o active la cámara para validar las entradas de los asistentes.
              </p>
            </div>
          )}
        </div>

        {/* Input Controls Grid (USB Auto / Camera Toggle / Manual Entry) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* LEFT 6-COLS: Manual Entry & Camera Switcher */}
          <div className="md:col-span-6 space-y-4">
            
            {/* Manual Code Input Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-amber-400" />
                  Ingreso Manual de Código
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Respaldo si el QR está dañado</span>
              </div>

              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ej: TKT-A8X9-1 o código de barras..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 text-sm font-mono text-white px-4 py-2.5 rounded-xl outline-none focus:border-amber-400 placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Validar
                </button>
              </form>
            </div>

            {/* Camera Scanner Toggle Button */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>Escáner de Cámara Web / Celular</span>
                </div>
                <button
                  onClick={() => setUseCamera(!useCamera)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    useCamera ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  {useCamera ? 'Apagar Cámara' : 'Encender Cámara'}
                </button>
              </div>

              {useCamera && (
                <CameraScanner
                  active={useCamera}
                  onScanSuccess={(decoded: string) => handleProcessScan(decoded, 'CAMERA')}
                />
              )}
            </div>

          </div>

          {/* RIGHT 6-COLS: Real-time Scan Log / Audit Table */}
          <div className="md:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                Historial de Escaneos Recientes
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Últimos accesos</span>
            </div>

            <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
              {scanLogs.length > 0 ? (
                scanLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          log.result === 'VALID'
                            ? 'bg-emerald-400'
                            : log.result === 'ALREADY_USED'
                            ? 'bg-rose-500'
                            : 'bg-amber-400'
                        }`}
                      />
                      <div>
                        <span className="font-mono font-bold text-white block">{log.ticketId}</span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {log.movieTitle || log.message}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                          log.result === 'VALID'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : log.result === 'ALREADY_USED'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {log.result}
                      </span>
                      <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic text-center py-6">
                  No hay registros de escaneo aún en esta sesión.
                </p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
