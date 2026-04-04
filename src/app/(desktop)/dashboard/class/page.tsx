"use client"

import { useState } from "react";
import Image from "next/image";
import React from "react";
import { Search, QrCode, SearchX, ExternalLink, Filter, ChevronDown, X, BadgeCheck, MoreHorizontal } from "lucide-react"; 

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

// Dummy Data (Updated with description & period stats)
const classesData = [
  { id: 1, name: "X MIPA 1", wali: "Mr. Mulyono S.Pd.", batch: "X", Student: 32, period: 4, description: "A highly disciplined class focusing on advanced sciences and collaborative projects." },
  { id: 2, name: "X MIPA 2", wali: "Mrs. Susi S.Pd.", batch: "X", Student: 31, period: 2, description: "Known for active participation in national physics Olympiads and teamwork." },
  { id: 3, name: "XI MIPA 1", wali: "Mr. Budi S.Pd.", batch: "XI", Student: 30, period: 5, description: "Exceptional analytical skills with consistent top-tier academic performance." },
  { id: 4, name: "XI IPS 1", wali: "Mrs. Ani S.Pd.", batch: "XI", Student: 29, period: 3, description: "Creative thinkers with a strong passion for sociology and economic debates." },
  { id: 5, name: "XII MIPA 1", wali: "Mr. Joko S.Pd.", batch: "XII", Student: 34, period: 1, description: "Senior class currently focusing on intensive university entrance preparations." },
  { id: 6, name: "XII MIPA 2", wali: "Mrs. Rina S.Pd.", batch: "XII", Student: 33, period: 6, description: "Driven by curiosity, this class excels in biological research and chemistry." },
  { id: 7, name: "XII IPS 1", wali: "Mr. Tono S.Pd.", batch: "XII", Student: 32, period: 4, description: "Leaders in school organizational events and public speaking competitions." },
  { id: 8, name: "XII IPS 2", wali: "Mrs. Sari S.Pd.", batch: "XII", Student: 31, period: 2, description: "A solid community of students passionate about history and global geography." },
  { id: 9, name: "X MIPA 3", wali: "Mr. Ahmad S.Pd.", batch: "X", Student: 32, period: 7, description: "Enthusiastic learners with a growing interest in technology and coding." },
  { id: 10, name: "X IPS 1", wali: "Mrs. Linda S.Pd.", batch: "X", Student: 30, period: 3, description: "Expressive and dynamic class, frequently winning inter-class art festivals." },
  { id: 11, name: "X IPS 2", wali: "Mr. Eko S.Pd.", batch: "X", Student: 31, period: 0, description: "Highly interactive environment with a focus on modern social studies." },
  { id: 12, name: "X IPS 3", wali: "Mrs. Maya S.Pd.", batch: "X", Student: 28, period: 5, description: "Friendly and collaborative, with strong literacy and storytelling skills." },
  { id: 13, name: "XI MIPA 2", wali: "Mr. Gunawan S.Pd.", batch: "XI", Student: 33, period: 2, description: "Competitive yet supportive, achieving great milestones in mathematics." },
  { id: 14, name: "XI MIPA 3", wali: "Mrs. Dewi S.Pd.", batch: "XI", Student: 32, period: 4, description: "Dedicated to continuous improvement and environmental science projects." },
  { id: 15, name: "XI IPS 2", wali: "Mr. Rahman S.Pd.", batch: "XI", Student: 30, period: 1, description: "Critical thinkers actively engaged in analyzing contemporary global issues." },
  { id: 16, name: "XI IPS 3", wali: "Mrs. Siti S.Pd.", batch: "XI", Student: 29, period: 6, description: "A cheerful class with a balanced approach to academics and extracurriculars." },
  { id: 17, name: "XII MIPA 3", wali: "Mr. Yusuf S.Pd.", batch: "XII", Student: 35, period: 3, description: "Future engineers and doctors preparing rigorously for their final exams." },
  { id: 18, name: "XII IPS 3", wali: "Mrs. Mega S.Pd.", batch: "XII", Student: 31, period: 5, description: "Strong entrepreneurial spirit with numerous student-led business initiatives." },
  { id: 19, name: "XII IPS 4", wali: "Mr. Andi S.Pd.", batch: "XII", Student: 30, period: 2, description: "Diligent and articulate, dominating the school's debate and language clubs." },
  { id: 20, name: "X MIPA 4", wali: "Mrs. Ratna S.Pd.", batch: "X", Student: 32, period: 4, description: "A fresh batch showing remarkable discipline and adaptability in sciences." },
  { id: 21, name: "XI MIPA 4", wali: "Mr. Surya S.Pd.", batch: "XI", Student: 31, period: 1, description: "A harmonious class setting high standards in laboratory experimentations." },
  { id: 22, name: "XII MIPA 4", wali: "Mrs. Lilis S.Pd.", batch: "XII", Student: 33, period: 7, description: "Highly motivated seniors leaving a strong legacy of academic excellence." },
  { id: 23, name: "XII IPS 5", wali: "Mr. Farhan S.Pd.", batch: "XII", Student: 29, period: 0, description: "Tight-knit group prioritizing cultural studies and social awareness." },
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

  const StudentPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 🔥 FIX: Logika Sliding Window Pagination
  const generatePagination = () => {
    if (StudentPages <= 4) {
      // Jika halaman 4 atau kurang, tampilkan semua (1, 2, 3, 4)
      return Array.from({ length: StudentPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 2) {
      // Jika di awal: 1, 2, 3, ..., Terakhir
      return [1, 2, 3, '...', StudentPages];
    }
    
    if (currentPage >= StudentPages - 1) {
      // Jika di akhir: 1, ..., Terakhir-2, Terakhir-1, Terakhir
      return [1, '...', StudentPages - 2, StudentPages - 1, StudentPages];
    }
    
    // Jika di tengah: 1, ..., (Current-1), Current, (Current+1), ..., Terakhir
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', StudentPages];
  };

  const visiblePages = generatePagination();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-background selection:bg-white/20">
      
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground">
              Class Management
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Centralized control and comprehensive monitoring of academic class data.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            
            {/* 🔥 FIX: Tree React disatukan dan ditambah suppressHydrationWarning */}
            <div className={cn("flex items-center transition-all duration-300", activeFilter !== "all" && "h-9 rounded-md border border-border bg-card shadow-sm animate-in fade-in slide-in-from-right-2")}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {activeFilter === "all" ? (
                    <Button suppressHydrationWarning variant="outline" className="h-9 gap-2 border-border bg-card hover:bg-accent text-foreground transition-all px-3">
                      <Filter className="size-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium">Filter</span>
                      <ChevronDown className="size-3.5 text-muted-foreground opacity-70" />
                    </Button>
                  ) : (
                    <Button suppressHydrationWarning variant="ghost" className="h-full rounded-none rounded-l-md border-r border-border px-3 gap-2 hover:bg-accent text-foreground transition-all focus-visible:ring-0">
                      <Filter className="size-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium">Filter</span>
                      <div className="h-4 w-px bg-border mx-1" />
                      <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        {activeFilter}
                      </span>
                    </Button>
                  )}
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-32 bg-card border-border shadow-xl rounded-lg origin-top-right data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                  {['X', 'XI', 'XII'].map(batch => (
                    <DropdownMenuItem 
                      key={batch} 
                      onClick={() => handleFilterChange(batch)} 
                      className={cn(
                        "cursor-pointer text-xs font-medium focus:bg-accent transition-colors",
                        activeFilter === batch ? "text-primary" : "text-foreground"
                      )}
                    >
                      Grade {batch}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Tombol X hanya muncul jika aktif */}
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

            <div className="relative group w-full sm:w-56 sm:focus-within:w-72 transition-all duration-500 ease-out">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors duration-300 size-4" />
              <Input
                placeholder="Search class or teacher..."
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
      <main className="flex-1 w-full pb-8">
        {paginatedClasses.length > 0 ? (
          <div className="flex flex-wrap justify-center items-start gap-6 xl:gap-8 mt-4">
            {paginatedClasses.map((kelas) => (
              <div
                key={kelas.id}
                className="group relative w-63.5 h-91 bg-card border border-border rounded-3xl flex flex-col transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                {/* 1. Banner Section */}
                <div className="relative w-full h-28 shrink-0 bg-muted overflow-hidden rounded-t-3xl">
                  <Image
                    src="/bg-banner.jpeg"
                    alt="Class Banner"
                    fill
                    className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/80" />

                  {/* 🔥 FIX: Status Badge menjadi Nama Wali Kelas dengan background gelap agar jelas */}
                  <div className="absolute top-4 right-4 flex items-center px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 z-10 shadow-sm max-w-40">
                    <span className="font-inter text-[10px] font-semibold text-white tracking-wide truncate">
                      {kelas.wali}
                    </span>
                  </div>
                </div>

                {/* 🔥 FIX: Avatar Profile dengan efek Kaca Pucat (Frosted Glass) yang lebih terang */}
                <div className="absolute top-21 left-5 z-20">
                  {/* Dasar bg-card (hitam pekat) untuk memblokir garis spanduk agar tidak bocor */}
                  <div className="relative size-14 rounded-full border-[3px] border-card bg-card flex items-center justify-center shadow-lg overflow-hidden">

                    {/* Lapisan primary transparan yang LEBIH TERANG agar tidak menyatu dengan background */}
                    <div className="absolute inset-0 bg-linear-to-br from-primary/2 via-primary/8 to-transparent" />

                    <span className="font-space font-bold text-foreground text-[15px] z-10 drop-shadow-md">
                      {kelas.batch}
                    </span>
                  </div>
                </div>

                {/* 3. Content Section */}
                <div className="flex flex-col flex-1 p-5 pt-10">

                  {/* Title & Verified Badge */}
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-jakarta font-bold text-[18px] text-foreground tracking-tight leading-none truncate">
                      {kelas.name}
                    </h3>
                    <BadgeCheck className="size-4 text-blue-500 shrink-0" />
                  </div>

                  {/* 🔥 FIX: Username menjadi @namakelas huruf kecil */}
                  <p className="font-mono text-[11px] text-muted-foreground tracking-tight">
                    @{kelas.name.toLowerCase().replace(/\s+/g, '')}
                  </p>

                  {/* 🔥 FIX: Deskripsi kelas dengan line-clamp 2 baris */}
                  <p className="font-inter text-[12px] text-foreground/70 leading-relaxed mt-2.5 line-clamp-2">
                    {kelas.description}
                  </p>

                  {/* 🔥 FIX: 4. Stats Section (3 Kolom & Warna "Period" Disamakan) */}
                  <div className="flex items-center justify-between mt-auto mb-4 font-inter text-[12px]">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground leading-none mb-1">{kelas.Student}</span>
                      <span className="text-muted-foreground text-[9px] uppercase tracking-wider">Students</span>
                    </div>
                    <div className="h-5 w-px bg-border" />
                    <div className="flex flex-col">
                      {/* Warna text-foreground disamaratakan */}
                      <span className="font-bold text-foreground leading-none mb-1">{kelas.period}</span>
                      <span className="text-muted-foreground text-[9px] uppercase tracking-wider">Period</span>
                    </div>
                    <div className="h-5 w-px bg-border" />
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground leading-none mb-1">{kelas.batch}</span>
                      <span className="text-muted-foreground text-[9px] uppercase tracking-wider">Grade</span>
                    </div>
                  </div>

                  {/* 5. Links / Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      /* 🔥 FIX: bg-primary/70 agar perbedaan warnanya kentara, dan tambah efek hover melayang sedikit */
                      className="group/view flex-1 h-9 rounded-full bg-primary text-black hover:bg-primary/70 hover:-translate-y-0.5 font-bold text-[12px] transition-all active:scale-95 shadow-md"
                    >
                      <ExternalLink className="mr-1.5 size-3.5 group-hover/view:ar-bounce-x" />
                      View
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="group/qr h-9 w-9 rounded-full border-border bg-card hover:bg-accent hover:border-white/20 hover:text-foreground transition-all active:scale-95 shadow-sm"
                      onClick={() => setIsQRModalOpen(true)}
                    >
                      <QrCode className="size-4 transition-colors group-hover/qr:text-primary group-hover/qr:ar-shake-loop" />
                    </Button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center opacity-30">
            <SearchX className="size-16 text-muted-foreground/50" />
            <p className="mt-4 font-bold tracking-widest uppercase text-xs text-center text-foreground">No classes found</p>
          </div>
        )}

        {/* --- PAGINATION (Premium Rounded Square & Subtle Active) --- */}
        {StudentPages > 1 && (
          <div className="mt-12 flex justify-center pb-12">
            <Pagination className="mx-0 w-auto">
              {/* Jarak antar elemen utama dibuat lega (gap-2) */}
              <PaginationContent className="flex items-center gap-2 sm:gap-3">

                {/* Tombol Previous */}
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={cn(
                      // 🔥 Bentuk rounded-lg untuk kesan kotak melengkung elegan
                      "h-8 px-2 sm:px-3 rounded-lg border border-transparent transition-all duration-300 flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider",
                      currentPage === 1
                        ? "pointer-events-none text-muted-foreground/30"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  />
                </PaginationItem>

                {/* Area Angka - Jarak antar angka (gap-1) */}
                <div className="flex items-center gap-1.5">
                  {visiblePages.map((page, index) => {
                    // Render Titik-titik (Ellipsis)
                    if (page === '...') {
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <div className="h-8 w-8 flex items-center justify-center text-muted-foreground/40">
                            <MoreHorizontal className="size-4" />
                          </div>
                        </PaginationItem>
                      );
                    }

                    // Render Angka Halaman
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
                            // 🔥 FIX KUNCI: rounded-lg (kotak melengkung), h-8 w-8 (proporsi ramping)
                            "h-8 w-8 p-0 flex items-center justify-center font-bold text-xs rounded-lg transition-all duration-300",
                            currentPage === page
                              // 🔥 AKTIF: Background redup transparan (15%), ada border tipis bercahaya, text putih
                              ? "bg-foreground/15 text-foreground border border-foreground/20 shadow-sm" 
                              // 🔥 TIDAK AKTIF: Tanpa border, hover menyala elegan
                              : "bg-transparent text-muted-foreground border border-transparent hover:bg-accent/50 hover:text-foreground" 
                          )}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                </div>

                {/* Tombol Next */}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < StudentPages) setCurrentPage(currentPage + 1);
                    }}
                    className={cn(
                      "h-8 px-2 sm:px-3 rounded-lg border border-transparent transition-all duration-300 flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider",
                      currentPage === StudentPages
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

      {/* --- QR MODAL --- */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-2xl border-border sm:max-w-xs p-0 overflow-hidden rounded-4xl shadow-2xl">
          <div className="p-8 flex flex-col items-center gap-6 text-center">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black tracking-tighter uppercase leading-none text-foreground">Class QR</DialogTitle>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Collective Attendance</p>
            </div>

            <div className="relative p-6 bg-white rounded-4xl shadow-md">
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-75 animate-pulse" />
              <div className="relative w-40 h-40">
                <QrCode className="w-full h-full text-black" strokeWidth={1.5} />
              </div>
            </div>

            <p className="text-[11px] font-bold text-muted-foreground/80 leading-relaxed px-6 italic">
              &quot;Use the ARDEN mobile scanner to process attendance for all students automatically.&quot;
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