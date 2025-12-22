"use client"

import { type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  label,
  items,
}: {
  label?: string
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      
      <SidebarMenu>
        {items.map((item) => {
          // 3. LOGIKA DETEKSI AKTIF
          // Jika URL menu adalah "/dashboard", dia hanya aktif jika path persis sama (biar gak nyala terus)
          // Jika URL menu lain (misal /dashboard/class), dia aktif jika path diawali URL tsb (biar anak-anaknya juga nyala)
          const isLinkActive = item.url === "/dashboard" 
            ? pathname === "/dashboard"
            : pathname.startsWith(item.url)

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                tooltip={item.title} 
                isActive={isLinkActive} // 4. Pasang status aktif otomatis disini
                className="sidebar-shine hover:bg-white/5 transition-all duration-300"
              >
                <Link href={item.url}>
                  {item.icon && <item.icon className="text-(--sidebar-primary)/60 group-hover:text-(--sidebar-primary) transition-colors" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}