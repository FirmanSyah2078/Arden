"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation" 

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

import { useDashboard } from "@/contexts/cont-dashboard"
// 🔥 IMPORT FUNGSI SAKTI
import { systemRoles, getDynamicMenus } from "@/config/nav-dashboard"

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

  // 🔥 FIX: PANGGIL OTAK PENDETEKSI AKTIF DARI FILE CONFIG (Sangat Bersih!)
  const currentMenus = getDynamicMenus(pathname, activeRole.name);

  const [userData, setUserData] = useState({ name: "Loading...", username: "...", avatar: "" })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // 🔥 FUNGSI PEMBACA COOKIE
    const loadUserData = () => {
      const savedUsername = getCookie("user_username");
      setUserData({
        name: getCookie("user_name") || "User ARDEN",
        username: savedUsername !== "" ? savedUsername : "admin_arden", 
        avatar: getCookie("user_photo") || "",
      });
    };

    loadUserData();
    setMounted(true);

    window.addEventListener('profile-updated', loadUserData);
    return () => {
      window.removeEventListener('profile-updated', loadUserData);
    };
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {!isReady ? (
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