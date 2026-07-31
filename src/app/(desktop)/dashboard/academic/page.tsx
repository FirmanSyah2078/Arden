"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Search,
  QrCode,
  SearchX,
  ExternalLink,
  Filter,
  ChevronDown,
  X,
  BadgeCheck,
  MoreHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import { useClass } from "@/hooks/academic/use-class"
// 🔥 Import komponen Modal yang baru kita buat
import { QrPrintModal } from "@/components/dashboard/academic/qrprint-modal"

export default function AcademicPage() {
  const router = useRouter()
  const {
    keyword,
    handleSearchChange,
    activeFilter,
    handleFilterChange,
    currentPage,
    setCurrentPage,
    StudentPages,
    visiblePages,
    paginatedClasses,
    qrModalClass,
    openQrModal,
    closeQrModal,
    dummyStudentsQR,
    selectedQRStudents,
    handleToggleQRStudent,
    handleSelectAllQR,
    handlePrint,
  } = useClass()

  const handleCloseModal = () => {
    closeQrModal()
    setTimeout(() => {
      document.body.style.pointerEvents = "auto"
      document.body.style.overflow = "auto"
      document.body.removeAttribute("data-scroll-locked")
    }, 200)
  }

  return (
    <div className="flex w-full flex-1 flex-col print:bg-white print:p-0">
      {/* TAMPILAN UI NORMAL DASHBOARD */}
      <div className="flex w-full flex-1 flex-col print:hidden">
        <header className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-col gap-1.5">
              {/* 🔥 Judul diubah menjadi Academic */}
              <h1 className="text-foreground font-jakarta text-xl font-bold tracking-tight">
                Academic
              </h1>
              <p className="text-muted-foreground font-inter text-[13px]">
                Centralized control and comprehensive monitoring of academic
                class data.
              </p>
            </div>

            <div className="flex w-full flex-wrap items-center gap-2.5 md:w-auto">
              <div
                className={cn(
                  "flex items-center transition-all duration-300",
                  activeFilter !== "all" &&
                    "border-border bg-card h-8 rounded-md border shadow-sm"
                )}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {activeFilter === "all" ? (
                      <Button
                        suppressHydrationWarning
                        variant="outline"
                        className="border-border bg-card hover:bg-accent text-foreground h-8 gap-2 rounded-md px-3 shadow-sm transition-all"
                      >
                        <Filter className="text-muted-foreground size-3.5" />
                        <span className="hidden text-xs font-medium sm:inline">
                          Filter Grade
                        </span>
                        <ChevronDown className="text-muted-foreground size-3.5 opacity-70" />
                      </Button>
                    ) : (
                      <Button
                        suppressHydrationWarning
                        variant="ghost"
                        className="border-border hover:bg-accent text-foreground h-full gap-2 rounded-none rounded-l-md border-r px-3 transition-all focus-visible:ring-0"
                      >
                        <Filter className="text-muted-foreground size-3.5" />
                        <span className="hidden text-xs font-medium sm:inline">
                          Grade
                        </span>
                        <div className="bg-border mx-1 hidden h-4 w-px sm:block" />
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                          {activeFilter}
                        </span>
                      </Button>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-card border-border w-32 origin-top-right rounded-lg text-xs shadow-xl"
                  >
                    {["X", "XI", "XII"].map((batch) => (
                      <DropdownMenuItem
                        key={batch}
                        onClick={() => handleFilterChange(batch)}
                        className={cn(
                          "focus:bg-accent cursor-pointer text-xs font-medium transition-colors",
                          activeFilter === batch
                            ? "text-primary"
                            : "text-foreground"
                        )}
                      >
                        Grade {batch}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {activeFilter !== "all" && (
                  <button
                    onClick={() => handleFilterChange("all")}
                    className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground flex h-full items-center justify-center rounded-r-md px-2.5 transition-colors outline-none"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <div className="group relative w-full transition-all duration-500 ease-out sm:w-56 sm:focus-within:w-64">
                <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 size-3.5 -translate-y-1/2 transition-colors duration-300" />
                <Input
                  placeholder="Search class or teacher..."
                  spellCheck={false}
                  autoComplete="off"
                  className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground h-8 rounded-md pr-8 pl-8 text-[13px] shadow-sm transition-all focus-visible:ring-0"
                  value={keyword}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {keyword && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange("")}
                    className="text-muted-foreground hover:text-foreground hover:bg-destructive/10 absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full p-1 transition-all duration-200 outline-none"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="from-border via-border/50 h-px w-full bg-linear-to-r to-transparent" />
        </header>

        <main className="w-full flex-1 pb-8">
          {paginatedClasses.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-start justify-center gap-6 xl:gap-8">
              {paginatedClasses.map((kelas) => (
                <div
                  key={kelas.id}
                  className="group bg-card border-border hover:shadow-primary/5 relative flex h-91 w-63.5 flex-col rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl"
                >
                  <div className="bg-muted relative h-28 w-full shrink-0 overflow-hidden rounded-t-3xl">
                    <Image
                      src="/bg-banner.jpeg"
                      alt="Banner"
                      fill
                      className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/80" />
                    <div className="absolute top-4 right-4 z-10 flex max-w-40 items-center rounded-full border border-white/10 bg-black/70 px-3 py-1.5 shadow-sm backdrop-blur-md">
                      <span className="font-inter truncate text-[10px] font-semibold tracking-wide text-white">
                        {kelas.wali}
                      </span>
                    </div>
                  </div>

                  <div className="absolute top-21 left-5 z-20">
                    <div className="border-card bg-card relative flex size-14 items-center justify-center overflow-hidden rounded-full border-[3px] shadow-lg">
                      <div className="from-primary/2 via-primary/8 absolute inset-0 bg-linear-to-br to-transparent" />
                      <span className="font-space text-foreground z-10 text-[15px] font-bold drop-shadow-md">
                        {kelas.batch}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 pt-10">
                    <div className="mb-0.5 flex items-center gap-1.5">
                      <h3 className="font-jakarta text-foreground truncate text-[18px] leading-none font-bold tracking-tight">
                        {kelas.name}
                      </h3>
                      <BadgeCheck className="size-4 shrink-0 text-blue-500" />
                    </div>
                    <p className="text-muted-foreground font-mono text-[11px] tracking-tight">
                      @{kelas.name.toLowerCase().replace(/\s+/g, "")}
                    </p>
                    <p className="font-inter text-foreground/70 mt-2.5 line-clamp-2 text-[12px] leading-relaxed">
                      {kelas.description}
                    </p>

                    <div className="font-inter mt-auto mb-4 flex items-center justify-between text-[12px]">
                      <div className="flex flex-col">
                        <span className="text-foreground mb-1 leading-none font-bold">
                          {kelas.Student}
                        </span>
                        <span className="text-muted-foreground text-[9px] tracking-wider uppercase">
                          Students
                        </span>
                      </div>
                      <div className="bg-border h-5 w-px" />
                      <div className="flex flex-col">
                        <span className="text-foreground mb-1 leading-none font-bold">
                          {kelas.period}
                        </span>
                        <span className="text-muted-foreground text-[9px] tracking-wider uppercase">
                          Period
                        </span>
                      </div>
                      <div className="bg-border h-5 w-px" />
                      <div className="flex flex-col">
                        <span className="text-foreground mb-1 leading-none font-bold">
                          {kelas.batch}
                        </span>
                        <span className="text-muted-foreground text-[9px] tracking-wider uppercase">
                          Grade
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* 🔥 PERBAIKAN: Gunakan kelas.slug bukan kelas.id */}
                      <Button
                        onClick={() =>
                          router.push(`/dashboard/academic/${kelas.slug}`)
                        }
                        className="group/view bg-primary hover:bg-primary/70 h-9 flex-1 rounded-full text-[12px] font-bold text-black shadow-md transition-all hover:-translate-y-0.5 active:scale-95"
                      >
                        <ExternalLink className="group-hover/view:ar-bounce-x mr-1.5 size-3.5" />{" "}
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openQrModal(kelas)}
                        className="group/qr border-border bg-card hover:bg-accent hover:text-foreground h-9 w-9 rounded-full shadow-sm transition-all hover:border-white/20 active:scale-95"
                      >
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
              <p className="text-foreground mt-4 text-center text-[11px] font-bold tracking-widest uppercase">
                No classes found
              </p>
            </div>
          )}

          {StudentPages > 1 && (
            <div className="mt-8 flex justify-center pb-8">
              <Pagination className="mx-0 w-auto">
                <PaginationContent className="flex items-center gap-1.5 sm:gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                      }}
                      className={cn(
                        "flex h-8 items-center gap-1 rounded-lg border border-transparent px-2 text-[11px] font-bold tracking-wider uppercase transition-all duration-300 sm:px-3",
                        currentPage === 1
                          ? "text-muted-foreground/30 pointer-events-none"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    />
                  </PaginationItem>
                  <div className="flex items-center gap-1">
                    {visiblePages.map((page, index) =>
                      page === "..." ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <div className="text-muted-foreground/40 flex h-8 w-8 items-center justify-center">
                            <MoreHorizontal className="size-3.5" />
                          </div>
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === page}
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(Number(page))
                            }}
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-lg p-0 text-xs font-bold transition-all",
                              currentPage === page
                                ? "bg-foreground/15 text-foreground border-foreground/20 border shadow-sm"
                                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground border border-transparent bg-transparent"
                            )}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                  </div>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < StudentPages)
                          setCurrentPage(currentPage + 1)
                      }}
                      className={cn(
                        "flex h-8 items-center gap-1 rounded-lg border border-transparent px-2 text-[11px] font-bold tracking-wider uppercase transition-all duration-300 sm:px-3",
                        currentPage === StudentPages
                          ? "text-muted-foreground/30 pointer-events-none"
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

      {/* 🔥 Panggil Komponen Modal yang telah dipisah */}
      <QrPrintModal
        qrModalClass={qrModalClass}
        dummyStudentsQR={dummyStudentsQR}
        selectedQRStudents={selectedQRStudents}
        handleCloseModal={handleCloseModal}
        handleSelectAllQR={handleSelectAllQR}
        handleToggleQRStudent={handleToggleQRStudent}
        handlePrint={handlePrint}
      />
    </div>
  )
}
