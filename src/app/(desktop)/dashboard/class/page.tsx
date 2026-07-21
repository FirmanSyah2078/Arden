// src/app/(desktop)/dashboard/class/page.tsx
"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Search, QrCode, SearchX, ExternalLink, Filter, ChevronDown, X,
  BadgeCheck, MoreHorizontal, Printer, Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useClass } from "@/hooks/class/use-class"

export default function ClassPage() {
  const router = useRouter()
  const {
    keyword, handleSearchChange, activeFilter, handleFilterChange, currentPage, setCurrentPage,
    StudentPages, visiblePages, paginatedClasses, qrModalClass, openQrModal, closeQrModal,
    dummyStudentsQR, selectedQRStudents, handleToggleQRStudent, handleSelectAllQR, handlePrint,
  } = useClass()

  const visibleCards = dummyStudentsQR.filter((s) => selectedQRStudents.includes(s.id)).slice(0, 3)
  const len = visibleCards.length

  const handleCloseModal = () => {
    closeQrModal()
    setTimeout(() => {
      document.body.style.pointerEvents = "auto"
      document.body.style.overflow = "auto"
      document.body.removeAttribute("data-scroll-locked")
    }, 200)
  }

  return (
    // 🔥 FIX: Padding dicabut (diurus oleh layout.tsx). Struktur dibuat flex-col murni.
    <div className="flex flex-1 flex-col w-full print:bg-white print:p-0">
      
      {/* =====================================================================
          🔥 PRINTABLE AREA (HANYA MUNCUL DI KERTAS SAAT CTRL+P / CMD+P) 🔥 
          ===================================================================== */}
      <div className="fixed inset-0 z-9999 hidden overflow-visible bg-white p-8 print:block">
        <h2 className="font-jakarta mb-6 text-center text-xl font-bold text-black">QR Code ID Card - {qrModalClass?.name}</h2>
        <div className="grid grid-cols-5 place-items-center gap-x-4 gap-y-8">
          {dummyStudentsQR.filter((s) => selectedQRStudents.includes(s.id)).map((student) => (
            <div key={student.id} className="flex flex-col items-center">
              <div className="flex h-[3.5cm] w-[3.5cm] items-center justify-center rounded-md border border-gray-400 bg-white p-2">
                <QrCode className="h-full w-full text-black" strokeWidth={1} />
              </div>
              <p className="font-inter mt-1.5 w-[3.5cm] truncate px-1 text-center text-[10px] font-bold tracking-tight text-black uppercase">{student.name}</p>
              <p className="font-mono text-[8px] tracking-widest text-gray-500 uppercase">{student.icode}</p>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          TAMPILAN UI NORMAL DASHBOARD
          ===================================================================== */}
      <div className="print:hidden flex flex-col flex-1 w-full">
        
        {/* 🔥 FIX: HEADER PERFECTLY BALANCED (Persis Gatekeeper) */}
        <header className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex flex-col gap-1.5">
              <h1 className="text-xl font-bold tracking-tight text-foreground font-jakarta">Class Hub</h1>
              <p className="text-[13px] text-muted-foreground font-inter">Centralized control and comprehensive monitoring of academic class data.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className={cn("flex items-center transition-all duration-300", activeFilter !== "all" && "h-8 rounded-md border border-border bg-card shadow-sm")}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {activeFilter === "all" ? (
                      <Button suppressHydrationWarning variant="outline" className="h-8 gap-2 border-border bg-card hover:bg-accent text-foreground transition-all px-3 rounded-md shadow-sm">
                        <Filter className="size-3.5 text-muted-foreground" />
                        <span className="hidden sm:inline text-xs font-medium">Filter Grade</span>
                        <ChevronDown className="size-3.5 text-muted-foreground opacity-70" />
                      </Button>
                    ) : (
                      <Button suppressHydrationWarning variant="ghost" className="h-full rounded-none rounded-l-md border-r border-border px-3 gap-2 hover:bg-accent text-foreground transition-all focus-visible:ring-0">
                        <Filter className="size-3.5 text-muted-foreground" />
                        <span className="hidden sm:inline text-xs font-medium">Grade</span>
                        <div className="hidden sm:block h-4 w-px bg-border mx-1" />
                        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{activeFilter}</span>
                      </Button>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32 bg-card border-border shadow-xl rounded-lg origin-top-right text-xs">
                    {["X", "XI", "XII"].map((batch) => (
                      <DropdownMenuItem key={batch} onClick={() => handleFilterChange(batch)} className={cn("cursor-pointer text-xs font-medium focus:bg-accent transition-colors", activeFilter === batch ? "text-primary" : "text-foreground")}>
                        Grade {batch}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {activeFilter !== "all" && (
                  <button onClick={() => handleFilterChange("all")} className="h-full px-2.5 flex items-center justify-center hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors rounded-r-md outline-none">
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <div className="relative group w-full sm:w-56 sm:focus-within:w-64 transition-all duration-500 ease-out">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300 size-3.5" />
                <Input placeholder="Search class or teacher..." spellCheck={false} autoComplete="off" className="pl-8 pr-8 h-8 bg-muted/30 border-border focus-visible:ring-0 transition-all text-[13px] rounded-md text-foreground placeholder:text-muted-foreground shadow-sm" value={keyword} onChange={(e) => handleSearchChange(e.target.value)} />
                {keyword && (
                  <button type="button" onClick={() => handleSearchChange("")} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground hover:bg-destructive/10 rounded-full transition-all duration-200 outline-none">
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
          <div className="h-px w-full bg-linear-to-r from-border via-border/50 to-transparent" />
        </header>

        {/* MAIN CONTENT (Card Grid) */}
        <main className="w-full flex-1 pb-8">
          {paginatedClasses.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-start justify-center gap-6 xl:gap-8">
              {paginatedClasses.map((kelas) => (
                <div key={kelas.id} className="group bg-card border-border hover:shadow-primary/5 relative flex h-91 w-63.5 flex-col rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl">
                  {/* Bagian Banner */}
                  <div className="bg-muted relative h-28 w-full shrink-0 overflow-hidden rounded-t-3xl">
                    <Image src="/bg-banner.jpeg" alt="Banner" fill className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/80" />
                    <div className="absolute top-4 right-4 z-10 flex max-w-40 items-center rounded-full border border-white/10 bg-black/70 px-3 py-1.5 shadow-sm backdrop-blur-md">
                      <span className="font-inter truncate text-[10px] font-semibold tracking-wide text-white">{kelas.wali}</span>
                    </div>
                  </div>
                  
                  {/* Lingkaran Angkatan */}
                  <div className="absolute top-21 left-5 z-20">
                    <div className="border-card bg-card relative flex size-14 items-center justify-center overflow-hidden rounded-full border-[3px] shadow-lg">
                      <div className="from-primary/2 via-primary/8 absolute inset-0 bg-linear-to-br to-transparent" />
                      <span className="font-space text-foreground z-10 text-[15px] font-bold drop-shadow-md">{kelas.batch}</span>
                    </div>
                  </div>
                  
                  {/* Detail Konten */}
                  <div className="flex flex-1 flex-col p-5 pt-10">
                    <div className="mb-0.5 flex items-center gap-1.5">
                      <h3 className="font-jakarta text-foreground truncate text-[18px] leading-none font-bold tracking-tight">{kelas.name}</h3>
                      <BadgeCheck className="size-4 shrink-0 text-blue-500" />
                    </div>
                    <p className="text-muted-foreground font-mono text-[11px] tracking-tight">@{kelas.name.toLowerCase().replace(/\s+/g, "")}</p>
                    <p className="font-inter text-foreground/70 mt-2.5 line-clamp-2 text-[12px] leading-relaxed">{kelas.description}</p>
                    
                    <div className="font-inter mt-auto mb-4 flex items-center justify-between text-[12px]">
                      <div className="flex flex-col"><span className="text-foreground mb-1 leading-none font-bold">{kelas.Student}</span><span className="text-muted-foreground text-[9px] tracking-wider uppercase">Students</span></div>
                      <div className="bg-border h-5 w-px" />
                      <div className="flex flex-col"><span className="text-foreground mb-1 leading-none font-bold">{kelas.period}</span><span className="text-muted-foreground text-[9px] tracking-wider uppercase">Period</span></div>
                      <div className="bg-border h-5 w-px" />
                      <div className="flex flex-col"><span className="text-foreground mb-1 leading-none font-bold">{kelas.batch}</span><span className="text-muted-foreground text-[9px] tracking-wider uppercase">Grade</span></div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button onClick={() => router.push(`/dashboard/class-hub/${kelas.id}`)} className="group/view bg-primary hover:bg-primary/70 h-9 flex-1 rounded-full text-[12px] font-bold text-black shadow-md transition-all hover:-translate-y-0.5 active:scale-95">
                        <ExternalLink className="group-hover/view:ar-bounce-x mr-1.5 size-3.5" /> View
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => openQrModal(kelas)} className="group/qr border-border bg-card hover:bg-accent hover:text-foreground h-9 w-9 rounded-full shadow-sm transition-all hover:border-white/20 active:scale-95">
                        <QrCode className="group-hover/qr:text-primary group-hover/qr:ar-shake-loop size-4 transition-colors" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 opacity-30">
              <SearchX className="text-muted-foreground/50 size-16" />
              <p className="text-foreground mt-4 text-center text-[11px] font-bold tracking-widest uppercase">No classes found</p>
            </div>
          )}

          {/* 🔥 FIX: PAGINATION (Persis Gatekeeper) */}
          {StudentPages > 1 && (
            <div className="mt-8 flex justify-center pb-8">
              <Pagination className="mx-0 w-auto">
                <PaginationContent className="flex items-center gap-1.5 sm:gap-2">
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }} className={cn("h-8 px-2 sm:px-3 rounded-lg border border-transparent transition-all duration-300 flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider", currentPage === 1 ? "pointer-events-none text-muted-foreground/30" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground")} />
                  </PaginationItem>
                  <div className="flex items-center gap-1">
                    {visiblePages.map((page, index) => page === "..." ? (<PaginationItem key={`ellipsis-${index}`}><div className="text-muted-foreground/40 flex h-8 w-8 items-center justify-center"><MoreHorizontal className="size-3.5" /></div></PaginationItem>) : (<PaginationItem key={page}><PaginationLink href="#" isActive={currentPage === page} onClick={(e) => { e.preventDefault(); setCurrentPage(Number(page)); }} className={cn("flex h-8 w-8 items-center justify-center rounded-lg p-0 text-xs font-bold transition-all", currentPage === page ? "bg-foreground/15 text-foreground border-foreground/20 border shadow-sm" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground border border-transparent bg-transparent")}>{page}</PaginationLink></PaginationItem>))}
                  </div>
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < StudentPages) setCurrentPage(currentPage + 1); }} className={cn("h-8 px-2 sm:px-3 rounded-lg border border-transparent transition-all duration-300 flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider", currentPage === StudentPages ? "pointer-events-none text-muted-foreground/30" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground")} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>
      </div>
      
      {/* 
        =====================================================================
        🔥 MODAL BULK QR GENERATOR (RESPONSIVE: MOBILE & DESKTOP) 🔥
        =====================================================================
      */}
      <Dialog open={!!qrModalClass} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="flex h-[90vh] flex-col overflow-hidden rounded-2xl border-white/10 bg-[#0a0a0a] p-0 text-white selection:bg-white/20 selection:text-white sm:h-120 sm:max-w-2xl print:hidden">
          <DialogDescription className="sr-only">Modal for mass QR printing</DialogDescription>

          <div className="flex flex-1 flex-col overflow-hidden sm:flex-row">
            {/* KIRI: SELEKSI SISWI */}
            <div className="relative order-2 flex h-full w-full flex-1 flex-col border-white/10 bg-transparent sm:order-1 sm:w-[45%] sm:flex-none sm:border-r">
              <div className="shrink-0 space-y-3 border-b border-white/10 p-4">
                <DialogTitle className="text-foreground font-jakarta flex flex-wrap items-center gap-1.5 truncate text-[16px] leading-tight font-bold">
                  Print QR <span className="bg-primary/10 text-primary rounded-md px-2.5 py-0.5 text-[13px] font-semibold tracking-wide">{qrModalClass?.name}</span>
                </DialogTitle>
                <div className="mt-2 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5">
                  <div className="flex cursor-pointer items-center gap-2" onClick={handleSelectAllQR}>
                    <Checkbox checked={selectedQRStudents.length === dummyStudentsQR.length && dummyStudentsQR.length > 0} className="data-[state=checked]:bg-primary size-3.5 rounded-lg border-white/20 data-[state=checked]:text-black" />
                    <span className="text-[11px] font-medium text-white select-none">Select All</span>
                  </div>
                  <span className="text-primary bg-primary/10 border-primary/20 rounded border px-1.5 py-0.5 font-mono text-[9px]">{selectedQRStudents.length} / {dummyStudentsQR.length}</span>
                </div>
              </div>

              {/* LIST SCROLL */}
              <div className="group/list relative flex-1 overflow-hidden">
                <div className="absolute inset-0 space-y-1 overflow-y-auto p-2 pr-3 pb-6 transition-all [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent group-hover/list:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:mb-3 [&::-webkit-scrollbar-track]:bg-transparent">
                  {dummyStudentsQR.map((student) => (
                    <div key={student.id} onClick={() => handleToggleQRStudent(student.id)} className={cn("flex cursor-pointer items-center justify-between rounded-lg border p-2 transition-all", selectedQRStudents.includes(student.id) ? "bg-primary/10 border-primary/30" : "border-transparent bg-transparent hover:bg-white/5")}>
                      <div className="flex min-w-0 flex-1 items-center gap-2.5 pr-2">
                        <Checkbox checked={selectedQRStudents.includes(student.id)} className="data-[state=checked]:bg-primary size-3.5 shrink-0 rounded-lg border-white/20 data-[state=checked]:text-black" />
                        <span className="truncate text-[11px] font-medium text-white">{student.name}</span>
                      </div>
                      <span className="text-muted-foreground shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[9px]">{student.icode}</span>
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute bottom-0 left-0 h-10 w-[calc(100%-10px)] bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent" />
              </div>
            </div>

            {/* KANAN: PREVIEW QR + DESKTOP FOOTER */}
            <div className="relative order-1 flex h-64 w-full shrink-0 flex-col overflow-hidden border-b border-white/5 bg-transparent sm:order-2 sm:h-full sm:w-[55%] sm:border-b-0">
              <div className="relative flex h-full w-full flex-1 flex-col items-center justify-center">
                {selectedQRStudents.length === 0 ? (
                  <div className="flex flex-col items-center text-center opacity-30">
                    <QrCode className="text-muted-foreground mb-2 size-10" strokeWidth={1.5} />
                    <p className="text-[10px] font-bold tracking-wider uppercase">Select Students</p>
                  </div>
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center sm:-mt-12 sm:perspective-[1000px]">
                    {/* TAMPILAN MOBILE (HP) */}
                    <div className="flex flex-col items-center sm:hidden">
                      <div className="relative flex w-28 flex-col items-center rounded-2xl border border-white/10 bg-[#111] p-3 shadow-2xl">
                        <div className="from-primary/10 pointer-events-none absolute top-0 left-0 h-10 w-full rounded-t-2xl bg-linear-to-b to-transparent" />
                        <div className="relative z-10 aspect-square w-full rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">
                          <QrCode className="size-full text-black" strokeWidth={1} />
                        </div>
                        <div className="relative z-10 mt-3 w-full px-1 text-center">
                          <p className="font-jakarta truncate text-[10px] leading-relaxed font-semibold tracking-wide text-white/95 uppercase antialiased">{visibleCards[0]?.name}</p>
                          <p className="text-primary mt-0.5 font-mono text-[8px] font-medium tracking-widest antialiased">{visibleCards[0]?.icode}</p>
                        </div>
                      </div>
                      {selectedQRStudents.length > 1 && (
                        <div className="animate-in fade-in zoom-in-95 mt-3 rounded-full border border-white/10 bg-black/80 px-3 py-1 backdrop-blur-md">
                          <p className="text-[9px] font-bold tracking-widest text-white">+ {selectedQRStudents.length - 1} OTHERS</p>
                        </div>
                      )}
                    </div>

                    {/* TAMPILAN DESKTOP (Kipas Tangan 3D) */}
                    <div className="relative hidden h-full w-full items-center justify-center sm:flex">
                      {visibleCards.map((student, index) => {
                        let angle = 0
                        if (len === 2) angle = index === 0 ? -12 : 12
                        if (len === 3) angle = index === 0 ? -18 : index === 1 ? 0 : 18
                        const isCenter = angle === 0

                        return (
                          <div key={student.id} className="absolute flex w-30 flex-col items-center rounded-2xl border border-white/10 bg-[#111] p-3 shadow-2xl transition-transform duration-500 ease-out" style={{ transformOrigin: "50% 150%", transform: `rotate(${angle}deg)`, zIndex: isCenter ? 10 : 5 }}>
                            <div className="from-primary/10 pointer-events-none absolute top-0 left-0 h-10 w-full rounded-t-2xl bg-linear-to-b to-transparent" />
                            <div className="relative z-10 aspect-square w-full rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">
                              <QrCode className="size-full text-black" strokeWidth={1} />
                            </div>
                            <div className="relative z-10 mt-3 w-full text-center">
                              <p className="truncate text-[10px] leading-none font-bold tracking-tight text-white uppercase">{student.name}</p>
                              <p className="text-primary/80 mt-1 font-mono text-[8px]">{student.icode}</p>
                            </div>
                          </div>
                        )
                      })}
                      {selectedQRStudents.length > 3 && (
                        <div className="animate-in fade-in zoom-in-95 absolute -bottom-3 z-50 rounded-full border border-white/10 bg-black/80 px-3 py-1 backdrop-blur-md">
                          <p className="text-[9px] font-bold tracking-widest text-white">+ {selectedQRStudents.length - 3} OTHERS</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* DESKTOP FOOTER */}
              <div className="z-10 hidden w-full shrink-0 items-center justify-between gap-2 border-t border-white/10 bg-transparent px-5 py-4 sm:flex">
                <Button variant="outline" size="sm" className="h-8 border-white/10 bg-transparent px-3 text-[10px] text-gray-300 transition-colors hover:bg-white/5 hover:text-white" onClick={handleCloseModal}>Cancel</Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 border-white/10 bg-white/5 px-2 text-[10px] text-white hover:bg-white/10" disabled={selectedQRStudents.length === 0}><Download className="size-3" /> PDF</Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 h-8 gap-1.5 px-3 text-[10px] font-bold text-black" disabled={selectedQRStudents.length === 0} onClick={handlePrint}><Printer className="size-3" /> Print</Button>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE FOOTER */}
          <div className="relative z-20 order-3 flex w-full shrink-0 items-center justify-between gap-2 border-t border-white/10 bg-[#0a0a0a] px-5 py-4 sm:hidden">
            <Button variant="outline" size="sm" className="h-8 border-white/10 bg-transparent px-3 text-[10px] text-gray-300 transition-colors hover:bg-white/5 hover:text-white" onClick={handleCloseModal}>Cancel</Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 border-white/10 bg-white/5 px-2 text-[10px] text-white hover:bg-white/10" disabled={selectedQRStudents.length === 0}><Download className="size-3" /> PDF</Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 h-8 gap-1.5 px-3 text-[10px] font-bold text-black max-sm:pointer-events-none max-sm:opacity-30" disabled={selectedQRStudents.length === 0} onClick={handlePrint}><Printer className="size-3" /> Print</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}