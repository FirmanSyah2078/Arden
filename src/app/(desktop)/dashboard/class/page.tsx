"use client"

import { useState } from "react";
import Image from "next/image";
import React from "react";
// 🔥 FIX: Tambahkan ChevronDown untuk icon Dropdown
import { Search, QrCode, SearchX, ExternalLink, Filter, ChevronDown } from "lucide-react"; 

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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

// Data Dummy Kelas
const classesData = [
  { id: 1, name: "X MIPA 1", wali: "Bapak Mulyono S.Pd.", batch: "X", total: 32 },
  { id: 2, name: "X MIPA 2", wali: "Ibu Susi S.Pd.", batch: "X", total: 31 },
  { id: 3, name: "XI MIPA 1", wali: "Bapak Budi S.Pd.", batch: "XI", total: 30 },
  { id: 4, name: "XI IPS 1", wali: "Ibu Ani S.Pd.", batch: "XI", total: 29 },
  { id: 5, name: "XII MIPA 1", wali: "Bapak Joko S.Pd.", batch: "XII", total: 34 },
  { id: 6, name: "XII MIPA 2", wali: "Ibu Rina S.Pd.", batch: "XII", total: 33 },
  { id: 7, name: "XII IPS 1", wali: "Bapak Tono S.Pd.", batch: "XII", total: 32 },
  { id: 8, name: "XII IPS 2", wali: "Ibu Sari S.Pd.", batch: "XII", total: 31 },
  { id: 9, name: "X MIPA 3", wali: "Bapak Ahmad S.Pd.", batch: "X", total: 32 },
  { id: 10, name: "X IPS 1", wali: "Ibu Linda S.Pd.", batch: "X", total: 30 },
  { id: 11, name: "X IPS 2", wali: "Bapak Eko S.Pd.", batch: "X", total: 31 },
  { id: 12, name: "X IPS 3", wali: "Ibu Maya S.Pd.", batch: "X", total: 28 },
  { id: 13, name: "XI MIPA 2", wali: "Bapak Gunawan S.Pd.", batch: "XI", total: 33 },
  { id: 14, name: "XI MIPA 3", wali: "Ibu Dewi S.Pd.", batch: "XI", total: 32 },
  { id: 15, name: "XI IPS 2", wali: "Bapak Rahman S.Pd.", batch: "XI", total: 30 },
  { id: 16, name: "XI IPS 3", wali: "Ibu Siti S.Pd.", batch: "XI", total: 29 },
  { id: 17, name: "XII MIPA 3", wali: "Bapak Yusuf S.Pd.", batch: "XII", total: 35 },
  { id: 18, name: "XII IPS 3", wali: "Ibu Mega S.Pd.", batch: "XII", total: 31 },
  { id: 19, name: "XII IPS 4", wali: "Bapak Andi S.Pd.", batch: "XII", total: 30 },
  { id: 20, name: "X MIPA 4", wali: "Ibu Ratna S.Pd.", batch: "X", total: 32 },
  { id: 21, name: "XI MIPA 4", wali: "Bapak Surya S.Pd.", batch: "XI", total: 31 },
  { id: 22, name: "XII MIPA 4", wali: "Ibu Lilis S.Pd.", batch: "XII", total: 33 },
  { id: 23, name: "XII IPS 5", wali: "Bapak Farhan S.Pd.", batch: "XII", total: 29 },
];

export default function ClassPage() {
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
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

  const filteredClasses = classesData.filter((kelas) => {
    const matchTab = activeFilter === "all" ? true : kelas.batch === activeFilter;
    const matchSearch =
      kelas.name.toLowerCase().includes(keyword.toLowerCase()) ||
      kelas.wali.toLowerCase().includes(keyword.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col h-full min-h-screen bg-background selection:bg-white/20">
      
      {/* --- HEADER PROFESIONAL --- */}
      <header className="px-8 pt-8 pb-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground">
              Class Management
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Pusat kendali dan pemantauan data akademik kelas secara komprehensif.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            
            {/* 🔥 FIX: SMART FILTER DROPDOWN DENGAN BADGE & PANAH */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 gap-2 border-border bg-card hover:bg-accent text-foreground transition-all px-3">
                  <Filter className="size-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium">Filter</span>
                  
                  {/* Badge Muncul Jika Filter Aktif */}
                  {activeFilter !== "all" && (
                    <>
                      <div className="h-4 w-px bg-border mx-1" /> {/* Garis vertikal pemisah */}
                      <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        {activeFilter}
                      </span>
                    </>
                  )}
                  
                  <ChevronDown className="size-3.5 text-muted-foreground opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 bg-card border-border shadow-xl rounded-lg">
                <DropdownMenuItem 
                  onClick={() => handleFilterChange("all")} 
                  className={cn(
                    "cursor-pointer text-xs font-medium focus:bg-accent transition-colors",
                    activeFilter === "all" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Semua Angkatan
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                {['X', 'XI', 'XII'].map(batch => (
                  <DropdownMenuItem 
                    key={batch} 
                    onClick={() => handleFilterChange(batch)} 
                    className={cn(
                      "cursor-pointer text-xs font-medium focus:bg-accent transition-colors",
                      activeFilter === batch ? "text-primary" : "text-foreground"
                    )}
                  >
                    Angkatan {batch}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 🔥 FIX: SEARCH BAR (Hapus ring biru, biarkan border saja yang menyala) */}
            <div className="relative group w-full sm:w-56 sm:focus-within:w-72 transition-all duration-500 ease-out">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors duration-300 size-4" />
              <Input
                placeholder="Cari kelas atau wali..."
                className="pl-9 h-9 bg-muted/30 border-border hover:border-foreground/30 focus-visible:border-white focus-visible:ring-0 focus-visible:bg-transparent transition-all text-[13px] rounded-md text-foreground placeholder:text-muted-foreground shadow-sm"
                value={keyword}
                onChange={handleSearchChange}
              />
            </div>
            
          </div>
        </div>
        
        <div className="h-px w-full bg-linear-to-r from-border via-border/50 to-transparent" />
      </header>

      {/* --- GRID CLASS CARDS --- */}
      <main className="container mx-auto p-8 lg:p-10 pt-4">
        {paginatedClasses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedClasses.map((kelas) => (
              <div
                key={kelas.id}
                className="group bg-card border border-border rounded-xl p-4 flex flex-col gap-4 transition-all hover:border-white/20 shadow-sm"
              >
                <div className="relative w-full h-20 overflow-hidden rounded-lg">
                  <Image
                    src="/bg-banner.jpeg"
                    alt="Class Banner"
                    fill
                    className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>

                <div>
                  <h3 className="font-bold text-[16px] text-foreground uppercase tracking-tight leading-none mb-1">
                    {kelas.name}
                  </h3>
                  <p className="text-[14px] text-muted-foreground truncate font-medium">
                    {kelas.wali}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    // 🔥 FIX: text-black dipaksa agar teks pada tombol putih tetap terlihat jelas!
                    className="flex-1 h-10 bg-primary text-black hover:bg-primary/90 font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <ExternalLink className="mr-2 size-4" />
                    Masuk
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 border-border bg-card hover:bg-accent hover:border-white/20 hover:text-foreground transition-all active:scale-95"
                    onClick={() => setIsQRModalOpen(true)}
                  >
                    <QrCode className="size-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center opacity-30">
            <SearchX className="size-16 text-muted-foreground/50" />
            <p className="mt-4 font-bold tracking-widest uppercase text-xs text-center text-foreground">Kelas tidak ditemukan</p>
          </div>
        )}

        {/* --- PAGINATION --- */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center pb-10">
            <Pagination className="mx-0 w-auto">
              <PaginationContent className="bg-card border border-border rounded-full p-1 shadow-sm">

                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={cn(
                      "h-9 w-9 md:w-auto md:px-4 rounded-full border-none transition-colors",
                      currentPage === 1
                        ? "pointer-events-none opacity-20"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  />
                </PaginationItem>

                <div className="flex items-center gap-1 px-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === pageNumber}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNumber);
                          }}
                          className={cn(
                            "h-9 w-9 font-bold text-xs rounded-full border-none transition-all",
                            // 🔥 FIX: text-black dipaksa untuk state active agar kontras dengan bg putih
                            currentPage === pageNumber
                              ? "bg-primary text-black hover:bg-primary/90 shadow-md scale-105"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          {pageNumber}
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
                      "h-9 w-9 md:w-auto md:px-4 rounded-full border-none transition-colors",
                      currentPage === totalPages
                        ? "pointer-events-none opacity-20"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  />
                </PaginationItem>

              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>

      {/* --- QR MODAL --- */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-2xl border-border sm:max-w-xs p-0 overflow-hidden rounded-4xl shadow-2xl">
          <div className="p-8 flex flex-col items-center gap-6 text-center">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black tracking-tighter uppercase leading-none text-foreground">Class QR</DialogTitle>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Absensi Kolektif</p>
            </div>

            <div className="relative p-6 bg-white rounded-4xl shadow-md">
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-75 animate-pulse" />
              <div className="relative w-40 h-40">
                <QrCode className="w-full h-full text-black" strokeWidth={1.5} />
              </div>
            </div>

            <p className="text-[11px] font-bold text-muted-foreground/80 leading-relaxed px-6 italic">
              &quot;Gunakan pemindai mobile ARDEN untuk memproses kehadiran seluruh siswi secara otomatis.&quot;
            </p>

            <Button className="w-full rounded-xl h-12 font-black tracking-widest text-[10px] bg-secondary text-secondary-foreground hover:bg-secondary/80">
              GENERATE NEW CODE
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}