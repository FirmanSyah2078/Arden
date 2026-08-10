// 🔥 Presentational only.
// Diupgrade: sekarang bisa terima badge verified + baris statistik (opsional),
// biar halaman detail siswi nggak perlu nulis ulang markup profil sendiri.
// Ring dashed yang animate-spin terus-terusan dibuang — nggak nambah info,
// cuma bikin capek diliat kalau halaman dibuka lama.

import { FileText, ShieldCheck, User } from "lucide-react"

interface StudentStat {
  label: string
  value: string | number
}

interface StudentProfileCardProps {
  name: string
  nis: string
  notes?: string
  verified?: boolean
  /** Baris statistik ringkas, niru motif divider di card kelas (Students/Period/Grade) */
  stats?: StudentStat[]
}

export function StudentProfileCard({
  name,
  nis,
  notes,
  verified = true,
  stats = [],
}: StudentProfileCardProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="border-primary/20 bg-primary/10 flex size-16 shrink-0 items-center justify-center rounded-full border">
          <User className="text-primary size-7" />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <h2 className="font-jakarta text-foreground truncate text-lg leading-tight font-bold">
            {name}
          </h2>
          {verified && (
            <span className="inline-flex w-fit items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-black tracking-widest text-emerald-400 uppercase">
              <ShieldCheck className="size-2.5" /> Terverifikasi
            </span>
          )}
        </div>
      </div>

      <div className="text-muted-foreground flex w-fit items-center gap-2 rounded-lg border border-white/5 bg-black/20 px-3 py-1.5 font-mono text-[13px]">
        <span className="text-muted-foreground/70 text-[10px] font-bold tracking-widest uppercase">
          NIS
        </span>
        {nis}
      </div>

      {stats.length > 0 && (
        <div className="font-inter flex items-center justify-between border-y border-white/5 py-4 text-[12px]">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex flex-1 items-center">
              {index > 0 && <div className="bg-border mr-4 h-5 w-px shrink-0" />}
              <div className="flex min-w-0 flex-col">
                <span className="text-foreground mb-1 truncate leading-none font-bold">
                  {stat.value}
                </span>
                <span className="text-muted-foreground text-[9px] tracking-wider uppercase">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex w-full items-start gap-3 rounded-2xl border border-white/5 bg-white/2 p-4">
        <FileText className="text-muted-foreground mt-0.5 size-4 shrink-0" />
        <p className="text-muted-foreground text-left text-[12px] leading-relaxed italic">
          {notes || "Tidak ada catatan khusus."}
        </p>
      </div>
    </div>
  )
}