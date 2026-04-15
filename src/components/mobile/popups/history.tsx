'use client';

import { useEffect, useState } from 'react';
import { Clock, Inbox, Loader2, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DailyPrayer } from '@/types/api';
import { useAttendance } from '@/hooks/mobile/use-attendance';

import { formatTime } from '@/lib/date';

interface HistoryProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  sholat: DailyPrayer;
}

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

  const ListContent = () => (
    <div className="flex flex-col w-full">
      <ScrollArea className="max-h-[45vh] w-full pr-2">
        <ul className="flex flex-col gap-2 w-full pb-2">
          {isLoadingHistory ? (
            <div className="flex w-full py-12 items-center justify-center gap-3 text-white/30">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-xs font-mono tracking-widest uppercase">Loading...</span>
            </div>
          ) : historyData.length > 0 ? (
            historyData.map((item, idx) => (
              <li
                key={idx}
                className="w-full bg-white/2 border border-white/5 rounded-2xl p-3 flex items-center justify-between gap-3 transition-all active:scale-[0.98] group hover:border-white/10"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40 shrink-0 group-hover:bg-indigo-500/10 group-hover:text-indigo-300 transition-colors">
                    {item.tbl_students.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-semibold text-white truncate leading-none mb-1">{item.tbl_students.full_name}</p>
                    <p className="text-[10px] font-mono text-white/30 tracking-wide">{item.tbl_students.nis}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="font-mono text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                    {formatTime(item.created_at)}
                  </div>
                  <span className="text-[8px] text-white/20 font-bold uppercase tracking-tighter">WIB</span>
                </div>
              </li>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-white/20 bg-white/2 border border-white/5 rounded-3xl border-dashed">
              <Inbox className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-xs font-medium tracking-wide">Belum ada riwayat</p>
            </div>
          )}
        </ul>
      </ScrollArea>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        showCloseButton={false}
        className="w-[92%] max-w-sm rounded-3xl bg-[#151419] border-white/10 text-white p-6 shadow-2xl"
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90 z-10"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-indigo-400" />
          <DialogTitle className="text-lg font-bold tracking-tight">Riwayat Kehadiran</DialogTitle>
        </div>

        <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-1 h-12 flex items-center gap-1 mb-6 shadow-lg">
          <button
            onClick={() => setActiveTab('Dhuhr')}
            className={`flex-1 h-full rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'Dhuhr'
                ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 shadow-inner'
                : 'text-white/40 hover:text-white/60'
              }`}
          >
            Dzuhur
          </button>
          <button
            onClick={() => setActiveTab('Asr')}
            className={`flex-1 h-full rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'Asr'
                ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 shadow-inner'
                : 'text-white/40 hover:text-white/60'
              }`}
          >
            Ashar
          </button>
        </div>

        <div className="mt-2">
          {activeTab === 'Dhuhr' ? <ListContent /> : <ListContent />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
