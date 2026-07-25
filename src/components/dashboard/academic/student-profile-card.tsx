// 🔥 Presentational only.

import { FileText, User } from "lucide-react"

interface StudentProfileCardProps {
  name: string
  nis: string
  notes?: string
}

export function StudentProfileCard({ name, nis, notes }: StudentProfileCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-5 pt-2 items-center sm:items-start w-full">
      <div className="shrink-0 size-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-xl relative mt-1">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40 animate-[spin_10s_linear_infinite]" />
        <User className="size-8 text-primary" />
      </div>
      <div className="flex flex-col gap-3 w-full text-center sm:text-left">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-foreground font-jakarta leading-tight">{name}</h2>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">NIS</span>
            <span className="text-[12px] font-mono text-primary/90 font-medium bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
              {nis}
            </span>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-white/3 border border-white/5 p-3.5 rounded-2xl w-full">
          <FileText className="size-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[12px] text-muted-foreground leading-relaxed italic text-left">
            {notes || "Tidak ada catatan khusus."}
          </p>
        </div>
      </div>
    </div>
  )
}
