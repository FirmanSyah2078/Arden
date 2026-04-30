import { useState, useEffect, useMemo, useCallback } from "react"
import { Student, Class } from "@/types/api"
import { FieldConfig } from "@/components/dashboard/directory/dialog/create"

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

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents])

  useEffect(() => {
    fetch('/api/class')
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setClassOptions(json.data.map((cls: Class) => ({
            // 🔥 Sudah menggunakan Angka (10, 11, 12) sesuai DB, jadinya "10 MIPA 1"
            label: `${cls.grade_level} ${cls.class_name}`, 
            value: cls.id_class.toString()
          })))
        }
      })
  }, [])

  const studentFields: FieldConfig[] = useMemo(() => [
    { 
      name: "full_name", 
      label: "Full Name", 
      type: "text", 
      placeholder: "Ex: Aisyah Putri Maharani", 
      required: true 
    },
    { 
      // 🔥 FIX: type diubah ke "text" agar panah (spinner) browser hilang
      name: "nis", 
      label: "NIS", 
      type: "text", 
      placeholder: "Ex: 1002938101", 
      required: true, 
      halfWidth: true 
    },
    { 
      name: "id_class", 
      label: "Class", 
      type: "select", 
      placeholder: "Select Class", 
      options: classOptions, 
      required: true, 
      halfWidth: true 
    }
  ], [classOptions])

  return {
    data,
    classOptions, isLoading,
    studentFields, 
    openCreate, setOpenCreate,
    openImport, setOpenImport,
    editData, setEditData,
    deleteData, setDeleteData,
    refreshData: fetchStudents 
  }
}