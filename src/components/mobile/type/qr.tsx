"use client";

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Scan, Loader2, QrCode, User } from 'lucide-react';
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

  // --- IMPERATIVE HANDLE: Allows parent component to control scanner lifecycle ---
  useImperativeHandle(ref, () => ({
    start: async () => {
      if (!cameraId) return;
      try {
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

  // --- VALIDATION PIPELINE: Decode QR -> Extract ID -> API Validation ---
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
    <div className="w-full h-full relative overflow-hidden">
      <div id="reader" className="w-full h-full absolute inset-0" />

      {!isCameraActive && !validating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-40 bg-transparent animate-in fade-in duration-500 pb-20">
          <div className="flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative flex items-center justify-center -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#151419] bg-[#1F1E23] flex items-center justify-center z-10 shadow-lg ar-float-loop" style={{ animationDelay: '0s' }}>
                  <User size={16} className="text-white/20" />
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-[#151419] bg-[#27272A] flex items-center justify-center z-20 scale-110 shadow-xl ar-float-loop" style={{ animationDelay: '0.2s' }}>
                  <QrCode size={20} className="text-white/60" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#151419] bg-[#1F1E23] flex items-center justify-center z-10 shadow-lg ar-float-loop" style={{ animationDelay: '0.4s' }}>
                  <User size={16} className="text-white/20" />
                </div>
              </div>
            </div>
            <h3 className="text-white font-semibold text-lg mb-1 tracking-tight">QR Scanner</h3>
            <p className="text-white/40 text-xs max-w-55 leading-relaxed text-center">
              Point the camera at the QR Code. <br />
              Press <span className="text-indigo-400 font-bold">Start Cam</span> to begin.
            </p>
          </div>
        </div>
      )}

      {validating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#151419]">
          <Loader2 size={48} className="animate-spin text-white" />
          <p className="text-xs mt-4 text-white font-mono tracking-widest uppercase opacity-80">Validating Data...</p>
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
