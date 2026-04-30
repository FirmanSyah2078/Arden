"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
// 🔥 IMPORT EYE dan EYEOFF
import { KeyRound, Loader2, Save, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react"
import { User } from "@/types/api"
import { cn } from "@/lib/utils"

interface ResetPasswordDialogProps {
  open: boolean
  user: User
  onOpenChange: (open: boolean) => void
}

export function ResetPasswordDialog({
  open,
  user,
  onOpenChange,
}: ResetPasswordDialogProps) {
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  // 🔥 STATE UNTUK SHOW/HIDE PASSWORD
  const [showPassword, setShowPassword] = React.useState(false)

  React.useEffect(() => {
    if (!open) {
      setPassword("")
      setConfirm("")
      setLoading(false)
      setShowPassword(false) // Reset state mata saat dialog tutup
    }
  }, [open])

  // Logika Kekuatan Password Berbentuk Teks Saja
  const getStrengthText = (pw: string) => {
    if (!pw) return { text: "", color: "text-transparent" };
    if (pw.length < 6) return { text: "Too short", color: "text-red-400" };
    
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;

    if (score <= 1) return { text: "Weak", color: "text-red-400" };
    if (score === 2) return { text: "Fair", color: "text-amber-400" };
    if (score === 3) return { text: "Good", color: "text-emerald-400" };
    return { text: "Strong", color: "text-emerald-500" };
  };

  const strength = getStrengthText(password);
  const isValidLength = password.length >= 6;
  const isMatch = password === confirm && password.length > 0;
  const isValid = isValidLength && isMatch;

  async function handleReset() {
    if (!isValid) return;

    try {
      setLoading(true)

      const res = await fetch("/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id_user: user.id_user, 
          new_password: password 
        })
      });

      const json = await res.json();
      if (!res.ok || json.status === 'fail') throw new Error(json.message);

      toast.success(`Password for ${user.username} has been successfully reset`)
      onOpenChange(false)

      setTimeout(() => {
        document.body.style.pointerEvents = "auto"
        document.body.style.overflow = "auto"
        document.body.removeAttribute("data-scroll-locked")
      }, 200)

    } catch (err: any) {
      toast.error(err.message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 FIX: Border hover dan focus dikembalikan ke DEFAULT (white)
  const inputClass = "bg-[#050505] border border-white/10 text-white placeholder:text-gray-600 outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/40 hover:border-white/30 shadow-none transition-all duration-300"

  // Kelas tombol mata agar konsisten
  const eyeBtnClass = "absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white/70 transition-colors"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#0a0a0a] border border-white/10 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            <KeyRound className="h-5 w-5 text-amber-500 animate-pulse" />
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-xs">
            Securely reset the password for the selected account.
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-white/10" />

        <div className="rounded-md border border-white/10 bg-white/5 p-3">
          <div className="text-sm">
            <div className="font-medium text-white tracking-tight">{user.name}</div>
            <div className="text-xs text-gray-400 mt-1.5 font-mono bg-black/30 inline-block px-1.5 py-0.5 rounded border border-white/5">
              @{user.username} — {user.role}
            </div>
          </div>
        </div>

        <div className="space-y-5 pt-1">
          {/* Kolom New Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">New Password</Label>
              <span className={cn("text-[10px] font-medium tracking-wide transition-opacity", strength.color, password ? "opacity-100" : "opacity-0")}>
                {strength.text}
              </span>
            </div>
            {/* 🔥 FIX: Penempatan Ikon Mata */}
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"} // Type dinamis
                className={`${inputClass} pr-10`} // Kasih padding kanan
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className={eyeBtnClass}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Kolom Confirm Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="confirm">Confirm Password</Label>
              <span className={cn(
                "text-[10px] font-medium tracking-wide flex items-center gap-1.5 transition-opacity", 
                confirm ? "opacity-100" : "opacity-0",
                isMatch ? "text-emerald-400" : "text-red-400"
              )}>
                {isMatch ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
                {isMatch ? "Matched" : "Not matched"}
              </span>
            </div>
            {/* 🔥 FIX: Penempatan Ikon Mata */}
            <div className="relative">
              <Input
                id="confirm"
                type={showPassword ? "text" : "password"} // Type dinamis mengikuti mata atas
                className={cn(
                  `${inputClass} pr-10`, // Kasih padding kanan
                  confirm.length > 0 && !isMatch ? "border-red-500/40" : ""
                )}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter new password"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className={eyeBtnClass}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="border-white/10 bg-transparent text-gray-300 hover:bg-white/5 transition-colors"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleReset}
            disabled={loading || !isValid}
            className={`
               group border-0 font-medium transition-all shadow-lg
               ${(!isValid) ? "bg-white/10 text-gray-500 cursor-not-allowed" : "bg-amber-500 text-black hover:bg-amber-600"}
            `}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4 group-hover:ar-tada" />}
            Reset Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}