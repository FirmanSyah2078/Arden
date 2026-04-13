'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export const Manager = ({
  className = '',
  onOpenHistory,
  onLogout,
  isMenuOpen,
  setIsMenuOpen
}: ManagerProps) => {
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [search, setSearch] = useState('');
  const [data, setData] = useState<StudentMobile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [manualResult, setManualResult] = useState<AttendanceStatusResponse | undefined>(undefined);
  const [notifOpen, setNotifOpen] = useState(false);
  const [inputFormOpen, setInputFormOpen] = useState(false);
  const [isCamActive, setIsCamActive] = useState(false);

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
    setIsMenuOpen(false);
  };

  const handleCamAction = async () => {
    if (qrRef.current?.isScanning) {
      await qrRef.current?.stop();
    } else {
      await qrRef.current?.start();
    }
    setIsMenuOpen(false);
  };

  return (
    <div className={`relative w-full h-full bg-[#151419] overflow-hidden ${className}`}>

      <div className="relative w-full h-full">
        {mode === 'scan' ? (
          <div className="w-full h-full animate-in fade-in zoom-in-95 duration-700 ease-out">
            <Qr ref={qrRef} sholat={activeScanner} onCamActive={setIsCamActive} />
          </div>
        ) : (
          <div className="w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col">
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
            />
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out">
        <div className="flex items-center bg-[#1A191E]/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.7)] gap-1.5">
          <Button
            variant="secondary"
            onClick={handleToggleMode}
            className="h-10 w-10 rounded-full bg-white/3 hover:bg-white/8 text-white/40 hover:text-white transition-all duration-300 active:scale-90 group flex items-center justify-center border border-white/5 shrink-0"
          >
            {mode === 'scan' ? (
              <UserSearch size={16} className="text-white/40 group-hover:text-indigo-400 transition-colors" />
            ) : (
              <ScanLine size={16} className="text-white/60 group-hover:text-white transition-colors" />
            )}
          </Button>

          <Button
            variant="secondary"
            onClick={mode === 'scan' ? handleCamAction : () => setSearch('')}
            className={`h-10 w-10 rounded-full transition-all duration-300 active:scale-90 group flex items-center justify-center shadow-inner shrink-0 ${mode === 'scan' ? 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30' : 'bg-white/3 hover:bg-white/8 text-white/40 hover:text-white border border-white/5'}`}
          >
            {mode === 'scan' ? (
              <Camera size={16} className="group-hover:animate-pulse" />
            ) : (
              <RotateCcw size={16} className="text-white/60 group-hover:text-white transition-colors" />
            )}
          </Button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`h-10 w-10 rounded-full bg-white/3 hover:bg-white/8 text-white/40 hover:text-white transition-all duration-300 active:scale-90 group outline-none flex items-center justify-center border border-white/5 shrink-0 shadow-sm hover:border-white/20 ${isMenuOpen ? 'text-red-500' : ''}`}
          >
            {isMenuOpen ? (
              <X size={20} strokeWidth={1.5} className="w-5 h-5" />
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 w-5 h-5">
                <span className="h-0.5 w-5 bg-current rounded-full" />
                <span className="h-0.5 w-4 bg-current rounded-full" />
                <span className="h-0.5 w-3 bg-current rounded-full" />
              </div>
            )}
          </button>
        </div>
      </div>

      <Form isOpen={inputFormOpen} setIsOpen={setInputFormOpen} dataStudent={manualResult} setPick={setManualResult} sholat={activeScanner} setSuccessPopup={setNotifOpen} />
      {/* 🔥 Prop setSuccessPopup sudah dihapus supaya nggak error, nya! ฅ^•ﻌ•^ฅ */}\n      <Alert isOpen={notifOpen} absensiStatus={manualResult} setOpen={setNotifOpen} sholatTime={activeScanner as unknown as string} />
    </div>
  );
};