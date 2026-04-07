'use client';

import { useEffect, useState } from 'react';
import { Info, Clock, Inbox, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DailyPrayer } from '@/types/api';
import { useAttendance } from '@/hooks/mobile/use-attendance'; 

import { formatTime } from '@/lib/date';

interface HistoryProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  sholat: DailyPrayer;
}

export default function History({ isOpen, setIsOpen }: HistoryProps) {
  const [activeTab, setActiveTab] = useState<string>('Dhuhr');
  const { historyData, isLoadingHistory, fetchHistory } = useAttendance();

  useEffect(() => {
    if (isOpen) fetchHistory(activeTab);
  }, [isOpen, activeTab, fetchHistory]);

  const ListContent = () => (
    <div className="flex flex-col h-full">
      <div className="w-full flex items-start gap-2.5 p-3 mb-4 bg-[#1F1E23] border border-white/5 rounded-xl shadow-sm">
        <Info className="text-white/40 w-4 h-4 shrink-0 mt-px" />
        <p className="text-[11px] leading-relaxed text-white/60 font-medium">Menampilkan riwayat hari ini. Data direset otomatis setiap pukul 00:00 WIB.</p>
      </div>

      <ScrollArea className="h-[40vh] w-full">
        <ul className="flex flex-col gap-2 w-full pb-2">
          {isLoadingHistory ? (
            <div className="flex w-full p-4 items-center justify-center gap-3 text-white/50">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-mono">Loading data...</span>
            </div>
          ) : historyData.length > 0 ? (
            historyData.map((item, idx) => (
              <li key={idx} className="w-full bg-[#1F1E23] border border-white/5 rounded-2xl p-3.5 flex items-center justify-between gap-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.tbl_students.full_name}</p>
                  <div className="flex items-center gap-2 text-[10px] text-white/40 mt-0.5">
                    <span className="font-mono tracking-wide">{item.tbl_students.nis}</span>
                  </div>
                </div>
                <div className="font-mono tracking-wide text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded shrink-0">
                  {formatTime(item.created_at)} WIB
                </div>
              </li>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-white/30 bg-[#1F1E23]/50 border border-white/5 rounded-2xl border-dashed">
              <Inbox className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs mt-3 font-medium tracking-wide">Belum ada riwayat kehadiran</p>
            </div>
          )}
        </ul>
      </ScrollArea>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[90%] max-w-95 sm:max-w-100 rounded-[16px] bg-[#151419] border-[#27272A] text-white p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-white/70" /> Riwayat Kehadiran
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="Dhuhr" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-[#1F1E23] border border-white/5 p-1 h-auto rounded-xl">
            <TabsTrigger value="Dhuhr" className="rounded-lg py-2 data-[state=active]:bg-[#27272A] data-[state=active]:text-white text-white/50 transition-all font-medium text-xs">Dzuhur</TabsTrigger>
            <TabsTrigger value="Asr" className="rounded-lg py-2 data-[state=active]:bg-[#27272A] data-[state=active]:text-white text-white/50 transition-all font-medium text-xs">Ashar</TabsTrigger>
          </TabsList>
          <TabsContent value="Dhuhr" className="mt-4"><ListContent /></TabsContent>
          <TabsContent value="Asr" className="mt-4"><ListContent /></TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}