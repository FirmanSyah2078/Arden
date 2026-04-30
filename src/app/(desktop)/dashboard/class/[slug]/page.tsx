"use client";

import { use, useState, useMemo } from "react";
import { 
  ArrowLeft, 
  User, 
  Search, 
  Fingerprint, 
  QrCode, 
  Calendar as CalendarIcon,
  FileText,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ==========================================
// 1. DATA DUMMY (LENGKAP 12 SISWI)
// ==========================================
const dummyStudents = [
  { 
    id: 1, name: "Aisyah Putri Maharani Kusumawardhani", icode: "ARD-XMP1-001", nis: "1002938101",
    notes: "Siswi aktif dalam kegiatan pramuka dan memiliki kedisiplinan yang tinggi dalam ibadah.",
    history: [
      { id: 1, start: "2024-03-01", end: "2024-03-07", status: "Selesai", remarks: "Siklus normal 7 hari" },
      { id: 2, start: "2024-04-02", end: "2024-04-10", status: "Selesai", remarks: "Terlambat 2 hari dari estimasi" },
    ]
  },
  { 
    id: 2, name: "Bunga Pertiwi", icode: "ARD-XMP1-002", nis: "1002938102",
    notes: "Membutuhkan perhatian khusus pada kesehatan fisik saat siklus berlangsung.",
    history: [
      { id: 1, start: "2024-03-15", end: "2024-03-22", status: "Selesai", remarks: "Laporan dari UKS" }
    ]
  },
  { 
    id: 3, name: "Citra Lestari", icode: "ARD-XMP1-003", nis: "1002938103",
    notes: "Sering mewakili sekolah dalam olimpiade sains.",
    history: []
  },
  { 
    id: 4, name: "Dian Sastrowardoyo", icode: "ARD-XMP1-004", nis: "1002938104",
    notes: "Ketua ekstrakurikuler teater. Absensi sangat disiplin.",
    history: [
      { id: 1, start: "2024-01-10", end: "2024-01-16", status: "Selesai", remarks: "Siklus normal" },
      { id: 2, start: "2024-02-12", end: "2024-02-19", status: "Selesai", remarks: "Siklus normal" },
    ]
  },
  { 
    id: 5, name: "Eka Wardhani", icode: "ARD-XMP1-005", nis: "1002938105",
    notes: "Memiliki riwayat dispensasi keterlambatan presensi karena rumah jauh.",
    history: []
  },
  { 
    id: 6, name: "Fatimah Azzahra", icode: "ARD-XMP1-006", nis: "1002938106",
    notes: "Anggota rohis. Selalu tepat waktu dalam validasi ARDEN.",
    history: [
      { id: 1, start: "2024-04-01", end: "2024-04-06", status: "Selesai", remarks: "Validasi lancar" }
    ]
  },
  { 
    id: 7, name: "Gita Gutawa", icode: "ARD-XMP1-007", nis: "1002938107",
    notes: "Bergabung dalam tim paduan suara.",
    history: []
  },
  { 
    id: 8, name: "Hana Saraswati", icode: "ARD-XMP1-008", nis: "1002938108",
    notes: "Data biologis perlu dipantau ulang bulan depan.",
    history: [
      { id: 1, start: "2024-02-28", end: "2024-03-10", status: "Selesai", remarks: "Siklus melebihi batas wajar (11 Hari)" }
    ]
  },
  { 
    id: 9, name: "Ira Wibowo", icode: "ARD-XMP1-009", nis: "1002938109",
    notes: "Tidak ada catatan khusus.",
    history: []
  },
  { 
    id: 10, name: "Jihan Fahira", icode: "ARD-XMP1-010", nis: "1002938110",
    notes: "Pindahan dari kelas X MIPA 3.",
    history: [
      { id: 1, start: "2024-04-05", end: "2024-04-12", status: "Selesai", remarks: "Data termigrasi" }
    ]
  },
  { 
    id: 11, name: "Kiky Fatmala", icode: "ARD-XMP1-011", nis: "1002938111",
    notes: "Sering lupa membawa ID Card, disarankan menggunakan Manual Input.",
    history: []
  },
  { 
    id: 12, name: "Lulu Tobing", icode: "ARD-XMP1-012", nis: "1002938112",
    notes: "Wakil ketua kelas X MIPA 1.",
    history: [
      { id: 1, start: "2024-03-20", end: "2024-03-27", status: "Selesai", remarks: "Siklus normal 7 hari" }
    ]
  }
];

export default function ClassDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const displayClassName = resolvedParams.slug.toUpperCase().replace(/-/g, ' ');

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(dummyStudents[0].id);
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

  return (
    <>
      {/* HEADER KELAS */}
      <header className="flex items-center gap-4 shrink-0">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-full bg-card hover:bg-accent transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-jakarta">
            {displayClassName}
          </h1>
          <p className="text-sm text-muted-foreground font-inter">
            Detailed view and analytics for this class.
          </p>
        </div>
      </header>

      <main className="flex-1 w-full mt-6 flex flex-col lg:flex-row gap-8 min-h-0 lg:h-[calc(100vh-140px)]">
        
        {/* --- KIRI: DAFTAR SISWI (MASTER) --- */}
        <div className="w-full lg:w-67.5 h-87.5 lg:h-full flex flex-col bg-card/20 border border-white/5 rounded-3xl overflow-hidden shadow-sm shrink-0">
          <div className="p-5 border-b border-white/5 shrink-0 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-jakarta text-[14px] font-bold text-foreground">Daftar Siswi</h3>
              <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {dummyStudents.length} Siswi
              </span>
            </div>
            <div className="relative group w-full transition-all duration-300">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300 size-3.5" />
              <Input
                placeholder="Cari nama atau icode..."
                spellCheck={false}
                autoComplete="off"
                className="pl-8 h-9 bg-black/20 border-white/10 text-[12px] rounded-xl text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div 
            className="flex-1 overflow-y-auto smooth-scrollbar px-2"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 24px, black calc(100% - 24px), transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 24px, black calc(100% - 24px), transparent 100%)'
            }}
          >
            <div className="py-4 flex flex-col gap-1">
              {filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={cn(
                    "w-full text-left flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-300 group",
                    selectedStudentId === student.id 
                      ? "bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.05)]" 
                      : "bg-transparent border border-transparent hover:bg-white/3"
                  )}
                >
                  <div className={cn(
                    "size-10 rounded-full flex items-center justify-center shrink-0 border transition-colors duration-300", 
                    selectedStudentId === student.id ? "bg-primary/20 border-primary/30" : "bg-white/5 border-white/10 group-hover:border-white/20"
                  )}>
                    <User className={cn("size-4", selectedStudentId === student.id ? "text-primary" : "text-muted-foreground group-hover:text-white/80")} />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                    <span className={cn(
                      "font-jakarta text-[13px] font-bold truncate transition-colors", 
                      selectedStudentId === student.id ? "text-primary" : "text-white/90 group-hover:text-white"
                    )}>
                      {student.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono">
                      <Fingerprint size={10} className={selectedStudentId === student.id ? "text-primary/70" : "text-muted-foreground/60"}/>
                      <span className={selectedStudentId === student.id ? "text-primary/80" : "text-muted-foreground"}>
                        {student.icode}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- KANAN: DETAIL SISWI --- */}
        <div className="flex-1 flex flex-col gap-8 overflow-y-auto smooth-scrollbar lg:pr-4 pb-12">
          {currentStudent ? (
            <>
              {/* ATAS: BIODATA & ACTIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                
                {/* 🔥 FIX: BIODATA DIBUAT SANGAT KOMPAK (SIDE-BY-SIDE / HORIZONTAL) */}
                <div className="flex flex-col sm:flex-row gap-5 pt-2 items-center sm:items-start w-full">
                  
                  {/* Foto Profil */}
                  <div className="shrink-0 size-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-xl relative mt-1">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40 animate-[spin_10s_linear_infinite]" />
                    <User className="size-8 text-primary" />
                  </div>

                  {/* Info Dipadatkan */}
                  <div className="flex flex-col gap-3 w-full text-center sm:text-left">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-xl font-bold text-foreground font-jakarta leading-tight">
                        {currentStudent.name}
                      </h2>
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">NIS</span>
                        <span className="text-[12px] font-mono text-primary/90 font-medium bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                          {currentStudent.nis}
                        </span>
                      </div>
                    </div>

                    {/* Notes Box Compact */}
                    <div className="flex items-start gap-3 bg-white/3 border border-white/5 p-3.5 rounded-2xl w-full">
                      <FileText className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-[12px] text-muted-foreground leading-relaxed italic text-left">
                        {currentStudent.notes || "Tidak ada catatan khusus."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ACTIONS & DYNAMIC VIEW (Sisi Kanan Atas) */}
                <div className="flex flex-col items-center gap-6 pt-2">
                  <div className="flex gap-3 w-fit">
                    <Button 
                      variant="ghost" 
                      className={cn("h-10 px-5 sm:px-6 rounded-xl gap-2 font-bold text-xs transition-all", rightTab === "qr" ? "bg-primary text-black hover:bg-primary/90 shadow-lg" : "bg-white/3 border border-white/5 text-muted-foreground hover:bg-white/10 hover:text-white")}
                      onClick={() => setRightTab("qr")}
                    >
                      <QrCode className="size-4" /> QR Code
                    </Button>
                    <Button 
                      variant="ghost" 
                      className={cn("h-10 px-5 sm:px-6 rounded-xl gap-2 font-bold text-xs transition-all", rightTab === "calendar" ? "bg-primary text-black hover:bg-primary/90 shadow-lg" : "bg-white/3 border border-white/5 text-muted-foreground hover:bg-white/10 hover:text-white")}
                      onClick={() => setRightTab("calendar")}
                    >
                      <CalendarIcon className="size-4" /> Calendar
                    </Button>
                  </div>

                  <div className="w-full flex items-center justify-center h-65">
                    {rightTab === "qr" ? (
                      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-4 bg-white rounded-4xl shadow-2xl border-4 border-primary/20">
                          <QrCode className="size-36 text-black" strokeWidth={1.5} />
                        </div>
                        <span className="text-[11px] font-bold font-mono text-muted-foreground tracking-widest uppercase bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                          {currentStudent.icode}
                        </span>
                      </div>
                    ) : (
                      <div className="w-full max-w-70 h-full p-6 border border-dashed border-white/10 rounded-4xl flex flex-col items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 bg-white/1">
                        <CalendarIcon className="size-10 text-muted-foreground/30" />
                        <p className="text-[11px] text-muted-foreground text-center font-medium leading-relaxed">
                          Visualisasi kalender siklus biologis akan dirender di area ini.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* BAWAH: TABEL RIWAYAT SIKLUS */}
              <div className="flex flex-col gap-5 mt-4">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  <h3 className="font-jakarta text-sm font-bold text-foreground">Riwayat Siklus Biologis</h3>
                </div>

                <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-white/2">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/3">
                        <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">No</th>
                        <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Siklus Awal</th>
                        <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Siklus Akhir</th>
                        <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                        <th className="p-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="text-[13px]">
                      {currentStudent.history.length > 0 ? currentStudent.history.map((item, index) => (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/2 transition-colors last:border-0">
                          <td className="p-4 font-mono text-muted-foreground">{index + 1}</td>
                          <td className="p-4 text-white font-medium whitespace-nowrap">{item.start}</td>
                          <td className="p-4 text-white font-medium whitespace-nowrap">{item.end}</td>
                          <td className="p-4">
                            <span className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                              <CheckCircle2 size={12} /> {item.status}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground italic text-xs">{item.remarks}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-muted-foreground opacity-40">
                            <FileText className="size-8 mx-auto mb-3" />
                            Belum ada riwayat siklus yang tercatat.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 mt-20">
              <User className="size-16 text-muted-foreground/50 mb-4" />
              <p className="text-sm font-bold tracking-widest uppercase text-foreground">Pilih Siswi Untuk Detail</p>
            </div>
          )}
        </div>

      </main>
    </>
  );
}