'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { Scan, Loader2, Maximize2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AttendanceStatusResponse, DailyPrayer } from '@/types/api';
import { Alert } from '../popups/alert';

interface QrProps {
  sholat: DailyPrayer;
  onCamActive?: (isActive: boolean) => void;
}

export interface QrHandle {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  isScanning: boolean;
}

const Qr = forwardRef<QrHandle, QrProps>(({ sholat, onCamActive }, ref) => {
  const qrRef = useRef<Html5Qrcode | null>(null);
  const [cameraId, setCameraId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [validating, setValidating] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [scanResult, setScanResult] = useState<AttendanceStatusResponse | undefined>(undefined);

  // EXPOSE CONTROL TO MANAGER (Symmetry & Control)
  useImperativeHandle(ref, () => ({
    start: async () => {
      if (!cameraId) return;
      if (qrRef.current) { try { await qrRef.current.stop(); qrRef.current.clear(); } catch { } }

      const html5QrCode = new Html5Qrcode('reader');
      qrRef.current = html5QrCode;

      try {
        await html5QrCode.start({ deviceId: { exact: cameraId } }, { fps: 20 }, onScan, () => { });
        setScanning(true);
        setPermissionError(false);
        if (onCamActive) onCamActive(true);

        // Force video to cover screen perfectly
        setTimeout(() => {
          const v = document.querySelector('#reader video') as HTMLVideoElement;
          if (v) {
            v.style.objectFit = 'cover';
            v.style.width = '100%';
            v.style.height = '100%';
            v.style.transform = 'scale(1.05)'; // Slight scale to remove black edges
          }
        }, 300);
      } catch {
        setPermissionError(true);
        toast.error("Gagal membuka kamera");
      }
    },
    stop: async () => {
      try {
        if (qrRef.current?.isScanning) {
          await qrRef.current.stop();
          qrRef.current.clear();
        }
      } catch { }
      setScanning(false);
      if (onCamActive) onCamActive(false);
    },
    get isScanning() { return scanning; }
  }));

  useEffect(() => {
    let isMounted = true;
    const initCamera = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!isMounted) return;
        if (devices && devices.length > 0) {
          const backCam = devices.find((d) => d.label.toLowerCase().includes('back')) || devices[0];
          setCameraId(backCam.id);
        } else {
          setPermissionError(true);
        }
      } catch {
        if (isMounted) setPermissionError(true);
      }
    };
    initCamera();
    return () => {
      isMounted = false;
      if (qrRef.current?.isScanning) qrRef.current.stop().catch(() => { }).then(() => qrRef.current?.clear());
    };
  }, []);

  const onScan = async (decodedText: string) => {
    if (validating || showPopup) return;
    try {
      await qrRef.current?.pause(true);
      setValidating(true);
      let icode = decodedText;

      if (decodedText.startsWith('http') || decodedText.includes('://')) {
        const parts = decodedText.split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart) icode = lastPart;
      }
      try {
        const json = JSON.parse(decodedText);
        icode = json.i || json.icode || json.nis || icode;
      } catch { }

      const res = await fetch(`/api/student?icode=${icode}`);
      const jsonRes = await res.json();

      if (jsonRes.status !== 'success' || !jsonRes.data) throw new Error("Data siswi tidak ditemukan.");
      const student = jsonRes.data;
      setScanResult({
        id: student.id_student.toString(),
        full_name: student.full_name,
        nis: student.nis,
        class_name: student.tbl_classes?.class_name || '-',
        status: 'success',
        message: 'Menunggu konfirmasi',
      });
      setValidating(false);
      setShowPopup(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "QR Gagal";
      toast.error("Gagal", { description: msg });
      setValidating(false);
      setTimeout(() => {
        try { if (qrRef.current?.getState() === Html5QrcodeScannerState.PAUSED) qrRef.current.resume(); } catch { }
      }, 1500);
    }
  };

  const handleScanUlang = () => {
    setShowPopup(false);
    setTimeout(() => {
      try { if (qrRef.current?.getState() === Html5QrcodeScannerState.PAUSED) qrRef.current.resume(); } catch { }
    }, 300);
  };

  return (
    <div className="w-full h-full relative bg-black">
      {/* CAMERA VIEWER - Pure Full Screen */}
      <div id="reader" className="w-full h-full absolute inset-0" />

      {/* SCAN FRAME - Luxe & Minimalist */}
      {scanning && !validating && !showPopup && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br-2xl"></div>
            {/* Subtle center glow */}
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] rounded-3xl" />
          </div>
        </div>
      )}

      {/* STANDBY STATE - Luxury Minimalist */}
      {!scanning && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-40 bg-black/40 backdrop-blur-sm transition-all duration-500">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
            <Maximize2 size={60} strokeWidth={1} className="text-white/60 relative z-10" />
          </div>
          <p className="text-xs font-medium text-white/40 tracking-widest uppercase">Scanner Standby</p>
          <p className="text-[10px] text-white/20 mt-1">Ready to capture QR code</p>
        </div>
      )}

      {/* VALIDATING STATE */}
      {validating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/60 backdrop-blur-md">
          <Loader2 size={48} className="animate-spin text-indigo-400" />
          <p className="text-xs mt-4 text-white font-mono tracking-widest uppercase opacity-80">Validating Data...</p>
        </div>
      )}

      {/* RESULT POPUP */}
      <Alert
        isOpen={showPopup}
        absensiStatus={scanResult}
        setOpen={setShowPopup}
        sholatTime={sholat as unknown as string}
        onScanUlang={handleScanUlang}
        initialStatus="idle"
      />
    </div>
  );
});

Qr.displayName = 'Qr';
export default Qr;