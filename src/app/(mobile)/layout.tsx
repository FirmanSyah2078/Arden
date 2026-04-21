'use client';
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from 'lucide-react'; 

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-black/90 lg:bg-zinc-950 overflow-hidden font-sans">
      {/* 🔥 FIX: Set max-width, max-height, min-height, & aspect-ratio untuk layar desktop */}
      <div className="w-full h-dvh lg:h-auto lg:min-h-175 lg:max-h-212.5 lg:aspect-9/19 max-w-95 bg-[#151419] text-white relative shadow-2xl lg:rounded-[2.5rem] lg:border-8 lg:border-zinc-900 overflow-hidden flex flex-col">
        
        {/* Posisi diset ke top-center untuk mobile */}
        <Toaster position="top-center" theme="dark" richColors closeButton className="absolute mt-4" />

        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#151419]">
            <Loader2 className="w-10 h-10 text-white/50 animate-spin mb-3" />
            <p className="text-xs font-mono text-white/50 tracking-widest">LOADING ARDEN...</p>
          </div>
        ) : (
          <main className="flex-1 w-full h-full relative overflow-hidden animate-in fade-in duration-500">
              {children}
          </main>
        )}
      </div>
    </div>
  );
}