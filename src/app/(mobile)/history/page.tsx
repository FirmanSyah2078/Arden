"use client";

import { useEffect, useState } from 'react';
import { Inbox, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedHeader } from '@/components/mobile/ui/unified-header';
import { useAttendance } from '@/hooks/mobile/use-attendance';
import { formatTime } from '@/lib/date';
import { useSholat } from '@/hooks/mobile/use-sholat';
import { useRouter } from 'next/navigation';

// --- LIST COMPONENT (Symmetry Luxury Implementation) ---
const ListContent = ({ isLoadingHistory, historyData }: { isLoadingHistory: boolean, historyData: any[] }) => {
  if (isLoadingHistory) {
    return (
      <div className="flex flex-col gap-3 w-full py-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center w-full p-3 bg-[#1F1E23] rounded-2xl border border-white/5 gap-4 animate-pulse">
            <div className="w-11 h-11 rounded-xl bg-zinc-800 shrink-0" />
            <div className="flex-1 flex justify-between items-center gap-3">
              <div className="flex flex-col gap-2">
                <div className="w-32 h-4 bg-zinc-800 rounded-full" />
                <div className="w-20 h-3 bg-zinc-800 rounded-full" />
              </div>
              <div className="w-12 h-3 bg-zinc-800 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-0 w-full pb-2">
        <ul className="flex flex-col gap-3 w-full">
          {historyData.length > 0 ? (
            historyData.map((item, idx) => (
              <li key={idx}>
                <div className="flex items-center w-full">
                  <div className="flex-1 bg-[#1F1E23] rounded-2xl p-3 flex items-center gap-4 shadow-sm border border-white/5">
                    <div className="w-11 h-11 rounded-xl bg-[#2A292F] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-inner">
                      {item.tbl_students.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0 flex justify-between items-center gap-3">
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-semibold text-white truncate leading-tight">
                          {item.tbl_students.full_name}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono tracking-wider uppercase mt-0.5">
                          <span className="text-white/60">
                            {item.tbl_students.tbl_classes?.class_name || 'N/A'}
                          </span>
                          <span className="opacity-20">•</span>
                          <span className="font-mono tracking-wide">{item.tbl_students.nis}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-white/60 font-mono text-[10px] leading-none">
                          {formatTime(item.created_at)} WIB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center px-6 bg-zinc-900/50 rounded-3xl border border-white/10 shadow-inner">
              <Inbox className="w-12 h-12 mb-3 text-zinc-500 opacity-40" />
              <p className="text-xs font-medium text-zinc-500 tracking-wide">No history available</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default function HistoryPage() {
  const router = useRouter();
  const { displayStatus } = useSholat();
  const [activeTab, setActiveTab] = useState<string>('Dhuhr');
  const { historyData, isLoadingHistory, fetchHistory } = useAttendance();

  const PRAYER_TIMES = [
    { id: 'Dhuhr', label: 'Dhuhr' },
    { id: 'Asr', label: 'Asr' },
    { id: 'Maghrib', label: 'Maghrib' },
    { id: 'Isha', label: 'Isha' },
  ];

  useEffect(() => {
    const initialTab = PRAYER_TIMES.find(t => t.id === displayStatus)?.id || 'Dhuhr';
    setActiveTab(initialTab);
  }, [displayStatus]);

  useEffect(() => {
    fetchHistory(activeTab);
  }, [activeTab, fetchHistory]);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#151419] flex flex-col px-5 pt-4 font-sans overflow-hidden">
      <UnifiedHeader />
 
      {/* TAB NAVIGATION - Persistent/Fixed at the top */}
      <div className="w-full bg-[#1F1E23] rounded-2xl p-1 h-12 flex items-center justify-between gap-1 shadow-inner border border-white/5 mt-4 mb-6">
        {PRAYER_TIMES.map((time) => (
          <button
            key={time.id}
            onClick={() => setActiveTab(time.id)}
            className={`flex-1 h-full rounded-xl text-[10px] font-bold transition-all duration-300 ${activeTab === time.id
              ? 'bg-indigo-600 text-white shadow-sm scale-[1.02]'
              : 'text-white/40 hover:text-white/60'
            }`}
          >
            {time.label}
          </button>
        ))}
      </div>
 
      {/* BODY - The Isolated Scroll Zone */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        <style jsx>{`
          div { -ms-overflow-style: none; scrollbar-width: none; }
          div::-webkit-scrollbar { display: none; }
        `}</style>
        <div className="flex flex-col gap-6">
          <ListContent isLoadingHistory={isLoadingHistory} historyData={historyData} />
        </div>
      </div>
 
      {/* FOOTER - The Safe Zone (No Overlap) */}
      <div className="p-5 flex justify-center items-center bg-transparent">
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
