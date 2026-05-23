"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Search, User, History, ChevronDown } from 'lucide-react';
import { UnifiedHeader } from '@/components/mobile/ui/unified-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function GuidePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const guides = [
    {
      title: 'QR Scanner',
      desc: 'Quickly record your attendance by scanning the provided QR code.',
      details: [
        'Ensure your device camera has granted permission to access the scanner.',
        'Point the viewfinder squarely at the QR code provided by the officer.',
        'Hold the device steady until the system detects the code automatically.',
        'Wait for the success feedback before moving away from the scanning area.'
      ],
      icon: QrCode,
      color: 'text-indigo-400'
    },
    {
      title: 'Manual Search',
      desc: 'Can\'t scan? Use manual search to find identity and record attendance.',
      details: [
        'Tap the Search icon if the QR scanner fails or is unavailable.',
        'Type your full name or Student Identification Number (NIS) in the search bar.',
        'Select your correct profile from the filtered results list.',
        'Confirm the details and submit to record your attendance manually.'
      ],
      icon: Search,
      color: 'text-zinc-400'
    },
    {
      title: 'Profile Management',
      desc: 'Keep your identity updated. Change name or picture in the Me section.',
      details: [
        'Navigate to the "Me" section from the main navigation menu.',
        'Tap on the profile picture to upload a new, professional photo.',
        'Update your personal information if there are any clerical errors.',
        'Save changes to ensure your records are always accurate and up-to-date.'
      ],
      icon: User,
      color: 'text-zinc-400'
    },
    {
      title: 'Attendance History',
      desc: 'Review your attendance logs across prayer times in the History section.',
      details: [
        'Access the History page to view your personal attendance timeline.',
        'Switch between prayer tabs (Dhuhr, Asr, Maghrib, Isha) to filter records.',
        'Verify the timestamps to ensure your attendance was recorded correctly.',
        'Use this data to track your consistency over a specific period.'
      ],
      icon: History,
      color: 'text-zinc-400'
    }
  ];

  return (
    <div className="relative w-full h-full bg-[#151419] flex flex-col px-5 pt-4 font-sans overflow-hidden">
      <UnifiedHeader />

      {/* BODY - The Invisible Boundary Zone (Zero-Offside) */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        <style jsx>{`
          div { -ms-overflow-style: none; scrollbar-width: none; }
          div::-webkit-scrollbar { display: none; }
        `}</style>
        <div className="flex flex-col gap-4 pt-6 pb-6">
          {isLoading ? (
            <div className="flex flex-col gap-3 w-full">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center w-full p-3 bg-[#1F1E23] rounded-2xl border border-white/5 gap-4 animate-pulse">
                    <div className="w-11 h-11 rounded-xl bg-zinc-800 shrink-0" />
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="w-32 h-4 bg-zinc-800 rounded-full" />
                      <div className="w-48 h-3 bg-zinc-800 rounded-full" />
                    </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              {guides.map((guide, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div 
                    key={idx} 
                    className={cn(
                      "flex flex-col w-full rounded-2xl border transition-colors duration-300 overflow-hidden",
                      isExpanded ? "bg-[#25242B] border-white/20 shadow-md" : "bg-[#1F1E23] border-white/5 shadow-sm"
                    )}
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  >
                    <div className="flex items-center w-full p-3 cursor-pointer transition-colors">
                      <div className={cn(
                        "w-11 h-11 rounded-xl bg-[#2A292F] border border-white/5 flex items-center justify-center shrink-0 shadow-inner transition-colors duration-300",
                        guide.color
                      )}>
                        <guide.icon size={20} />
                      </div>
                      <div className="ml-4 flex-1 flex justify-between items-center min-w-0">
                        <div className="flex flex-col min-w-0">
                          <h3 className="text-sm font-semibold text-white truncate leading-tight">
                            {guide.title}
                          </h3>
                          <p className="text-[10px] text-white/40 leading-relaxed font-medium truncate">
                            {guide.desc}
                          </p>
                        </div>
                        <ChevronDown 
                          size={16} 
                          className={cn(
                            "text-white/30 transition-transform duration-300",
                            isExpanded && "rotate-180 text-white/60"
                          )} 
                        />
                      </div>
                    </div>

                    <div className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}>
                      <div className="overflow-hidden">
                        <div className="px-4 pb-4 pt-1">
                          <div className="h-px w-full bg-white/5 mb-3" />
                          <div className="space-y-3">
                            {guide.details.map((point, pIdx) => (
                              <div key={pIdx} className="flex gap-3 items-start">
                                <div className="w-1 h-1 rounded-full bg-indigo-400 shrink-0 mt-1.5 shadow-[0_0_4px_rgba(129,140,248,0.6)]" />
                                <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                                  {point}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER - The Safe Zone (No Overlap) */}
      <div className="pt-4 pb-6 px-4 flex justify-center items-center bg-transparent shrink-0">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="w-full max-w-sm h-14 rounded-2xl bg-zinc-900 text-white/80 border-white/10 hover:bg-zinc-800 hover:text-white font-semibold transition-all active:scale-[0.98]"
        >
          Back
        </Button>
      </div>
    </div>
  );
}
