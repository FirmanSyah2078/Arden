"use client"

import * as React from "react"
import { ChevronUp, ChevronDown, Shield } from "lucide-react"

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

import { useDashboard } from "@/contexts/cont-dashboard"

export function NavRole({
  roles,
}: {
  roles: {
    name: string
    logo: React.ElementType
    plan: string
    level: number
  }[]
}) {
  const { isMobile } = useSidebar()
  const { realRole, activeRole, setActiveRole } = useDashboard()

  const displayRole = roles.find(r => r.name === activeRole.name) || roles[0];
  const allowedRoles = roles.filter(r => r.level <= realRole.level);

  if (!displayRole) return null
  const Logo = displayRole.logo;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={allowedRoles.length <= 1}>
            <SidebarMenuButton
              size="lg"
              className="select-none group/trigger transition-all duration-500 ease-(--transition-timing-function-smooth) hover:bg-white/5 focus-visible:ring-0 outline-none border-none bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-sidebar-foreground"
            >
              
              {/* ANAK 1: LOGO */}
              <div 
                key={`logo-${displayRole.name}`}
                className="bg-white/10 text-white flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg border border-white/5 animate-in fade-in slide-in-from-bottom-1 duration-500"
              >
                {Logo && <Logo className="size-4" />}
              </div>
              
              {/* ANAK 2: TEKS */}
              <div 
                key={`text-${displayRole.name}`}
                className="grid flex-1 text-left text-sm leading-tight ml-1 animate-in fade-in slide-in-from-bottom-1 duration-500"
              >
                <span className="truncate font-bold text-white tracking-tight">{displayRole.name}</span>
                <span className="truncate text-[10px] text-gray-500 uppercase tracking-widest">{displayRole.plan}</span>
              </div>

              {/* ANAK 3: ANIMASI CHEVRON NVG */}
              {allowedRoles.length > 1 && (
                <div className="ml-auto flex size-6 shrink-0 items-center justify-center">
                  <div className="flex flex-col items-center justify-center will-change-transform transition-transform duration-500 ease-(--transition-timing-function-snappy) group-data-[state=open]/trigger:rotate-180">
                    <ChevronUp className="size-3.5 -mb-0.75 text-muted-foreground will-change-transform transition-transform duration-500 ease-(--transition-timing-function-snappy) group-data-[state=open]/trigger:-rotate-180" />
                    <ChevronDown className="size-3.5 -mt-0.75 text-muted-foreground will-change-transform transition-transform duration-500 ease-(--transition-timing-function-snappy) group-data-[state=open]/trigger:-rotate-180" />
                  </div>
                </div>
              )}

            </SidebarMenuButton>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-[#0a0a0a] border-white/10 text-white shadow-2xl"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs uppercase tracking-widest">
              Switch View As
            </DropdownMenuLabel>
            
            {allowedRoles.map((role) => {
              const DropdownLogo = role.logo;
              return (
                <DropdownMenuItem 
                  key={role.name} 
                  onClick={() => setActiveRole(role)} 
                  className="gap-3 p-2 cursor-pointer focus:bg-white/10 focus:text-white transition-colors duration-200"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border border-white/10 bg-white/5">
                    {DropdownLogo && <DropdownLogo className="size-3.5 shrink-0" />}
                  </div>
                  <span className="font-medium">{role.name}</span>
                  {role.name === realRole.name && (
                     <span className="ml-auto text-[9px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-sm border border-indigo-500/20">REAL</span>
                  )}
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator className="bg-white/10" />

            <div className="flex items-start gap-2 px-2 py-2 mx-1 mt-1.5 mb-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
              <Shield className="size-4 text-indigo-400 shrink-0 mt-0.5" />
              <span className="text-[10px] text-indigo-200/70 font-medium leading-relaxed">
                Akses level Anda saat ini adalah <strong className="font-bold text-indigo-300 uppercase">{realRole.name}</strong>.
              </span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}