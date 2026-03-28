"use client"

import * as React from "react"
import Link from "next/link"
import {
  LogOut,
  ChevronUp,
  ChevronDown,
  UserCircle, // 🔥 TAMBAHAN: Ikon untuk Profile
  LifeBuoy,   // 🔥 Ikon Bantuan
  Settings,   // Ikon Account Settings
  Sparkles,   // Ikon System Updates
  Sun,        // Ikon Theme Light
  Moon,       // Ikon Theme Dark
  Monitor,    // Ikon Theme System
  Palette,    // Ikon Induk Theme
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useLogout } from "@/hooks/use-logout"
import { SettingsDialog } from "@/components/dashboard/settings/settings-dialog"

export function NavUser({
  user,
}: {
  // 🔥 FIX 1: Ubah 'role' menjadi 'username'
  user: { name: string; username: string; avatar: string }
}) {
  const { isMobile } = useSidebar()
  const { handleLogout } = useLogout()

  const [mounted, setMounted] = React.useState(false)
  const [showSettings, setShowSettings] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "AU"

  if (!mounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="opacity-50 cursor-default hover:bg-transparent">
            {/* 🔥 FIX 2: Ubah rounded-lg menjadi rounded-full untuk Avatar Lingkaran */}
            <div className="h-8 w-8 shrink-0 rounded-full bg-white/10 animate-pulse" />
            <div className="grid flex-1 gap-1.5 text-left text-sm leading-tight ml-1 group-data-[collapsible=icon]:hidden">
              <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
              <div className="h-2 w-12 rounded bg-white/10 animate-pulse" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="select-none group/trigger transition-all duration-500 ease-(--transition-timing-function-smooth) hover:bg-white/5 focus-visible:ring-0 outline-none border-none bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-sidebar-foreground"
            >
              {/* 🔥 FIX 2: rounded-full */}
              <Avatar className="h-8 w-8 shrink-0 rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-full bg-white/10 text-white font-medium border border-white/5">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              {/* 🔥 FIX 3: Tipografi Normal (Hapus bold, uppercase, tracking) */}
              <div className="grid flex-1 text-left text-sm leading-tight ml-1 group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium text-white">
                  {user.name}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  @{user.username}
                </span>
              </div>
              
              <div className="ml-auto flex size-6 shrink-0 items-center justify-center group-data-[collapsible=icon]:hidden">
                <div className="flex flex-col items-center justify-center will-change-transform transition-transform duration-500 ease-(--transition-timing-function-snappy) group-data-[state=open]/trigger:rotate-180">
                  <ChevronUp className="size-3.5 -mb-0.75 text-muted-foreground will-change-transform transition-transform duration-500 ease-(--transition-timing-function-snappy) group-data-[state=open]/trigger:-rotate-180" />
                  <ChevronDown className="size-3.5 -mt-0.75 text-muted-foreground will-change-transform transition-transform duration-500 ease-(--transition-timing-function-snappy) group-data-[state=open]/trigger:-rotate-180" />
                </div>
              </div>

            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-white/10 bg-[#0a0a0a] shadow-2xl p-1"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            onCloseAutoFocus={(e) => e.preventDefault()}  
            >
            {/* --- AREA 1: INFORMASI PROFIL --- */}
            <DropdownMenuLabel className="p-2 font-normal">
              <div className="flex items-center gap-2 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-full bg-white/10 text-white font-medium border border-white/5">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                  <span className="truncate font-medium text-white">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    @{user.username}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-white/10 -mx-1 my-1" />

            {/* --- AREA 2: ACCOUNT & UPDATES --- */}
            <DropdownMenuItem 
              onClick={() => setShowSettings(true)}
              className="cursor-pointer gap-2 p-2 focus:bg-white/5 focus:text-white text-sidebar-foreground/70 transition-colors duration-200"
            >
              <Settings className="size-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>

            {/* Untuk System Updates, biarkan dulu karena nanti pakai Modal/Pop-up */}
            <DropdownMenuItem className="cursor-pointer gap-2 p-2 focus:bg-white/5 focus:text-white text-sidebar-foreground/70 transition-colors duration-200">
              <Sparkles className="size-4" />
              <span>System Updates</span>
            </DropdownMenuItem>

            {/* --- AREA 3: THEME (SUB-MENU) --- */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer gap-2 p-2 focus:bg-white/5 focus:text-white text-sidebar-foreground/70 transition-colors duration-200 data-[state=open]:bg-white/5 data-[state=open]:text-white">
                <Palette className="size-4" />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent 
                  className="rounded-lg border-white/10 bg-[#0a0a0a] shadow-2xl p-1 min-w-32"
                  sideOffset={8}
                >
                  <DropdownMenuItem className="cursor-pointer gap-2 p-2 focus:bg-white/5 focus:text-white text-sidebar-foreground/70 transition-colors duration-200">
                    <Sun className="size-4" />
                    <span>Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 p-2 focus:bg-white/5 focus:text-white text-sidebar-foreground/70 transition-colors duration-200">
                    <Moon className="size-4" />
                    <span>Dark</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 p-2 focus:bg-white/5 focus:text-white text-sidebar-foreground/70 transition-colors duration-200">
                    <Monitor className="size-4" />
                    <span>System</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            {/* 🔥 GARIS DEMARKASI */}
            <DropdownMenuSeparator className="bg-white/10 -mx-1 my-1" />

            {/* --- AREA 4: LOG OUT --- */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer gap-2 p-2 focus:bg-transparent focus:text-red-500 text-sidebar-foreground/70 transition-colors duration-200"
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {showSettings && (
        <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
      )}

    </SidebarMenu>
  )
}