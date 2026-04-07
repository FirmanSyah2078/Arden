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
import { KeyRound, Loader2, Save } from "lucide-react"
import { User } from "@/types/api"

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

  React.useEffect(() => {
    if (!open) {
      setPassword("")
      setConfirm("")
      setLoading(false)
    }
  }, [open])

  const isValid = password.length >= 6 && password === confirm;

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

    // 🔥 VAKSIN LAYAR HITAM
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

  const inputClass = "bg-[#050505] border border-white/10 text-white placeholder:text-gray-600 outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/40 hover:border-white/30 shadow-none transition-all duration-300"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#0a0a0a] border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-amber-500 animate-pulse" />
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Securely reset the password for the selected account.
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-white/10" />

        <div className="rounded-md border border-white/10 bg-white/5 p-3">
          <div className="text-sm">
            <div className="font-medium text-white">{user.name}</div>
            <div className="text-xs text-gray-400 mt-1">
              @{user.username} — {user.role}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              className={inputClass}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
            />
          </div>

          {!isValid && password.length > 0 && (
            <p className="text-[10px] text-red-400 italic transition-all">
              * Password must be at least 6 characters and match
            </p>
          )}
        </div>

        <DialogFooter className="pt-4">
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
               group border-0 font-medium transition-all
               ${(!isValid) ? "bg-white/10 text-gray-500 cursor-not-allowed" : "bg-amber-500 text-black hover:bg-amber-600 shadow-md"}
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