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

import { useDashboard } from "@/db/dashboard/system/context"
import { getActiveBreadcrumb } from "@/db/dashboard/system/navigation"
import { cn } from "@/lib/utils" 

export function DashboardHeader() {
  const pathname = usePathname(); 
  const { activeRole, isReady } = useDashboard();
  
  const activePath = getActiveBreadcrumb(pathname, activeRole.name);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4 bg-white/10" />
        
        <Breadcrumb>
          <BreadcrumbList>
            {!isReady ? (
               <>
                 <BreadcrumbItem className="hidden md:block">
                   <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                 </BreadcrumbItem>
                 <BreadcrumbSeparator className="hidden md:block text-white/20" />
                 <BreadcrumbItem>
                   <div className="h-3 w-24 bg-white/20 rounded animate-pulse" />
                 </BreadcrumbItem>
               </>
            ) : (
              <>
                {/* 1. LABEL (Contoh: Projek / Management) */}
                <BreadcrumbItem className="hidden md:block">
                  {/* 🔥 FIX: Hapus text-xs dan tracking-wide agar ukurannya persis sama */}
                  <BreadcrumbPage className="text-muted-foreground font-medium capitalize">
                    {activePath.label}
                  </BreadcrumbPage>
                </BreadcrumbItem>
                
                <BreadcrumbSeparator className="hidden md:block text-white/20" />
                
                {/* 2. TITLE (Contoh: Home / Settings) */}
                <BreadcrumbItem>
                  <BreadcrumbPage className={cn(
                    "transition-colors capitalize font-medium",
                    activePath.subTitle ? "text-muted-foreground hidden md:block" : "text-foreground" // 🔥 Pakai text-foreground
                  )}>
                    {activePath.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>

                {/* 3. SUB-TITLE (Jika ada) */}
                {activePath.subTitle && (
                  <>
                    <BreadcrumbSeparator className="text-white/20" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="font-medium text-foreground capitalize">
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