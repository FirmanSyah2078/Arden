'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserSearch, ScanLine } from 'lucide-react';

import Qr from '../type/qr';
import { Manual } from '../type/manual';
import { Alert } from '../popups/alert';
import { Form } from '../popups/form';
import { AttendanceStatusResponse } from '@/types/api';
import { useSholat } from '@/hooks/mobile/use-sholat';

interface ManagerProps {
  className?: string;
}

export const Manager = ({ className = '' }: ManagerProps) => {
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [manualResult, setManualResult] = useState<AttendanceStatusResponse | undefined>(undefined);
  const [notifOpen, setNotifOpen] = useState(false);
  const [inputFormOpen, setInputFormOpen] = useState(false);
  const [isCamActive, setIsCamActive] = useState(false);

  const { activeScanner } = useSholat();

  const toggleMode = () => {
    setMode(mode === 'scan' ? 'manual' : 'scan');
    setIsCamActive(false);
  };

  return (
    <div className={`relative w-full h-full flex flex-col ${className}`}>
      
      {/* 🔥 FIX: Kondisi pembungkus berbeda untuk Scan dan Manual */}
      {mode === 'scan' ? (
        <div className="flex-1 w-full h-full relative rounded-3xl overflow-hidden shadow-2xl border border-[#27272A] z-0">
          <Qr sholat={activeScanner} onCamActive={setIsCamActive} />
        </div>
      ) : (
        <div className="flex-1 w-full h-full relative z-0 flex flex-col animate-in fade-in zoom-in-95 duration-300">
          <Manual setPick={setManualResult} setOpenForm={setInputFormOpen} />
        </div>
      )}

      {/* Tombol Switcher Melayang */}
      <div className={`absolute bottom-8 left-6 z-50 font-sans transition-all duration-500 ease-in-out ${isCamActive ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <Button variant="secondary" size="sm" onClick={toggleMode} className="h-10 px-3 pr-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-2 transition-all active:scale-95 group">
          {mode === 'scan' ? (
            <><UserSearch size={18} className="text-white/80 group-hover:text-white transition-colors" /><span className="text-xs font-semibold tracking-wide hidden xs:inline">Manual</span></>
          ) : (
            <><ScanLine size={18} className="text-white/80 group-hover:text-white transition-colors" /><span className="text-xs font-semibold tracking-wide hidden xs:inline">Scan QR</span></>
          )}
        </Button>
      </div>

      <Form
        isOpen={inputFormOpen}
        setIsOpen={setInputFormOpen}
        dataStudent={manualResult}
        setPick={setManualResult}
        sholat={activeScanner} 
        setSuccessPopup={setNotifOpen}
      />

      <Alert
        isOpen={notifOpen}
        absensiStatus={manualResult}
        setOpen={setNotifOpen}
        sholatTime={activeScanner as unknown as string}
        initialStatus={manualResult?.status as any}
      />
    </div>
  );
};