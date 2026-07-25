"use client"

// 🔥 SEMUA logika & dummy detail siswi hidup di sini, bukan di komponen/page.
// Page & komponen di bawah cuma nerima props hasil hook ini (presentational only).

import { useEffect, useMemo, useState } from "react"
import {
  dummyClasses,
  getStudentsByClassId,
  dummyCyclePeriodsByStudent,
  dummyHolidayDates,
  dummyIntervalThresholdDays,
  dummyPhaseConfig,
  dummyTodayISO,
} from "@/lib/dumy-class"
import {
  buildMonthCalendar,
  classifyPhase,
  computeIntervalDays,
  diffDays,
  type DayCell,
  type PhaseKey,
} from "@/lib/academic/cycle-engine"

export interface HistoryRow {
  id: number
  startDate: string
  endDate: string | null
  durationDays: number
  phase: PhaseKey
  isOngoing: boolean
  isAnomalyInterval: boolean
  source: "pelaksana" | "mandiri_libur"
}

export function useView(classIdStr: string) {
  const classId = Number(classIdStr)

  const [searchQuery, setSearchQuery] = useState("")
  const [rightTab, setRightTab] = useState<"calendar" | "qr">("calendar")

  // 🔥 FIX konsep: panel kanan WAJIB kosong sampai ada siswi yang diklik —
  // sebelumnya default ke classStudents[0], sekarang default null.
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)

  const today = useMemo(() => {
    const [y, m, d] = dummyTodayISO.split("-").map(Number)
    return { year: y, month: m - 1, day: d }
  }, [])

  const [viewYear, setViewYear] = useState(today.year)
  const [viewMonth, setViewMonth] = useState(today.month)

  // 🔥 Gate 2-langkah QR — selalu mulai TERTUTUP, tidak boleh ada state awal "terbuka"
  const [qrRevealed, setQrRevealed] = useState(false)
  const [qrConfirmOpen, setQrConfirmOpen] = useState(false)

  const classData = useMemo(() => dummyClasses.find((c) => c.id === classId), [classId])
  const classStudents = useMemo(() => getStudentsByClassId(classId), [classId])

  const filteredStudents = useMemo(
    () =>
      classStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.icode.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [classStudents, searchQuery]
  )

  const currentStudent = useMemo(
    () => classStudents.find((s) => s.id === selectedStudentId),
    [classStudents, selectedStudentId]
  )

  const dummyClassName = classData
    ? `${classData.name} (${classData.academic_year})`
    : "Kelas Tidak Ditemukan"

  // 🔥 Ganti siswi ATAU pindah tab → QR wajib balik ke tertutup.
  // Ini yang mencegah "kebuka nyangkut" kalau ter-klik tidak sengaja.
  useEffect(() => {
    setQrRevealed(false)
    setQrConfirmOpen(false)
  }, [selectedStudentId, rightTab])

  const periods = useMemo(
    () => (selectedStudentId ? dummyCyclePeriodsByStudent[selectedStudentId] ?? [] : []),
    [selectedStudentId]
  )

  const calendarDays: DayCell[] = useMemo(
    () =>
      buildMonthCalendar({
        year: viewYear,
        month: viewMonth,
        periods,
        holidaySet: dummyHolidayDates,
        phaseConfig: dummyPhaseConfig,
        intervalThresholdDays: dummyIntervalThresholdDays,
        todayISO: dummyTodayISO,
      }),
    [viewYear, viewMonth, periods]
  )

  const historyRows: HistoryRow[] = useMemo(() => {
    const sorted = [...periods].sort((a, b) => a.startDate.localeCompare(b.startDate))
    return sorted.map((period, index) => {
      const referenceEnd = period.confirmedEndDate ?? dummyTodayISO
      const durationDays = diffDays(period.startDate, referenceEnd) + 1
      const interval = computeIntervalDays(period, sorted[index - 1])
      return {
        id: period.id,
        startDate: period.startDate,
        endDate: period.confirmedEndDate,
        durationDays,
        phase: classifyPhase(durationDays, dummyPhaseConfig),
        isOngoing: period.confirmedEndDate === null,
        isAnomalyInterval: interval !== null && interval < dummyIntervalThresholdDays,
        source: period.source,
      }
    })
  }, [periods])

  const goToPrevMonth = () => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1)
        return 11
      }
      return m - 1
    })
  }

  const goToNextMonth = () => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1)
        return 0
      }
      return m + 1
    })
  }

  const requestQrReveal = () => setQrConfirmOpen(true)
  const confirmQrReveal = () => {
    setQrRevealed(true)
    setQrConfirmOpen(false)
  }
  const cancelQrReveal = () => setQrConfirmOpen(false)
  const hideQr = () => setQrRevealed(false)

  return {
    classId,
    dummyClassName,
    searchQuery,
    setSearchQuery,
    filteredStudents,
    selectedStudentId,
    setSelectedStudentId,
    currentStudent,
    rightTab,
    setRightTab,
    viewYear,
    viewMonth,
    goToPrevMonth,
    goToNextMonth,
    calendarDays,
    historyRows,
    qrRevealed,
    qrConfirmOpen,
    requestQrReveal,
    confirmQrReveal,
    cancelQrReveal,
    hideQr,
  }
}