"use client"

import Image from "next/image"
import { User, History, Settings, LogOut } from "lucide-react"
import { useProfile } from "@/hooks/settings/use-profile"

interface BottomDockProps {
    onOpenHistory: () => void
    onOpenSettings: () => void
    onLogout: () => void
}

export const BottomDock = ({
    onOpenHistory,
    onOpenSettings,
    onLogout,
}: BottomDockProps) => {
    const { formData } = useProfile()

    return (
        <div className="absolute bottom-6 left-1/2 z-50 flex w-[92%] max-w-md -translate-x-1/2 items-center justify-between rounded-full border border-white/10 bg-[#1F1E23] p-2 shadow-2xl transition-all duration-500 hover:border-white/20">
            {/* LEFT SECTION: Identity */}
            <div className="flex items-center gap-3 px-3">
                <div className="flex items-center gap-2">
                    <Image
                        src="/arden.svg"
                        alt="Logo"
                        width={18}
                        height={20}
                        className="shrink-0 object-contain"
                    />
                    <span className="text-[10px] leading-none font-extrabold tracking-tighter text-white opacity-80">
                        ARDEN
                    </span>
                </div>
                <div className="mx-1 h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[#2A292F]">
                        {formData?.avatarUrl ? (
                            <Image
                                src={formData.avatarUrl}
                                alt="Profile"
                                width={24}
                                height={24}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-white/20">
                                <User size={10} />
                            </div>
                        )}
                    </div>
                    <span className="max-w-15 truncate text-[10px] font-bold text-white">
                        {formData?.name?.split(" ")[0] || "User"}
                    </span>
                </div>
            </div>

            {/* DIVIDER: Vertical Line */}
            <div className="mx-1 h-6 w-px bg-white/10" />

            {/* RIGHT SECTION: Navigation Actions */}
            <div className="flex items-center gap-1 px-1">
                <button
                    onClick={onOpenHistory}
                    className="rounded-full p-2 text-white/40 transition-all hover:bg-[#2A292F] hover:text-white active:scale-90"
                    title="History"
                >
                    <History size={18} />
                </button>
                <button
                    onClick={onOpenSettings}
                    className="rounded-full p-2 text-white/40 transition-all hover:bg-[#2A292F] hover:text-white active:scale-90"
                    title="Settings"
                >
                    <Settings size={18} />
                </button>
                <button
                    onClick={onLogout}
                    className="rounded-full p-2 text-white/40 transition-all hover:bg-red-900/20 hover:text-red-400 active:scale-90"
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </div>
    )
}
