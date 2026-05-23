// src/lib/dumy-class.ts

// --- TABEL KELAS ---
export const dummyClasses = [
  { 
    id: 1, 
    name: "X MIPA 1", 
    academic_year: "2025/2026", 
    wali: "Mr. Mulyono S.Pd.", 
    batch: "X", 
    period: 4, 
    description: "A highly disciplined class focusing on advanced sciences and collaborative projects." 
  },
  { 
    id: 2, 
    name: "X MIPA 2", 
    academic_year: "2025/2026", 
    wali: "Mrs. Susi S.Pd.", 
    batch: "X", 
    period: 2, 
    description: "Known for active participation in national physics Olympiads and teamwork." 
  },
  { 
    id: 3, 
    name: "XI MIPA 1", 
    academic_year: "2025/2026", 
    wali: "Mr. Budi S.Pd.", 
    batch: "XI", 
    period: 5, 
    description: "Exceptional analytical skills with consistent top-tier academic performance." 
  },
  { 
    id: 4, 
    name: "XII IPS 1", 
    academic_year: "2024/2025", // Contoh tahun ajaran lama (historical)
    wali: "Mrs. Ani S.Pd.", 
    batch: "XII", 
    period: 3, 
    description: "Creative thinkers with a strong passion for sociology and economic debates." 
  },
];

// --- TABEL SISWI (Berelasi dengan classId) ---
export const dummyStudents = [
  // --- SISWI KELAS X MIPA 1 (classId: 1) ---
  { id: 101, classId: 1, name: "Aisyah Putri Maharani Kusumawardhani", icode: "ARD-XMP1-001", nis: "1002938101", notes: "Siswi aktif dalam kegiatan pramuka.", history: [{ id: 1, start: "2024-03-01", end: "2024-03-07", status: "Selesai", remarks: "Siklus normal 7 hari" }] },
  { id: 102, classId: 1, name: "Bunga Pertiwi", icode: "ARD-XMP1-002", nis: "1002938102", notes: "Membutuhkan perhatian khusus pada kesehatan fisik.", history: [] },
  { id: 103, classId: 1, name: "Citra Lestari", icode: "ARD-XMP1-003", nis: "1002938103", notes: "Sering mewakili sekolah dalam olimpiade sains.", history: [] },
  { id: 104, classId: 1, name: "Dian Sastrowardoyo", icode: "ARD-XMP1-004", nis: "1002938104", notes: "Ketua ekstrakurikuler teater.", history: [{ id: 1, start: "2024-01-10", end: "2024-01-16", status: "Selesai", remarks: "Siklus normal" }] },
  { id: 105, classId: 1, name: "Eka Wardhani", icode: "ARD-XMP1-005", nis: "1002938105", notes: "", history: [] },
  { id: 106, classId: 1, name: "Fatimah Azzahra", icode: "ARD-XMP1-006", nis: "1002938106", notes: "", history: [] },
  { id: 107, classId: 1, name: "Santika Ayu", icode: "ARD-XMP1-007", nis: "1002938107", notes: "", history: [] },
  { id: 108, classId: 1, name: "Ryassanty Nawa", icode: "ARD-XMP1-008", nis: "1002938108", notes: "", history: [] },
  { id: 109, classId: 1, name: "Nabila Ayu Saraswati", icode: "ARD-XMP1-009", nis: "1002938109", notes: "", history: [] },
  { id: 110, classId: 1, name: "Kirana Larasati", icode: "ARD-XMP1-010", nis: "1002938110", notes: "", history: [] },

  // --- SISWI KELAS X MIPA 2 (classId: 2) ---
  { id: 201, classId: 2, name: "Ratu Jelita", icode: "ARD-XMP2-001", nis: "1002938201", notes: "", history: [] },
  { id: 202, classId: 2, name: "Salsabila Firdaus", icode: "ARD-XMP2-002", nis: "1002938202", notes: "", history: [] },
  { id: 203, classId: 2, name: "Tari Melani Anjani", icode: "ARD-XMP2-003", nis: "1002938203", notes: "", history: [] },

  // --- SISWI KELAS XI MIPA 1 (classId: 3) ---
  { id: 301, classId: 3, name: "Umi Kalsum", icode: "ARD-XIM1-001", nis: "1002938301", notes: "", history: [] },
  { id: 302, classId: 3, name: "Vania Agatha", icode: "ARD-XIM1-002", nis: "1002938302", notes: "", history: [] },
];

// --- HELPER FUNCTIONS ---
export const getClassesWithStudentCount = () => {
  return dummyClasses.map(kelas => {
    // Hitung jumlah siswi di kelas ini secara otomatis
    const studentCount = dummyStudents.filter(s => s.classId === kelas.id).length;
    return { ...kelas, Student: studentCount };
  });
};

export const getStudentsByClassId = (classId: number) => {
  return dummyStudents.filter(s => s.classId === classId);
};