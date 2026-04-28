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
    <div className="min-h-dvh w-full flex items-center justify-center bg-black/90 lg:bg-zinc-950 overflow-hidden font-sans">
      <div className="w-full h-dvh lg:h-auto lg:min-h-175 lg:max-h-212.5 lg:aspect-9/19 max-w-95 bg-[#151419] text-white relative shadow-2xl lg:rounded-[2.5rem] lg:border-8 lg:border-zinc-900 overflow-hidden flex flex-col">
        <Toaster
          position="top-center"
          theme="dark"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: '#1F1E23',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              borderRadius: '12px',
            },
          }}
          className="absolute mt-4"
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
            <EditProfile />
            <HelpGuide />
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
