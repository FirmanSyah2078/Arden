'use client';

import Image from 'next/image';
import { Clock } from 'lucide-react';
import { useSholat } from '@/hooks/mobile/use-sholat';

export const UnifiedHeader = () => {
    const { currentTime, displayStatus, timeRange } = useSholat();
    const labels: Record<string, string> = { Fajr: 'Shubuh', Sunrise: 'Dhuha', Dhuhr: 'Zhuhur', Asr: 'Ashar', Maghrib: 'Maghrib', Isha: 'Isya' };

    return (
        <div className="w-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-4 shadow-lg transition-all duration-500">

            {/* LEFT: App Identity */}
            <div className="flex items-center gap-3">
                <div className="relative p-1 bg-white/5 rounded-lg border border-white/10">
                    <Image src="/arden.svg" alt="Logo" width={24} height={26} className="object-contain" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xs font-extrabold text-white tracking-tighter leading-none">ARDEN</h1>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/30 leading-none mt-1">Symmetry System</span>
                </div>
            </div>

            {/* RIGHT: Sholat Status (Condensed Luxe Badge) */}
            <div className="flex items-center gap-3">
                {/* Prayer Badge */}
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    <div className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                        {labels[displayStatus] || '...'}
                    </span>
                </div>

                {/* Time Display */}
                <div className="flex items-center gap-1.5 text-white/80">
                    <Clock size={12} className="text-white/40" />
                    <p className="text-xs font-mono font-bold tracking-tighter">
                        {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>
        </div>
    );
};