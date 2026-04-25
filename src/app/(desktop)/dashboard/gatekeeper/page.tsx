"use client"

import { useState } from "react";
import React from "react";
import { 
  Search, 
  QrCode, 
  SearchX, 
  Filter, 
  ChevronDown, 
  X, 
  MoreHorizontal,
  ShieldCheck,
  Server,
  Smartphone,
  Clock,
  Edit3,
  User,
  CheckCircle2,
  AlertCircle
} from "lucide-react"; 

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

// ==========================================
// 1. DATA DUMMY LOG AKTIVITAS
// ==========================================
interface ActivityLogItem {
  id: string | number;
  studentName: string;
  time: string;
  method: "Scan QR" | "Manual";
  className: string;
  executor: string;
  session: "Dhuhr" | "Asr" | "Fajr";
  status: "Ontime" | "Late";
}

const logsData: ActivityLogItem[] = [
  { id: 1, studentName: "Aisyah Putri", time: "12:15", method: "Scan QR", className: "XII MIPA 1", executor: "Scanner A", session: "Dhuhr", status: "Ontime" },
  { id: 2, studentName: "Bunga Pertiwi", time: "12:25", method: "Scan QR", className: "XI IPS 3", executor: "Scanner B", session: "Dhuhr", status: "Late" },
  { id: 3, studentName: "Citra Lestari", time: "15:20", method: "Manual", className: "X MIPA 2", executor: "Admin (Antara)", session: "Asr", status: "Ontime" },
  { id: 4, studentName: "Dian Sastro", time: "12:10", method: "Scan QR", className: "XII IPS 4", executor: "Scanner A", session: "Dhuhr", status: "Ontime" },
  { id: 5, studentName: "Eka Wardhani", time: "15:35", method: "Scan QR", className: "XI MIPA 1", executor: "Scanner C", session: "Asr", status: "Late" },
  { id: 6, studentName: "Fatimah Azzahra", time: "12:18", method: "Manual", className: "X IPS 5", executor: "Admin (Antara)", session: "Dhuhr", status: "Ontime" },
  { id: 7, studentName: "Gita Gutawa", time: "15:10", method: "Scan QR", className: "XII MIPA 3", executor: "Scanner B", session: "Asr", status: "Ontime" },
  { id: 8, studentName: "Hana Saraswati", time: "12:28", method: "Scan QR", className: "XI IPS 1", executor: "Scanner C", session: "Dhuhr", status: "Late" },
  { id: 9, studentName: "Ira Wibowo", time: "12:12", method: "Scan QR", className: "X MIPA 4", executor: "Scanner A", session: "Dhuhr", status: "Ontime" },
  { id: 10, studentName: "Jihan Fahira", time: "15:40", method: "Manual", className: "XII IPS 2", executor: "Admin (Antara)", session: "Asr", status: "Late" },
];

export default function GatekeeperPage() {
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    setCurrentPage(1);
  };

  // ==========================================
  // 2. LOGIKA FILTERING & SEARCH
  // ==========================================
  const filteredLogs = logsData.filter((log) => {
    const matchTab = activeFilter === "all" ? true : log.session === activeFilter;
    const matchSearch =
      log.studentName.toLowerCase().includes(keyword.toLowerCase()) ||
      log.className.toLowerCase().includes(keyword.toLowerCase());
    return matchTab && matchSearch;
  });

  // ==========================================
  // 3. LOGIKA PAGINATION (SLIDING WINDOW)
  // ==========================================
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const generatePagination = () => {
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
  };

  const visiblePages = generatePagination();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-background selection:bg-white/20">
      
      {/* ========================================== */}
      {/* HEADER & CONTROLS (Identik dengan class/page) */}
      {/* ========================================== */}
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground font-jakarta">
              Gatekeeper
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed font-inter">
              Centralized inbound data validation and real-time attendance logs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            
            {/* Filter Dropdown */}
            <div className={cn("flex items-center transition-all duration-300", activeFilter !== "all" && "h-9 rounded-md border border-border bg-card shadow-sm animate-in fade-in slide-in-from-right-2")}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {activeFilter === "all" ? (
                    <Button suppressHydrationWarning variant="outline" className="h-9 gap-2 border-border bg-card hover:bg-accent text-foreground transition-all px-3">
                      <Filter className="size-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium">Filter Session</span>
                      <ChevronDown className="size-3.5 text-muted-foreground opacity-70" />
                    </Button>
                  ) : (
                    <Button suppressHydrationWarning variant="ghost" className="h-full rounded-none rounded-l-md border-r border-border px-3 gap-2 hover:bg-accent text-foreground transition-all focus-visible:ring-0">
                      <Filter className="size-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium">Session</span>
                      <div className="h-4 w-px bg-border mx-1" />
                      <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        {activeFilter}
                      </span>
                    </Button>
                  )}
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-36 bg-card border-border shadow-xl rounded-lg origin-top-right data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                  {['Dhuhr', 'Asr'].map(session => (
                    <DropdownMenuItem 
                      key={session} 
                      onClick={() => handleFilterChange(session)} 
                      className={cn(
                        "cursor-pointer text-xs font-medium focus:bg-accent transition-colors",
                        activeFilter === session ? "text-primary" : "text-foreground"
                      )}
                    >
                      {session} Session
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear Filter Button */}
              {activeFilter !== "all" && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFilterChange("all");
                  }} 
                  className="h-full px-2.5 flex items-center justify-center hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors rounded-r-md outline-none focus-visible:bg-destructive/10 focus-visible:text-destructive"
                  aria-label="Clear filter"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Custom Search Input */}
            <div className="relative group w-full sm:w-56 sm:focus-within:w-64 transition-all duration-500 ease-out">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300 size-4" />
              <Input
                placeholder="Search student or class..."
                spellCheck={false}
                autoComplete="off"
                className="pl-9 pr-9 h-9 bg-muted/30 border-border hover:border-foreground/30 focus-visible:border-foreground/50 focus-visible:ring-0 focus-visible:bg-transparent transition-all text-[13px] rounded-md text-foreground placeholder:text-muted-foreground shadow-sm"
                value={keyword}
                onChange={handleSearchChange}
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => {
                    setKeyword("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground hover:bg-destructive/10 rounded-full transition-all animate-in fade-in zoom-in-75 duration-200 outline-none focus-visible:ring-2 focus-visible:ring-destructive/50"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>

        <div className="h-px w-full bg-linear-to-r from-border via-border/50 to-transparent" />
      </header>

      <main className="flex-1 w-full pb-8">
        
        {/* ========================================== */}
        {/* EXPLANATION CARD (Premium Logic Architecture) */}
        {/* ========================================== */}
        <div className="mb-8 p-6 bg-card border border-border rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full transition-all duration-700 group-hover:bg-primary/10" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="size-5 text-primary" />
                <h2 className="font-jakarta text-lg font-bold text-foreground tracking-tight">System Architecture & Validation Rules</h2>
              </div>
              <p className="font-inter text-[13px] text-muted-foreground leading-relaxed">
                The Gatekeeper actively monitors inbound data from <strong className="text-foreground">ARDEN Mobile Scanners</strong> and <strong className="text-foreground">Manual Inputs</strong>. It validates incoming timestamps against geographic prayer times (Aladhan API) and the active daily routing to determine if an entry is marked as <span className="text-emerald-400 font-semibold px-1 bg-emerald-500/10 rounded">ONTIME</span> or <span className="text-red-400 font-semibold px-1 bg-red-500/10 rounded">LATE</span>.
              </p>
            </div>

            {/* Visual Logic Flow */}
            <div className="flex items-center gap-3 shrink-0 bg-muted/30 p-3 rounded-2xl border border-border/50">
              <div className="flex flex-col items-center gap-1">
                <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Smartphone className="size-4 text-blue-500" />
                </div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Input</span>
              </div>
              <div className="h-0.5 w-6 bg-border" />
              <div className="flex flex-col items-center gap-1">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 relative">
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <Server className="size-4 text-primary" />
                </div>
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Gatekeeper</span>
              </div>
              <div className="h-0.5 w-6 bg-border" />
              <div className="flex flex-col items-center gap-1">
                <div className="size-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <ShieldCheck className="size-4 text-emerald-500" />
                </div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Valid</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* LIST LOG AKTIVITAS */}
        {/* ========================================== */}
        {paginatedLogs.length > 0 ? (
          <div className="flex flex-col gap-3">
            {paginatedLogs.map((log) => (
              <div
                key={log.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 px-5 bg-card/40 border border-border rounded-2xl transition-all duration-300 hover:border-white/20 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Left Info */}
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[15px] font-bold text-foreground truncate font-jakarta">
                      {log.studentName}
                    </span>
                    {/* Status Badge */}
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest border",
                      log.status === "Ontime" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    )}>
                      {log.status === "Ontime" ? <CheckCircle2 className="inline size-3 mr-1 -mt-0.5" /> : <AlertCircle className="inline size-3 mr-1 -mt-0.5" />}
                      {log.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[12px] font-inter text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      {log.method === 'Scan QR' ? <QrCode size={12} className="text-primary" /> : <Edit3 size={12} className="text-blue-500" />}
                      <span className="font-medium text-foreground/80">{log.method}</span>
                    </div>
                    <span className="opacity-30">•</span>
                    <span className="font-medium">Class {log.className}</span>
                    <span className="opacity-30">•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      <span>{log.time} ({log.session})</span>
                    </div>
                  </div>
                </div>

                {/* Right Info (Executor) */}
                <div className="mt-3 sm:mt-0 flex items-center gap-2 bg-muted/40 px-3.5 py-2 rounded-xl border border-border/50 shrink-0">
                  <User size={14} className="text-muted-foreground/70" />
                  <span className="text-[11px] font-semibold text-muted-foreground truncate max-w-30">
                    {log.executor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center opacity-30">
            <SearchX className="size-16 text-muted-foreground/50" />
            <p className="mt-4 font-bold tracking-widest uppercase text-xs text-center text-foreground">No logs found</p>
          </div>
        )}

        {/* ========================================== */}
        {/* PAGINATION (Sama persis dengan class/page) */}
        {/* ========================================== */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center pb-12">
            <Pagination className="mx-0 w-auto">
              <PaginationContent className="flex items-center gap-2 sm:gap-3">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={cn(
                      "h-8 px-2 sm:px-3 rounded-lg border border-transparent transition-all duration-300 flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider",
                      currentPage === 1
                        ? "pointer-events-none text-muted-foreground/30"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  />
                </PaginationItem>

                <div className="flex items-center gap-1.5">
                  {visiblePages.map((page, index) => {
                    if (page === '...') {
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <div className="h-8 w-8 flex items-center justify-center text-muted-foreground/40">
                            <MoreHorizontal className="size-4" />
                          </div>
                        </PaginationItem>
                      );
                    }
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === page}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(Number(page));
                          }}
                          className={cn(
                            "h-8 w-8 p-0 flex items-center justify-center font-bold text-xs rounded-lg transition-all duration-300",
                            currentPage === page
                              ? "bg-foreground/15 text-foreground border border-foreground/20 shadow-sm" 
                              : "bg-transparent text-muted-foreground border border-transparent hover:bg-accent/50 hover:text-foreground"
                          )}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                </div>

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={cn(
                      "h-8 px-2 sm:px-3 rounded-lg border border-transparent transition-all duration-300 flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider",
                      currentPage === totalPages
                        ? "pointer-events-none text-muted-foreground/30"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        
      </main>
    </div>
  );
}