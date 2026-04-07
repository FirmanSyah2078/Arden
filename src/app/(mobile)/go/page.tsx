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
          <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                  <div className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                      <Menu className="w-6 h-6 text-white" />
                  </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#1f1e23] border-[#27272A] text-white">
                  <DropdownMenuItem onClick={() => setShowHistory(true)} className="cursor-pointer hover:bg-[#27272A]">
                      <HistoryIcon className="mr-2 h-4 w-4" /> <span>History</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Fitur Setting belum tersedia")} className="cursor-pointer hover:bg-[#27272A]">
                      <Settings className="mr-2 h-4 w-4" /> <span>Settings</span>
                  </DropdownMenuItem>
                  
                  {/* 🔥 FIX: Panggil fungsi onLogoutClick yang menggunakan hook */}
                  <DropdownMenuItem onClick={onLogoutClick} className="cursor-pointer text-red-500 hover:bg-[#27272A]">
                      <LogOut className="mr-2 h-4 w-4" /> <span>Logout</span>
                  </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
        </Header>
        <div className="mb-4 mt-2">
            <CardSholat />
        </div>
      </div>
      <div className="flex-1 min-h-0 relative w-full">
         <Manager className="h-full w-full" />
      </div>
      <History isOpen={showHistory} setIsOpen={setShowHistory} sholat={activeScanner} />
    </div>
  );
}