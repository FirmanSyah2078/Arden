'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UserSearch, ScanLine, Menu, X, History as HistoryIcon, Settings, LogOut, RotateCcw, Camera } from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk kontrol icon X dan open menu, nya!

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

      {/* BASE LAYER: Content Area */}
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

      {/* ACTION LAYER: Floating Command Center (Luxe Glass Dock) */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${isCamActive ? 'opacity-60' : 'opacity-100'}`}>
        <div className="flex items-center bg-white/5 backdrop-blur-2xl border border-white/10 p-1.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] gap-1.5">

          {/* Mode Switcher - Icon Only nya! */}
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

          {/* Primary Action - Icon Only nya! */}
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

          {/* LUXE HAMBURGER TRIGGER */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-10 w-10 rounded-full bg-white/[0.03] hover:bg-white/10 text-white transition-all active:scale-95 group outline-none flex items-center justify-center border border-white/10 shrink-0 shadow-sm">
                <Menu className="w-5 h-5 text-white/40 group-hover:text-indigo-300 transition-colors duration-300" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 bg-[#1A191E] border-white/10 text-white shadow-2xl rounded-3xl p-2 transition-all duration-300"
            >
              <div className="flex flex-col gap-1">
                {/* HISTORY ITEM */}
                <DropdownMenuItem
                  onClick={onOpenHistory}
                  className="cursor-pointer rounded-2xl px-3 py-3 hover:bg-white/5 text-white/70 hover:text-white transition-all duration-200 flex items-center gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-indigo-500/20 transition-colors shrink-0">
                    <HistoryIcon className="h-4 w-4 text-white/40 group-hover:text-indigo-300 transition-colors" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[13px] font-semibold tracking-wide">History</span>
                    <span className="text-[10px] text-white/30 group-hover:text-white/50 transition-colors">Lihat riwayat absensi siswi</span>
                  </div>
                </DropdownMenuItem>

                {/* SETTINGS ITEM */}
                <DropdownMenuItem
                  onClick={() => toast.info("Fitur Setting belum tersedia")}
                  className="cursor-pointer rounded-2xl px-3 py-3 hover:bg-white/5 text-white/70 hover:text-white transition-all duration-200 flex items-center gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-indigo-500/20 transition-colors shrink-0">
                    <Settings className="h-4 w-4 text-white/40 group-hover:text-indigo-300 transition-colors" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[13px] font-semibold tracking-wide">Settings</span>
                    <span className="text-[10px] text-white/30 group-hover:text-white/50 transition-colors">Atur preferensi aplikasi</span>
                  </div>
                </DropdownMenuItem>

                <div className="h-px bg-white/5 my-1 mx-2" />

                {/* LOGOUT ITEM */}
                <DropdownMenuItem
                  onClick={onLogout}
                  className="cursor-pointer rounded-2xl px-3 py-3 hover:bg-red-500/10 text-red-400/70 hover:text-red-400 transition-all duration-200 flex items-center gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors shrink-0">
                    <LogOut className="h-4 w-4 text-red-400/40 group-hover:text-red-300 transition-colors" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[13px] font-semibold tracking-wide">Logout</span>
                    <span className="text-[10px] text-red-400/40 group-hover:text-red-400/60 transition-colors">Keluar dari sistem Arden</span>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* POPUP LAYER */}
      <Form isOpen={inputFormOpen} setIsOpen={setInputFormOpen} dataStudent={manualResult} setPick={setManualResult} sholat={activeScanner} setSuccessPopup={setNotifOpen} />
      <Alert isOpen={notifOpen} absensiStatus={manualResult} setOpen={setNotifOpen} sholatTime={activeScanner as unknown as string} initialStatus={manualResult?.status as any} />
    </div>
  );
};