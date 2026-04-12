'use client';

import Image from 'next/image';
import { Clock, Hourglass } from 'lucide-react';
import { useSholat } from '@/hooks/mobile/use-sholat';

export const CardSholat = ({ className = '' }: { className?: string }) => {
  const { currentTime, displayStatus, timeRange } = useSholat();

  const labels: Record<string, string> = { Fajr: 'Shubuh', Sunrise: 'Dhuha', Dhuhr: 'Zhuhur', Asr: 'Ashar', Maghrib: 'Maghrib', Isha: 'Isya' };

  return (
    <div className={`relative w-full bg-white/2 backdrop-blur-xl border-y border-white/5 rounded-3xl py-4 px-6 flex items-center justify-between gap-6 transition-all duration-500 ${className}`}>

      {/* LEFT SECTION: Identity & Status */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative">
          <Image src="/arden.svg" alt="Logo" width={36} height={38} className="object-contain opacity-80" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 leading-none mb-1">Current Prayer</span>
          <h2 className="text-base font-extrabold text-white tracking-tighter leading-none">
            {labels[displayStatus] || '...'}
          </h2>
        </div>
      </div>

      {/* SYMMETRY DIVIDER: Garis tipis pemisah */}
      <div className="w-px h-8 bg-white/10" />

      {/* RIGHT SECTION: Time & Range */}
      <div className="flex flex-col items-end justify-center flex-1">
        <div className="flex items-center gap-1.5 text-white/40 mb-1">
          <Hourglass size={10} />
          <p className="text-[9px] font-medium uppercase tracking-widest">{timeRange}</p>
        </div>
        <div className="flex items-baseline gap-1">
          <p className="text-2xl font-mono font-bold text-white tracking-tighter leading-none">
            {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">WIB</span>
        </div>
      </div>
    </div>
  );
};