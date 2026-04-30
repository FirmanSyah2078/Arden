import { useState, useEffect, useCallback, useMemo } from "react"
import { Class } from "@/types/api"
import { FieldConfig } from "@/components/dashboard/directory/dialog/create" 

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

  const classFields: FieldConfig[] = useMemo(() => [
    {
      name: "academic_year", 
      label: "Academic Year",
      type: "text",
      placeholder: "Ex: 2025/2026",
      required: true,
      halfWidth: true
    },
    {
      name: "grade_level", 
      label: "Grade Level",
      type: "select",
      placeholder: "Select Grade",
      required: true,
      halfWidth: true,
      options: [
        // 🔥 FIX: Hilangkan label romawi agar tampil polos 10, 11, 12
        { label: "10", value: "10" },
        { label: "11", value: "11" },
        { label: "12", value: "12" }
      ]
    },
    {
      name: "class_name", 
      label: "Class Name",
      type: "text",
      placeholder: "Ex: MIPA 1",
      required: true,
    },
    {
      name: "advisor",
      label: "Homeroom Teacher",
      type: "text",
      placeholder: "Ex: Siti Aminah, S.Pd",
      required: true, // 🔥 FIX: Wali kelas sekarang WAJIB
    },
  ], [])

  const fetchClasses = useCallback(() => {
    setIsLoading(true);
    fetch("/api/class")
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
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
    classFields, 
    refreshData: fetchClasses
  }
}