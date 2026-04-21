"use client"

import {
  CheckCircle2,
  Info,
  Loader2,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

type CustomToasterProps = ToasterProps & {
  variant?: "default" | "mobile"
}

const Toaster = ({ variant = "default", ...props }: CustomToasterProps) => {
  const { theme = "system" } = useTheme()
  const isMobile = variant === "mobile"

  return (
    <Sonner
      duration={4000} 
      theme={isMobile ? "dark" : (theme as ToasterProps["theme"])}
      position={isMobile ? "top-center" : "top-right"} 
      className={`toaster group ${isMobile ? "absolute mt-4 w-full flex justify-center pointer-events-none" : ""}`}
      
      toastOptions={{
        classNames: {
          toast: [
            "!min-h-0 !border-0 !shadow-[0_15px_40px_-10px_rgba(0,0,0,0.8)] !p-0", 
            "flex items-center !gap-2.5 !px-4 !py-2 !rounded-[12px] w-fit", 
            "!relative !overflow-hidden !bg-[#1A191E] !text-white",
            isMobile ? "mx-auto pointer-events-auto" : "ml-auto",
            
            // Animasi Garis Kilat Bawah
            "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:animate-toast-progress"
          ].join(" "),
          
          // Warna Kilat RGB Bawah
          success: "after:bg-gradient-to-r after:from-transparent after:via-emerald-400 after:to-emerald-300 after:shadow-[0_0_15px_#34d399]",
          error: "after:bg-gradient-to-r after:from-transparent after:via-red-500 after:to-red-400 after:shadow-[0_0_15px_#f87171]",
          warning: "after:bg-gradient-to-r after:from-transparent after:via-amber-500 after:to-amber-400 after:shadow-[0_0_15px_#fbbf24]",
          info: "after:bg-gradient-to-r after:from-transparent after:via-blue-500 after:to-blue-400 after:shadow-[0_0_15px_#60a5fa]",
          
          description: "!hidden", 
          title: "!text-[13px] !font-medium !text-gray-200 !tracking-wide !leading-none !m-0", 
          actionButton: "!bg-white !text-black !text-xs !px-3 !py-1 !rounded-[8px] !font-medium !ml-3",
          cancelButton: "!bg-white/10 !text-gray-300 !text-xs !px-3 !py-1 !rounded-[8px] !ml-2",
        },
      }}

      // 🔥 FIX: Menyuntikkan Library Animasi Custom Arden ke Masing-Masing Ikon!
      icons={{
        success: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ar-tada-loop" />,
        info: <Info className="w-3.5 h-3.5 text-blue-400 ar-float-loop" />,
        warning: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 ar-shake-loop" />,
        error: <XCircle className="w-3.5 h-3.5 text-red-400 ar-beat-loop" />,
        loading: <Loader2 className="w-3.5 h-3.5 text-gray-400 animate-spin" />,
      }}

      style={
        {
          "--toast-padding": "0px",
          "--toast-border-radius": "12px",
          "--normal-bg": "transparent",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }