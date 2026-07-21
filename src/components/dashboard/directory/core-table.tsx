"use client"

import * as React from "react"
import {
  ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable, SortingState,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area" 
import { Search, Plus, SlidersHorizontal, Upload, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CoreTableProps<TData, TValue> {
  title: string;
  description: string;
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean;
  searchPlaceholder?: string
  onCreate?: () => void
  onImport?: () => void
  children?: React.ReactNode
}

export function CoreTable<TData, TValue>({
  title, description, columns, data, isLoading = false, searchPlaceholder = "Search...", onCreate, onImport, children
}: CoreTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data, columns, state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter, onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(), 
    getFilteredRowModel: getFilteredRowModel(), 
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  })

  const isFiltered = globalFilter.length > 0;

  return (
    <div className="w-full flex flex-col animate-in fade-in duration-500">
      
      {/* ========================================== */}
      {/* HEADER PERFECTLY BALANCED */}
      {/* ========================================== */}
      <header className="flex flex-col gap-4 mb-6">
        {/* 🔥 FIX: Gunakan items-center agar tombol di kanan seimbang dengan teks di kiri */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground font-jakarta">
              {title}
            </h1>
            <p className="text-[13px] text-muted-foreground font-inter">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-8 gap-2 border-border bg-card hover:bg-accent text-foreground transition-all px-3 rounded-md shadow-sm">
                  <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                  <span className="hidden sm:inline text-xs font-medium">View</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border text-foreground rounded-xl shadow-xl text-xs">
                {table.getAllColumns().filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide()).map((column) => (
                  <DropdownMenuCheckboxItem key={column.id} className="capitalize focus:bg-accent focus:text-foreground cursor-pointer" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id.replace(/_/g, " ")}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {onImport && (
              <Button variant="outline" onClick={onImport} className="h-8 gap-2 border-border bg-card hover:bg-accent text-foreground transition-all px-3 rounded-md shadow-sm">
                <Upload className="size-3.5 text-muted-foreground" />
                <span className="hidden sm:inline text-xs font-medium">Import</span>
              </Button>
            )}

            {onCreate && (
              <Button onClick={onCreate} className="h-8 px-3.5 gap-1.5 bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md shadow-sm font-bold">
                <Plus className="size-3.5" />
                <span className="hidden sm:inline text-xs">New Record</span>
              </Button>
            )}

            <div className="relative group w-full sm:w-56 sm:focus-within:w-64 transition-all duration-500 ease-out">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300 size-3.5" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                className={cn(
                  "pl-8 h-8 bg-muted/30 border-border focus-visible:ring-0 transition-all text-[13px] rounded-md text-foreground placeholder:text-muted-foreground shadow-sm",
                  isFiltered ? "pr-8" : "pr-3"
                )}
              />
              {isFiltered && (
                <button type="button" onClick={() => setGlobalFilter("")} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground hover:bg-destructive/10 rounded-full transition-all duration-200 outline-none">
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Garis batas absolut */}
        <div className="h-px w-full bg-linear-to-r from-border via-border/50 to-transparent" />
      </header>

      {/* ========================================== */}
      {/* DATA TABLE */}
      {/* ========================================== */}
      <main className="flex-1 w-full pb-8">
        <div className="rounded-xl border border-border bg-card/40 overflow-hidden shadow-sm">
          <ScrollArea className="w-full whitespace-nowrap pb-3">
            <Table className="w-full"> 
              <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-border hover:bg-transparent">
                    {headerGroup.headers.map((header) => {
                      const meta = header.column.columnDef.meta as { className?: string } | undefined
                      return (
                        <TableHead key={header.id} className={cn("py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground", meta?.className || "px-6")}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/50">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-[10px] uppercase tracking-widest font-bold animate-pulse text-foreground">Loading Data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                      {row.getVisibleCells().map((cell) => {
                        const meta = cell.column.columnDef.meta as { className?: string } | undefined
                        return (
                          <TableCell key={cell.id} className={cn("py-3 text-sm", meta?.className || "px-6")}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-48 text-center text-muted-foreground font-bold uppercase text-[11px] tracking-widest">
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" className="bg-border hover:bg-border/80 transition-colors rounded-full" />
          </ScrollArea>
        </div>

        <div className="mt-5 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center sm:text-left">
            Showing <span className="text-foreground">{table.getFilteredRowModel().rows.length === 0 ? 0 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> –{" "}
            <span className="text-foreground">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}</span> of{" "}
            <span className="text-foreground">{table.getFilteredRowModel().rows.length}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7 border-border bg-card hover:bg-accent hover:text-foreground rounded-md" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}><ChevronsLeft className="h-3 w-3" /></Button>
            <Button variant="outline" size="icon" className="h-7 w-7 border-border bg-card hover:bg-accent hover:text-foreground rounded-md" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft className="h-3 w-3" /></Button>
            <div className="mx-2 h-3 w-px bg-border" />
            <div className="px-2 text-[11px] font-bold text-foreground min-w-10 text-center">Page {table.getState().pagination.pageIndex + 1}</div>
            <div className="mx-2 h-3 w-px bg-border" />
            <Button variant="outline" size="icon" className="h-7 w-7 border-border bg-card hover:bg-accent hover:text-foreground rounded-md" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight className="h-3 w-3" /></Button>
            <Button variant="outline" size="icon" className="h-7 w-7 border-border bg-card hover:bg-accent hover:text-foreground rounded-md" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}><ChevronsRight className="h-3 w-3" /></Button>
          </div>
        </div>
      </main>
      {children}
    </div>
  )
}