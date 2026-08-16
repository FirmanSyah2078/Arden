"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { UserSearch, ScanLine, Menu, X } from "lucide-react"
import { useDock } from "@/context/dock-context"

interface BottomDockProps {
  variant: "home" | "history" | "profile"
  handleCamAction?: () => void
}

export const BottomDock = ({ variant, handleCamAction }: BottomDockProps) => {
  const { isMenuOpen, setIsMenuOpen, mode, setMode } = useDock()
  const router = useRouter()

  const handleToggleMode = () => {
    const newMode = mode === "scan" ? "manual" : "scan"
    setMode(newMode)

    if (window.location.pathname.includes("/history")) {
      router.push("/go")
    }
  }
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both relative z-50 flex w-full items-center justify-center pt-4 pb-6 transition-all duration-500 ease-in-out">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#1F1E23] p-1.5 shadow-2xl">
        {/* LEFT SECTION: Identity */}
        <div className="flex items-center gap-2 px-2">
          <Image
            src="/arden.svg"
            alt="Logo"
            width={16}
            height={18}
            className="shrink-0 translate-y-px object-contain"
          />
          <div className="flex flex-col">
            <span className="text-[10px] leading-none font-extrabold tracking-tighter text-white">
              ARDEN
            </span>
            <span className="mt-0.5 text-[8px] leading-none font-bold tracking-widest whitespace-nowrap text-white/40 uppercase">
              Attendance System
            </span>
          </div>
        </div>

        {/* DIVIDER LINE */}
        <div className="h-6 w-px bg-white/10" />

        {/* RIGHT SECTION: Controls */}
        <div className="flex items-center gap-1.5">
          {/* Mode toggle for both home and history pages */}
          {(variant === "home" || variant === "history") && (
            <>
              <Button
                variant="secondary"
                onClick={handleToggleMode}
                className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-none bg-[#2A292F] text-white transition-all duration-300 hover:bg-[#35343B] hover:text-white"
              >
                {mode === "scan" ? (
                  <UserSearch size={16} />
                ) : (
                  <ScanLine size={16} />
                )}
              </Button>
            </>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-none shadow-sm transition-all duration-300 outline-none ${isMenuOpen ? "bg-indigo-600 text-white" : "bg-[#2A292F] text-white hover:bg-[#35343B] hover:text-white"}`}
          >
            {isMenuOpen ? (
              <X size={20} strokeWidth={2} />
            ) : (
              <Menu size={20} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
