'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserSearch, ScanLine, Menu, X, History as HistoryIcon, Settings, LogOut, RotateCcw, Camera, User } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

import Qr, { QrHandle } from '../type/qr';
import { Manual } from '../type/manual';
import { Alert } from '../popups/alert';
import { Form } from '../popups/form';
import { AttendanceStatusResponse, StudentMobile } from '@/types/api';
import { useSholat } from '@/hooks/mobile/use-sholat';
import { useProfile } from '@/hooks/settings/use-profile';

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
  const { formData } = useProfile();

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

      {/* ULTIMATE BOTTOM DOCK: Integrated Identity & Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out">
        <div className="flex items-center bg-[#1F1E23] p-1.5 rounded-full shadow-2xl gap-3 border border-white/10">

          {/* LEFT SECTION: Identity */}
          <div className="flex items-center gap-2 px-2">
            <Image
              src="/arden.svg"
              alt="Logo"
              width={16}
              height={18}
              className="object-contain shrink-0 translate-y-px"
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-white tracking-tighter leading-none">
                ARDEN
              </span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-white/40 leading-none mt-0.5 whitespace-nowrap">
                Attendance System
              </span>
            </div>
          </div>

          {/* DIVIDER LINE */}
          <div className="w-px h-6 bg-white/10" />

          {/* RIGHT SECTION: Controls */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              onClick={handleToggleMode}
              className="h-10 w-10 rounded-full transition-all duration-300 active:scale-90 group flex items-center justify-center shrink-0 border-none bg-[#2A292F] text-white hover:text-white hover:bg-[#35343B]"
            >
              {mode === 'scan' ? (
                <UserSearch size={16} className="text-current" />
              ) : (
                <ScanLine size={16} className="text-current" />
              )}
            </Button>

            {mode === 'scan' && (
              <Button
                variant="secondary"
                onClick={handleCamAction}
                className="h-10 w-10 rounded-full transition-all duration-300 active:scale-90 group flex items-center justify-center shrink-0 border-none bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              >
                <Camera size={16} className="group-hover:animate-pulse" />
              </Button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`h-10 w-10 rounded-full transition-all duration-300 active:scale-90 group outline-none flex items-center justify-center shrink-0 border-none shadow-sm ${isMenuOpen ? 'bg-indigo-600 text-white' : 'bg-[#2A292F] text-white hover:text-white hover:bg-[#35343B]'}`}
            >
              {isMenuOpen ? (
                <div className="flex items-center justify-center w-5 h-5">
                  <X size={20} strokeWidth={2} />
                </div>
              ) : (
                <Menu size={20} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>

      <Form
        key={manualResult?.id}
        isOpen={inputFormOpen}
        setIsOpen={setInputFormOpen}
        dataStudent={manualResult}
        setPick={setManualResult}
        sholat={activeScanner}
        setSuccessPopup={setNotifOpen}
      />
      <Alert isOpen={notifOpen} absensiStatus={manualResult} setOpen={setNotifOpen} sholatTime={activeScanner as unknown as string} />
    </div>
  );
};
