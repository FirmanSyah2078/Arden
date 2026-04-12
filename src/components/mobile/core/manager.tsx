'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserSearch, ScanLine, Menu, History as HistoryIcon, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

import Qr from '../type/qr';
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

  const { activeScanner } = useSholat();

  useEffect(() => {
    if (mode !== 'manual') return;
    if (!search.trim()) { setData([]); setIsLoading(false); return; }
    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/student?prm=${search}&limit=15`);
        const json = await res.json();
        if (json.status === 'success' && json.data) {
          setData(json.data.map((s: any) => ({
            id_student: s.id_student, full_name: s.full_name, nis: s.nis, class_name: s.tbl_classes?.class_name || 'Unknown', icode: ''
          })));
        } else { setData([]); }
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, mode]);

  const toggleMode = () => {
    setMode(mode === 'scan' ? 'manual' : 'scan');
    setIsCamActive(false);
  };

  return (
    <div className={`relative w-full h-full flex flex-col ${className}`}>

      {/* 🔥 LUXURY LAYOUT: Padding p-5 dihapus agar lebar sama persis dengan CardSholat, nya! */}
      <div className="relative w-full h-full flex flex-col">

        {/* Search Bar: Sekarang benar-benar full width, no more belenggu! */}
        {mode === 'manual' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 w-full">
            <ManualSearch search={search} setSearch={setSearch} isLoading={isLoading} />
          </div>
        )}

        {/* THE LUXURY BOX: Lebar 1:1 dengan CardSholat, nya! */}
        <div className={`flex-1 w-full relative rounded-3xl overflow-hidden shadow-2xl border transition-all duration-500 ease-in-out ${mode === 'scan'
          ? 'border-[#27272A] translate-y-0 scale-100'
          : 'border-[#27272A] translate-y-2 scale-100 bg-[#1F1E23]/30'
          }`}>
          {mode === 'scan' ? (
            <Qr sholat={activeScanner} onCamActive={setIsCamActive} />
          ) : (
            <ManualResults
              search={search}
              data={data}
              isLoading={isLoading}
              handleSelect={(s) => {
                setManualResult({ id: String(s.id_student), full_name: s.full_name, nis: s.nis, class_name: s.class_name, status: 'idle', message: 'Manual Entry' });
                setInputFormOpen(true);
              }}
            />
          )}
        </div>
      </div>

      {/* Bottom Navigation - Luxury Symmetry */}
      <div className="absolute bottom-8 left-0 right-0 px-6 flex justify-between items-center z-50 pointer-events-none">
        <div className={`transition-all duration-500 ease-in-out pointer-events-auto ${isCamActive ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}>
          <Button
            variant="secondary"
            onClick={toggleMode}
            className="h-11 px-4 rounded-full bg-[#1F1E23] hover:bg-[#2A292F] text-white backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-2 transition-all active:scale-95 group"
          >
            {mode === 'scan' ? (
              <><UserSearch size={18} className="text-white/80 group-hover:text-white transition-colors" /><span className="text-xs font-semibold tracking-wide hidden xs:inline">Manual</span></>
            ) : (
              <><ScanLine size={18} className="text-white/80 group-hover:text-white transition-colors" /><span className="text-xs font-semibold tracking-wide hidden xs:inline">Scan QR</span></>
            )}
          </Button>
        </div>

        <div className="transition-all duration-500 ease-in-out pointer-events-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="h-11 w-11 rounded-full bg-[#1F1E23] hover:bg-[#2A292F] text-white backdrop-blur-md border border-white/10 shadow-lg flex items-center justify-center transition-all active:scale-95 group outline-none"
              >
                <Menu className="w-6 h-6 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#1f1e23] border-[#27272A] text-white">
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