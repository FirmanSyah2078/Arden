'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UserSearch, ScanLine, Menu, X, History as HistoryIcon, Settings, LogOut, RotateCcw, Camera } from 'lucide-react';
import { toast } from 'sonner';

import Qr, { QrHandle } from '../type/qr';
import { Manual } from '../type/manual';
import { Alert } from '../popups/alert';
import { Form } from '../popups/form';
import { AttendanceStatusResponse, StudentMobile } from '@/types/api';
import { useSholat } from '@/hooks/mobile/use-sholat';

interface ManagerProps {
  className?: string;
  onOpenHistory?: () => void;
  onLogout?: () => void;
}

export const Manager = ({ className = '', onOpenHistory, onLogout }: ManagerProps) => {
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [search, setSearch] = useState('');
  const [data, setData] = useState<StudentMobile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [manualResult, setManualResult] = useState<AttendanceStatusResponse | undefined>(undefined);
  const [notifOpen, setNotifOpen] = useState(false);
  const [inputFormOpen, setInputFormOpen] = useState(false);
  const [isCamActive, setIsCamActive] = useState(false);

  // STATE UNTUK CUSTOM MENU nya! (=^･ω･^=)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const qrRef = useRef<QrHandle>(null);
  const { activeScanner } = useSholat();

  useEffect(() => {
    if (mode !== 'manual') return;
    if (!search.trim()) { setData([]); setIsLoading(false); return; }
    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/student?prm=${encodeURIComponent(search)}&limit=15`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        if (json.status === 'success' && Array.isArray(json.data)) {
          setData(json.data.map((s: any) => ({
            id_student: s.id_student,
            full_name: s.full_name,
            nis: s.nis,
            class_name: s.tbl_classes?.class_name || s.class_name || 'Unknown',
            icode: s.icode || ''
          })));
        } else { setData([]); }
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, mode]);

  const handleToggleMode = async () => {
    if (mode === 'scan') {
      await qrRef.current?.stop();
    }
    setMode(mode === 'scan' ? 'manual' : 'scan');
    setSearch('');
    setIsMenuOpen(false); // Tutup menu pas ganti mode nya!
  };

  const handleCamAction = async () => {
    if (qrRef.current?.isScanning) {
      await qrRef.current?.stop();
    } else {
      await qrRef.current?.start();
    }
    setIsMenuOpen(false); // Tutup menu pas buka kamera nya!
  };

  return (
    <div className={`relative w-full h-full bg-[#151419] overflow-hidden ${className}`}>

      {/* OVERLAY: Untuk menutup menu pas klik di luar nya! ฅ^•ﻌ•^ฅ */}
      {isMenuOpen && (
        <div
          className="absolute inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* BASE LAYER: Content Area */}
      <div className="relative w-full h-full flex flex-col transition-all duration-500 ease-in-out">
        {mode === 'scan' ? (
          <div className="w-full h-full animate-in fade-in duration-700">
            <Qr ref={qrRef} sholat={activeScanner} onCamActive={setIsCamActive} />
          </div>
        ) : (
          <div className="w-full h-full p-5 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col">
            <Manual
              search={search}
              setSearch={setSearch}
              data={data}
              isLoading={isLoading}
              onFocus={() => { }}
              onBlur={() => { }}
              handleSelect={(s) => {
                setManualResult({ id: String(s.id_student), full_name: s.full_name, nis: s.nis, class_name: s.class_name, status: 'idle', message: 'Manual Entry' });
                setInputFormOpen(true);
              }}
              setPick={setManualResult}
              setOpenForm={setInputFormOpen}
            // onScrollDirectionChange dihapus karena sudah tidak dipakai di manual.tsx nya!
            />
          </div>
        )}
      </div>

      {/* CUSTOM MENU PANEL - Slide up dari bawah nya! (=^･ω･^=) */}
      {isMenuOpen && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 w-60 animate-in slide-in-from-bottom-8 duration-300">
          <div className="bg-[#1A191E] border border-white/10 rounded-3xl p-2 shadow-2xl">
            <div className="flex flex-col gap-1">

              {/* ITEM: History - Icon Kiri, B&W Theme */}
              <button
                onClick={() => { onOpenHistory?.(); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 text-white/40 flex items-center justify-center border border-white/10 group-hover:bg-white/10 group-hover:text-white transition-all shrink-0 shadow-inner">
                    <HistoryIcon size={16} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">History</span>
                    <span className="text-[10px] text-white/30 leading-tight">Riwayat absensi siswi</span>
                  </div>
                </div>
              </button>

              {/* ITEM: Settings - Icon Kiri, B&W Theme */}
              <button
                onClick={() => { toast.info("Fitur Setting belum tersedia"); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 text-white/40 flex items-center justify-center border border-white/10 group-hover:bg-white/10 group-hover:text-white transition-all shrink-0 shadow-inner">
                    <Settings size={16} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">Settings</span>
                    <span className="text-[10px] text-white/30 leading-tight">Preferensi aplikasi</span>
                  </div>
                </div>
              </button>

              <div className="h-px bg-white/5 my-1 mx-2" />

              {/* ITEM: Logout - Icon Kiri, Tetap Merah */}
              <button
                onClick={() => { onLogout?.(); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-red-500/10 transition-all active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500/20 group-hover:text-red-300 transition-all shrink-0 shadow-inner">
                    <LogOut size={16} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">Logout</span>
                    <span className="text-[10px] text-white/30 leading-tight">Keluar dari sistem Arden</span>
                  </div>
                </div>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* FLOATING DOCK */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out">
        <div className="flex items-center bg-white/5 backdrop-blur-2xl border border-white/10 p-1.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] gap-1.5">
          <Button
            variant="secondary"
            onClick={handleToggleMode}
            className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95 group flex items-center justify-center border border-white/5 shrink-0"
          >
            {mode === 'scan' ? (
              <UserSearch size={16} className="text-white/40 group-hover:text-indigo-400 transition-colors" />
            ) : (
              <ScanLine size={16} className="text-white/40 group-hover:text-indigo-400 transition-colors" />
            )}
          </Button>

          <Button
            variant="secondary"
            onClick={mode === 'scan' ? handleCamAction : () => setSearch('')}
            className={`h-10 w-10 rounded-full transition-all active:scale-95 group flex items-center justify-center shadow-inner shrink-0 ${mode === 'scan' ? 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/20' : 'bg-white/10 hover:bg-white/20 text-white border border-white/5'}`}
          >
            {mode === 'scan' ? (
              <Camera size={16} className="group-hover:animate-pulse" />
            ) : (
              <RotateCcw size={16} className="text-white/60 group-hover:text-white transition-colors" />
            )}
          </Button>

          {/* HAMBURGER TRIGGER - Berubah jadi X Merah pas Menu Open nya! ฅ^•ﻌ•^ฅ */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95 group outline-none flex items-center justify-center border border-white/10 shrink-0 shadow-sm hover:border-white/20"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-red-500 animate-in zoom-in duration-200" />
            ) : (
              <Menu className="w-5 h-5 text-white/40 group-hover:text-white transition-colors duration-300" />
            )}
          </button>
        </div>
      </div>

      <Form isOpen={inputFormOpen} setIsOpen={setInputFormOpen} dataStudent={manualResult} setPick={setManualResult} sholat={activeScanner} setSuccessPopup={setNotifOpen} />
      <Alert isOpen={notifOpen} absensiStatus={manualResult} setOpen={setNotifOpen} sholatTime={activeScanner as unknown as string} initialStatus={manualResult?.status as any} />
    </div>
  );
};