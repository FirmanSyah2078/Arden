'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UserSearch, ScanLine, Menu, X, Camera } from 'lucide-react';
import { useDock } from '@/context/dock-context';

interface BottomDockProps {
  variant: 'home' | 'history' | 'profile';
  handleCamAction?: () => void;
}

export const BottomDock = ({
  variant,
  handleCamAction
}: BottomDockProps) => {
  const { isMenuOpen, setIsMenuOpen, mode, setMode } = useDock();
  const router = useRouter();

  const handleToggleMode = () => {
    const newMode = mode === 'scan' ? 'manual' : 'scan';
    setMode(newMode);
    
    // If user is on history page, automatically redirect back to /go
    if (window.location.pathname.includes('/history')) {
      router.push('/go');
    }
  };
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      <div className="flex items-center bg-[#1F1E23] p-1.5 rounded-full shadow-2xl gap-3 border border-white/10">

        {/* LEFT SECTION: Identity */}
        <div className="flex items-center gap-2 px-2">
          <Image
            src="/arden.svg"
            alt="Logo"
            width={16}
            height={18}
            className="object-contain shrink-0 translate-y-px"
          />
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-white tracking-tighter leading-none">
              ARDEN
            </span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-white/40 leading-none mt-0.5 whitespace-nowrap">
              Attendance System
            </span>
          </div>
        </div>

        {/* DIVIDER LINE */}
        <div className="w-px h-6 bg-white/10" />

        {/* RIGHT SECTION: Controls */}
        <div className="flex items-center gap-1.5">
          {/* Show mode toggle for both home and history pages */}
          {(variant === 'home' || variant === 'history') && (
            <>
              <Button
                variant="secondary"
                onClick={handleToggleMode}
                className="h-10 w-10 rounded-full transition-all duration-300 group flex items-center justify-center shrink-0 border-none bg-[#2A292F] text-white hover:text-white hover:bg-[#35343B]"
              >
                {mode === 'scan' ? <UserSearch size={16} /> : <ScanLine size={16} />}
              </Button>

              {/* Camera button strictly for home page */}
              {variant === 'home' && mode === 'scan' && null}
            </>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`h-10 w-10 rounded-full transition-all duration-300 group outline-none flex items-center justify-center shrink-0 border-none shadow-sm ${isMenuOpen ? 'bg-indigo-600 text-white' : 'bg-[#2A292F] text-white hover:text-white hover:bg-[#35343B]'}`}
          >
            {isMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
      </div>
    </div>
  );
};
