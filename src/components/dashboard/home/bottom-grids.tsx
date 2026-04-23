"use client"

import { CycleQualityChart } from "./cycle-quality-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

// Tambahkan interface untuk props
interface CycleQualityItem {
  status: string;
  count: number;
  fill: string;
}

export function BottomGrids({ cycleData }: { cycleData: CycleQualityItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      
      {/* 1. KUALITAS SIKLUS (Menerima data dari Parent) */}
      <CycleQualityChart data={cycleData} />

      {/* 2. INSIGHT KONDISI */}
      <Card className="bg-[#151419] border-white/5 shadow-none font-inter h-full outline-none ring-0">
        <CardHeader className="py-3 px-5 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-[11px] font-bold text-white/70 uppercase tracking-widest">
            Kondisi Haid Hari Ini
          </CardTitle>
          <CheckCircle2 size={14} className="text-pink-500" />
        </CardHeader>
        <CardContent className="px-5 pb-5 flex flex-col justify-center h-[calc(100%-50px)]">
          <p className="text-xs font-jakarta text-muted-foreground leading-relaxed">
            Berdasarkan data masuk, sebanyak <span className="text-white font-bold">245 siswi</span> (12% dari total) tercatat sedang dalam masa udzur. 
          </p>
          
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Distribusi Udzur</span>
              <span className="text-xs font-bold text-white">12%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-pink-500 rounded-full transition-all duration-1000" 
                style={{ width: '12%' }} 
              />
            </div>
          </div>

          <p className="mt-4 text-[10px] italic text-muted-foreground font-jakarta">
            *Data disinkronkan otomatis dengan laporan harian per kelas.
          </p>
        </CardContent>
      </Card>

    </div>
  )
}