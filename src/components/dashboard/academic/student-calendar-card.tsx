"use client"

// 🔥 Presentational only — cuma render dari DayCell[] yang sudah dihitung di hooks.
// Dibungkus card (rounded-3xl, border-white/5, bg-card) biar senada sama panel
// lain di dashboard, dan sel-selnya dibesarin supaya nggak berdesakan.

import { AlertTriangle, ChevronLeft, ChevronRight, Clock3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { DayCell } from "@/lib/academic/cycle-engine"

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const PHASE_CELL_STYLE: Record<string, string> = {
  minimal: "bg-minimal/15 border-minimal/40 text-minimal",
  standard: "bg-standard/15 border-standard/40 text-standard",
  maximal: "bg-maximal/15 border-maximal/40 text-maximal",
  over: "bg-over/15 border-over/40 text-over",
}

const LEGEND_ITEMS: { key: string; label: string; swatchClass: string }[] = [
  { key: "minimal", label: "Minimum", swatchClass: "bg-minimal" },
  { key: "standard", label: "Standard", swatchClass: "bg-standard" },
  { key: "maximal", label: "Maximum", swatchClass: "bg-maximal" },
  { key: "over", label: "Over", swatchClass: "bg-over" },
]

interface StudentCalendarCardProps {
  year: number
  month: number
  days: DayCell[]
  onPrevMonth: () => void
  onNextMonth: () => void
}

export function StudentCalendarCard({ year, month, days, onPrevMonth, onNextMonth }: StudentCalendarCardProps) {
  // Senin sebagai kolom pertama (Mo..Su) — geser offset hari pertama bulan
  const firstDayOfMonth = new Date(year, month, 1).getDay() // 0 Sun .. 6 Sat
  const leadingBlanks = (firstDayOfMonth + 6) % 7

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl border border-white/5 bg-card/40 p-6 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <h4 className="font-jakarta text-[16px] font-bold text-foreground">
          {MONTH_LABELS[month]} {year}
        </h4>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="icon-sm" className="rounded-full bg-white/3 hover:bg-accent" onClick={onPrevMonth}>
            <ChevronLeft className="size-3.5" />
          </Button>
          <Button variant="outline" size="icon-sm" className="rounded-full bg-white/3 hover:bg-accent" onClick={onNextMonth}>
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 pb-1">
            {label}
          </span>
        ))}

        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {days.map((day) => {
          const phaseClass = day.phase ? PHASE_CELL_STYLE[day.phase] : null
          const baseClass = phaseClass ?? (day.isHoliday
            ? "bg-destructive/10 border-destructive/20 text-destructive/70"
            : "bg-white/2 border-white/5 text-foreground/80")

          return (
            <div
              key={day.dateISO}
              className={cn(
                "relative aspect-square rounded-xl flex items-center justify-center text-[14px] font-semibold border transition-colors",
                baseClass,
                day.isPending && "border-dashed opacity-70",
                day.isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
              title={
                day.phase
                  ? `Hari ke-${day.cycleDay} — fase ${day.phase}${day.isPending ? " (proyeksi, belum dikonfirmasi)" : ""}`
                  : day.isHoliday
                    ? "Libur"
                    : undefined
              }
            >
              {day.dayNumber}
              {day.isPending && (
                <Clock3 className="absolute -top-1.5 -right-1.5 size-3.5 text-muted-foreground bg-background rounded-full p-0.5" />
              )}
              {day.isAnomalyStart && (
                <AlertTriangle className="absolute -bottom-1.5 -right-1.5 size-3.5 text-amber-400 bg-background rounded-full p-0.5" />
              )}
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-white/5">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.key} className="flex items-center gap-1.5">
            <span className={cn("size-2.5 rounded-full", item.swatchClass)} />
            <span className="text-[11px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <Clock3 className="size-3 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">Proyeksi (libur)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="size-3 text-amber-400" />
          <span className="text-[11px] text-muted-foreground">Anomali interval</span>
        </div>
      </div>
    </div>
  )
}