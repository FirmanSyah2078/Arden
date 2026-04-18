"use client";

import { useEffect, useState } from 'react';
import { Inbox, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DailyPrayer } from '@/types/api';
import { useAttendance } from '@/hooks/mobile/use-attendance';

import { formatTime } from '@/lib/date';

interface HistoryProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  sholat: DailyPrayer;
}

// --- LIST COMPONENT (High-End Luxury Implementation) ---
const ListContent = ({ isLoadingHistory, historyData }: { isLoadingHistory: boolean, historyData: any[] }) => (
  <div className="flex flex-col w-full">
    {/* Custom scroll area with hidden scrollbar for a seamless mobile experience */}
    <div className="max-h-[50vh] w-full overflow-y-auto overscroll-contain pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                  {/* Student Item Card - Material Solid Surface */}
                  <div className="flex-1 bg-[#1F1E23] rounded-2xl p-3 flex items-center gap-4 shadow-sm">

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
  </div>
);

export default function History({ isOpen, setIsOpen, sholat }: HistoryProps) {
  const [activeTab, setActiveTab] = useState<string>('Dhuhr');
  const { historyData, isLoadingHistory, fetchHistory } = useAttendance();

  useEffect(() => {
    if (isOpen && sholat) {
      const initialTab = sholat === 'Dhuhr' ? 'Dhuhr' : sholat === 'Asr' ? 'Asr' : 'Dhuhr';
      setActiveTab(initialTab);
    }
  }, [isOpen, sholat]);

  useEffect(() => {
    if (isOpen) fetchHistory(activeTab);
  }, [isOpen, activeTab, fetchHistory]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        showCloseButton={false}
        className="w-[92%] max-w-sm rounded-3xl bg-[#151419] border-none text-white p-6 shadow-2xl"
      >
        {/* Header Section - professional English */}
        <div className="flex flex-col gap-1 mb-6 pb-4 border-b border-white/5">
          <DialogTitle className="text-xl font-bold tracking-tight text-white">
            Attendance History
          </DialogTitle>
          <DialogDescription className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
            Attendance History Logs
          </DialogDescription>
        </div>

        {/* Tab Navigation - Material Solid Surface */}
        <div className="w-full bg-[#1F1E23] rounded-2xl p-1 h-12 flex items-center gap-1 mb-6 shadow-inner">
          <button
            onClick={() => setActiveTab('Dhuhr')}
            className={`flex-1 h-full rounded-xl text-xs font-bold transition-all duration-200 ${activeTab === 'Dhuhr'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-white/40 hover:text-white/60'
              }`}
          >
            Dhuhr
          </button>
          <button
            onClick={() => setActiveTab('Asr')}
            className={`flex-1 h-full rounded-xl text-xs font-bold transition-all duration-200 ${activeTab === 'Asr'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-white/40 hover:text-white/60'
              }`}
          >
            Asr
          </button>
        </div>

        <div className="mt-2">
          <ListContent isLoadingHistory={isLoadingHistory} historyData={historyData} />
        </div>
      </DialogContent>
    </Dialog>
  );
}