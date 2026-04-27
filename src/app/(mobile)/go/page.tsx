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
import { useDock } from '@/context/dock-context';
import { useRouter } from 'next/navigation';
import { DailyPrayer } from '@/types/api';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function MobilePage() {
  const router = useRouter();
  const [showHistory, setShowHistory] = useState(false);
  // State kept for reference, but will no longer be triggered by menu
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { isMenuOpen, setIsMenuOpen } = useDock();
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
          onOpenHistory={() => {
            router.push('/history');
          }} 
          onLogout={onLogoutClick}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      </div>

      {/* Popup elements kept for reference as requested - NO LONGER TRIGGERED */}
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
