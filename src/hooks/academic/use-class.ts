import { useState, useMemo } from "react";
import { getClassesWithStudentCount, getStudentsByClassId } from "@/lib/dumy-class";

export function useClass() {
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // State untuk Modal QR Bulk Print
  const [qrModalClass, setQrModalClass] = useState<any | null>(null);
  const [dummyStudentsQR, setDummyStudentsQR] = useState<any[]>([]);
  const [selectedQRStudents, setSelectedQRStudents] = useState<number[]>([]);

  // Panggil data kelas terintegrasi (dengan hitungan murid otomatis)
  const classesData = useMemo(() => getClassesWithStudentCount(), []);

  // LOGIKA PENCARIAN & FILTER
  const handleSearchChange = (val: string) => { 
    setKeyword(val); 
    setCurrentPage(1); 
  };
  
  const handleFilterChange = (value: string) => { 
    setActiveFilter(value); 
    setCurrentPage(1); 
  };

  const filteredClasses = classesData.filter((kelas) => {
    const matchTab = activeFilter === "all" ? true : kelas.batch === activeFilter;
    const matchSearch = kelas.name.toLowerCase().includes(keyword.toLowerCase()) || kelas.wali.toLowerCase().includes(keyword.toLowerCase());
    return matchTab && matchSearch;
  });

  // LOGIKA PAGINASI
  const StudentPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const generatePagination = () => {
    if (StudentPages <= 4) return Array.from({ length: StudentPages }, (_, i) => i + 1);
    if (currentPage <= 2) return [1, 2, 3, '...', StudentPages];
    if (currentPage >= StudentPages - 1) return [1, '...', StudentPages - 2, StudentPages - 1, StudentPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', StudentPages];
  };

  // LOGIKA CETAK QR
  const handleToggleQRStudent = (id: number) => {
    setSelectedQRStudents(prev => prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]);
  };

  const handleSelectAllQR = () => {
    if (selectedQRStudents.length === dummyStudentsQR.length) {
      setSelectedQRStudents([]);
    } else {
      setSelectedQRStudents(dummyStudentsQR.map(s => s.id));
    }
  };

  const openQrModal = (kelas: any) => {
    setQrModalClass(kelas);
    const studentsInThisClass = getStudentsByClassId(kelas.id);
    setDummyStudentsQR(studentsInThisClass);
    setSelectedQRStudents([]); 
  };

  const closeQrModal = () => {
    setQrModalClass(null);
    setDummyStudentsQR([]);
  };

  const handlePrint = () => {
    window.print();
  };

  return {
    keyword, handleSearchChange,
    activeFilter, handleFilterChange,
    currentPage, setCurrentPage, StudentPages, visiblePages: generatePagination(),
    paginatedClasses,
    qrModalClass, openQrModal, closeQrModal,
    dummyStudentsQR, selectedQRStudents, handleToggleQRStudent, handleSelectAllQR, handlePrint
  };
}