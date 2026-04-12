'use client';

import { useState } from 'react';
import { Menu, History as HistoryIcon, Settings, LogOut } from 'lucide-react'; 
import { toast } from 'sonner';

import { Header } from '@/components/mobile/ui/header';
import { CardSholat } from '@/components/mobile/ui/card-sholat';
import { Manager } from '@/components/mobile/core/manager';
import History from '@/components/mobile/popups/history';
import { DailyPrayer } from '@/types/api';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSholat } from '@/hooks/mobile/use-sholat';

// 🔥 FIX: Import hook sakti milikmu
import { useLogout } from '@/hooks/use-logout';

export default function MobilePage() {
  const [showHistory, setShowHistory] = useState(false);
  const { activeScanner } = useSholat();
  
  // 🔥 FIX: Panggil fungsi dari hook, UI jadi bersih dari logika!
  const { handleLogout } = useLogout();

  const onLogoutClick = () => {
    toast.success("Sampai jumpa!");
    // Beri sedikit waktu agar animasi toast muncul sebelum hard-reload dari hook
    setTimeout(() => {
      handleLogout();
    }, 300);
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#151419] flex flex-col p-5 font-sans overflow-hidden">
      <div className="flex-none">
        <Header>
          {/* Hamburger menu moved to Manager for Thumb Principle symmetry, nya! */}
        </Header>
        <div className="mb-4 mt-2">
            <CardSholat />
        </div>
      </div>
      <div className="flex-1 min-h-0 relative w-full">
         <Manager 
            className="h-full w-full\" 
            onOpenHistory={() => setShowHistory(true)} 
            onLogout={onLogoutClick} 
         />
      </div>
      <History isOpen={showHistory} setIsOpen={setShowHistory} sholat={activeScanner} />
    </div>
  );
}