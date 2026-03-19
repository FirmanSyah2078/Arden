import { UserCircle, Upload } from "lucide-react"

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div>
        <h3 className="text-lg font-medium text-white">Profil Publik</h3>
        <p className="text-sm text-sidebar-foreground/60 mt-1">
          Perbarui foto dan detail informasi pribadi Anda yang digunakan di dalam sistem ARDEN.
        </p>
      </div>

      <div className="h-px w-full bg-white/10" />

      {/* FORM SECTION */}
      <div className="space-y-6">
        
        {/* Foto Profil */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <UserCircle className="size-10 text-white/20" />
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <button className="flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-white/90">
                <Upload className="size-4" />
                Unggah Foto
              </button>
              <button className="rounded-md border border-white/10 bg-transparent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/5">
                Hapus
              </button>
            </div>
            <p className="text-[11px] text-sidebar-foreground/50">
              Rekomendasi ukuran: 256x256px. Format: JPG, PNG, atau GIF. Maks 2MB.
            </p>
          </div>
        </div>

        {/* Input: Nama Lengkap */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-white/90">
            Nama Lengkap
          </label>
          <input
            id="name"
            defaultValue="User ARDEN"
            className="w-full max-w-md rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            placeholder="Masukkan nama lengkap..."
          />
          <p className="text-[11px] text-sidebar-foreground/50">
            Nama ini akan ditampilkan pada sistem absensi dan laporan.
          </p>
        </div>

        {/* Input: Username */}
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-white/90">
            Username
          </label>
          <div className="flex w-full max-w-md items-center overflow-hidden rounded-md border border-white/10 bg-black/20 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <span className="flex select-none items-center px-3 text-sm text-white/40 border-r border-white/10 bg-white/5">
              @
            </span>
            <input
              id="username"
              defaultValue="admin_arden"
              className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none"
              placeholder="username"
            />
          </div>
          <p className="text-[11px] text-sidebar-foreground/50">
            Username digunakan untuk login. Pastikan unik dan mudah diingat.
          </p>
        </div>

      </div>

      <div className="h-px w-full bg-white/10" />

      {/* FOOTER ACTION */}
      <div className="flex justify-end gap-3">
        <button className="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5">
          Batal
        </button>
        <button className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-400">
          Simpan Perubahan
        </button>
      </div>

    </div>
  )
}