"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

import { useDashboard } from "@/logic/dashboard/system/context"
import { getActiveBreadcrumb } from "@/logic/dashboard/system/navigation"

export function DashboardHeader() {
  const pathname = usePathname(); 
  const { activeRole, isReady } = useDashboard(); // 🔥 TAMBAHKAN isReady DI SINI
  
  // 🔥 OTOMATISASI MAGIS: Mencocokkan URL dengan data menu role saat ini
  const activePath = getActiveBreadcrumb(pathname, activeRole.name);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md">
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4 bg-white/10" />
        
        <Breadcrumb>
          <BreadcrumbList>
            {/* 🔥 SKELETON BREADCRUMB JIKA BELUM SIAP */}
            {!isReady ? (
               <div className="flex items-center gap-2">
                 <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                 <span className="text-white/20">/</span>
                 <div className="h-3 w-24 bg-white/20 rounded animate-pulse" />
               </div>
            ) : (
              // RENDER BREADCRUMB ASLI JIKA SUDAH SIAP
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage className="text-muted-foreground font-medium tracking-wide text-xs uppercase">
                    {activePath.label}
                  </BreadcrumbPage>
                </BreadcrumbItem>
                
                <BreadcrumbSeparator className="hidden md:block text-white/20" />
                
                <BreadcrumbItem>
                  <BreadcrumbPage className={cn(
                    "transition-colors",
                    activePath.subTitle ? "text-muted-foreground hidden md:block" : "font-bold text-white tracking-tight"
                  )}>
                    {activePath.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>

                {activePath.subTitle && (
                  <>
                    <BreadcrumbSeparator className="text-white/20" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="font-bold text-white tracking-tight">
                        {activePath.subTitle}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}

// Helper untuk gabung class
import { cn } from "@/lib/utils"