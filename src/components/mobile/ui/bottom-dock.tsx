"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { UserSearch, ScanLine, Menu, X } from "lucide-react";
import { useDock } from "@/context/dock-context";

interface BottomDockProps {
  variant: "home" | "history" | "profile";
  handleCamAction?: () => void;
  isCamActive?: boolean;
}

export const BottomDock = ({ variant }: BottomDockProps) => {
  const { isMenuOpen, setIsMenuOpen, mode, setMode } = useDock()
  const router = useRouter()

  const setSpecificMode = (m: "scan" | "manual") => {
    if (m === mode) return
    setMode(m)
    if (window.location.pathname.includes("/history")) {
      router.push("/go")
    }
  }

  const showModeToggle = variant === "home" || variant === "history"

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both relative z-50 flex w-full items-center justify-center pt-4 pb-6">
      {/* ===== Main dock pill ===== */}
      <div className="relative flex items-center gap-2 rounded-[26px] border border-white/[0.08] bg-[#1F1E23] px-2 py-2 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.75)]">
        {/* ===== Brand mark ===== */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 shadow-[0_6px_16px_-4px_rgba(79,70,229,0.55)]">
          <Image
            src="/arden.svg"
            alt="Arden"
            width={17}
            height={19}
            className="object-contain brightness-0 invert"
          />
        </div>

        {/* ===== Segmented mode control (the "wow") ===== */}
        {showModeToggle && (
          <div className="relative flex items-center rounded-full bg-[#141317] p-1">
            {/* Sliding active indicator */}
            <div
              className={`absolute top-1 bottom-1 left-1 w-[74px] rounded-full border border-white/[0.07] bg-[#2B2A31] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                mode === "manual" ? "translate-x-[74px]" : "translate-x-0"
              }`}
            />
            <button
              onClick={() => setSpecificMode("scan")}
              className={`relative z-10 flex h-9 w-[74px] items-center justify-center gap-1.5 rounded-full text-[11px] font-bold tracking-tight transition-colors duration-300 ${
                mode === "scan" ? "text-white" : "text-white/35 hover:text-white/55"
              }`}
            >
              <ScanLine size={14} strokeWidth={2.2} />
              Scan
            </button>
            <button
              onClick={() => setSpecificMode("manual")}
              className={`relative z-10 flex h-9 w-[74px] items-center justify-center gap-1.5 rounded-full text-[11px] font-bold tracking-tight transition-colors duration-300 ${
                mode === "manual" ? "text-white" : "text-white/35 hover:text-white/55"
              }`}
            >
              <UserSearch size={14} strokeWidth={2.2} />
              Manual
            </button>
          </div>
        )}

        {/* ===== Menu button ===== */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-90 ${
            isMenuOpen
              ? "bg-indigo-600 text-white shadow-[0_6px_16px_-4px_rgba(79,70,229,0.55)]"
              : "bg-[#2B2A31] text-white/70 hover:text-white"
          }`}
        >
          {isMenuOpen ? <X size={20} strokeWidth={2.4} /> : <Menu size={20} strokeWidth={2} />}
        </button>
      </div>
    </div>
  )
}
