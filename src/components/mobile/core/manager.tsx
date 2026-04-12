'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UserSearch, ScanLine, Menu, History as HistoryIcon, Settings, LogOut, RotateCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

import Qr, { QrHandle } from '../type/qr';
import { ManualSearch, ManualResults } from '../type/manual';
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

  // FUNGSI GANTI MODE (Fix: Pastikan nama konsisten)
  const handleToggleMode = async () => {
    if (mode === 'scan') {
      // Matikan kamera dulu sebelum pindah ke manual, nya!
      await qrRef.current?.stop();
    }
    setMode(mode === 'scan' ? 'manual' : 'scan');
    setSearch('');
  };

  const handleCamAction = async () => {
    if (qrRef.current?.isScanning) {
      await qrRef.current?.stop();
    } else {
      await qrRef.current?.start();
    }
  };

  return (
    <div className={`relative w-full h-full bg-[#151419] overflow-hidden ${className}`}>

      {/* BASE LAYER: Full Screen Content */}
      <div className="relative w-full h-full flex flex-col transition-all duration-500 ease-in-out">
        {mode === 'scan' ? (
          <div className="w-full h-full animate-in fade-in duration-700">
            <Qr ref={qrRef} sholat={activeScanner} onCamActive={setIsCamActive} />
          </div>
        ) : (
          <div className="w-full h-full p-5 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col">
            <ManualSearch search={search} setSearch={setSearch} isLoading={isLoading} onFocus={() => { }} onBlur={() => { }} />
            <div className="flex-1 min-h-0 relative w-full overflow-hidden">
              <ManualResults
                search={search}
                data={data}
                isLoading={isLoading}
                isFocused={false}
                handleSelect={(s) => {
                  setManualResult({ id: String(s.id_student), full_name: s.full_name, nis: s.nis, class_name: s.class_name, status: 'idle', message: 'Manual Entry' });
                  setInputFormOpen(true);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ACTION LAYER: Floating Command Center */}
      {/* FIX: Dock tidak lagi hilang total saat kamera aktif, cuma jadi lebih transparan, nya! */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${isCamActive ? 'opacity-60' : 'opacity-100'}`}>
        <div className="flex items-center bg-white/5 backdrop-blur-2xl border border-white/10 p-1.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] gap-1.5">

          {/* Mode Switcher */}
          <Button
            variant="secondary"
            onClick={handleToggleMode}
            className="h-10 px-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95 group flex items-center gap-2 border border-white/5"
          >
            {mode === 'scan' ? (
              <><UserSearch size={16} className="text-white/40 group-hover:text-indigo-400 transition-colors" /><span className="text-[11px] font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">Manual</span></>
            ) : (
              <><ScanLine size={16} className="text-white/40 group-hover:text-indigo-400 transition-colors" /><span className="text-[11px] font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">Scan QR</span></>
            )}
          </Button>

          {/* Primary Action (Start/Stop Camera or Reset Search) */}
          <Button
            variant="secondary"
            onClick={mode === 'scan' ? handleCamAction : () => setSearch('')}
            className={`h-10 px-5 rounded-full transition-all active:scale-95 group flex items-center gap-2 shadow-inner ${mode === 'scan'
              ? 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/20'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/5'
              }`}
          >
            {mode === 'scan' ? (
              <>
                <ScanLine size={16} className="group-hover:animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {qrRef.current?.isScanning ? 'Stop Cam' : 'Start Cam'}
                </span>
              </>
            ) : (
              <>
                <RotateCcw size={16} className="text-white/60 group-hover:text-white transition-colors" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Reset</span>
              </>
            )}
          </Button>

          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95 group outline-none flex items-center justify-center border border-white/5"
              >
                <Menu className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48 bg-[#1f1e23] border-[#27272A] text-white shadow-2xl">
              <DropdownMenuItem onClick={onOpenHistory} className="cursor-pointer hover:bg-[#27272A] flex items-center gap-2">
                <HistoryIcon className="h-4 w-4" /> <span>History</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Fitur Setting belum tersedia")} className="cursor-pointer hover:bg-[#27272A] flex items-center gap-2">
                <Settings className="h-4 w-4" /> <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-500 hover:bg-[#27272A] flex items-center gap-2">
                <LogOut className="h-4 w-4" /> <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Form isOpen={inputFormOpen} setIsOpen={setInputFormOpen} dataStudent={manualResult} setPick={setManualResult} sholat={activeScanner} setSuccessPopup={setNotifOpen} />
      <Alert isOpen={notifOpen} absensiStatus={manualResult} setOpen={setNotifOpen} sholatTime={activeScanner as unknown as string} initialStatus={manualResult?.status as any} />
    </div>
  );
};