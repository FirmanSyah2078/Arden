"use client"

// 🔥 Presentational + gate 2-langkah. State revealed/confirmOpen/copied semuanya
// cuma "UI micro-state" (bukan logika bisnis), jadi wajar hidup di sini.
// Style dirombak biar senada sama pola card lain di dashboard (rounded-3xl,
// border-white/5, bg-card) — patokan visualnya sidebar & card kelas yang sudah ada.

import { useState } from "react"
import { Check, Copy, EyeOff, QrCode, ShieldAlert } from "lucide-react"
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
import { cn } from "@/lib/utils"

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
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(icode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="w-full max-w-xs mx-auto rounded-3xl border border-white/5 bg-card/40 p-7 flex flex-col items-center text-center gap-5 animate-in fade-in zoom-in-95 duration-300">
      {revealed ? (
        <>
          <div className="flex flex-col items-center gap-2">
            <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <QrCode className="size-5 text-primary" />
            </div>
            <h4 className="font-jakarta text-[15px] font-bold text-foreground">QR Darurat</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed max-w-52">
              Tunjukkan layar ini ke Pelaksana untuk pemindaian manual.
            </p>
          </div>

          <div className="relative p-5 bg-white rounded-3xl shadow-2xl border-4 border-primary/20 overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-primary/10 to-transparent" />
            <QrCode className="size-32 text-black relative z-10" strokeWidth={1.5} />
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-[11px] font-bold font-mono text-muted-foreground tracking-widest uppercase bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5 transition-colors"
          >
            {icode}
            {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
          </button>

          <Button variant="outline" size="sm" className="gap-1.5 text-[11px] w-full" onClick={onHide}>
            <EyeOff className="size-3.5" /> Sembunyikan
          </Button>
        </>
      ) : (
        <>
          <div className="size-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <ShieldAlert className="size-6 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[13px] font-bold text-foreground">QR Darurat Terkunci</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed max-w-56">
              Cuma untuk keadaan darurat kalau siswi tidak membawa kartu. Perlu konfirmasi dulu
              sebelum kode ditampilkan ke layar.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full gap-2 border-white/10 bg-white/3 hover:bg-white/8 hover:border-primary/30"
            onClick={onRequestReveal}
          >
            <QrCode className="size-4" /> Tampilkan QR
          </Button>
        </>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={(open) => !open && onCancelReveal()}>
        <AlertDialogContent className="max-w-sm rounded-3xl border-white/10 bg-[#0d0d0d] p-7">
          <AlertDialogHeader className="items-center text-center gap-3">
            <div className="size-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ShieldAlert className="size-6 text-primary" />
            </div>
            <AlertDialogTitle className="text-[16px]">Tampilkan QR darurat?</AlertDialogTitle>
            <AlertDialogDescription className="text-[12px] leading-relaxed">
              QR ini cuma untuk kondisi darurat kalau siswi tidak membawa kartu. Jalur utama
              pencatatan tetap lewat scan Pelaksana. Lanjutkan menampilkan kode ini di layar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-2 mt-2">
            <AlertDialogCancel
              onClick={onCancelReveal}
              className={cn("flex-1 sm:flex-none sm:min-w-28")}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmReveal} className="flex-1 sm:flex-none sm:min-w-28">
              Tampilkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}