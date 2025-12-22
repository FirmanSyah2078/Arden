"use client"

import { cn } from "@/lib/utils"
import { LucideIcon, Info, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
  label: string
  value: string | number
  subtext: string
  icon: LucideIcon
  color: string
  trend?: number
}

// Pastikan ada kata 'export' di sini
export function StatCard({ label, value, subtext, icon: Icon, color, trend }: StatCardProps) {
  
  // Formatter Angka
  const displayValue = typeof value === 'number' 
    ? value.toLocaleString('id-ID') 
    : value

  return (
    <div className="relative w-full overflow-hidden rounded-[20px] border border-white/5 bg-[#151419] p-4 shadow-lg transition-all duration-300 hover:border-white/10 hover:bg-[#1a191f] group outline-none focus:outline-none ring-0">
      
      {/* DEKORASI BACKGROUND (Sinyal Samar) */}
      {/* <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none transition-transform group-hover:scale-110">
        <Icon className={cn("h-32 w-32", color)} />
      </div> */}

      {/* CONTAINER UTAMA */}
      <div className="relative z-10 flex flex-col justify-between h-full gap-4">
        
        {/* BAGIAN ATAS */}
        <div className="space-y-1">
          
          {/* BARIS 1: TITLE & ICON */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#C9C9C9]/80 font-sans">
              {label}
            </p>
            {/* Icon Box */}
            <div className={cn("p-2 rounded-lg bg-white/5 border border-white/5 shadow-[0_0_15px_-3px_rgba(255,255,255,0.1)]", color)}>
              <Icon className="h-5 w-5" />
            </div>
          </div>

          {/* BARIS 2: VALUE & TREND */}
          <div className="flex items-end gap-3">
            <h3 
              className="text-3xl font-bold text-white font-space tracking-tight"
              suppressHydrationWarning
            >
              {displayValue}
            </h3>

            {trend !== undefined && (
              <div className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium mb-1.5",
                trend > 0 ? "text-emerald-400 bg-emerald-400/10" : 
                trend < 0 ? "text-red-400 bg-red-400/10" : 
                "text-gray-400 bg-gray-400/10"
              )}>
                {trend > 0 ? <TrendingUp size={10} /> : trend < 0 ? <TrendingDown size={10} /> : <Minus size={10} />}
                <span>
                  {trend > 0 ? "+" : ""}{trend}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* BAGIAN BAWAH: INFO SUBTEXT */}
        <div className="pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <Info size={14} className="shrink-0 text-blue-400/70" />
            <span className="truncate">{subtext}</span>
          </div>
        </div>

      </div>
    </div>
  )
}