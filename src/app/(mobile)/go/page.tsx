"use client";

import { useState } from 'react';
import { toast } from 'sonner';

import { UnifiedHeader } from '@/components/mobile/ui/unified-header';
import { Manager } from '@/components/mobile/core/manager';
import { StatusCard } from '@/components/mobile/core/status-card';
import HistoryPopup from '@/components/mobile/popups/history';
import EditProfile from '@/components/mobile/settings/edit-profile';
import HelpGuide from '@/components/mobile/settings/help-guide';
import { useSholat } from '@/hooks/mobile/use-sholat';
import { History as LucideHistory, LogOut as LucideLogOut, HelpCircle, User } from 'lucide-react';
import { useLogout } from '@/hooks/auth/use-logout';
import { DailyPrayer } from '@/types/api';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function MobilePage() {
  const [showHistory, setShowHistory] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { activeScanner } = useSholat();
  const { handleLogout } = useLogout();

  const onLogoutClick = () => {
    toast.success('See you soon!');
    setTimeout(() => {
      handleLogout();
    }, 300);
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#151419] flex flex-col px-5 pt-4 font-sans overflow-hidden">
      <UnifiedHeader />

      <div className="mt-4 mb-6">
        <StatusCard />
      </div>

      <div className="flex-1 min-h-0 relative w-full">
        <Manager
          className="h-full w-full"
          onOpenHistory={() => setShowHistory(true)}
          onLogout={onLogoutClick}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      </div>

      {isMenuOpen && (
        <div
          className="absolute inset-0 z-40 bg-black/50 transition-opacity animate-in fade-in duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {isMenuOpen && (
        <div className="absolute bottom-24 right-6 z-50 w-52 animate-in slide-in-from-bottom-8 duration-300">
          <div className="bg-[#1F1E23] border border-white/5 rounded-3xl p-2 shadow-2xl">
            <div className="flex flex-col gap-1">

              <button
                onClick={() => { setIsProfileOpen(true); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#2A292F] transition-all active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2A292F] text-white flex items-center justify-center border-none group-hover:bg-[#35343B] group-hover:text-white transition-all shrink-0 shadow-inner">
                    <User size={14} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">Profile</span>
                    <span className="text-[10px] text-white/30 leading-tight">Manage account identity</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => { setShowHistory(true); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#2A292F] transition-all active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2A292F] text-white flex items-center justify-center border-none group-hover:bg-[#35343B] group-hover:text-white transition-all shrink-0 shadow-inner">
                    <LucideHistory size={14} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">History</span>
                    <span className="text-[10px] text-white/30 leading-tight">Attendance history logs</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => { setIsHelpOpen(true); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#2A292F] transition-all active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2A292F] text-white flex items-center justify-center border-none group-hover:bg-[#35343B] group-hover:text-white transition-all shrink-0 shadow-inner">
                    <HelpCircle size={14} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">Guide</span>
                    <span className="text-[10px] text-white/30 leading-tight">Operational guidelines</span>
                  </div>
                </div>
              </button>

              <div className="h-px bg-white/10 my-1 mx-2" />

              <button
                onClick={() => { onLogoutClick(); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#2A292F] transition-all active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2A292F] text-white flex items-center justify-center border-none group-hover:bg-[#35343B] group-hover:text-white transition-all shrink-0 shadow-inner">
                    <LucideLogOut size={14} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">Logout</span>
                    <span className="text-[10px] text-white/30 leading-tight">Sign out from Arden system</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <HistoryPopup
        isOpen={showHistory}
        setIsOpen={setShowHistory}
        sholat={activeScanner}
      />

      <HelpGuide
        isOpen={isHelpOpen}
        setIsOpen={setIsHelpOpen}
      />

      <EditProfile
        isOpen={isProfileOpen}
        setIsOpen={setIsProfileOpen}
      />
    </div>
  );
}
