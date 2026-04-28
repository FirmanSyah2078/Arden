"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDock } from "@/context/dock-context";
import {
  History as LucideHistory,
  Settings as LucideSettings,
  LogOut as LucideLogOut,
  HelpCircle,
  User
} from "lucide-react";
import { useLogout } from "@/hooks/auth/use-logout";
import { toast } from "sonner";

export const GlobalMenu = () => {
  const { isMenuOpen, setIsMenuOpen } = useDock();
  const router = useRouter();
  const { handleLogout } = useLogout();

  if (!isMenuOpen) return null;

  const onLogoutClick = () => {
    toast.success("See you soon!");
    setTimeout(() => {
      handleLogout();
    }, 300);
  };

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
      label: "Guide",
      desc: "Operational guidelines",
      icon: HelpCircle,
      onClick: () => router.push("/guide"),
    },
  ];

  return (
    <>
      {/* Backdrop - Clean Overlay */}
      <div
        className="absolute inset-0 z-40 bg-black/50 transition-opacity animate-in fade-in duration-300"
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Menu Container - Perfectly Aligned to Bottom Dock Right Edge */}
      <div className="absolute bottom-24 right-8 z-50 w-52 animate-in slide-in-from-bottom-8 duration-300">
        <div className="bg-[#1F1E23] border border-white/5 rounded-3xl p-2 shadow-2xl">
          <div className="flex flex-col gap-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#2A292F] transition-all active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2A292F] text-white flex items-center justify-center border-none group-hover:bg-[#35343B] group-hover:text-white transition-all shrink-0 shadow-inner">
                    <item.icon size={14} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-white/30 leading-tight">
                      {item.desc}
                    </span>
                  </div>
                </div>
              </button>
            ))}

            {/* Divider */}
            <div className="h-px bg-white/10 my-1 mx-2" />

            {/* Logout Button */}
            <button
              onClick={() => {
                onLogoutClick();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#2A292F] transition-all active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2A292F] text-white flex items-center justify-center border-none group-hover:bg-[#35343B] group-hover:text-white transition-all shrink-0 shadow-inner">
                  <LucideLogOut size={14} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">
                    Logout
                  </span>
                  <span className="text-[10px] text-white/30 leading-tight">
                    Sign out from Arden system
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
