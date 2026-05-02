import { useState, useMemo } from "react";

// --- DUMMY DATA LENGKAP SISWI ---
const dummyStudents = [
  { id: 1, name: "Aisyah Putri Maharani Kusumawardhani", icode: "ARD-XMP1-001", nis: "1002938101", notes: "Siswi aktif dalam kegiatan pramuka.", history: [{ id: 1, start: "2024-03-01", end: "2024-03-07", status: "Selesai", remarks: "Siklus normal 7 hari" }] },
  { id: 2, name: "Bunga Pertiwi", icode: "ARD-XMP1-002", nis: "1002938102", notes: "Membutuhkan perhatian khusus pada kesehatan fisik.", history: [] },
  { id: 3, name: "Citra Lestari", icode: "ARD-XMP1-003", nis: "1002938103", notes: "Sering mewakili sekolah dalam olimpiade sains.", history: [] },
  { id: 4, name: "Dian Sastrowardoyo", icode: "ARD-XMP1-004", nis: "1002938104", notes: "Ketua ekstrakurikuler teater.", history: [{ id: 1, start: "2024-01-10", end: "2024-01-16", status: "Selesai", remarks: "Siklus normal" }] },
];

export function useView(classId: string) {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(dummyStudents[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rightTab, setRightTab] = useState<"qr" | "calendar">("qr");

  // Filter List Siswi
  const filteredStudents = dummyStudents.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.icode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Data Siswi Terpilih
  const currentStudent = useMemo(() => 
    dummyStudents.find(s => s.id === selectedStudentId), 
  [selectedStudentId]);

  // Karena belum ada DB, kita pura-pura buat nama kelas dari ID-nya
  const dummyClassName = `Detail Kelas (ID: ${classId})`;

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