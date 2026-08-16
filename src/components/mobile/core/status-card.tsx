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

  const loading = isLoading || isPrayerLoading;

  return (
    <div className="flex w-full items-center gap-4 rounded-3xl border border-white/10 bg-[#1F1E23] p-4 shadow-xl">
      {/* Avatar — kotak固定 56px, tidak pernah berubah ukuran */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[#2A292F] shadow-inner">
        {loading ? (
          <div className="h-full w-full animate-pulse bg-zinc-800" />
        ) : profile.avatarUrl ? (
          <>
            <img
              src={profile.avatarUrl}
              alt="Blur"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-md"
            />
            <img
              src={profile.avatarUrl}
              alt="Profile"
              className="relative z-10 h-full w-full object-cover"
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/20">
            <User size={24} />
          </div>
        )}
      </div>

      {/* Kolom teks — tinggi dikunci 68px, dua state sama persis */}
      <div className="flex h-17 min-w-0 flex-1 flex-col justify-center">
        {loading ? (
          <>
            <div className="mb-1.5 h-3 w-20 animate-pulse rounded-full bg-zinc-800" />
            <div className="mb-2.5 h-4 w-32 animate-pulse rounded-full bg-zinc-800" />
            <div className="h-5 w-28 animate-pulse rounded-full bg-zinc-800" />
          </>
        ) : (
          <>
            <span className="mb-1 text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Welcome back,
            </span>
            <h2 className="mb-2 truncate text-base font-bold leading-tight text-white">
              {profile.name || 'User'}
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex shrink-0 items-center rounded-full bg-indigo-600 px-2 py-0.5 shadow-sm">
                <span className="text-[9px] font-bold capitalize tracking-wider text-white">
                  {labels[displayStatus] ? `Prayer Time: ${labels[displayStatus]}` : '...'}
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-tight text-zinc-500">
                {timeRange} <span className="opacity-50">WIB</span>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
