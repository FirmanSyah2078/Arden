'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { Scan, Loader2, Maximize2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AttendanceStatusResponse, DailyPrayer } from '@/types/api';
import { Alert } from '../popups/alert'; 

interface QrProps {
  sholat: DailyPrayer;
  onCamActive?: (isActive: boolean) => void;
}

export default function Qr({ sholat, onCamActive }: QrProps) {
  const qrRef = useRef<Html5Qrcode | null>(null);
  const [cameraId, setCameraId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [validating, setValidating] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [scanResult, setScanResult] = useState<AttendanceStatusResponse | undefined>(undefined);

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

  const start = async () => {
    if (!cameraId) return;
    if (qrRef.current) { try { await qrRef.current.stop(); qrRef.current.clear(); } catch { } }
    const html5QrCode = new Html5Qrcode('reader');
    qrRef.current = html5QrCode;
    try {
      await html5QrCode.start({ deviceId: { exact: cameraId } }, { fps: 20 }, onScan, () => { });
      setScanning(true);
      setPermissionError(false);
      if (onCamActive) onCamActive(true);
      setTimeout(() => {
        const v = document.querySelector('#reader video') as HTMLVideoElement;
        if (v) { v.style.objectFit = 'cover'; v.style.width = '100%'; v.style.height = '100%'; v.style.transform = 'scale(1.02)'; }
      }, 300);
    } catch {
      setPermissionError(true);
      toast.error("Gagal membuka kamera");
    }
  };

  const stop = async () => {
    try { if (qrRef.current?.isScanning) { await qrRef.current.stop(); qrRef.current.clear(); } } catch { }
    setScanning(false);
    if (onCamActive) onCamActive(false);
  };

  return (
    <div className="w-full h-full relative">
      <div id="reader" className="w-full h-full" />
      {scanning && !validating && !showPopup && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 relative">
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white/90 rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white/90 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white/90 rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white/90 rounded-br-3xl"></div>
          </div>
        </div>
      )}
      {!scanning && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-40">
          <div className="relative mb-6"><div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-2xl"></div><Maximize2 size={64} strokeWidth={1} className="text-white/80 relative z-10" /></div>
          <p className="text-xs text-white/40 mt-2">Scanner standby</p>
        </div>
      )}
      {validating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50"><Loader2 size={48} className="animate-spin text-green-500" /><p className="text-xs mt-2 text-white font-mono">MEMERIKSA...</p></div>
      )}
      <div className="absolute bottom-8 w-full flex justify-center z-50">
        <button onClick={scanning ? stop : start} disabled={validating || showPopup} className={`w-14 h-14 rounded-full backdrop-blur-md border-2 transition-all duration-300 flex items-center justify-center ${permissionError ? 'border-red-500 text-red-500 bg-red-500/10' : scanning ? 'border-green-500 text-white' : 'border-white/20 text-white hover:border-white/50 bg-white/5'}`}>
          {permissionError ? <AlertCircle /> : <Scan />}
        </button>
      </div>

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
}