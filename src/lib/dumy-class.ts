// src/lib/dumy-class.ts
//
// 🔥 Satu sumber dummy untuk modul Academic: data kelas/siswi + config & periode
// siklus. Sebelumnya kepisah di src/lib/academic/cycle-dummy.ts — sekarang digabung
// di sini biar cuma ada satu sumber dummy, nggak jalan sendiri-sendiri.

import type { CyclePeriod, PhaseConfig } from "./academic/cycle-engine"

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
// 🔥 Field `history` lama sudah dihapus — dead code, sudah nggak dipakai UI Academic
// (riwayat siklus sekarang diturunkan dari `dummyCyclePeriodsByStudent` di bawah).
export const dummyStudents = [
  // --- SISWI KELAS X MIPA 1 (classId: 1) ---
  { id: 101, classId: 1, name: "Aisyah Putri Maharani Kusumawardhani", icode: "ARD-XMP1-001", nis: "1002938101", notes: "Siswi aktif dalam kegiatan pramuka." },
  { id: 102, classId: 1, name: "Bunga Pertiwi", icode: "ARD-XMP1-002", nis: "1002938102", notes: "Membutuhkan perhatian khusus pada kesehatan fisik." },
  { id: 103, classId: 1, name: "Citra Lestari", icode: "ARD-XMP1-003", nis: "1002938103", notes: "Sering mewakili sekolah dalam olimpiade sains." },
  { id: 104, classId: 1, name: "Dian Sastrowardoyo", icode: "ARD-XMP1-004", nis: "1002938104", notes: "Ketua ekstrakurikuler teater." },
  { id: 105, classId: 1, name: "Eka Wardhani", icode: "ARD-XMP1-005", nis: "1002938105", notes: "" },
  { id: 106, classId: 1, name: "Fatimah Azzahra", icode: "ARD-XMP1-006", nis: "1002938106", notes: "" },
  { id: 107, classId: 1, name: "Santika Ayu", icode: "ARD-XMP1-007", nis: "1002938107", notes: "" },
  { id: 108, classId: 1, name: "Ryassanty Nawa", icode: "ARD-XMP1-008", nis: "1002938108", notes: "" },
  { id: 109, classId: 1, name: "Nabila Ayu Saraswati", icode: "ARD-XMP1-009", nis: "1002938109", notes: "" },
  { id: 110, classId: 1, name: "Kirana Larasati", icode: "ARD-XMP1-010", nis: "1002938110", notes: "" },

  // --- SISWI KELAS X MIPA 2 (classId: 2) ---
  { id: 201, classId: 2, name: "Ratu Jelita", icode: "ARD-XMP2-001", nis: "1002938201", notes: "" },
  { id: 202, classId: 2, name: "Salsabila Firdaus", icode: "ARD-XMP2-002", nis: "1002938202", notes: "" },
  { id: 203, classId: 2, name: "Tari Melani Anjani", icode: "ARD-XMP2-003", nis: "1002938203", notes: "" },

  // --- SISWI KELAS XI MIPA 1 (classId: 3) ---
  { id: 301, classId: 3, name: "Umi Kalsum", icode: "ARD-XIM1-001", nis: "1002938301", notes: "" },
  { id: 302, classId: 3, name: "Vania Agatha", icode: "ARD-XIM1-002", nis: "1002938302", notes: "" },
];

// --- HELPER FUNCTIONS (KELAS & SISWI) ---
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

// =========================================================================
// 🔥 SIKLUS BIOLOGIS — dipindahkan dari src/lib/academic/cycle-dummy.ts.
// Tetap dummy DATA (bukan logika) — logikanya tetap di cycle-engine.ts.
// =========================================================================

export const dummyTodayISO = "2025-11-18"

// Nanti datang dari /dashboard/phases (4-Phase Time Range)
export const dummyPhaseConfig: PhaseConfig = {
  minimum: 6,
  standard: 8,
  maximum: 9,
}

// Nanti datang dari interval minimum antar periode (aturan medis/settingan admin)
export const dummyIntervalThresholdDays = 15

// Nanti datang dari kalender nasional (API) + input manual sekolah (mis. libur fogging)
export const dummyHolidayDates = new Set<string>(["2025-11-13", "2025-11-20"])

// Nanti datang dari tbl_menstruation_periods, dikelompokkan per id_student.
// Sengaja dibikin nyebar ke 3 kelas & macam-macam skenario biar nggak "kosong" pas
// dicoba di kelas selain X MIPA 1:
export const dummyCyclePeriodsByStudent: Record<number, CyclePeriod[]> = {
  // --- X MIPA 1 ---
  // Aisyah — dua periode lampau, normal, tidak ada anomali
  101: [
    { id: 1, startDate: "2025-10-05", confirmedEndDate: "2025-10-11", source: "pelaksana" },
    { id: 2, startDate: "2025-11-01", confirmedEndDate: "2025-11-08", source: "pelaksana" },
  ],
  // Bunga — periode pendek, selesai murni di fase Minimum (4 hari)
  102: [{ id: 1, startDate: "2025-10-20", confirmedEndDate: "2025-10-23", source: "pelaksana" }],
  // Dian — periode masih berjalan, mulai sebelum blok libur ganda (13 & 20 Nov),
  // dipakai buat demo proyeksi lintas-libur (belum tembus Over di tanggal "today")
  104: [{ id: 1, startDate: "2025-11-12", confirmedEndDate: null, source: "pelaksana" }],
  // Santika — periode masih berjalan sejak awal bulan, sudah lama banget →
  // dipakai buat demo kasus "sudah Over, dan salah satu tanggal Over-nya jatuh pas libur"
  107: [{ id: 1, startDate: "2025-11-01", confirmedEndDate: null, source: "pelaksana" }],
  // Ryassanty — periode selesai persis di batas atas Maximum (9 hari), belum sampai Over
  108: [{ id: 1, startDate: "2025-10-01", confirmedEndDate: "2025-10-09", source: "pelaksana" }],
  // Kirana — periode baru mulai cuma 5 hari setelah periode sebelumnya berakhir →
  // dipakai buat demo anomali INTERVAL (bukan anomali durasi), sumber lapor mandiri saat libur
  110: [
    { id: 1, startDate: "2025-10-01", confirmedEndDate: "2025-10-07", source: "pelaksana" },
    { id: 2, startDate: "2025-10-12", confirmedEndDate: "2025-10-17", source: "mandiri_libur" },
  ],

  // --- X MIPA 2 ---
  // Salsabila — satu periode lampau normal, fase Standard, biar kelas ini nggak kosong
  202: [{ id: 1, startDate: "2025-10-10", confirmedEndDate: "2025-10-17", source: "pelaksana" }],

  // --- XI MIPA 1 ---
  // Umi Kalsum — periode baru mulai 2 hari lalu, masih di fase Minimum & masih berjalan
  301: [{ id: 1, startDate: "2025-11-16", confirmedEndDate: null, source: "pelaksana" }],
}