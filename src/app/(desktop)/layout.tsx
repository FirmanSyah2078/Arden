import { Toaster } from "sonner" // Opsional: Kalau kamu mau pakai Sonner di Desktop juga

export default function DesktopNeutralLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white font-sans antialiased selection:bg-indigo-500/30">
      {/* Toaster dipasang di sini agar Notifikasi bisa muncul di 
        area Dashboard maupun di area Settings 
      */}
      <Toaster theme="dark" position="top-right" richColors />
      
      {/* Children ini akan digantikan oleh (main)/layout.tsx 
        atau (settings)/layout.tsx tergantung URL-nya 
      */}
      {children}
    </div>
  )
}