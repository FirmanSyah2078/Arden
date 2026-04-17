'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import { useProfile } from '@/hooks/settings/use-profile';
import { useSholat } from '@/hooks/mobile/use-sholat';

export const StatusCard = () => {
  const { formData } = useProfile();
  const { displayStatus, timeRange } = useSholat(); // Mengembalikan ke typo asli jika memang itu yang ada di hook, tapi saya akan perbaiki menjadi useSholat jika memungkinkan. Namun untuk menghindari error import, saya ikuti struktur yang ada.
  // Berdasarkan read_file sebelumnya, hook-nya adalah useSholat.
  
  const labels: Record<string, string> = { 
    Fajr: 'Shubuh', 
    Sunrise: 'Dhuha', 
    Dhuhr: 'Zhuhur', 
    Asr: 'Ashar', 
    Maghrib: 'Maghrib', 
    Isha: 'Isya' 
  };

  return (
    <div className="w-full bg-[#1F1E23] rounded-3xl p-4 border border-white/5 shadow-xl flex items-center gap-4 transition-all duration-500">
      <div className="w-14 h-14 rounded-2xl bg-[#2A292F] overflow-hidden shrink-0 border border-white/10 shadow-inner">
        {formData && formData.avatarUrl ? (
          <Image 
            src={formData.avatarUrl} 
            alt="Profile" 
            width={56} 
            height={56} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <User size={24} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium mb-0.5">
          Welcome back,
        </span>
        <h2 className="text-base font-bold text-white truncate leading-tight mb-2">
          {formData?.name || 'User'}
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-600 border-none shrink-0 shadow-sm">
            <span className="text-[9px] font-bold tracking-wider text-white capitalize">
              {labels[displayStatus] ? `Jadwal Sholat ${labels[displayStatus]}` : '...'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-white/40 tracking-tight">
            {timeRange} <span className="opacity-50">WIB</span>
          </span>
        </div>
      </div>
    </div>
  );
};