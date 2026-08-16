'use client';

import { User } from 'lucide-react';
import { useProfile } from '@/hooks/settings/use-profile';
import { useSholat } from '@/hooks/mobile/use-sholat';

export const StatusCard = () => {
  const { profile, isLoading } = useProfile();
  const { displayStatus, timeRange, isLoading: isPrayerLoading } = useSholat()

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
      {isLoading || isPrayerLoading ? (
        <div className="flex w-full items-center gap-4 rounded-3xl border border-white/10 bg-[#1F1E23] p-4 shadow-xl">
          <div className="h-14 w-14 shrink-0 animate-pulse rounded-full border border-white/10 bg-[#2A292F]" />

          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div className="mb-0.5 h-2.5 w-20 animate-pulse rounded-full bg-zinc-800" />

            <div className="mb-2 h-4 w-32 animate-pulse rounded-full bg-zinc-800" />

            <div className="flex items-center gap-2">
              <div className="h-5 w-28 animate-pulse rounded-full bg-zinc-800" />
              <div className="h-3 w-20 animate-pulse rounded-full bg-zinc-800" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full bg-[#1F1E23] rounded-3xl p-4 border border-white/10 shadow-xl flex items-center gap-4 transition-all duration-500">
          {/* Avatar with Symmetry Blurred BG Glow effect */}
          <div className="w-14 h-14 rounded-full bg-[#2A292F] overflow-hidden shrink-0 border border-white/10 shadow-inner relative">
            {profile.avatarUrl ? (
              <>
                <img
                  src={profile.avatarUrl}
                  alt="Blur"
                  className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-40"
                />
                <img
                  src={profile.avatarUrl}
                  alt="Profile"
                  className="relative z-10 w-full h-full object-cover"
                />
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
              {profile.name || 'User'}
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
