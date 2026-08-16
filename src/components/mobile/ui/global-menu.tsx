"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useDock } from "@/context/dock-context"
import {
  History as LucideHistory,
  CloudOff,
  LogOut as LucideLogOut,
  HelpCircle,
  User,
} from "lucide-react"
import { useLogout } from "@/hooks/auth/use-logout"
import { toast } from "sonner"

export const GlobalMenu = () => {
  const { isMenuOpen, setIsMenuOpen } = useDock()
  const router = useRouter()
  const { handleLogout } = useLogout()

  if (!isMenuOpen) return null

  const onLogoutClick = () => {
    toast.success("See you soon!")
    setTimeout(() => {
      handleLogout()
    }, 300)
  }

  const menuItems = [
    {
      label: "Profile",
      desc: "Manage your account",
      icon: User,
      onClick: () => router.push("/me"),
    },
    {
      label: "History",
      desc: "Attendance history logs",
      icon: LucideHistory,
      onClick: () => router.push("/history"),
    },
    {
      label: "Queue",
      desc: "Attendance records waiting to sync",
      icon: CloudOff,
      onClick: () => router.push("/queue"),
    },
    {
      label: "Guide",
      desc: "Operational guidelines",
      icon: HelpCircle,
      onClick: () => router.push("/guide"),
    },
  ]

  return (
    <>
      {/* Backdrop - Clean Overlay */}
      <div
        className="animate-in fade-in absolute inset-0 z-40 bg-black/50 transition-opacity duration-300"
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Menu Container - Perfectly Aligned to Bottom Dock Right Edge */}
      <div className="animate-in slide-in-from-bottom-8 absolute right-8 bottom-24 z-50 w-52 duration-300">
        <div className="rounded-3xl border border-white/5 bg-[#1F1E23] p-2 shadow-2xl">
          <div className="flex flex-col gap-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick()
                  setIsMenuOpen(false)
                }}
                className="group flex w-full items-center justify-between rounded-2xl p-2 text-left transition-all hover:bg-[#2A292F] active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-none bg-[#2A292F] text-white shadow-inner transition-all group-hover:bg-[#35343B] group-hover:text-white">
                    <item.icon size={14} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-white transition-colors group-hover:text-white">
                      {item.label}
                    </span>
                    <span className="text-left text-[10px] leading-tight text-white/30">
                      {item.desc}
                    </span>
                  </div>
                </div>
              </button>
            ))}

            {/* Divider */}
            <div className="mx-2 my-1 h-px bg-white/10" />

            {/* Logout Button */}
            <button
              onClick={() => {
                onLogoutClick()
                setIsMenuOpen(false)
              }}
              className="group flex w-full items-center justify-between rounded-2xl p-2 text-left transition-all hover:bg-[#2A292F] active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-none bg-[#2A292F] text-white shadow-inner transition-all group-hover:bg-[#35343B] group-hover:text-white">
                  <LucideLogOut size={14} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-white transition-colors group-hover:text-white">
                    Logout
                  </span>
                  <span className="text-left text-[10px] leading-tight text-white/30">
                    Sign out from Arden system
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
