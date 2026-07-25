"use client";

// 🔥 Page ini CUMA komposisi. Tidak ada dummy data, tidak ada perhitungan fase/kalender
// di sini — semua itu ada di useView() (hooks/academic/use-view.ts) dan cycle-engine.ts.

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar as CalendarIcon, Clock, QrCode, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useView } from "@/hooks/academic/use-view";
import { StudentListPanel } from "@/components/dashboard/academic/student-list-panel";
import { StudentProfileCard } from "@/components/dashboard/academic/student-profile-card";
import { StudentCalendarCard } from "@/components/dashboard/academic/student-calendar-card";
import { StudentQrCard } from "@/components/dashboard/academic/student-qr-card";
import { StudentHistoryTable } from "@/components/dashboard/academic/student-history-table";

export default function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);

  const {
    dummyClassName,
    searchQuery, setSearchQuery, filteredStudents,
    selectedStudentId, setSelectedStudentId, currentStudent,
    rightTab, setRightTab,
    viewYear, viewMonth, goToPrevMonth, goToNextMonth, calendarDays,
    historyRows,
    qrRevealed, qrConfirmOpen, requestQrReveal, confirmQrReveal, cancelQrReveal, hideQr,
  } = useView(resolvedParams.id);

  return (
    <>
      <header className="flex items-center gap-4 shrink-0">
        <Button
          variant="outline" size="icon" onClick={() => router.back()}
          className="rounded-full bg-card hover:bg-accent transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-jakarta">
            {dummyClassName}
          </h1>
          <p className="text-sm text-muted-foreground font-inter">
            Detailed view and analytics for this class.
          </p>
        </div>
      </header>

      <main className="flex-1 w-full mt-6 flex flex-col lg:flex-row gap-8 min-h-0 lg:h-[calc(100vh-140px)]">
        <StudentListPanel
          students={filteredStudents}
          selectedStudentId={selectedStudentId}
          onSelectStudent={setSelectedStudentId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="flex-1 flex flex-col gap-8 overflow-y-auto smooth-scrollbar lg:pr-4 pb-12">
          {currentStudent ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                <StudentProfileCard
                  name={currentStudent.name}
                  nis={currentStudent.nis}
                  notes={currentStudent.notes}
                />

                <div className="flex flex-col items-center gap-6 pt-2 w-full">
                  <div className="flex gap-3 w-fit">
                    <Button
                      variant="ghost"
                      className={cn(
                        "h-10 px-5 sm:px-6 rounded-xl gap-2 font-bold text-xs transition-all",
                        rightTab === "calendar"
                          ? "bg-primary text-black hover:bg-primary/90 shadow-lg"
                          : "bg-white/3 border border-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                      )}
                      onClick={() => setRightTab("calendar")}
                    >
                      <CalendarIcon className="size-4" /> Calendar
                    </Button>
                    <Button
                      variant="ghost"
                      className={cn(
                        "h-10 px-5 sm:px-6 rounded-xl gap-2 font-bold text-xs transition-all",
                        rightTab === "qr"
                          ? "bg-primary text-black hover:bg-primary/90 shadow-lg"
                          : "bg-white/3 border border-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                      )}
                      onClick={() => setRightTab("qr")}
                    >
                      <QrCode className="size-4" /> QR Code
                    </Button>
                  </div>

                  <div className="w-full flex items-center justify-center min-h-65">
                    {rightTab === "calendar" ? (
                      <StudentCalendarCard
                        year={viewYear}
                        month={viewMonth}
                        days={calendarDays}
                        onPrevMonth={goToPrevMonth}
                        onNextMonth={goToNextMonth}
                      />
                    ) : (
                      <StudentQrCard
                        icode={currentStudent.icode}
                        revealed={qrRevealed}
                        confirmOpen={qrConfirmOpen}
                        onRequestReveal={requestQrReveal}
                        onConfirmReveal={confirmQrReveal}
                        onCancelReveal={cancelQrReveal}
                        onHide={hideQr}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5 mt-4">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  <h3 className="font-jakarta text-sm font-bold text-foreground">Riwayat Siklus Biologis</h3>
                </div>
                <StudentHistoryTable rows={historyRows} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 mt-20">
              <User className="size-16 text-muted-foreground/50 mb-4" />
              <p className="text-sm font-bold tracking-widest uppercase text-foreground">Pilih Siswi Untuk Detail</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
