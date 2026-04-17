'use client';

import Image from 'next/image';
import { Timer } from 'lucide-react';
import { useSholat } from '@/hooks/mobile/use-sholat';

export const UnifiedHeader = () => {
    const { displayStatus, timeRange } = useSholat();
    const labels: Record<string, string> = { Fajr: 'Shubuh', Sunrise: 'Dhuha', Dhuhr: 'Zhuhur', Asr: 'Ashar', Maghrib: 'Maghrib', Isha: 'Isya' };

    return (
        <div className="w-full bg-[#1F1E23] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 shadow-sm transition-all duration-500">

            {/* TOP ROW: App Identity */}
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

            {/* BOTTOM ROW: Just a clean separator line (Symmetry Style) */}
            <div className="border-t border-white/5 pt-1">
               <div className="h-1 w-8 bg-indigo-600 rounded-full opacity-50" />
            </div>
        </div>
    );
};
