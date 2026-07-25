// src/lib/cycle-engine.ts
//
// 🔥 LOGIKA MURNI (tidak ada dummy data / UI di sini).
// Semua aturan yang sudah didiskusikan dituangkan jadi fungsi di file ini:
// - checklist 2/2 & kontinuitas periode → direpresentasikan lewat CyclePeriod
//   (startDate = hari resmi 2/2 terpenuhi, confirmedEndDate = null selama masih berjalan)
// - libur tetap dihitung dalam durasi (tidak "pause")
// - proyeksi durasi tetap jalan walau lagi libur, ditandai isPending (lihat catatan di buildMonthCalendar)
// - dua sumbu anomali dipisah: fase durasi (classifyPhase) vs interval antar-periode (computeIntervalDays)

export type PhaseKey = "minimal" | "standard" | "maximal" | "over"

/** Threshold hari, mengikuti setting fitur Phases (Minimum/Standard/Maximum). Di atas `maximum` = "over". */
export interface PhaseConfig {
  minimum: number
  standard: number
  maximum: number
}

export interface CyclePeriod {
  id: number
  /** ISO yyyy-mm-dd — hari ke-1 resmi (checklist 2/2 terpenuhi, atau konfirmasi mandiri saat libur) */
  startDate: string
  /** null = periode masih berjalan / belum ada konfirmasi akhir */
  confirmedEndDate: string | null
  source: "pelaksana" | "mandiri_libur"
}

export interface DayCell {
  dateISO: string
  dayNumber: number
  isToday: boolean
  isHoliday: boolean
  isWeekend: boolean
  phase: PhaseKey | null
  /** hari ke berapa dalam periode ini (1 = hari pertama) */
  cycleDay: number | null
  /** proyeksi otomatis selama libur untuk periode yang belum dikonfirmasi — belum resmi jadi warning */
  isPending: boolean
  /** hari pertama periode ini terlalu dekat dari akhir periode sebelumnya (anomali interval) */
  isAnomalyStart: boolean
}

const DAY_MS = 24 * 60 * 60 * 1000

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

/** Format tanggal jadi ISO yyyy-mm-dd TANPA lewat Date.toISOString (menghindari pergeseran timezone). */
export function formatISO(year: number, month: number, day: number) {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`
}

/** Selisih hari antara dua tanggal ISO (b - a), dihitung di UTC supaya konsisten. */
export function diffDays(aISO: string, bISO: string) {
  const [ay, am, ad] = aISO.split("-").map(Number)
  const [by, bm, bd] = bISO.split("-").map(Number)
  const a = Date.UTC(ay, am - 1, ad)
  const b = Date.UTC(by, bm - 1, bd)
  return Math.round((b - a) / DAY_MS)
}

/** Klasifikasi fase berdasar hari ke berapa dalam periode (1-based). */
export function classifyPhase(cycleDay: number, config: PhaseConfig): PhaseKey {
  if (cycleDay <= config.minimum) return "minimal"
  if (cycleDay <= config.standard) return "standard"
  if (cycleDay <= config.maximum) return "maximal"
  return "over"
}

/**
 * Interval (hari) dari akhir periode SEBELUMNYA ke mulai periode ini.
 * Return null kalau tidak ada periode sebelumnya yang sudah confirmed untuk dibandingkan.
 */
export function computeIntervalDays(
  period: CyclePeriod,
  previousPeriod: CyclePeriod | undefined
): number | null {
  if (!previousPeriod?.confirmedEndDate) return null
  return diffDays(previousPeriod.confirmedEndDate, period.startDate)
}

interface BuildMonthCalendarArgs {
  year: number
  /** 0-11 */
  month: number
  periods: CyclePeriod[]
  /** tanggal merah (libur nasional/sekolah), di luar weekend */
  holidaySet: Set<string>
  phaseConfig: PhaseConfig
  intervalThresholdDays: number
  todayISO: string
}

/**
 * Bangun grid 1 bulan kalender siswi. Weekend & holidaySet dianggap "libur" (prioritas
 * tertinggi untuk status sistem-aktif), TAPI durasi periode yang sedang berjalan tetap
 * dihitung menembus hari libur (kontinuitas) — hari libur di dalam periode yang belum
 * confirmed ditandai isPending=true (proyeksi, nunggu konfirmasi di hari aktif berikutnya).
 */
export function buildMonthCalendar({
  year,
  month,
  periods,
  holidaySet,
  phaseConfig,
  intervalThresholdDays,
  todayISO,
}: BuildMonthCalendarArgs): DayCell[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const sortedPeriods = [...periods].sort((a, b) => a.startDate.localeCompare(b.startDate))
  const cells: DayCell[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    const dateISO = formatISO(year, month, day)
    const dow = new Date(year, month, day).getDay() // 0 Sun .. 6 Sat
    const isWeekend = dow === 0 || dow === 6
    const isHoliday = isWeekend || holidaySet.has(dateISO)
    const isFuture = dateISO > todayISO

    let phase: PhaseKey | null = null
    let cycleDay: number | null = null
    let isPending = false
    let isAnomalyStart = false

    if (!isFuture) {
      const periodIndex = sortedPeriods.findIndex((p) => {
        const end = p.confirmedEndDate ?? todayISO
        return dateISO >= p.startDate && dateISO <= end
      })

      if (periodIndex !== -1) {
        const period = sortedPeriods[periodIndex]
        cycleDay = diffDays(period.startDate, dateISO) + 1
        phase = classifyPhase(cycleDay, phaseConfig)
        // Proyeksi: periode masih berjalan (belum confirmed) dan hari ini kebetulan libur —
        // warna tetap ditampilkan (kontinuitas), tapi ini belum "resmi" sampai hari aktif berikutnya.
        isPending = period.confirmedEndDate === null && isHoliday

        if (dateISO === period.startDate) {
          const prev = sortedPeriods[periodIndex - 1]
          const interval = computeIntervalDays(period, prev)
          isAnomalyStart = interval !== null && interval < intervalThresholdDays
        }
      }
    }

    cells.push({
      dateISO,
      dayNumber: day,
      isToday: dateISO === todayISO,
      isHoliday,
      isWeekend,
      phase,
      cycleDay,
      isPending,
      isAnomalyStart,
    })
  }

  return cells
}
