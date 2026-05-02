import { useState } from "react";

// --- DUMMY DATA ---
const classesData = [
  { id: 1, name: "X MIPA 1", wali: "Mr. Mulyono S.Pd.", batch: "X", Student: 32, period: 4, description: "A highly disciplined class focusing on advanced sciences and collaborative projects." },
  { id: 2, name: "X MIPA 2", wali: "Mrs. Susi S.Pd.", batch: "X", Student: 31, period: 2, description: "Known for active participation in national physics Olympiads and teamwork." },
  { id: 3, name: "XI MIPA 1", wali: "Mr. Budi S.Pd.", batch: "XI", Student: 30, period: 5, description: "Exceptional analytical skills with consistent top-tier academic performance." },
  { id: 4, name: "XI IPS 1", wali: "Mrs. Ani S.Pd.", batch: "XI", Student: 29, period: 3, description: "Creative thinkers with a strong passion for sociology and economic debates." },
];

const dummyStudentsQR = [
  { id: 101, name: "Aisyah Putri Maharani Kusumawardhani", icode: "ARD-XMP1-001" },
  { id: 102, name: "Bunga Pertiwi", icode: "ARD-XMP1-002" },
  { id: 103, name: "Citra Lestari", icode: "ARD-XMP1-003" },
  { id: 104, name: "Dian Sastrowardoyo", icode: "ARD-XMP1-004" },
  { id: 105, name: "Eka Wardhani", icode: "ARD-XMP1-005" },
  { id: 106, name: "Fatimah Azzahra", icode: "ARD-XMP1-006" },
  { id: 107, name: "Santika Ayu", icode: "ARD-XMP1-007" },
  { id: 108, name: "Ryassanty Nawa", icode: "ARD-XMP1-008" },
  { id: 109, name: "Nabila Ayu Saraswati", icode: "ARD-XMP1-009" },
  { id: 110, name: "Kirana Larasati", icode: "ARD-XMP1-010" },
  { id: 111, name: "Ratu Jelita", icode: "ARD-XMP1-011" },
  { id: 112, name: "Salsabila Firdaus", icode: "ARD-XMP1-012" },
  { id: 113, name: "Tari Melani Anjani", icode: "ARD-XMP1-013" },
  { id: 114, name: "Umi Kalsum", icode: "ARD-XMP1-014" },
  { id: 115, name: "Vania Agatha", icode: "ARD-XMP1-015" },
  { id: 116, name: "Wulan Ningrum", icode: "ARD-XMP1-016" },
  { id: 117, name: "Xena Rania", icode: "ARD-XMP1-017" },
  { id: 118, name: "Yulia Mutiara", icode: "ARD-XMP1-018" },
  { id: 119, name: "Zahra Aulia", icode: "ARD-XMP1-019" },
  { id: 120, name: "Rania Putri Salsabila", icode: "ARD-XMP1-020" },
  { id: 121, name: "Mutia Cantika", icode: "ARD-XMP1-021" },
  { id: 122, name: "Jihan Fahira", icode: "ARD-XMP1-022" },
  { id: 123, name: "Lilis Suryani", icode: "ARD-XMP1-023" },
  { id: 124, name: "Maya Septha", icode: "ARD-XMP1-024" },
  { id: 125, name: "Prita Laura", icode: "ARD-XMP1-025" },
];

export function useClass() {
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // State untuk Modal QR Bulk Print
  const [qrModalClass, setQrModalClass] = useState<any | null>(null);
  const [selectedQRStudents, setSelectedQRStudents] = useState<number[]>([]);

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
    setSelectedQRStudents([]); // Reset pilihan saat modal baru dibuka
  };

  const closeQrModal = () => setQrModalClass(null);

  const handlePrint = () => {
    window.print();
  };

  return {
    keyword, handleSearchChange,
    activeFilter, handleFilterChange,
    currentPage, setCurrentPage, StudentPages, visiblePages: generatePagination(),
    paginatedClasses,
    
    // QR Modal Exports
    qrModalClass, openQrModal, closeQrModal,
    dummyStudentsQR, selectedQRStudents, handleToggleQRStudent, handleSelectAllQR, handlePrint
  };
}