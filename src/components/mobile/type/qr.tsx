"use client";

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Loader2, QrCode, User } from 'lucide-react';
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
  const [cameraId, setCameraId] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [validating, setValidating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [scanResult, setScanResult] = useState<AttendanceStatusResponse | undefined>(undefined);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useImperativeHandle(ref, () => ({
    start: async () => {
      if (!cameraId) return;
      try {
        // ELEMENT MUST EXIST IN DOM BEFORE THIS CALL
        const scanner = new Html5Qrcode('reader');
        html5QrCodeRef.current = scanner;

        await scanner.start(
          { deviceId: { exact: cameraId } },
          { fps: 20 },
          (text: string) => handleScanSuccess(text),
          () => { }
        );

        const v = document.querySelector('#reader video') as HTMLVideoElement;
        if (v) {
          v.style.objectFit = 'cover';
          v.style.width = '100%';
          v.style.height = '100%';
        }

        setIsCameraActive(true);
        if (onCamActive) onCamActive(true);

        setTimeout(() => {
          setScanning(true);
        }, 800);
      } catch (e) {
        console.error(e);
        toast.error("Failed to access the camera.");
      }
    },
    stop: async () => {
      try {
        if (html5QrCodeRef.current) {
          await html5QrCodeRef.current.stop();
          html5QrCodeRef.current.clear();
          html5QrCodeRef.current = null;
        }
        setIsCameraActive(false);
        setScanning(false);
        if (onCamActive) onCamActive(false);
      } catch (e) {
        console.error("Error stopping camera:", e);
      }
    },
    get isScanning() { return scanning; }
  }));

  useEffect(() => {
    (async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices?.length > 0) {
          const backCam = devices.find((d) => d.label.toLowerCase().includes('back')) || devices[0];
          setCameraId(backCam.id);
        }
      } catch { }
    })();
  }, []);

  const handleScanSuccess = async (decodedText: string) => {
    if (validating || showPopup) return;
    try {
      setValidating(true);
      let icode = decodedText;
      if (decodedText.startsWith('http') || decodedText.includes('://')) {
        const parts = decodedText.split('/');
        icode = parts[parts.length - 1] || icode;
      }
      try {
        const json = JSON.parse(decodedText);
        icode = json.i || json.icode || json.nis || icode;
      } catch { }

      const res = await fetch(`/api/student?icode=${icode}`);
      const jsonRes = await res.json();
      if (jsonRes.status !== 'success' || !jsonRes.data) throw new Error("Student data not found.");

      setScanResult({
        id: jsonRes.data.id_student.toString(),
        full_name: jsonRes.data.full_name,
        nis: jsonRes.data.nis,
        class_name: jsonRes.data.tbl_classes?.class_name || '-',
        status: 'success',
        message: 'Awaiting confirmation',
      });
      setValidating(false);
      setShowPopup(true);
    } catch (err: any) {
      toast.error("Scanning Failed", { description: err.message || "Invalid QR Code" });
      setValidating(false);
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#151419] flex flex-col items-center justify-center p-4 pb-32">

      {/* CAMERA WINDOW: Always in DOM but visually hidden when inactive */}
      <div className={`relative w-full max-w-md aspect-2/3 overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-black transition-all duration-500 ${isCameraActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div id="reader" className="w-full h-full absolute inset-0" />

        {/* Viewfinder Overlay - Only show when active */}
        {isCameraActive && !validating && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 rounded-none shadow-[0_0_0_9999px_rgba(21,20,25,0.6)]" />
              <div className="absolute inset-0 border border-zinc-500/30 rounded-none" />
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white rounded-none" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white rounded-none" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white rounded-none" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white rounded-none" />
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-300 to-transparent shadow-[0_0_8px_rgba(209,203,203,0.6)] animate-scan-line" />
            </div>
          </div>
        )}
      </div>

      {/* IDLE STATE: Rendered as an absolute overlay when camera is inactive */}
      {!isCameraActive && !validating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-40 bg-transparent animate-in fade-in duration-500 px-6 text-center pb-20">
          <style>{`
            @keyframes symmetry-float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
            }
            .animate-symmetry-float {
                animation: symmetry-float 4s ease-in-out infinite;
            }
          `}</style>
          <div className="flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-zinc-500/10 rounded-full blur-3xl" />
              <div className="relative flex items-center justify-center -space-x-3">
                {[
                    { icon: User, delay: '0s' },
                    { icon: QrCode, delay: '0.2s' },
                    { icon: User, delay: '0.4s' }
                ].map((item, i) => (
                    <div 
                        key={i}
                        className={`relative w-12 h-12 rounded-full bg-zinc-800 border border-black flex items-center justify-center shadow-xl animate-symmetry-float overflow-hidden transition-all ${i === 1 ? 'z-20 scale-110' : 'z-10 scale-80'}`}
                        style={{ animationDelay: item.delay }}
                    >
                        <item.icon size={20} className="text-zinc-400 relative z-10" />
                    </div>
                ))}
              </div>
            </div>
            <h3 className="text-white font-semibold text-lg mb-1 tracking-tight">QR Scanner</h3>
            <p className="text-white/40 text-xs max-w-xs leading-relaxed">
              Point the camera at the QR Code. <br />
              Press <span className="text-indigo-400 font-bold">Start Cam</span> to begin.
            </p>
          </div>
        </div>
      )}

      {/* VALIDATING STATE */}
      {validating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#151419]/90 backdrop-blur-sm">
          <Loader2 size={40} className="animate-spin text-white" />
          <p className="text-[10px] mt-3 text-white font-mono tracking-widest uppercase opacity-80">Validating Data...</p>
        </div>
      )}

      <Alert
        isOpen={showPopup}
        absensiStatus={scanResult}
        setOpen={setShowPopup}
        sholatTime={sholat as unknown as string}
        onScanUlang={() => {
          setShowPopup(false);
        }}
        initialStatus="idle"
      />
    </div>
  );
});

Qr.displayName = 'Qr';
export default Qr;