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
    globalFilterFn: "includesString", // 🔥 FIX: Memaksa tabel membaca string secara global
  })

  const isFiltered = globalFilter.length > 0;

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold tracking-tight text-white">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group w-48 focus-within:w-64 transition-all duration-500 ease-out shrink-0">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground group-focus-within:text-white transition-colors duration-300" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              className={cn(
                "h-8 pl-8 text-xs bg-white/5 border-transparent text-white rounded-lg shadow-none focus-visible:ring-0 focus-visible:bg-transparent focus-visible:border-white/20 hover:bg-white/10 transition-all duration-300 placeholder:text-muted-foreground/70 placeholder:truncate",
                isFiltered ? "pr-8" : "pr-3"
              )}
            />
            {isFiltered && (
              <button onClick={() => setGlobalFilter("")} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-white hover:bg-white/10 rounded-full transition-all">
                <X className="h-3 w-3 hover:ar-tada" />
              </button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 px-2.5 text-xs gap-1.5 border-transparent bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors rounded-lg shadow-none group">
                <SlidersHorizontal className="h-3.5 w-3.5 group-hover:ar-tada" />
                <span className="hidden sm:inline font-medium">View</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0a0a0a] border-white/10 text-white rounded-xl shadow-2xl text-xs">
              {table.getAllColumns().filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide()).map((column) => (
                  <DropdownMenuCheckboxItem key={column.id} className="capitalize focus:bg-white/10 focus:text-white cursor-pointer" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id.replace(/_/g, " ")}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {onImport && (
            <Button onClick={onImport} className="h-8 px-2.5 text-xs gap-1.5 border-transparent bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors rounded-lg shadow-none group">
              <Upload className="h-3.5 w-3.5 group-hover:ar-float" />
              <span className="hidden sm:inline font-medium">Import</span>
            </Button>
          )}

          {onCreate && (
            <Button onClick={onCreate} className="h-8 px-3 text-xs gap-1.5 bg-white text-black hover:bg-gray-200 transition-colors rounded-lg shadow-md font-bold group">
              <Plus className="h-3.5 w-3.5 group-hover:ar-tada" />
              <span className="hidden sm:inline">New Record</span>
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#0a0a0a]/50 overflow-hidden">
        <ScrollArea className="w-full whitespace-nowrap pb-3">
          <Table className="w-full"> 
            <TableHeader className="bg-white/3">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-white/5 hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta as { className?: string } | undefined
                    return (
                      <TableHead key={header.id} className={cn("py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500", meta?.className || "px-6")}>
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
                     <div className="flex flex-col items-center justify-center gap-2 text-white/40">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="text-[10px] uppercase tracking-widest font-medium animate-pulse">Loading Data...</span>
                     </div>
                   </TableCell>
                 </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-white/5 hover:bg-white/2 transition-colors">
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
                  <TableCell colSpan={columns.length} className="h-48 text-center text-gray-500 font-bold uppercase text-xs tracking-widest">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" className="bg-white/5 hover:bg-white/10 transition-colors rounded-full" />
        </ScrollArea>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
        <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground text-center sm:text-left">
          Showing <span className="text-white">{table.getFilteredRowModel().rows.length === 0 ? 0 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> –{" "}
          <span className="text-white">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}</span> of{" "}
          <span className="text-white">{table.getFilteredRowModel().rows.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7 border-white/5 bg-transparent hover:bg-white/5 hover:text-white" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}><ChevronsLeft className="h-3 w-3" /></Button>
          <Button variant="outline" size="icon" className="h-7 w-7 border-white/5 bg-transparent hover:bg-white/5 hover:text-white" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft className="h-3 w-3" /></Button>
          <div className="mx-2 h-3 w-px bg-white/10" />
          <div className="px-2 text-[11px] font-bold text-white min-w-10 text-center">Page {table.getState().pagination.pageIndex + 1}</div>
          <div className="mx-2 h-3 w-px bg-white/10" />
          <Button variant="outline" size="icon" className="h-7 w-7 border-white/5 bg-transparent hover:bg-white/5 hover:text-white" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight className="h-3 w-3" /></Button>
          <Button variant="outline" size="icon" className="h-7 w-7 border-white/5 bg-transparent hover:bg-white/5 hover:text-white" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}><ChevronsRight className="h-3 w-3" /></Button>
        </div>
      </div>
      {children}
    </div>
  )
}