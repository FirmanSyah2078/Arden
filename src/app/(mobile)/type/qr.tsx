"use client";

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Loader2, QrCode, Camera, X } from 'lucide-react';
import { toast } from 'sonner';
import { AttendanceStatusResponse, DailyPrayer } from '@/types/api';
import { Alert } from '@/components/mobile/popups/alert';
import { searchStudentCache } from "@/lib/offline/student-cache"

interface QrProps {
  sholat: DailyPrayer;
  onCamActive?: (isActive: boolean) => void;
  onCamAction?: () => void;
}

export interface QrHandle {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  isScanning: boolean;
}

const Qr = forwardRef<QrHandle, QrProps>(({ sholat, onCamActive, onCamAction }, ref) => {
  const [cameraId, setCameraId] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [validating, setValidating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [scanResult, setScanResult] = useState<AttendanceStatusResponse | undefined>(undefined);
  const [camError, setCamError] = useState(false);
  const isProcessingRef = useRef(false);


  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isTransitioning = useRef(false);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const startCamera = async () => {
    if (isTransitioning.current) return;
    setCamError(false);
    isTransitioning.current = true;

    try {
      const scanner = new Html5Qrcode('reader');
      html5QrCodeRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
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
    } catch (e: any) {
      if (e?.name === 'AbortError' || e?.message?.includes('aborted')) {
        console.warn("Symmetry Info: Camera start aborted by user agent (spam protection)");
        return;
      }
      console.error("Symmetry Error: Camera start failed", e);
      try {
        const scanner = new Html5Qrcode('reader');
        html5QrCodeRef.current = scanner;
        await scanner.start(
          { facingMode: "user" },
          { fps: 20 },
          (text: string) => handleScanSuccess(text),
          () => { }
        );
        setIsCameraActive(true);
        if (onCamActive) onCamActive(true);
        setTimeout(() => {
          setScanning(true);
        }, 800);
      } catch (fallbackErr: any) {
        if (fallbackErr?.name !== 'AbortError') {
          toast.error("Camera Access Denied", {
            description: "Please enable camera permissions in your browser settings."
          });
          setCamError(true);
        }
      }
    } finally {
      await sleep(300);
      isTransitioning.current = false;
    }
  };

  const stopCamera = async () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    try {
      if (html5QrCodeRef.current) {
        const scanner = html5QrCodeRef.current;
        html5QrCodeRef.current = null;
        try {
          await scanner.stop();
          await scanner.clear();
        } catch (stopErr: any) {
          if (stopErr?.name !== 'AbortError') {
            console.warn("Symmetry Warn: Camera stop failed", stopErr);
          }
        }
      }
      setIsCameraActive(false);
      setScanning(false);
      if (onCamActive) onCamActive(false);
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        console.error("Symmetry Error: Camera stop failed", e);
      }
    } finally {
      await sleep(300);
      isTransitioning.current = false;
    }
  };

  useImperativeHandle(ref, () => ({
    start: startCamera,
    stop: stopCamera,
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
    return () => {
      stopCamera();
    };
  }, []);

  const handleScanSuccess = async (decodedText: string) => {
    if (isProcessingRef.current || showPopup) return;

    // HARD LOCK: Kunci instan secara sinkron
    isProcessingRef.current = true;
    setValidating(true);

    try {
      let icode = decodedText;
      if (decodedText.startsWith('http') || decodedText.includes('://')) {
        const parts = decodedText.split('/');
        icode = parts[parts.length - 1] || icode;
      }
      try {
        const json = JSON.parse(decodedText);
        icode = json.i || json.icode || json.nis || icode;
      } catch { }

      let student: {
        id_student: string | number
        full_name: string
        nis: string
        class_name?: string
        icode: string
      } | null = null

      try {
        const res = await fetch(`/api/student?icode=${icode.trim()}`)
        const jsonRes = await res.json()

        if (res.ok && jsonRes.status === "success" && jsonRes.data) {
          student = {
            id_student: jsonRes.data.id_student,
            full_name: jsonRes.data.full_name,
            nis: jsonRes.data.nis,
            class_name: jsonRes.data.tbl_classes?.class_name || "-",
            icode: jsonRes.data.icode || icode.trim(),
          }
        } else {
          const cachedStudents = searchStudentCache(icode.trim())
          student = cachedStudents[0] || null
        }
      } catch {
        const cachedStudents = searchStudentCache(icode.trim())
        student = cachedStudents[0] || null
      }

      if (!student) {
        throw new Error("Student data not found.")
      }

      setScanResult({
        id: student.id_student.toString(),
        full_name: student.full_name,
        nis: student.nis,
        class_name: student.class_name || "-",
        status: "success",
        message: "Awaiting confirmation",
        icode: student.icode,
      })

      setValidating(false);
      setShowPopup(true);
      // Catatan: isProcessingRef tetap TRUE karena popup muncul, mencegah scan di background
    } catch (err: any) {
      toast.error("Scanning Failed", { description: err.message || "Invalid QR Code" });
      setValidating(false);

      // COOLDOWN: Buka kunci setelah 2 detik agar tidak spamming
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 2000);
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#151419] flex flex-col items-center justify-center p-4">
      <style>{`
        @keyframes qr-scan-line {
            0%, 100% { top: 14%; opacity: 0.9; }
            50% { top: 80%; opacity: 0.5; }
        }
        .animate-qr-scan-line {
            animation: qr-scan-line 2.4s ease-in-out infinite;
        }
      `}</style>
      <div className={`relative w-full max-w-md aspect-2/3 overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-black transition-all duration-180 ease-out ${isCameraActive ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div id="reader" className="w-full h-full absolute inset-0" />
        {isCameraActive && !validating && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 rounded-none shadow-[0_0_0_9999px_rgba(21,20,25,0.6)]" />
              <div className="absolute inset-0 border border-zinc-500/30 rounded-none" />
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white rounded-none" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white rounded-none" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white rounded-none" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white rounded-none" />
              <div className="animate-qr-scan-line absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-300 to-transparent shadow-[0_0_8px_rgba(209,203,203,0.6)]" />
            </div>
          </div>
        )}
      </div>

      {!isCameraActive && !validating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-40 bg-transparent pointer-events-none animate-in fade-in duration-180 ease-out px-6 text-center">
          <div className="flex flex-col items-center justify-center">
            {/* Scan frame dengan garis scan bergerak */}
            <div className="relative mb-8 h-24 w-24 animate-in fade-in zoom-in-95 duration-180 fill-mode-both" style={{ animationDelay: '0ms' }}>
              <div className="absolute left-0 top-0 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-indigo-500" />
              <div className="absolute right-0 top-0 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-indigo-500" />
              <div className="absolute bottom-0 left-0 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-indigo-500" />
              <div className="absolute bottom-0 right-0 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-indigo-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Mini kartu siswi: kotak QR + identitas */}
                <div className="flex h-12 w-18.5 items-center gap-2 rounded-lg border border-white/10 bg-[#27272A] px-2 shadow-inner">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#1F1E23]">
                    <QrCode size={16} className="text-zinc-400" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="h-1.5 w-full rounded-full bg-zinc-600" />
                    <div className="h-1.5 w-2/3 rounded-full bg-zinc-700" />
                  </div>
                </div>
              </div>
              <div className="animate-qr-scan-line absolute left-3 right-3 h-0.5 rounded-full bg-indigo-500/80" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2 tracking-tight animate-in fade-in zoom-in-95 duration-180 fill-mode-both" style={{ animationDelay: '150ms' }}>Scan Student Card</h3>
            <p className="text-white/40 text-xs max-w-55 leading-relaxed font-medium animate-in fade-in zoom-in-95 duration-180 fill-mode-both" style={{ animationDelay: '300ms' }}>
              Tap the <span className="text-indigo-400 font-bold">camera button</span> to turn on the camera.
            </p>
          </div>
        </div>
      )}

      {/* Floating camera button — solid material, no blur */}
      {!validating && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom-4 duration-180 ease-out fill-mode-both">
          <button
            onClick={isCameraActive ? stopCamera : startCamera}
            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-2xl transition-all duration-200 active:scale-95 border ${isCameraActive
              ? 'bg-[#1F1E23] border-white/10 text-white'
              : 'bg-indigo-600 border-indigo-500/50 text-white'
              }`}
          >
            {isCameraActive ? <X size={20} /> : <Camera size={20} />}
          </button>
        </div>
      )}

      {validating && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40 animate-in fade-in duration-300">
          <div className="bg-[#1F1E23] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl animate-in zoom-in-95 duration-300">
            <Loader2 size={32} className="animate-spin text-indigo-500 mb-4" />
            <p className="text-[10px] text-white/60 font-mono tracking-widest uppercase">Validating Data</p>
          </div>
        </div>
      )}

      <Alert
        isOpen={showPopup}
        absensiStatus={scanResult}
        setOpen={setShowPopup}
        sholatTime={sholat as unknown as string}
        onScanUlang={() => {
          setShowPopup(false);
          isProcessingRef.current = false;
        }}
        initialStatus="idle"
      />
    </div>
  );
});

Qr.displayName = 'Qr';
export default Qr;
