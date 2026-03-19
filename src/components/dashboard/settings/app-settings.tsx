"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserCircle, Shield, Palette } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarNavItems = [
  {
    title: "Profil",
    href: "/settings/profile", // Sesuaikan dengan route-mu nanti
    icon: UserCircle,
  },
  {
    title: "Keamanan",
    href: "/settings/security",
    icon: Shield,
  },
  {
    title: "Tampilan",
    href: "/settings/appearance",
    icon: Palette,
  },
]

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar">
      {sidebarNavItems.map((item) => {
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 shrink-0 md:shrink",
              isActive
                ? "bg-white/10 text-white shadow-sm"
                : "text-sidebar-foreground/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={cn("size-4", isActive ? "text-indigo-400" : "")} />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}