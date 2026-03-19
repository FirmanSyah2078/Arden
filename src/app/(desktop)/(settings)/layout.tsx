import { Separator } from "@/components/ui/separator"
import { SettingsSidebar } from "@/components/dashboard/settings/app-settings" // Kita akan buat komponen ini nanti

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Kontainer utama dengan max-width agar tidak melebar jelek di layar ultrawide
    <div className="flex min-h-screen w-full flex-col bg-[#0a0a0a] text-white">
      
      {/* --- BAGIAN ATAS: HEADER / TIPOGRAFI --- */}
      <div className="mx-auto w-full max-w-6xl px-6 pt-10 pb-6 md:px-10 md:pt-12">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Pengaturan Akun
          </h2>
          <p className="text-sm text-sidebar-foreground/60">
            Kelola informasi profil, preferensi keamanan, dan tampilan sistem ARDEN Anda.
          </p>
        </div>
        
        {/* Garis Pembatas Elegan */}
        <Separator className="mt-6 bg-white/10" />
      </div>

      {/* --- BAGIAN BAWAH: SPLIT LAYOUT (MENU & KONTEN) --- */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-16 md:flex-row md:px-10">
        
        {/* Kolom Kiri: Sidebar Menu */}
        <aside className="w-full md:w-1/4 lg:w-1/5 shrink-0">
          <SettingsSidebar />
        </aside>

        {/* Kolom Kanan: Area Konten (Children) */}
        <main className="flex-1">
          <div className="max-w-3xl">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  )
}