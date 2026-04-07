import { useState, useEffect, useMemo, useCallback } from "react"
import { Student, Class } from "@/types/api"

export interface StudentWithStatus extends Student {
  is_menstruating?: boolean
  menstruation_day?: number
}

export function useStudents() {
  const [data, setData] = useState<StudentWithStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [classOptions, setClassOptions] = useState<{ label: string, value: string }[]>([])
  
  const [openCreate, setOpenCreate] = useState(false)
  const [openImport, setOpenImport] = useState(false)
  const [editData, setEditData] = useState<Student | null>(null)
  const [deleteData, setDeleteData] = useState<Student | null>(null)

  // 🔥 FUNGSI FETCH TERPUSAT (Agar bisa dipanggil ulang setelah save/edit/delete)
  const fetchStudents = useCallback(() => {
    setIsLoading(true);
    fetch("/api/student")
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          const hybrid = json.data.map((student: Student) => ({
            ...student,
            is_menstruating: false,
            menstruation_day: 0
          }))
          setData(hybrid)
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Ambil data Siswi pertama kali komponen dimuat
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents])

  // Fetch Options Kelas (Hanya sekali di awal)
  useEffect(() => {
    fetch('/api/class')
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setClassOptions(json.data.map((cls: Class) => ({
            label: cls.class_name,
            value: cls.id_class.toString()
          })))
        }
      })
  }, [])

  // Setup Fields secara dinamis
  const createFields = useMemo(() => [
    { name: "full_name", label: "Full Name", type: "text", required: true },
    { name: "nis", label: "NIS", type: "number", required: true },
    { name: "id_class", label: "Class", type: "select", placeholder: "Choose Class", options: classOptions, required: true }
  ] as any[], [classOptions])

  const editFields = useMemo(() => [
    { name: "full_name", label: "Full Name", type: "text" },
    { name: "nis", label: "NIS", type: "number" },
    { name: "id_class", label: "Class", type: "select", placeholder: "Choose Class", options: classOptions }
  ] as any[], [classOptions])

  return {
    data,
    classOptions, isLoading,
    createFields, editFields,
    openCreate, setOpenCreate,
    openImport, setOpenImport,
    editData, setEditData,
    deleteData, setDeleteData,
    refreshData: fetchStudents // 🔥 EKSPOR FUNGSI SAKTI INI
  }
}