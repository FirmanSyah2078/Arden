"use client"

// 🔥 Presentational only — tidak ada dummy/logic di sini, murni render dari props.

import { Fingerprint, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface StudentListItem {
  id: number
  name: string
  icode: string
}

interface StudentListPanelProps {
  students: StudentListItem[]
  selectedStudentId: number | null
  onSelectStudent: (id: number) => void
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function StudentListPanel({
  students,
  selectedStudentId,
  onSelectStudent,
  searchQuery,
  onSearchChange,
}: StudentListPanelProps) {
  return (
    <div className="w-full lg:w-67.5 h-87.5 lg:h-full flex flex-col bg-card/20 border border-white/5 rounded-3xl overflow-hidden shadow-sm shrink-0">
      <div className="p-5 border-b border-white/5 shrink-0 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-jakarta text-[14px] font-bold text-foreground">Daftar Siswi</h3>
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {students.length} Siswi
          </span>
        </div>
        <div className="relative group w-full transition-all duration-300">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300 size-3.5" />
          <Input
            placeholder="Cari nama atau icode..."
            spellCheck={false}
            autoComplete="off"
            className="pl-8 h-9 bg-black/20 border-white/10 text-[12px] rounded-xl text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-primary/50"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto smooth-scrollbar px-2"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 24px, black calc(100% - 24px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 24px, black calc(100% - 24px), transparent 100%)",
        }}
      >
        <div className="py-4 flex flex-col gap-1">
          {students.map((student) => {
            const isActive = selectedStudentId === student.id
            return (
              <button
                key={student.id}
                onClick={() => onSelectStudent(student.id)}
                className={cn(
                  "w-full text-left flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-300 group",
                  isActive
                    ? "bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.05)]"
                    : "bg-transparent border border-transparent hover:bg-white/3"
                )}
              >
                <div
                  className={cn(
                    "size-10 rounded-full flex items-center justify-center shrink-0 border transition-colors duration-300",
                    isActive
                      ? "bg-primary/20 border-primary/30"
                      : "bg-white/5 border-white/10 group-hover:border-white/20"
                  )}
                >
                  <User
                    className={cn(
                      "size-4",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-white/80"
                    )}
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                  <span
                    className={cn(
                      "font-jakarta text-[13px] font-bold truncate transition-colors",
                      isActive ? "text-primary" : "text-white/90 group-hover:text-white"
                    )}
                  >
                    {student.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <Fingerprint size={10} className={isActive ? "text-primary/70" : "text-muted-foreground/60"} />
                    <span className={isActive ? "text-primary/80" : "text-muted-foreground"}>{student.icode}</span>
                  </div>
                </div>
              </button>
            )
          })}

          {students.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 opacity-30">
              <Search className="size-8 text-muted-foreground/50" />
              <p className="mt-3 text-[10px] font-bold tracking-widest uppercase text-foreground">
                Tidak ditemukan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
