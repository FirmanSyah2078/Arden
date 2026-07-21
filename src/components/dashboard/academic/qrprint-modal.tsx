"use client"

import React from "react"
import { QrCode, Printer, Download } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface QrPrintModalProps {
  qrModalClass: any | null
  dummyStudentsQR: any[]
  selectedQRStudents: number[]
  handleCloseModal: () => void
  handleSelectAllQR: () => void
  handleToggleQRStudent: (id: number) => void
  handlePrint: () => void
}

export function QrPrintModal({
  qrModalClass,
  dummyStudentsQR,
  selectedQRStudents,
  handleCloseModal,
  handleSelectAllQR,
  handleToggleQRStudent,
  handlePrint,
}: QrPrintModalProps) {
  // Pindahkan kalkulasi visual card ke dalam komponen ini
  const visibleCards = dummyStudentsQR.filter((s) => selectedQRStudents.includes(s.id)).slice(0, 3)
  const len = visibleCards.length

  return (
    <>
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
          🔥 MODAL BULK QR GENERATOR (RESPONSIVE: MOBILE & DESKTOP) 🔥
          ===================================================================== */}
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
    </>
  )
}