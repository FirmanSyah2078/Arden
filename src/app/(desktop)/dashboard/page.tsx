import { SectionCards } from "@/components/dashboard/section-cards"
import { OverviewChart } from "@/components/dashboard/overview-chart" // Grafik dummy yang lama
import { DashboardBanner } from "@/components/dashboard/dashboard-banner"
import { ActivityLog } from "@/components/dashboard/activity-log"
import { BottomGrids } from "@/components/dashboard/bottom-grids"

// Import Data Dummy Terpusat
import { statsData, chartData, activityLogs } from "@/lib/dummy-data"

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      
      {/* GRID UTAMA */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 xl:grid-cols-4 min-h-[calc(100vh-140px)]">
        
        {/* KOLOM KIRI (3/4 Grid) */}
        <div className="space-y-4 lg:col-span-3">
          
          <DashboardBanner />
          <SectionCards stats={statsData} />

          {/* AREA GRAFIK */}
          <div className="grid grid-cols-1">
             <OverviewChart data={chartData} />
          </div>

          {/* 3 GRID KECIL BARU (INSIGHT AREA) */}
          <BottomGrids />

        </div>

        {/* KOLOM KANAN (1/4 Grid) */}
        <div className="lg:col-span-1">
           <ActivityLog logs={activityLogs} />
        </div>

      </div>
    </div>
  )
}