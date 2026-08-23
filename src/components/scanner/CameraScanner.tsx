import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, SwitchCamera, AlertCircle, RefreshCw } from 'lucide-react';

interface CameraScannerProps {
  active: boolean;
  onScanSuccess: (decodedText: string) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  active,
  onScanSuccess,
}) => {
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = 'argon-camera-scanner-region';

  useEffect(() => {
    // 1. Enumerate available video cameras
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Prefer back camera on mobile or default first camera
          const backCam = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('trasera') || d.label.toLowerCase().includes('environment'));
          setSelectedCameraId(backCam ? backCam.id : devices[0].id);
        } else {
          setError('No se detectaron cámaras en el dispositivo');
        }
      })
      .catch((err) => {
        setError('Permiso de cámara denegado o no soportado: ' + (err.message || err));
      });
  }, []);

  useEffect(() => {
    if (!active || !selectedCameraId) return;

    let isMounted = true;
    const scanner = new Html5Qrcode(regionId, {
      formatsToSupport: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.EAN_13,
      ],
      verbose: false,
    });
    scannerRef.current = scanner;

    const config = {
      fps: 15,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    scanner
      .start(
        selectedCameraId,
        config,
        (decodedText) => {
          if (isMounted) {
            onScanSuccess(decodedText);
          }
        },
        () => {
          // Ignore transient scan frame errors
        }
      )
      .then(() => {
        if (isMounted) setIsScanning(true);
      })
      .catch((err) => {
        if (isMounted) {
          setError('Error al iniciar la cámara: ' + (err.message || err));
          setIsScanning(false);
        }
      });

    return () => {
      isMounted = false;
      if (scanner.isScanning) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch((err) => console.error('Error stopping scanner:', err));
      } else {
        try {
          scanner.clear();
        } catch {}
      }
    };
  }, [active, selectedCameraId, onScanSuccess]);

  const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedCameraId(newId);
  };

  return (
    <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
      {/* Camera Selection Toolbar */}
      {cameras.length > 1 && (
        <div className="flex items-center justify-between gap-2 text-xs">
          <label className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
            <SwitchCamera className="w-3.5 h-3.5 text-cyan-400" />
            Cámara:
          </label>
          <select
            value={selectedCameraId}
            onChange={handleCameraChange}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            {cameras.map((cam) => (
              <option key={cam.id} value={cam.id}>
                {cam.label || `Cámara ${cam.id.slice(0, 5)}...`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Video Scanner Container */}
      <div className="relative overflow-hidden rounded-xl bg-black aspect-square max-w-[320px] mx-auto border border-slate-800 shadow-inner">
        <div id={regionId} className="w-full h-full" />

        {/* Laser Reticle Overlay */}
        {isScanning && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-cyan-400/80 rounded-2xl relative shadow-lg shadow-cyan-500/20">
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-300" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-300" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-300" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-300" />

              {/* Scanning Laser Animation */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse top-1/2 -translate-y-1/2 shadow-sm shadow-cyan-400" />
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] text-center text-slate-400">
        Alinee el código QR o código de barras del boleto dentro del visor
      </p>
    </div>
  );
};
