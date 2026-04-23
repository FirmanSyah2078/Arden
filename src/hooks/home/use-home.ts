import { useState, useEffect, useCallback } from "react";
import { statsData, chartData, cycleQualityData } from "@/lib/dummy-data";
import { ClassData } from "@/components/dashboard/home/overview-chart";

// Interface untuk Stats mengikuti struktur dummy-data.ts
export interface StatItem {
  value: number;
  trend: number;
}

export interface DashboardStats {
  totalSiswi: StatItem;
  sedangHaid: StatItem;
  wajibSholat: StatItem;
  izinSakit: StatItem;
  alpha: StatItem;
}

export interface CycleQualityItem {
  status: string;
  count: number;
  fill: string;
}

export function useHome() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [classChartData, setClassChartData] = useState<ClassData[]>([]);
  const [cycleData, setCycleData] = useState<CycleQualityItem[]>([]);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulasi delay jaringan API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Inject data dari dummy-data.ts
      setStats(statsData);
      setClassChartData(chartData);
      setCycleData(cycleQualityData);
      
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    classChartData,
    cycleData,
    isLoading,
    refreshData: fetchDashboardData,
  };
}