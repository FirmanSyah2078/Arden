// 🔥 Presentational only — rows sudah dihitung penuh (durasi, fase, anomali) di hooks.

import { AlertTriangle, CheckCircle2, Clock, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { HistoryRow } from "@/hooks/academic/use-view"

const PHASE_LABEL: Record<string, string> = {
  minimal: "Minimum",
  standard: "Standard",
  maximal: "Maximum",
  over: "Over",
}

const PHASE_BADGE: Record<string, string> = {
  minimal: "bg-minimal/10 text-minimal border-minimal/20",
  standard: "bg-standard/10 text-standard border-standard/20",
  maximal: "bg-maximal/10 text-maximal border-maximal/20",
  over: "bg-over/10 text-over border-over/20",
}

function formatDateID(iso: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(
    new Date(iso)
  )
}

interface StudentHistoryTableProps {
  rows: HistoryRow[]
}

export function StudentHistoryTable({ rows }: StudentHistoryTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-white/2">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/3">
            <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">No</th>
            <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
              Siklus Awal
            </th>
            <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
              Siklus Akhir
            </th>
            <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Durasi</th>
            <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Fase</th>
            <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Sumber</th>
          </tr>
        </thead>
        <tbody className="text-[13px]">
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <tr key={row.id} className="border-b border-white/5 hover:bg-white/2 transition-colors last:border-0">
                <td className="p-4 font-mono text-muted-foreground">{index + 1}</td>
                <td className="p-4 text-white font-medium whitespace-nowrap">{formatDateID(row.startDate)}</td>
                <td className="p-4 text-white font-medium whitespace-nowrap">
                  {row.endDate ? (
                    formatDateID(row.endDate)
                  ) : (
                    <span className="flex items-center gap-1.5 text-primary/80">
                      <Clock size={12} /> Masih berjalan
                    </span>
                  )}
                </td>
                <td className="p-4 text-muted-foreground">{row.durationDays} hari</td>
                <td className="p-4">
                  <span
                    className={cn(
                      "flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-[10px] font-bold border",
                      PHASE_BADGE[row.phase]
                    )}
                  >
                    {row.phase === "over" ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                    {PHASE_LABEL[row.phase]}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground italic text-xs">
                  {row.source === "mandiri_libur" ? "Lapor mandiri (libur)" : "Pelaksana"}
                  {row.isAnomalyInterval && (
                    <span className="ml-2 not-italic text-amber-400 font-bold">• Anomali interval</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-12 text-center text-muted-foreground opacity-40">
                <FileText className="size-8 mx-auto mb-3" /> Belum ada riwayat siklus yang tercatat.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
