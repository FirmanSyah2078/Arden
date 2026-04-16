'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { UnifiedHeader } from '@/components/mobile/ui/unified-header';
import { Manager } from '@/components/mobile/core/manager';
import History from '@/components/mobile/popups/history';
import SettingsHub from '@/components/mobile/settings/settings-hub';
import { useLogout } from '@/hooks/use-logout';
import { useSholat } from '@/hooks/mobile/use-sholat';
import { History as HistoryIcon, Settings, LogOut } from 'lucide-react';

export default function MobilePage() {
  const [showHistory, setShowHistory] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const { activeScanner } = useSholat();
  const { handleLogout } = useLogout();

  const onLogoutClick = () => {
    toast.success("Sampai jumpa!");
    setTimeout(() => {
      handleLogout();
    }, 300);
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#151419] flex flex-col px-5 pt-4 font-sans overflow-hidden">
      <UnifiedHeader />

      <div className="flex-1 min-h-0 relative w-full mt-4">
        <Manager
          className="h-full w-full"
          onOpenHistory={() => setShowHistory(true)}
          onLogout={onLogoutClick}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      </div>

      {/* OVERLAY */}
      {isMenuOpen && (
        <div
          className="absolute inset-0 z-40 bg-black/50 transition-opacity animate-in fade-in duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* MENU PANEL (SOLID MATERIAL VERSION) */}
      {isMenuOpen && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 w-52 animate-in slide-in-from-bottom-8 duration-300">
          <div className="bg-[#1F1E23] border border-white/5 rounded-3xl p-2 shadow-2xl">
            <div className="flex flex-col gap-1">
              {/* ITEM: History */}
              <button
                onClick={() => { setShowHistory(true); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#2A292F] transition-all active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2A292F] text-white/40 flex items-center justify-center border-none group-hover:bg-[#35343B] group-hover:text-white transition-all shrink-0 shadow-inner">
                    <HistoryIcon size={14} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">History</span>
                    <span className="text-[10px] text-white/30 leading-tight">Riwayat absensi siswi</span>
                  </div>
                </div>
              </button>

              {/* ITEM: Settings */}
              <button
                onClick={() => { setIsSettingsOpen(true); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#2A292F] transition-all active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2A292F] text-white/40 flex items-center justify-center border-none group-hover:bg-[#35343B] group-hover:text-white transition-all shrink-0 shadow-inner">
                    <Settings size={14} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">Settings</span>
                    <span className="text-[10px] text-white/30 leading-tight">Preferensi aplikasi</span>
                  </div>
                </div>
              </button>

              <div className="h-px bg-white/10 my-1 mx-2" />

              {/* ITEM: Logout - Now Monochromatic Solid */}
              <button
                onClick={() => { onLogoutClick(); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#2A292F] transition-all active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2A292F] text-white/40 flex items-center justify-center border-none group-hover:bg-[#35343B] group-hover:text-white transition-all shrink-0 shadow-inner">
                    <LogOut size={14} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">Logout</span>
                    <span className="text-[10px] text-white/30 leading-tight">Keluar dari sistem Arden</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <History
        isOpen={showHistory}
        setIsOpen={setShowHistory}
        sholat={activeScanner}
      />

      <SettingsHub 
        isOpen={isSettingsOpen} 
        setIsOpen={setIsSettingsOpen} 
      />
    </div>
  );
}
