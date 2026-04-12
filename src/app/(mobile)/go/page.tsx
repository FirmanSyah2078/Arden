'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { UnifiedHeader } from '@/components/mobile/ui/unified-header';
import { Manager } from '@/components/mobile/core/manager';
import History from '@/components/mobile/popups/history';
import { useLogout } from '@/hooks/use-logout';
import { useSholat } from '@/hooks/mobile/use-sholat';

export default function MobilePage() {
  const [showHistory, setShowHistory] = useState(false);
  const { activeScanner } = useSholat();
  const { handleLogout } = useLogout();

  const onLogoutClick = () => {
    toast.success("Sampai jumpa!");
    setTimeout(() => {
      handleLogout();
    }, 300);
  };

  return (
    // 🔥 FIX: Tambah pt-4 biar UnifiedHeader nggak mentok atas banget, nya!
    <div className="absolute inset-0 w-full h-full bg-[#151419] flex flex-col p-5 pt-4 font-sans overflow-hidden">
      <UnifiedHeader />

      <div className="flex-1 min-h-0 relative w-full mt-4">
        <Manager
          className="h-full w-full"
          onOpenHistory={() => setShowHistory(true)}
          onLogout={onLogoutClick}
        />
      </div>

      <History
        isOpen={showHistory}
        setIsOpen={setShowHistory}
        sholat={activeScanner}
      />
    </div>
  );
}