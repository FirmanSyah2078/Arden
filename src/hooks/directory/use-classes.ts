import { useState, useEffect, useCallback } from "react"
import { Class } from "@/types/api"

export interface ClassWithMetrics extends Class {
  total_students?: number
  active_period?: number
  warnings?: number
  health_status?: "Excellent" | "Good" | "Attention" | "Critical"
}

export function useClasses() {
  const [data, setData] = useState<ClassWithMetrics[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [openCreate, setOpenCreate] = useState(false)
  const [editData, setEditData] = useState<ClassWithMetrics | null>(null)
  const [deleteData, setDeleteData] = useState<ClassWithMetrics | null>(null)

  // 🔥 FUNGSI FETCH TERPUSAT & MENGEMBALIKAN LOGIKA DUMMY METRICS
  const fetchClasses = useCallback(() => {
    setIsLoading(true);
    fetch("/api/class")
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          // Gabungkan data asli dari DB dengan metrik buatan (hybrid)
          const hybrid = json.data.map((realClass: any) => {
            const seed = realClass.id_class ? Number(realClass.id_class) : realClass.class_name.length;
            const warn = (seed * 5) % 4;
            let status: "Excellent" | "Good" | "Attention" | "Critical" = "Excellent";
            if (warn === 1) status = "Good"; 
            if (warn === 2) status = "Attention"; 
            if (warn > 2) status = "Critical";

            return {
              ...realClass,
              active_period: (seed * 3) % 9,
              warnings: warn,
              health_status: status
            }
          });
          setData(hybrid);
        }
      })
      .catch(err => console.error("Error fetching classes:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses])

  return {
    data, isLoading,
    openCreate, setOpenCreate,
    editData, setEditData,
    deleteData, setDeleteData,
    refreshData: fetchClasses // 🔥 Fitur refresh tabel tanpa F5
  }
}