"use client"

import { UserCircle, Upload, Info } from "lucide-react"

export default function ProfileForm() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h3 className="text-lg font-medium text-foreground">Informasi Pribadi</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Perbarui foto profil dan detail informasi Anda yang digunakan di seluruh sistem ARDEN.
        </p>
      </div>

      <div className="h-px w-full bg-border" />

      <div className="space-y-6">
        {/* Avatar Upload Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-dashed border-border bg-muted/30">
            <UserCircle className="size-12 text-muted-foreground/50" />
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <button className="flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
                <Upload className="size-4" />
                Unggah Foto Baru
              </button>
              <button className="rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                Hapus
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Rekomendasi: 256x256px. Format: JPG, PNG, atau GIF. Maksimal 2MB.
            </p>
          </div>
        </div>

        {/* Input Grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">Nama Lengkap</label>
            <input
              id="name"
              defaultValue="Admin ARDEN"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              placeholder="Masukkan nama lengkap..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-foreground">Username</label>
            <div className="flex w-full items-center overflow-hidden rounded-md border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <span className="flex select-none items-center px-3 text-sm text-muted-foreground border-r border-border bg-muted/20">@</span>
              <input
                id="username"
                defaultValue="admin_pusat"
                className="w-full bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                placeholder="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-foreground">Nomor WhatsApp</label>
            <input
              id="phone"
              defaultValue="081234567890"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              placeholder="08xxxxxxxxxx"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
          <Info className="size-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Username dan Nomor WhatsApp digunakan untuk login dan menerima notifikasi sistem. Pastikan data yang dimasukkan valid.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
          Simpan Perubahan
        </button>
      </div>
    </div>
  )
}