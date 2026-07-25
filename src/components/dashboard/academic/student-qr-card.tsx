"use client"

// 🔥 Presentational + gate 2-langkah. State revealed/confirmOpen datang dari hooks,
// komponen ini cuma render & panggil handler — tidak nyimpan logic kapan boleh terbuka.

import { Eye, EyeOff, QrCode, ShieldAlert } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface StudentQrCardProps {
  icode: string
  revealed: boolean
  confirmOpen: boolean
  onRequestReveal: () => void
  onConfirmReveal: () => void
  onCancelReveal: () => void
  onHide: () => void
}

export function StudentQrCard({
  icode,
  revealed,
  confirmOpen,
  onRequestReveal,
  onConfirmReveal,
  onCancelReveal,
  onHide,
}: StudentQrCardProps) {
  return (
    <div className="w-full flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
      {revealed ? (
        <>
          <div className="p-4 bg-white rounded-4xl shadow-2xl border-4 border-primary/20">
            <QrCode className="size-36 text-black" strokeWidth={1.5} />
          </div>
          <span className="text-[11px] font-bold font-mono text-muted-foreground tracking-widest uppercase bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
            {icode}
          </span>
          <Button variant="outline" size="sm" className="gap-1.5 text-[11px]" onClick={onHide}>
            <EyeOff className="size-3.5" /> Sembunyikan
          </Button>
        </>
      ) : (
        <button
          onClick={onRequestReveal}
          className="flex flex-col items-center gap-3 py-10 px-8 rounded-3xl border border-dashed border-white/10 bg-white/2 hover:bg-white/4 hover:border-primary/30 transition-all group"
        >
          <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/30 transition-colors">
            <ShieldAlert className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-[12px] font-bold text-foreground">QR Terkunci</p>
            <p className="text-[11px] text-muted-foreground mt-1 max-w-52">
              Cuma untuk keadaan darurat. Tap untuk konfirmasi sebelum kode ditampilkan.
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
            <Eye className="size-3" /> Tampilkan QR
          </span>
        </button>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={(open) => !open && onCancelReveal()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tampilkan QR darurat?</AlertDialogTitle>
            <AlertDialogDescription>
              QR ini cuma untuk kondisi darurat kalau siswi tidak membawa kartu. Jalur utama
              pencatatan tetap lewat scan Pelaksana. Lanjutkan menampilkan kode ini di layar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancelReveal}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmReveal}>Tampilkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
