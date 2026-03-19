import { cookies } from "next/headers"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardProvider } from "@/logic/dashboard/system/context"

export default async function DesktopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    // 1. Bungkus semua dengan DashboardProvider agar state Role menyebar ke seluruh komponen
    <DashboardProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>

          {/* 2. Gunakan Header Baru yang berisi Breadcrumb Otomatis */}
          <DashboardHeader />

          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-x-hidden">
            {children}
          </div>

        </SidebarInset>
      </SidebarProvider>
    </DashboardProvider>
  )
}