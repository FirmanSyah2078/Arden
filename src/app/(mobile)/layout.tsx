'use client';

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';
import { DockProvider, useDock } from '@/context/dock-context';
import { BottomDock } from '@/components/mobile/ui/bottom-dock';
import { GlobalMenu } from '@/components/mobile/ui/global-menu';
import EditProfile from '@/components/mobile/settings/edit-profile';
import HelpGuide from '@/components/mobile/settings/help-guide';
import { usePathname as useP } from "next/navigation";

function MobileLayoutContent({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const [isEditProfileOpen, setEditProfileOpen] = useState(false);
  const [isHelpGuideOpen, setHelpGuideOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const getDockVariant = () => {
    if (!pathname) return 'profile';
    const path = pathname.toLowerCase();
    if (path === '/go' || path === '/' || path.includes('/go')) return 'home';
    if (path.includes('/history')) return 'history';
    return 'profile';
  };

  const isDockHidden = pathname !== '/go' && pathname !== '/';
  const currentVariant = getDockVariant();

  return (
    <div className="flex h-svh w-full items-center justify-center overflow-hidden bg-black/90 font-sans md:h-auto md:min-h-dvh md:overflow-auto md:bg-zinc-950 md:p-4">
      <div className="relative flex h-svh w-full flex-none flex-col overflow-hidden bg-[#151419] text-white md:h-211 md:w-97.5 md:shrink-0 md:rounded-[2.5rem] md:border-8 md:border-zinc-900 md:shadow-2xl">
        <Toaster
          position="top-center"
          theme="dark"
          richColors
          toastOptions={{
            className: "text-sm font-semibold flex items-center",
            style: {
              background: '#1F1E23',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
              padding: '12px 16px',
            },
          }}
          className="absolute mt-8 **:data-sonner-toast:flex **:data-sonner-toast:items-center"
        />

        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#151419]">
            <Loader2 className="w-10 h-10 text-white/50 animate-spin mb-3" />
            <p className="text-xs font-mono text-white/50 tracking-widest">LOADING ARDEN...</p>
          </div>
        ) : (
          <>
            <main className="flex-1 w-full relative overflow-hidden animate-in fade-in duration-500 flex flex-col">
              {children}
            </main>
            {!isDockHidden && (
              <div className="shrink-0 z-50">
                <BottomDock variant={currentVariant} />
              </div>
            )}
            <GlobalMenu />
            <EditProfile
              isOpen={isEditProfileOpen}
              setIsOpen={setEditProfileOpen}
            />
            <HelpGuide
              isOpen={isHelpGuideOpen}
              setIsOpen={setHelpGuideOpen}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <DockProvider>
      <MobileLayoutContent>{children}</MobileLayoutContent>
    </DockProvider>
  );
}
