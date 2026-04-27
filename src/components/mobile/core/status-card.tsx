'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import { useProfile } from '@/hooks/settings/use-profile';
import { useSholat } from '@/hooks/mobile/use-sholat';

export const StatusCard = () => {
  const { formData } = useProfile();
  const { displayStatus, timeRange } = useSholat();
  
  const labels: Record<string, string> = { 
    Fajr: 'Fajr', 
    Sunrise: 'Sunrise', 
    Dhuhr: 'Dhuhr', 
    Asr: 'Asr', 
    Maghrib: 'Maghrib', 
    Isha: 'Isha' 
  };

  return (
    <>
      {!formData ? (
        <div className="w-full bg-[#1F1E23] rounded-3xl p-4 border border-white/5 shadow-xl flex items-center gap-4 animate-pulse">
          {/* Avatar Skeleton */}
          <div className="w-14 h-14 rounded-full bg-zinc-800 animate-shimmer shrink-0" />
          
          <div className="flex-1 flex flex-col justify-center gap-2">
            {/* Welcome Label Skeleton */}
            <div className="w-20 h-2 bg-zinc-800 rounded-full animate-shimmer" />
            {/* Name Skeleton */}
            <div className="w-32 h-4 bg-zinc-800 rounded-full animate-shimmer" />
            {/* Badge Skeleton */}
            <div className="flex gap-2">
              <div className="w-24 h-4 bg-zinc-800 rounded-full animate-shimmer" />
              <div className="w-12 h-4 bg-zinc-800 rounded-full animate-shimmer" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full bg-[#1F1E23] rounded-3xl p-4 border border-white/5 shadow-xl flex items-center gap-4 transition-all duration-500 animate-in fade-in slide-in-from-top-2 fill-mode-both">
          {/* Avatar with Symmetry Blurred BG Glow effect */}
          <div className="w-14 h-14 rounded-full bg-[#2A292F] overflow-hidden shrink-0 border border-white/10 shadow-inner relative">
            {formData.avatarUrl ? (
              <>
                <Image src={formData.avatarUrl} alt="Blur" width={56} height={56} className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-40" />
                <Image src={formData.avatarUrl} alt="Profile" width={56} height={56} className="relative z-10 w-full h-full object-cover" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20">
                <User size={24} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-0.5">
              Welcome back,
            </span>
            <h2 className="text-base font-bold text-white truncate leading-tight mb-2">
              {formData.name || 'User'}
            </h2>
            <div className="flex items-center gap-2">
              {/* Professional Prayer Status Badge */}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-600 border-none shrink-0 shadow-sm">
                <span className="text-[9px] font-bold tracking-wider text-white capitalize">
                  {labels[displayStatus] ? `Prayer Time: ${labels[displayStatus]}` : '...'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 tracking-tight">
                {timeRange} <span className="opacity-50">WIB</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
