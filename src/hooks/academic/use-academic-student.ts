"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  getClassBySlug, 
  getStudentByNanoId, 
  dummyCyclePeriodsByStudent, 
  dummyHolidayDates, 
  dummyIntervalThresholdDays, 
  dummyPhaseConfig, 
  dummyTodayISO 
} from "@/lib/dumy-class";
import { 
  buildMonthCalendar, 
  classifyPhase, 
  computeIntervalDays, 
  diffDays 
} from "@/lib/academic/cycle-engine";

export function useAcademicStudent(slug: string, nanoId: string) {
  const [activeTab, setActiveTab] = useState<"calendar" | "qr">("calendar");
  const [qrRevealed, setQrRevealed] = useState(false);
  const [qrConfirmOpen, setQrConfirmOpen] = useState(false);

  const classData = useMemo(() => getClassBySlug(slug), [slug]);
  const currentStudent = useMemo(() => getStudentByNanoId(nanoId), [nanoId]);

  // 🔥 Reset QR State jika berpindah tab, mengamankan privasi
  useEffect(() => { 
    setQrRevealed(false); 
    setQrConfirmOpen(false); 
  }, [activeTab]);

  const today = useMemo(() => {
    const [y, m, d] = dummyTodayISO.split("-").map(Number);
    return { year: y, month: m - 1, day: d };
  }, []);

  const [viewYear, setViewYear] = useState(today.year);
  const [viewMonth, setViewMonth] = useState(today.month);

  const periods = useMemo(() => (currentStudent ? dummyCyclePeriodsByStudent[currentStudent.id] ?? [] : []), [currentStudent]);

  const calendarDays = useMemo(() => buildMonthCalendar({
    year: viewYear, month: viewMonth, periods, holidaySet: dummyHolidayDates,
    phaseConfig: dummyPhaseConfig, intervalThresholdDays: dummyIntervalThresholdDays, todayISO: dummyTodayISO,
  }), [viewYear, viewMonth, periods]);

  const historyRows = useMemo(() => {
    const sorted = [...periods].sort((a, b) => a.startDate.localeCompare(b.startDate));
    return sorted.map((period, index) => {
      const referenceEnd = period.confirmedEndDate ?? dummyTodayISO;
      const durationDays = diffDays(period.startDate, referenceEnd) + 1;
      const interval = computeIntervalDays(period, sorted[index - 1]);
      return {
        id: period.id, 
        startDate: period.startDate, 
        endDate: period.confirmedEndDate, 
        durationDays,
        phase: classifyPhase(durationDays, dummyPhaseConfig), 
        isOngoing: period.confirmedEndDate === null,
        isAnomalyInterval: interval !== null && interval < dummyIntervalThresholdDays, 
        source: period.source,
      };
    });
  }, [periods]);

  const goToPrevMonth = () => setViewMonth(m => m === 0 ? (setViewYear(y => y - 1), 11) : m - 1);
  const goToNextMonth = () => setViewMonth(m => m === 11 ? (setViewYear(y => y + 1), 0) : m + 1);

  return {
    classData, currentStudent, 
    activeTab, setActiveTab,
    viewYear, viewMonth, goToPrevMonth, goToNextMonth,
    calendarDays, historyRows,
    qrRevealed, qrConfirmOpen, 
    requestQrReveal: () => setQrConfirmOpen(true),
    confirmQrReveal: () => { setQrRevealed(true); setQrConfirmOpen(false); },
    cancelQrReveal: () => setQrConfirmOpen(false),
    hideQr: () => setQrRevealed(false),
  };
}