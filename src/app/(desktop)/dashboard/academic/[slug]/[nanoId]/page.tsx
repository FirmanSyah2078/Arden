"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Fingerprint, CalendarIcon, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useAcademicStudent } from "@/hooks/academic/use-academic-student";
import { StudentCalendarCard } from "@/components/dashboard/academic/student-calendar-card";
import { StudentQrCard } from "@/components/dashboard/academic/student-qr-card";
import { StudentHistoryTable } from "@/components/dashboard/academic/student-history-table";

export default function StudentDetailPage({ params }: { params: Promise<{ slug: string, nanoId: string }> }) {
  const router = useRouter();
  const { slug, nanoId } = use(params);
  const v = useAcademicStudent(slug, nanoId);

  if (!v.currentStudent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-foreground font-bold text-center text-base">Siswi Tidak Ditemukan</p>
        <Button variant="outline" onClick={() => router.push(`/dashboard/academic/${slug}`)} className="rounded-full">
          <ArrowLeft className="size-4 mr-2" /> Kembali ke Daftar Kelas
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-6 max-w-350 mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* BREADCRUMBS & HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-white/5 pb-4">
        <Button variant="outline" size="icon" onClick={() => router.push(`/dashboard/academic/${slug}`)} className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-white shrink-0 transition-transform hover:-translate-x-1">
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex flex-wrap items-center text-xs font-semibold tracking-wide uppercase">
          <span className="text-muted-foreground cursor-pointer hover:text-white transition-colors" onClick={() => router.push('/dashboard/academic')}>Academic</span>
          <span className="text-muted-foreground mx-2">/</span>
          <span className="text-muted-foreground cursor-pointer hover:text-white transition-colors" onClick={() => router.push(`/dashboard/academic/${slug}`)}>{v.classData?.name}</span>
          <span className="text-muted-foreground mx-2">/</span>
          <span className="text-primary truncate max-w-50 sm:max-w-none">{v.currentStudent.name}</span>
        </div>
      </header>

      {/* BENTO GRID MAIN AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* BENTO 1: PROFILE (Top Left) */}
        <div className="lg:col-span-4 bg-card border border-white/5 rounded-4xl p-8 flex flex-col shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-5">
             <span className="text-[9px] font-black tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full uppercase shadow-sm">
               Verified
             </span>
          </div>
          <div className="size-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner group-hover:border-primary/30 transition-colors duration-500">
            <User className="size-10 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h2 className="text-2xl font-bold text-foreground font-jakarta leading-tight mb-3">{v.currentStudent.name}</h2>
          <div className="flex items-center gap-2.5 text-muted-foreground text-[13px] font-mono mb-8 bg-black/20 w-fit px-3 py-1.5 rounded-lg border border-white/5">
            <Fingerprint className="size-4 text-primary/70" /> NIS: {v.currentStudent.nis}
          </div>
          <div className="mt-auto bg-white/2 border border-white/5 rounded-2xl p-5">
             <p className="text-[12px] text-muted-foreground italic leading-relaxed">
               {v.currentStudent.notes || "Sistem menyatakan tidak ada riwayat medis anomali khusus untuk siswi ini."}
             </p>
          </div>
        </div>

        {/* BENTO 2: HUB - CALENDAR & QR (Top Right) */}
        <div className="lg:col-span-8 bg-card border border-white/5 rounded-4xl p-8 shadow-xl flex flex-col min-h-112.5">

          {/* Custom Switcher Premium */}
          <div className="flex bg-[#0a0a0a] p-1.5 rounded-2xl border border-white/5 w-fit mb-8 shadow-inner">
            <button onClick={() => v.setActiveTab("calendar")} className={cn("flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300", v.activeTab === "calendar" ? "bg-white/10 text-foreground shadow-md ring-1 ring-white/10" : "text-muted-foreground hover:text-foreground hover:bg-white/5")}>
               <CalendarIcon className="size-4" /> Data Engine Calendar
            </button>
            <button onClick={() => v.setActiveTab("qr")} className={cn("flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300", v.activeTab === "qr" ? "bg-white/10 text-foreground shadow-md ring-1 ring-white/10" : "text-muted-foreground hover:text-foreground hover:bg-white/5")}>
               <QrCode className="size-4" /> iCode Emergency
            </button>
          </div>

          {/* RENDER CONTENT */}
          <div className="flex-1 flex items-center justify-center w-full">
            {v.activeTab === "calendar" ? (
               <StudentCalendarCard year={v.viewYear} month={v.viewMonth} days={v.calendarDays} onPrevMonth={v.goToPrevMonth} onNextMonth={v.goToNextMonth} />
            ) : (
               <StudentQrCard icode={v.currentStudent.icode} revealed={v.qrRevealed} confirmOpen={v.qrConfirmOpen} onRequestReveal={v.requestQrReveal} onConfirmReveal={v.confirmQrReveal} onCancelReveal={v.cancelQrReveal} onHide={v.hideQr} />
            )}
          </div>
        </div>
      </div>

      {/* BENTO GRID: BOTTOM ROW (History Table) */}
      <div className="bg-card border border-white/5 rounded-4xl p-8 shadow-xl">
        <h3 className="text-xs font-bold text-muted-foreground mb-6 uppercase tracking-[0.2em] font-jakarta">Recent Cycles History</h3>
        <StudentHistoryTable rows={v.historyRows} />
      </div>

    </div>
  );
}