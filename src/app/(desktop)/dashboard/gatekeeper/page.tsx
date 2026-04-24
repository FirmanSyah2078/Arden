"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  User, 
  QrCode, 
  Edit3, 
  Clock, 
  Settings2, 
  ShieldCheck, 
  AlertCircle,
  Filter,
  ChevronDown
} from "lucide-react";

// ==========================================
// DATA DUMMY & TYPES
// ==========================================
interface ActivityLogItem {
  id: string | number;
  studentName: string;
  time: string;
  method: "Scan QR" | "Manual";
  className: string;
  executor: string;
  category: "Zuhur" | "Ashar";
  status: "Ontime" | "Late";
}

const dummyLogs: ActivityLogItem[] = [
  { id: 1, studentName: "Aisyah Putri", time: "12:15", method: "Scan QR", className: "XII-1", executor: "Scanner A", category: "Zuhur", status: "Ontime" },
  { id: 2, studentName: "Bunga Pertiwi", time: "12:25", method: "Scan QR", className: "XI-3", executor: "Scanner B", category: "Zuhur", status: "Late" },
  { id: 3, studentName: "Citra Lestari", time: "15:20", method: "Manual", className: "X-2", executor: "Admin (Antara)", category: "Ashar", status: "Ontime" },
  { id: 4, studentName: "Dian Sastro", time: "12:10", method: "Scan QR", className: "XII-4", executor: "Scanner A", category: "Zuhur", status: "Ontime" },
  { id: 5, studentName: "Eka Wardhani", time: "15:35", method: "Scan QR", className: "XI-1", executor: "Scanner C", category: "Ashar", status: "Late" },
  { id: 6, studentName: "Fatimah Azzahra", time: "12:18", method: "Manual", className: "X-5", executor: "Admin (Antara)", category: "Zuhur", status: "Ontime" },
];

type FilterType = "all" | "Zuhur" | "Ashar";

export default function GatekeeperPage() {
  // --- STATE LOG FILTER ---
  const [filter, setFilter] = useState<FilterType>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter Data
  const filteredLogs = useMemo(() => {
    let result = [...dummyLogs];
    if (filter !== "all") result = result.filter(log => log.category === filter);
    // Sort dari yang paling baru (asumsi format time HH:MM bisa disort string)
    return result.sort((a, b) => b.time.localeCompare(a.time));
  }, [filter]);

  // Click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- DUMMY GATE STATUS ---
  // Dalam realita, ini dihitung dari waktu sekarang (new Date()) dibanding aturan
  const gateStatus: "OPEN" | "CLOSED" = "OPEN"; 
  const currentSession = "Zuhur";

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 bg-background selection:bg-white/20 h-full">
      
      {/* HEADER HALAMAN */}
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="font-jakarta text-2xl md:text-3xl font-bold text-foreground tracking-tight">Gatekeeper</h1>
        <p className="font-inter text-xs md:text-sm text-muted-foreground">Pusat kendali parameter gerbang dan log validasi data masuk.</p>
      </div>

      {/* GRID LAYOUT: Kiri (Kontrol/Status) & Kanan (Log Aktivitas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================== */}
        {/* KOLOM KIRI: STATUS & PENGATURAN (Col-Span 4) */}
        {/* ========================================== */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* 1. KARTU STATUS GERBANG */}
          <div className="relative flex flex-col p-6 bg-card/20 border border-white/5 rounded-3xl overflow-hidden shadow-sm group">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-transparent opacity-50" />
            
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-jakarta text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                  Live Status
                </span>
                {/* Indikator Denyut jika OPEN */}
                {gateStatus === "OPEN" && (
                  <div className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <h2 className={`font-jakarta text-3xl font-black tracking-tight ${gateStatus === "OPEN" ? "text-emerald-500" : "text-muted-foreground"}`}>
                  {gateStatus === "OPEN" ? "TERBUKA" : "DITUTUP"}
                </h2>
                <p className="font-inter text-sm font-medium text-foreground/80">
                  Sesi <span className="font-bold text-white">{currentSession}</span> Sedang Berjalan
                </p>
              </div>

              <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-black/20 rounded-xl border border-white/5">
                <ShieldCheck size={14} className="text-emerald-500/80" />
                <span className="text-[11px] font-inter text-muted-foreground">Menerima data scan dari aplikasi Mobile.</span>
              </div>
            </div>
          </div>

          {/* 2. KARTU PARAMETER WAKTU (Time Rules) */}
          <div className="flex flex-col p-6 bg-card/20 border border-white/5 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <span className="font-jakarta text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                Parameter Waktu
              </span>
              <Settings2 size={14} className="text-muted-foreground/50" />
            </div>

            <div className="flex flex-col gap-5">
              {/* Rule Zuhur */}
              <div className="flex flex-col gap-2 relative">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary" />
                  <span className="font-jakarta text-[13px] font-bold text-white/90">Sesi Zuhur</span>
                </div>
                <div className="flex items-center justify-between pl-4 text-[11px] font-inter text-white/60">
                  <span className="flex items-center gap-1.5"><Clock size={12}/> Buka: 11:45</span>
                  <span className="flex items-center gap-1.5 text-red-400/80"><AlertCircle size={12}/> Telat: {">"} 12:20</span>
                </div>
                <div className="flex items-center justify-between pl-4 text-[11px] font-inter text-white/60 mt-1">
                  <span className="flex items-center gap-1.5"><Clock size={12} className="opacity-0"/> Tutup: 12:45</span>
                </div>
                <div className="absolute left-0.75 top-4 -bottom-2.5 w-px bg-white/10" />
              </div>

              {/* Rule Ashar */}
              <div className="flex flex-col gap-2 relative">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-orange-500" />
                  <span className="font-jakarta text-[13px] font-bold text-white/90">Sesi Ashar</span>
                </div>
                <div className="flex items-center justify-between pl-4 text-[11px] font-inter text-white/60">
                  <span className="flex items-center gap-1.5"><Clock size={12}/> Buka: 15:00</span>
                  <span className="flex items-center gap-1.5 text-red-400/80"><AlertCircle size={12}/> Telat: {">"} 15:25</span>
                </div>
                <div className="flex items-center justify-between pl-4 text-[11px] font-inter text-white/60 mt-1">
                  <span className="flex items-center gap-1.5"><Clock size={12} className="opacity-0"/> Tutup: 15:45</span>
                </div>
              </div>
            </div>
          </div>

        </div>


        {/* ========================================== */}
        {/* KOLOM KANAN: TABEL LOG AKTIVITAS (Col-Span 8) */}
        {/* ========================================== */}
        <div className="lg:col-span-8 flex flex-col bg-card/20 border border-white/5 rounded-3xl overflow-hidden shadow-sm h-full max-h-150">
          
          {/* Header Tabel */}
          <div className="flex flex-row items-center justify-between p-5 md:p-6 border-b border-white/5">
            <div className="flex flex-col gap-1">
              <h2 className="font-jakarta text-lg font-bold text-foreground tracking-tight">Riwayat Validasi</h2>
              <p className="font-inter text-xs text-muted-foreground opacity-80">
                Log aliran data masuk berdasarkan metode dan sesi.
              </p>
            </div>

            {/* Custom Dropdown Premium */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 h-9 px-3.5 rounded-xl bg-white/3 border border-white/10 text-[11px] font-jakarta font-bold text-white/80 hover:bg-white/6 hover:text-white transition-all outline-none"
              >
                <Filter size={12} className="opacity-70 text-primary" />
                <span className="tracking-wide">{filter === "all" ? "Semua Sesi" : `Sesi ${filter}`}</span>
                <ChevronDown size={12} className={`opacity-50 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-11 w-36 bg-[#151419]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <button
                    onClick={() => { setFilter("all"); setIsDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-jakarta font-bold tracking-wide transition-colors flex items-center justify-between ${filter === "all" ? "bg-primary/10 text-primary" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                  >
                    Semua Sesi
                    {filter === "all" && <div className="size-1.5 rounded-full bg-primary" />}
                  </button>
                  <div className="h-px w-full bg-white/5 my-1" />
                  {["Zuhur", "Ashar"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => { setFilter(lvl as FilterType); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-jakarta font-bold tracking-wide transition-colors flex items-center justify-between ${filter === lvl ? "bg-primary/10 text-primary" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                    >
                      {lvl}
                      {filter === lvl && <div className="size-1.5 rounded-full bg-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Area List Log (Native Scroll) */}
          <div className="flex-1 overflow-y-auto smooth-scrollbar p-2">
            {filteredLogs.length > 0 ? (
              <div className="flex flex-col">
                {filteredLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-white/5 last:border-0 gap-4 group hover:bg-white/2 transition-colors rounded-xl"
                  >
                    {/* Info Kiri */}
                    <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[14px] font-bold text-white/95 truncate font-jakarta">{log.studentName}</span>
                        {/* Status Ontime/Late Badge */}
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                          log.status === "Ontime" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-inter text-white/40 truncate">
                        <span className="flex items-center gap-1">
                          {log.method === 'Scan QR' ? <QrCode size={10} className="text-emerald-500/80" /> : <Edit3 size={10} className="text-blue-500/80" />}
                          {log.method}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-white/60">Kelas {log.className}</span>
                        <span>•</span>
                        <span>{log.time}</span>
                      </div>
                    </div>

                    {/* Info Kanan (Executor) */}
                    <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5 shrink-0">
                      <User size={12} className="text-white/30" />
                      <span className="text-[10px] font-semibold text-white/50 truncate max-w-30">{log.executor}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <AlertCircle size={24} className="text-white/20 mb-2" />
                <span className="text-xs font-inter text-white/40">Belum ada data masuk untuk sesi ini.</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}