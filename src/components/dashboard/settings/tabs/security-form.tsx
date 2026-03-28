"use client"

import { KeyRound, AlertTriangle, Trash2, Smartphone, Monitor, ShieldCheck } from "lucide-react"

export default function SecurityForm() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h3 className="text-lg font-medium text-foreground">Keamanan & Akses</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola kata sandi, pantau perangkat aktif, dan amankan akun Anda.
        </p>
      </div>

      <div className="h-px w-full bg-border" />

      {/* --- PASSWORD SECTION --- */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-foreground">
          <KeyRound className="size-5 text-primary" />
          <h4 className="text-base font-medium">Ubah Kata Sandi</h4>
        </div>
        
        <div className="grid gap-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Kata Sandi Saat Ini</label>
              {/* 🔥 SOLUSI LUPA PASSWORD */}
              <button className="text-xs font-medium text-primary hover:underline">
                Lupa kata sandi?
              </button>
            </div>
            <input
              type="password"
              className="w-full max-w-md rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              placeholder="••••••••"
            />
            <p className="text-[11px] text-muted-foreground max-w-md">
              Jika Anda lupa kata sandi saat ini, klik tombol di atas untuk mengirimkan tautan reset ke WhatsApp/Email Anda.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Kata Sandi Baru</label>
            <input
              type="password"
              className="w-full max-w-md rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              placeholder="Minimal 8 karakter"
            />
          </div>

          <div className="pt-2">
            <button className="rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted">
              Perbarui Kata Sandi
            </button>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-border" />

      {/* --- SESSIONS SECTION (FITUR TAMBAHAN PRO) --- */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-foreground">
          <ShieldCheck className="size-5 text-primary" />
          <h4 className="text-base font-medium">Perangkat Aktif</h4>
        </div>
        <div className="rounded-lg border border-border bg-background divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Monitor className="size-6 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Windows • Chrome</p>
                <p className="text-xs text-success">Perangkat saat ini • Aktif sekarang</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Smartphone className="size-6 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Android • Mobile App</p>
                <p className="text-xs text-muted-foreground">Aktif 2 jam yang lalu</p>
              </div>
            </div>
            <button className="text-xs font-medium text-destructive hover:underline">Keluar</button>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-border" />

      {/* --- DANGER ZONE --- */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-5" />
          <h4 className="text-base font-medium">Zona Berbahaya</h4>
        </div>
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5 transition-colors hover:border-destructive/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h5 className="text-sm font-medium text-foreground">Hapus Akun Permanen</h5>
              <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Semua data profil dan akses Anda ke sistem akan dihapus.
              </p>
            </div>
            <button className="flex shrink-0 items-center justify-center gap-2 rounded-md bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground">
              <Trash2 className="size-4" />
              Hapus Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}