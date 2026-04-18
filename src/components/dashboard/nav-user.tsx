"use client"

import * as React from "react"
import Link from "next/link"
import {
  LogOut,
  ChevronUp,
  ChevronDown,
  UserCircle, 
  LifeBuoy,   
  Settings,   
  Sparkles,   
  Sun,        
  Moon,       
  Monitor,    
  Palette,    
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
import { useLogout } from "@/hooks/auth/use-logout"
import { SettingsDialog } from "@/components/dashboard/settings/settings-dialog"
import { getInitials } from "@/lib/utils" // 🔥 Import logika Inisial dari Utils

export function NavUser({
  user,
}: {
  user: { name: string; username: string; avatar: string }
}) {
  const { isMobile } = useSidebar()
  const { handleLogout } = useLogout()

  const [mounted, setMounted] = React.useState(false)
  const [showSettings, setShowSettings] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // 🔥 Cukup panggil fungsi global (Sangat Clean!)
  const initials = getInitials(user.name);

  if (!mounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="opacity-50 cursor-default hover:bg-transparent">
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
              {/* 🔥 FIX: Tambahkan overflow-hidden */}
              <Avatar className="h-8 w-8 shrink-0 rounded-full overflow-hidden">
                {/* 🔥 FIX: Tambahkan object-cover dan ukuran penuh */}
                <AvatarImage 
                  src={user.avatar} 
                  alt={user.name} 
                  className="object-cover h-full w-full" 
                />
                <AvatarFallback className="rounded-full bg-white/10 text-white font-normal border border-white/5 flex items-center justify-center">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
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
            <DropdownMenuLabel className="p-2 font-normal">
              <div className="flex items-center gap-2 text-left text-sm">
                {/* 🔥 FIX: Tambahkan overflow-hidden */}
                <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                  {/* 🔥 FIX: Tambahkan object-cover dan ukuran penuh */}
                  <AvatarImage 
                    src={user.avatar} 
                    alt={user.name} 
                    className="object-cover h-full w-full" 
                  />
                  <AvatarFallback className="rounded-full bg-white/10 text-white font-normal border border-white/5 flex items-center justify-center">
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

            <DropdownMenuItem 
              onClick={() => setShowSettings(true)}
              className="cursor-pointer gap-2 p-2 focus:bg-white/5 focus:text-white text-sidebar-foreground/70 transition-colors duration-200"
            >
              <Settings className="size-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer gap-2 p-2 focus:bg-white/5 focus:text-white text-sidebar-foreground/70 transition-colors duration-200">
              <Sparkles className="size-4" />
              <span>System Updates</span>
            </DropdownMenuItem>

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

            <DropdownMenuSeparator className="bg-white/10 -mx-1 my-1" />

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