'use client';

import Image from 'next/image';
import { Timer } from 'lucide-react';
import { useSholat } from '@/hooks/mobile/use-sholat';

export const UnifiedHeader = () => {
    const { displayStatus, timeRange } = useSholat();
    const labels: Record<string, string> = { Fajr: 'Shubuh', Sunrise: 'Dhuha', Dhuhr: 'Zhuhur', Asr: 'Ashar', Maghrib: 'Maghrib', Isha: 'Isya' };

    return (
        <div className="w-full bg-white/3 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-3 shadow-lg transition-all duration-500">

            {/* TOP ROW: App Identity - Kept exactly as requested nya! */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Image
                        src="/arden.svg"
                        alt="Logo"
                        width={24}
                        height={26}
                        className="object-contain shrink-0"
                    />
                    <div className="flex flex-col">
                        <h1 className="text-sm font-extrabold text-white tracking-tighter leading-none">ARDEN</h1>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-white/30 leading-none mt-1 whitespace-nowrap">Attendance System</span>
                    </div>
                </div>
            </div>

            {/* BOTTOM ROW: Sholat Status & Time Range */}
            <div className="flex items-center justify-between gap-3 min-w-0 border-t border-white/5 pt-3">
                {/* Prayer Name Badge */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                    <div className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="text-[10px] font-bold tracking-wider text-indigo-300 capitalize">
                        Jadwal Sholat {labels[displayStatus] || '...'}
                    </span>
                </div>

                {/* Time Range */}
                <div className="flex items-center gap-1.5 text-white/80 min-w-0">
                    <p className="text-xs font-mono font-bold tracking-tight truncate">
                        {timeRange} <span className="text-white/40 font-medium ml-1">WIB</span>
                    </p>
                </div>
            </div>
        </div>
    );
};
