import { useState, useMemo } from "react";
import { dummyClasses, getStudentsByClassId } from "@/lib/dumy-class";

export function useView(classIdStr: string) {
  const classId = Number(classIdStr);
  const [searchQuery, setSearchQuery] = useState("");
  const [rightTab, setRightTab] = useState<"qr" | "calendar">("qr");

  // Cari Data Kelas berdasarkan ID
  const classData = useMemo(() => dummyClasses.find(c => c.id === classId), [classId]);
  
  // Cari Semua Siswi di Kelas tersebut
  const classStudents = useMemo(() => getStudentsByClassId(classId), [classId]);

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(classStudents[0]?.id || null);

  // Filter List Siswi
  const filteredStudents = classStudents.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.icode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Data Siswi Terpilih
  const currentStudent = useMemo(() => 
    classStudents.find(s => s.id === selectedStudentId), 
  [selectedStudentId, classStudents]);

  // Nama Kelas yang Indah (Dilengkapi Tahun Ajaran)
  const dummyClassName = classData ? `${classData.name} (${classData.academic_year})` : `Kelas Tidak Ditemukan`;

  return {
    classId,
    dummyClassName,
    selectedStudentId, setSelectedStudentId,
    searchQuery, setSearchQuery,
    rightTab, setRightTab,
    filteredStudents,
    currentStudent
  };
}