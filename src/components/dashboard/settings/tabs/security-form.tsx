"use client"

import { AlertTriangle, Trash2, Smartphone, Monitor, ShieldCheck, KeyRound } from "lucide-react"

export default function SecurityForm() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- INFO CARD TRANSPARAN --- */}
      <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-[13px] text-white/70">
        <ShieldCheck className="size-4 shrink-0 mt-0.5 text-white/50" />
        <p className="leading-relaxed">
          Amankan akun Anda. Perbarui kata sandi secara berkala dan pantau perangkat aktif yang sedang mengakses akun Anda saat ini.
        </p>
      </div>

      {/* --- PASSWORD SECTION --- */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white/90">
          <KeyRound className="size-4 text-white/50" />
          <h4 className="text-[14px] font-medium">Kredensial Login</h4>
        </div>
        
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between max-w-md">
              <label className="text-[13px] font-medium text-white/80">Kata Sandi Saat Ini</label>
              <button className="text-[11px] font-medium text-white/60 hover:text-white transition-colors">
                Lupa sandi?
              </button>
            </div>
            <input
              type="password"
              className="w-full max-w-md rounded-md border border-white/10 bg-black/20 px-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-white/80">Kata Sandi Baru</label>
            <input
              type="password"
              className="w-full max-w-md rounded-md border border-white/10 bg-black/20 px-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
              placeholder="Minimal 8 karakter"
            />
          </div>

          <div className="pt-1">
            <button className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-medium text-white transition-all hover:bg-white/10">
              Perbarui Sandi
            </button>
          </div>
        </div>
      </div>

      {/* --- SESSIONS SECTION --- */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white/90">
          <Monitor className="size-4 text-white/50" />
          <h4 className="text-[14px] font-medium">Perangkat Aktif</h4>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 divide-y divide-white/5">
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <Monitor className="size-5 text-white/40" />
              <div>
                <p className="text-[13px] font-medium text-white/90">Windows • Chrome</p>
                <p className="text-[11px] text-emerald-400/80 mt-0.5">Sesi saat ini • Aktif</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <Smartphone className="size-5 text-white/40" />
              <div>
                <p className="text-[13px] font-medium text-white/90">Android • ARDEN App</p>
                <p className="text-[11px] text-white/40 mt-0.5">Aktif 2 jam lalu</p>
              </div>
            </div>
            <button className="text-[11px] font-medium text-red-400/80 hover:text-red-400 transition-colors">Cabut</button>
          </div>
        </div>
      </div>

      {/* --- DANGER ZONE --- */}
      <div className="space-y-4 pt-4">
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 transition-colors hover:border-red-500/30">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h5 className="text-[13px] font-medium text-white/90 flex items-center gap-2">
                <AlertTriangle className="size-3.5 text-red-400" />
                Hapus Akun Permanen
              </h5>
              <p className="text-[11px] text-white/50 max-w-sm leading-relaxed">
                Tindakan ini bersifat final. Seluruh data akademik dan akses sistem Anda akan dimusnahkan.
              </p>
            </div>
            <button className="flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20">
              <Trash2 className="size-3.5" />
              Hapus Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}