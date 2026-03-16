"use client"

import * as React from "react"
import {
  ChevronsUpDown,
  LogOut,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useLogout } from "@/hooks/use-logout"

export function NavUser({
  user,
}: {
  user: { name: string; role: string; avatar: string }
}) {
  const { isMobile } = useSidebar()
  const { handleLogout } = useLogout()

  const [mounted, setMounted] = React.useState(false)

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
          {/* 🔥 FIX SKELETON: Panah dihapus agar seragam dengan nav-role */}
          <SidebarMenuButton size="lg" className="opacity-50 cursor-default hover:bg-transparent">
            <div className="h-8 w-8 rounded-lg bg-white/10 animate-pulse" />
            <div className="grid flex-1 gap-1.5 text-left text-sm leading-tight ml-1">
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
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                {/* 🔥 FIX AVATAR: Background gelap elegan jika foto tidak ada */}
                <AvatarFallback className="rounded-lg bg-white/10 text-white font-bold border border-white/5">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              {/* 🔥 FIX FONT: Disamakan dengan gaya nav-role */}
              <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                <span className="truncate font-bold text-white tracking-tight">
                  {user.name}
                </span>
                <span className="truncate text-[10px] text-gray-500 uppercase tracking-widest">
                  Role {user.role}
                </span>
              </div>
              
              <div className="ml-auto flex size-6 shrink-0 items-center justify-center">
                <div className="flex flex-col items-center justify-center will-change-transform transition-transform duration-500 ease-(--transition-timing-function-snappy) group-data-[state=open]/trigger:rotate-180">
                  <ChevronUp className="size-3.5 -mb-0.75 text-muted-foreground will-change-transform transition-transform duration-500 ease-(--transition-timing-function-snappy) group-data-[state=open]/trigger:-rotate-180" />
                  <ChevronDown className="size-3.5 -mt-0.75 text-muted-foreground will-change-transform transition-transform duration-500 ease-(--transition-timing-function-snappy) group-data-[state=open]/trigger:-rotate-180" />
                </div>
              </div>

            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-white/10 bg-[#0a0a0a] shadow-2xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            onCloseAutoFocus={(e) => e.preventDefault()}  
            >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-white/10 text-white font-bold border border-white/5">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                  <span className="truncate font-bold text-white tracking-tight">
                    {user.name}
                  </span>
                  <span className="truncate text-[10px] text-gray-500 uppercase tracking-widest">
                    Role {user.role}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500 transition-colors duration-200"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}