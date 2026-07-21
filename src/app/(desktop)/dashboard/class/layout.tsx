export default function ClassLayout({ children }: { children: React.ReactNode }) {
  return (
    // 🔥 FIX: Buang 'lg:p-8' dan 'gap-6'. 
    // Samakan persis dengan bungkus terluar Gatekeeper yaitu 'p-6' mutlak.
    <div className="flex flex-1 flex-col p-6 bg-background selection:bg-white/20 h-full w-full">
      {children}
    </div>
  )
}