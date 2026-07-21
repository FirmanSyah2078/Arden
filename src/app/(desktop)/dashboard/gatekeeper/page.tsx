"use client"

import React from "react";
import { 
  Search, QrCode, SearchX, Filter, ChevronDown, X, MoreHorizontal,
  ShieldCheck, Server, Smartphone, Clock, Edit3, User, CheckCircle2,
  AlertCircle, Loader2, RefreshCw
} from "lucide-react"; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useGate } from "@/hooks/gatekeeper/use-gate";

export default function GatekeeperPage() {
  const {
    isLoading, keyword, activeFilter, currentPage, totalPages,
    paginatedLogs, visiblePages, handleSearchChange, handleFilterChange, setCurrentPage, fetchLogs
  } = useGate();

  return (
    // 🔥 FIX: PADDING p-6 MUTLAK (Kompak dengan CoreTable & ClassPage)
    <div className="flex flex-1 flex-col p-6 bg-background selection:bg-white/20">
      
      {/* ========================================== */}
      {/* HEADER PERFECTLY BALANCED */}
      {/* ========================================== */}
      <header className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-foreground font-jakarta">
                Gatekeeper
              </h1>
              <Button variant="ghost" size="icon" className="size-6 rounded-full text-muted-foreground hover:text-primary" onClick={fetchLogs} disabled={isLoading}>
                <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
              </Button>
            </div>
            <p className="text-[13px] text-muted-foreground font-inter">
              Centralized inbound data validation and real-time attendance logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className={cn("flex items-center transition-all duration-300", activeFilter !== "all" && "h-8 rounded-md border border-border bg-card shadow-sm")}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {activeFilter === "all" ? (
                    <Button suppressHydrationWarning variant="outline" className="h-8 gap-2 border-border bg-card hover:bg-accent text-foreground transition-all px-3">
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
                <DropdownMenuContent align="end" className="w-36 bg-card border-border shadow-xl rounded-lg origin-top-right">
                  {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(session => (
                    <DropdownMenuItem key={session} onClick={() => handleFilterChange(session)} className={cn("cursor-pointer text-xs font-medium focus:bg-accent transition-colors", activeFilter === session ? "text-primary" : "text-foreground")}>
                      {session} Session
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
              <Input
                placeholder="Search student or class..."
                spellCheck={false}
                autoComplete="off"
                className="pl-8 pr-8 h-8 bg-muted/30 border-border focus-visible:ring-0 transition-all text-[13px] rounded-md"
                value={keyword}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {keyword && (
                <button type="button" onClick={() => handleSearchChange("")} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground hover:bg-destructive/10 rounded-full">
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-linear-to-r from-border via-border/50 to-transparent" />
      </header>

      <main className="flex-1 w-full pb-8">
        {/* EXPLANATION CARD */}
        <div className="mb-6 p-5 bg-card border border-border rounded-2xl relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full transition-all duration-700 group-hover:bg-primary/10" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col gap-1.5 max-w-2xl">
              <div className="flex items-center gap-2 mb-0.5">
                <ShieldCheck className="size-4 text-primary" />
                <h2 className="font-jakarta text-[15px] font-semibold text-foreground tracking-tight">System Architecture & Validation Rules</h2>
              </div>
              <p className="font-inter text-xs text-muted-foreground leading-relaxed">
                The Gatekeeper filters inbound data by cross-referencing <strong className="text-foreground">Weekly Routines</strong> with <strong className="text-foreground">Astronomical Bounds</strong>. Entries within +20 mins of the scheduled time are accepted via QR and marked <span className="text-emerald-400 font-semibold px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20 mx-0.5">NORMAL</span>. Entries up to +60 mins require manual authorization and are marked <span className="text-red-400 font-semibold px-1.5 py-0.5 bg-red-500/10 rounded border border-red-500/20 mx-0.5">LATE</span>.
              </p>
            </div>
            {/* Visual Logic Flow */}
            <div className="flex items-center gap-2.5 shrink-0 bg-muted/30 p-2.5 rounded-xl border border-border/50">
              <div className="flex flex-col items-center gap-1">
                <div className="size-7 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20"><Smartphone className="size-3.5 text-blue-500" /></div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Input</span>
              </div>
              <div className="h-0.5 w-5 bg-border" />
              <div className="flex flex-col items-center gap-1">
                <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 relative">
                  <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span></span>
                  <Server className="size-3.5 text-primary" />
                </div>
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Gatekeeper</span>
              </div>
              <div className="h-0.5 w-5 bg-border" />
              <div className="flex flex-col items-center gap-1">
                <div className="size-7 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"><ShieldCheck className="size-3.5 text-emerald-500" /></div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Valid</span>
              </div>
            </div>
          </div>
        </div>

        {/* LIST LOG AKTIVITAS */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center opacity-50">
            <Loader2 className="size-8 animate-spin text-primary mb-3" />
            <p className="font-medium text-[13px] text-foreground">Fetching Live Data...</p>
          </div>
        ) : paginatedLogs.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {paginatedLogs.map((log) => (
              <div key={log.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 px-4 bg-card/40 border border-border rounded-xl transition-all duration-300 hover:border-white/20 hover:bg-card hover:shadow-md hover:shadow-primary/5">
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[14px] font-semibold text-foreground truncate font-jakarta">{log.studentName}</span>
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-widest border", log.status === "Normal" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20")}>
                      {log.status === "Normal" ? <CheckCircle2 className="inline size-3 mr-1 -mt-0.5" /> : <AlertCircle className="inline size-3 mr-1 -mt-0.5" />} {log.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-inter text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      {log.method === 'Scan QR' ? <QrCode size={11} className="text-primary" /> : <Edit3 size={11} className="text-blue-500" />}
                      <span className="font-medium text-foreground/80">{log.method}</span>
                    </div>
                    <span className="opacity-30">•</span><span className="font-medium">Class {log.className}</span><span className="opacity-30">•</span>
                    <div className="flex items-center gap-1.5"><Clock size={11} /><span>{log.time} ({log.session})</span></div>
                    {log.remarks !== "-" && (<><span className="opacity-30">•</span><span className="italic text-foreground/70">"{log.remarks}"</span></>)}
                  </div>
                </div>
                <div className="mt-2.5 sm:mt-0 flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50 shrink-0">
                  <User size={13} className="text-muted-foreground/70" />
                  <span className="text-[11px] font-medium text-muted-foreground truncate max-w-30">{log.executor}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center opacity-30">
            <SearchX className="size-12 text-muted-foreground/50" />
            <p className="mt-3 font-bold tracking-widest uppercase text-[11px] text-center text-foreground">No logs found</p>
          </div>
        )}

        {/* PAGINATION */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8 flex justify-center pb-8">
            <Pagination className="mx-0 w-auto">
              <PaginationContent className="flex items-center gap-1.5 sm:gap-2">
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }} className={cn("h-8 px-2 sm:px-3 rounded-lg border border-transparent transition-all duration-300 flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider", currentPage === 1 ? "pointer-events-none text-muted-foreground/30" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground")} />
                </PaginationItem>
                <div className="flex items-center gap-1">
                  {visiblePages.map((page, index) => {
                    if (page === '...') return (<PaginationItem key={`ellipsis-${index}`}><div className="h-8 w-8 flex items-center justify-center text-muted-foreground/40"><MoreHorizontal className="size-3.5" /></div></PaginationItem>);
                    return (<PaginationItem key={page}><PaginationLink href="#" isActive={currentPage === page} onClick={(e) => { e.preventDefault(); setCurrentPage(Number(page)); }} className={cn("h-8 w-8 p-0 flex items-center justify-center font-bold text-xs rounded-lg transition-all duration-300", currentPage === page ? "bg-foreground/15 text-foreground border-foreground/20 border shadow-sm" : "bg-transparent text-muted-foreground border border-transparent hover:bg-accent/50 hover:text-foreground")}>{page}</PaginationLink></PaginationItem>);
                  })}
                </div>
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1); }} className={cn("h-8 px-2 sm:px-3 rounded-lg border border-transparent transition-all duration-300 flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider", currentPage === totalPages ? "pointer-events-none text-muted-foreground/30" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground")} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
}