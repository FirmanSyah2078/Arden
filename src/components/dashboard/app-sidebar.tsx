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
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
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

  const [userData, setUserData] = useState({ name: "Loading...", username: "...", avatar: "" })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedUsername = getCookie("user_username");
    
    setUserData({
      name: getCookie("user_name") || "User ARDEN",
      // 🔥 FIX: Pastikan kalau cookie-nya benar-benar kosong (""), dia tetap pakai fallback
      username: savedUsername !== "" ? savedUsername : "admin_arden", 
      avatar: getCookie("user_photo") || "",
    })
    setMounted(true)
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {!isReady ? (
          // 🔥 FIX SKELETON ROLE: Pakai komponen resmi agar patuh saat sidebar tertutup
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="opacity-50 cursor-default hover:bg-transparent">
                <div className="size-8 shrink-0 rounded-lg bg-white/10 animate-pulse" />
                <div className="grid flex-1 gap-1.5 text-left text-sm leading-tight ml-1">
                  <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
                  <div className="h-2 w-12 rounded bg-white/10 animate-pulse" />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <NavRole roles={systemRoles} />
        )}
      </SidebarHeader>

      <SidebarContent>
        {!isReady ? (
          // 🔥 FIX SKELETON MENU: Pakai komponen resmi agar teks otomatis hilang saat tertutup
          <SidebarGroup>
            <SidebarGroupLabel>
              <div className="h-2 w-20 bg-white/10 rounded animate-pulse" />
            </SidebarGroupLabel>
            <SidebarMenu>
              {[1, 2, 3, 4].map((i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton className="opacity-50 cursor-default hover:bg-transparent">
                    <div className="size-4 shrink-0 rounded bg-white/10 animate-pulse" />
                    <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
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