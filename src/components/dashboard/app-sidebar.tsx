"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation" // 🔥 Otak Pembaca URL

import { NavGroup } from "@/components/dashboard/nav-group" 
import { NavUser } from "@/components/dashboard/nav-user"
import { NavRole } from "@/components/dashboard/nav-role" 

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { useDashboard } from "@/logic/dashboard/system/context"
import { systemRoles, roleMenus } from "@/logic/dashboard/system/navigation"

const getCookie = (name: string) => {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || "");
  return "";
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { activeRole, isReady } = useDashboard();
  const pathname = usePathname(); 

  // 1. Tarik menu mentah sesuai role
  const rawMenus = roleMenus[activeRole.name] || roleMenus["Pemantau"];

  // 2. 🔥 OTAK PENDETEKSI AKTIF (Smart Routing Logic)
  const currentMenus = rawMenus.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      const variant = item.variant || "default";

      // LOGIKA A: Untuk Menu Bertipe COLLAPSIBLE (Punya Sub-menu)
      if (variant === "collapsible" && item.items) {
        // Cek apakah ada *salah satu anak* yang URL-nya cocok dengan halaman saat ini
        const isAnyChildActive = item.items.some(
          (sub) => pathname === sub.url || pathname.startsWith(`${sub.url}/`)
        );

        return {
          ...item,
          isActive: isAnyChildActive, // Induk ikut aktif jika ada anak yang aktif
          items: item.items.map((sub) => ({
            ...sub,
            isActive: pathname === sub.url || pathname.startsWith(`${sub.url}/`) // Anak mana yang spesifik aktif
          }))
        };
      }

      // LOGIKA B: Untuk Menu Bertipe DEFAULT & ACTION (Link Polos / Titik Tiga)
      const isMainActive = item.url === "/dashboard" 
        ? pathname === "/dashboard" // Kalau Home, harus persis sama (strict)
        : pathname.startsWith(item.url); // Kalau halaman lain, toleransi sub-path

      return {
        ...item,
        isActive: isMainActive
      };
    })
  }));

  const [userData, setUserData] = useState({ name: "Loading...", role: "...", avatar: "" })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setUserData({
      name: getCookie("user_name") || "User ARDEN",
      role: getCookie("user_role") || "Authenticated",
      avatar: getCookie("user_photo") || "",
    })
    setMounted(true)
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {!isReady ? (
          <div className="flex items-center gap-2 p-2">
            <div className="size-8 shrink-0 rounded-lg bg-white/10 animate-pulse" />
            <div className="flex flex-col gap-1.5 w-full">
              <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
              <div className="h-2 w-12 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
        ) : (
          <NavRole roles={systemRoles} />
        )}
      </SidebarHeader>

      <SidebarContent>
        {!isReady ? (
          <div className="flex flex-col gap-4 p-4">
             <div className="h-3 w-24 bg-white/10 rounded animate-pulse mb-2" />
             <div className="h-8 w-full bg-white/5 rounded-md animate-pulse" />
             <div className="h-8 w-full bg-white/5 rounded-md animate-pulse" />
             <div className="h-8 w-full bg-white/5 rounded-md animate-pulse" />
          </div>
        ) : (
          // Render menu yang sudah dicerdaskan oleh logika di atas
          currentMenus.map((group) => (
            <NavGroup key={group.label} label={group.label} items={group.items} />
          ))
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}