export default function ClassLayout({ children }: { children: React.ReactNode }) {
  return (
    // 🔥 WADAH UTAMA: Semua padding, gap, background, dan efek selection ditarik ke sini
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 bg-background selection:bg-white/20 h-full w-full">
      {children}
    </div>
  )
}