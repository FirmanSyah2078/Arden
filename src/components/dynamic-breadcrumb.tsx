"use client"

import React from "react"
import { usePathname } from "next/navigation"

// KITA IMPORT DARI FILE YANG KAMU UPLOAD TADI
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function DynamicBreadcrumb() {
  const pathname = usePathname()

  // --- LOGIKA JUDUL ---
  const getBreadcrumbTitle = () => {
    const segments = pathname.split("/").filter(Boolean)
    const lastSegment = segments[segments.length - 1]

    if (!lastSegment || lastSegment === "dashboard") return "Home"

    // Mapping manual nama folder ke Judul Tampilan
    const titleMap: Record<string, string> = {
      "database": "Database",
      "class": "Classes",
      "rekapitulasi": "Recapitulation",
      "settings": "Settings",
      "docs": "Documentation"
    }

    return titleMap[lastSegment] || (lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1))
  }

  const currentPageTitle = getBreadcrumbTitle()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        
        {/* 1. DASHBOARD (Induk) */}
        <BreadcrumbItem className="hidden md:block">
          {/* Kita pakai BreadcrumbLink dengan asChild agar stylingnya tetap dapat,
              tapi kita isi span agar tidak menjadi link aktif (mati) */}
          <BreadcrumbLink asChild>
            <span className="cursor-default hover:text-foreground transition-colors">
              Dashboard
            </span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator className="hidden md:block" />
        
        {/* 2. HALAMAN SAAT INI (Anak) */}
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPageTitle}</BreadcrumbPage>
        </BreadcrumbItem>

      </BreadcrumbList>
    </Breadcrumb>
  )
}