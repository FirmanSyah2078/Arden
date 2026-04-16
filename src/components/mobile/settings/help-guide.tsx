'use client';

import { X, ClipboardCheck, BookOpen, Info, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HelpGuideProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const GUIDE_DATA = [
  {
    title: 'Manajemen Absensi',
    description: 'Pantau absensi siswa secara real-time. Anda dapat melihat siapa saja yang sudah atau belum hadir.',
    icon: <ClipboardCheck className="w-5 h-5 text-indigo-400" />,
    tip: 'Tips: Gunakan filter waktu untuk mencari data absensi spesifik.'
  },
  {
    title: 'Verifikasi QR',
    description: 'Pastikan sistem QR scanner bekerja optimal. Lakukan kalibrasi jika diperlukan melalui menu core.',
    icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
    tip: 'Tips: Pastikan pencahayaan cukup saat melakukan scan QR.'
  },
  {
    title: 'Laporan Harian',
    description: 'Ekspor data kehadiran menjadi laporan harian untuk diserahkan kepada kepala sekolah.',
    icon: <BookOpen className="w-5 h-5 text-indigo-400" />,
    tip: 'Tips: Laporan otomatis ter-update setiap akhir jam sholat.'
  },
  {
    title: 'Akses Administrator',
    description: 'Kelola hak akses pengguna lain dan atur jadwal sholat untuk seluruh sistem.',
    icon: <Info className="w-5 h-5 text-indigo-400" />,
    tip: 'Tips: Jaga kerahasiaan kredensial akun pelaksana Anda.'
  }
];

export default function HelpGuide({ isOpen, setIsOpen }: HelpGuideProps) {
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

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6 text-indigo-400" />
          </div>
          <DialogTitle className="text-lg font-bold tracking-tight">Pusat Panduan Operasional</DialogTitle>
          <DialogDescription className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
            Operational Harmony Guide
          </DialogDescription>
        </div>

        <ScrollArea className="max-h-[60vh] pr-2">
          <div className="flex flex-col gap-4 pb-4">
            {GUIDE_DATA.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-all group">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-white/40 leading-relaxed">{item.description}</p>
                    <div className="mt-2 p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                      <p className="text-[10px] text-indigo-300/70 font-medium italic">
                        {item.tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}