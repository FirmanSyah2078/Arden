"use client"

import { useMemo, useState } from "react"
import { User, QrCode, Edit3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

// 1. Interface yang ketat untuk menghindari error 'any'
interface ActivityLogItem {
  id: number | string
  studentName: string
  method: "Manual" | "Scan QR"
  className: string
  executor: string
  category: "Zuhur" | "Ashar"
  time: string
}

type LogCategory = "all" | "Zuhur" | "Ashar"

export function ActivityLog({ logs }: { logs: ActivityLogItem[] }) {
  const [filter, setFilter] = useState<LogCategory>("all")

  const filteredLogs = useMemo(() => {
    let result = [...logs]
    if (filter !== "all") {
      result = result.filter((log) => log.category === filter)
    }
    // Urutkan waktu terbaru di atas
    return result.sort((a, b) => b.time.localeCompare(a.time))
  }, [logs, filter])

  return (
    <Card className="h-full flex flex-col bg-[#151419] border-white/5 shadow-none font-inter overflow-hidden outline-none ring-0">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between py-2.5 px-5 border-b border-white/5 space-y-0">
        <CardTitle className="text-[11px] font-bold text-white/50 uppercase tracking-widest">
          Riwayat Presensi
        </CardTitle>

        <Select value={filter} onValueChange={(val) => setFilter(val as LogCategory)}>
          <SelectTrigger className="h-7 w-[95px] text-[10px] font-plus-jakarta bg-white/5 border-white/10 text-white/80 outline-none ring-0 px-2">
            <SelectValue placeholder="Waktu" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a191f] border-white/10 text-white font-jakarta">
            <SelectItem value="all" className="text-xs">Semua</SelectItem>
            <SelectItem value="Zuhur" className="text-xs">Zuhur</SelectItem>
            <SelectItem value="Ashar" className="text-xs">Ashar</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="flex-1 min-h-0 w-full">
          <div className="flex flex-col px-5 py-3">
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 group">
                  {/* SISI KIRI: Nama, Jam, Metode & Kelas */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/95 font-inter leading-none">
                        {log.studentName}
                      </span>
                      <span className="text-[10px] text-white/20 font-medium font-jakarta">
                        • {log.time}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-[11px] text-white/30 font-jakarta ">
                      {log.method === 'Scan QR' ? (
                        <QrCode size={11} className="text-emerald-500/70" />
                      ) : (
                        <Edit3 size={11} className="text-blue-500/70" />
                      )}
                      <span>Input {log.method} — {log.className}</span>
                    </div>
                  </div>

                  {/* SISI KANAN: Nama Pelaksana */}
                  <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded border border-white/10 shrink-0 group-hover:bg-white/10 transition-colors">
                    <User size={10} className="text-white/40" />
                    <span className="text-[10px] font-bold text-white/70 font-jakarta truncate max-w-20">
                      {log.executor}
                    </span>
                  </div>
                </div>
              ))}

              {filteredLogs.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-sm font-jakarta text-white/20 italic">Belum ada data masuk</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}