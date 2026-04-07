'use client';
import Image from 'next/image';
import { Clock, Hourglass } from 'lucide-react';
import { useSholat } from '@/hooks/mobile/use-sholat';

export const CardSholat = ({ className = '' }: { className?: string }) => {
  const { currentTime, displayStatus, timeRange } = useSholat();

  const labels: Record<string, string> = { Fajr: 'Shubuh', Sunrise: 'Dhuha', Dhuhr: 'Zhuhur', Asr: 'Ashar', Maghrib: 'Maghrib', Isha: 'Isya' };

  return (
    <div className={`w-full bg-[#1F1E23] border border-white/5 rounded-2xl p-4 shadow-sm flex items-center gap-5 ${className}`}>
      <div className="flex-none w-14 h-14 relative flex items-center justify-center">
        <Image src="/arden.svg" alt="Logo" width={50} height={52} className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
      </div>
      <div className="flex flex-col flex-1 justify-center gap-1">
        <h2 className="text-sm font-semibold text-white tracking-wide">Jadwal Sholat {labels[displayStatus] || '...'}</h2>
        <div className="flex items-center gap-2 text-white/50"><Hourglass size={14} /><p className="text-xs font-mono">{timeRange}</p></div>
        <div className="flex items-center gap-2 text-emerald-400 mt-0.5"><Clock size={14} className="animate-pulse" /><p className="text-xs font-mono font-bold">{currentTime.toLocaleTimeString('id-ID')} WIB</p></div>
      </div>
    </div>
  );
};