"use client";

import { useEffect, useState } from 'react';
import { Inbox, Loader2 } from 'lucide-react';
import { UnifiedHeader } from '@/components/mobile/ui/unified-header';
import { StatusCard } from '@/components/mobile/core/status-card';
import { useAttendance } from '@/hooks/mobile/use-attendance';
import { formatTime } from '@/lib/date';
import { useSholat } from '@/hooks/mobile/use-sholat';

// --- LIST COMPONENT (High-End Luxury Implementation) ---
const ListContent = ({ isLoadingHistory, historyData }: { isLoadingHistory: boolean, historyData: any[] }) => (
  <div className="flex flex-col w-full">
    <div className="flex flex-col gap-0 w-full pb-2">
      <ul className="flex flex-col gap-3 w-full">
        {isLoadingHistory ? (
          <div className="flex w-full py-12 items-center justify-center gap-3 text-white/30">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-mono tracking-widest uppercase">Loading...</span>
          </div>
        ) : historyData.length > 0 ? (
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
          <div className="flex flex-col items-center justify-center h-40 text-white/20 bg-[#1F1E23] rounded-3xl border-2 border-dashed border-white/5">
            <Inbox className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-xs font-medium tracking-wide">No history available</p>
          </div>
        )}
      </ul>
    </div>
  </div>
);

export default function HistoryPage() {
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

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="flex flex-col gap-6">
          
          {/* Tab Navigation - Material Solid Surface */}
          <div className="w-full bg-[#1F1E23] rounded-2xl p-1 h-12 flex items-center justify-between gap-1 shadow-inner border border-white/5">
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

          <ListContent isLoadingHistory={isLoadingHistory} historyData={historyData} />
        </div>
      </div>
    </div>
  );
}
