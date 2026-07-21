// src/hooks/gatekeeper/use-gate.ts
import { useState, useMemo, useEffect, useCallback } from "react";
import { DailyPrayer } from "@/types/api";
import { toast } from "sonner";

export interface ActivityLogItem {
  id: string | number;
  studentName: string;
  time: string;
  method: "Scan QR" | "Manual";
  className: string;
  executor: string;
  session: DailyPrayer | string;
  status: "Normal" | "Late";
  remarks: string;
}

export function useGate() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | DailyPrayer | string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // --- Fetch Data dari API Backend ---
  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      // Ambil tanggal hari ini berdasarkan zona waktu lokal
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jakarta' });
      const parts = formatter.formatToParts(now);
      const year = parts.find(p => p.type === 'year')?.value;
      const month = parts.find(p => p.type === 'month')?.value.padStart(2, '0');
      const day = parts.find(p => p.type === 'day')?.value.padStart(2, '0');
      
      const localDateStr = `${year}-${month}-${day}`;

      const res = await fetch(`/api/attendance?date=${localDateStr}&time=all`);
      const json = await res.json();

      if (json.status === 'success' && json.data?.absensi) {
        const mappedLogs: ActivityLogItem[] = json.data.absensi.map((log: any) => {
          // Format jam dari timestamp created_at
          const dateObj = new Date(log.created_at);
          const timeString = dateObj.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Jakarta"
          }).replace('.', ':');

          return {
            id: log.id_attendance,
            studentName: log.tbl_students?.full_name || "Unknown Student",
            className: log.tbl_students?.tbl_classes?.class_name || "-",
            time: timeString,
            method: log.method === "Scan QR" ? "Scan QR" : "Manual",
            executor: log.method === "Scan QR" ? "Sistem" : "Pelaksana", // Bisa disesuaikan jika ada ID user
            session: log.time,
            // Asumsi UI: Jika Manual biasanya karena telat (kecuali kasus Suci).
            status: log.method === "Scan QR" ? "Normal" : "Late", 
            remarks: log.remarks || "-",
          };
        });

        setLogs(mappedLogs);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error("Failed to fetch gatekeeper logs:", error);
      toast.error("Gagal memuat data log absensi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Muat data saat komponen pertama kali dirender
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // --- Handlers ---
  const handleSearchChange = (value: string) => {
    setKeyword(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    setCurrentPage(1);
  };

  // --- Filtering Logic ---
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchTab = activeFilter === "all" ? true : log.session === activeFilter;
      const matchSearch =
        log.studentName.toLowerCase().includes(keyword.toLowerCase()) ||
        log.className.toLowerCase().includes(keyword.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [logs, activeFilter, keyword]);

  // --- Pagination Logic ---
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage]);

  const visiblePages = useMemo(() => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 2) {
      return [1, 2, 3, '...', totalPages];
    }
    if (currentPage >= totalPages - 1) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }, [totalPages, currentPage]);

  return {
    isLoading,
    keyword,
    activeFilter,
    currentPage,
    totalPages,
    paginatedLogs,
    visiblePages,
    handleSearchChange,
    handleFilterChange,
    setCurrentPage,
    fetchLogs, // Diekspos agar bisa dibuat tombol "Refresh" manual di UI
  };
}