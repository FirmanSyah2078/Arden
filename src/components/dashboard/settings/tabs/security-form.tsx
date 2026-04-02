"use client"

import { 
  AlertTriangle, Trash2, Smartphone, Monitor, ShieldCheck, KeyRound, 
  Loader2, CheckCircle2, CircleDashed, Eye, EyeOff, XCircle 
} from "lucide-react"
import { useSecurity } from "@/hooks/settings/use-security"
import { cn } from "@/lib/utils"

export default function SecurityForm() {
  const {
    passwords,
    showPasswords,
    isSubmitting,
    isDirty,
    isMatch,
    isValidLength,
    strengthScore,
    isSaveDisabled,
    handleChange,
    toggleVisibility,
    handleSave,
  } = useSecurity()

  const getStrengthUI = (score: number, currentLength: number) => {
    if (currentLength === 0) return { label: "", color: "bg-transparent", text: "", width: "w-0" };
    if (currentLength < 8) return { label: "Too short", color: "bg-transparent", text: "text-red-400/80", width: "w-0" };
    
    if (score === 1) return { label: "Weak", color: "bg-red-500", text: "text-red-400", width: "w-[25%]" };
    if (score === 2) return { label: "Fair", color: "bg-amber-500", text: "text-amber-400", width: "w-[50%]" };
    if (score === 3) return { label: "Good", color: "bg-emerald-400", text: "text-emerald-400", width: "w-[75%]" };
    return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-500", width: "w-full" };
  };

  const strengthUI = getStrengthUI(strengthScore, passwords.new.length);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-4">
      
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-2 text-[12px] text-white/70">
        <ShieldCheck className="size-4 shrink-0 text-white/50" />
        <p className="leading-relaxed">
          Secure your account. Update your password regularly and monitor active devices.
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-2 text-white/90">
          <KeyRound className="size-4 text-white/50" />
          <h4 className="text-[14px] font-medium">Login Credentials</h4>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2">
          
          <div> 
            <label className="block mb-2.5 text-[13px] font-medium text-white/90">New Password</label>
            <div className="relative group">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwords.new}
                onChange={(e) => handleChange("new", e.target.value)}
                className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2.5 pr-10 text-[13px] text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all tracking-wide"
                placeholder="Minimum 8 characters"
              />
              <button 
                type="button" 
                onClick={() => toggleVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPasswords.new ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            
            <div className={cn("transition-all duration-300 overflow-hidden flex items-center gap-3", passwords.new.length > 0 ? "h-5 opacity-100 mt-3" : "h-0 opacity-0 mt-0")}>
              <span className={cn("text-[10px] font-medium shrink-0 flex items-center min-w-[40px]", strengthUI.text)}>
                {strengthUI.label} {!isValidLength && <span className="text-white/40 font-normal ml-1">(Min. 8 chars)</span>}
              </span>
              
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className={cn("h-full transition-all duration-500 ease-out", strengthUI.color, strengthUI.width)} />
              </div>
            </div>
          </div>

          <div> 
            <label className="block mb-2.5 text-[13px] font-medium text-white/90">Confirm Password</label>
            <div className="relative group">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwords.confirm}
                onChange={(e) => handleChange("confirm", e.target.value)}
                className={cn(
                  "w-full rounded-md border bg-black/20 px-3 py-2.5 pr-10 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:ring-1 transition-all tracking-wide",
                  passwords.confirm.length > 0 && !isMatch 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" 
                    : "border-white/10 focus:border-white/30 focus:ring-white/20"
                )}
                placeholder="Repeat new password"
              />
              <button 
                type="button" 
                onClick={() => toggleVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPasswords.confirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            <div className={cn("transition-all duration-300 overflow-hidden flex items-center", passwords.confirm.length > 0 ? "h-5 opacity-100 mt-3" : "h-0 opacity-0 mt-0")}>
              {isMatch ? (
                 <p className="text-[10px] text-emerald-400 flex items-center gap-1.5 font-medium">
                   <CheckCircle2 className="size-3" /> Passwords match!
                 </p>
              ) : (
                 <p className="text-[10px] text-red-400 flex items-center gap-1.5 font-medium">
                   <XCircle className="size-3" /> Passwords do not match
                 </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-[11px] text-white/40">
            {isDirty ? (
              <><CircleDashed className="size-3.5 text-amber-500 animate-spin-slow" /> Unsaved changes</>
            ) : (
              <><CheckCircle2 className="size-3.5 text-emerald-500/80" /> Up to date</>
            )}
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaveDisabled}
            className="flex items-center justify-center min-w-25 gap-2 rounded-md bg-white px-5 py-2 text-[13px] font-medium text-black shadow-lg shadow-white/5 transition-all duration-300 hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-30 disabled:pointer-events-none disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
               <><Loader2 className="size-4 animate-spin" /> Saving</>
            ) : (
               "Save Password"
            )}
          </button>
        </div>
      </div>

      <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white/90">
          <Monitor className="size-4 text-white/50" />
          <h4 className="text-[14px] font-medium">Active Sessions</h4>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 divide-y divide-white/5">
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3">
              <Monitor className="size-5 text-white/40" />
              <div>
                <p className="text-[13px] font-medium text-white/90">Windows • Chrome</p>
                <p className="text-[11px] text-emerald-400/80 mt-0.5">Current session • Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

      {/* --- DANGER ZONE --- */}
      <div className="space-y-4 pt-2">
        <h4 className="text-[14px] font-medium text-red-400 flex items-center gap-2">
          <AlertTriangle className="size-4" /> Danger Zone
        </h4>

        {/* 🔥 FIX CARD: Menggunakan red-950 (merah paling gelap/hampir hitam) agar tetap dominan gelap */}
        <div className="rounded-lg border border-white/10 bg-black/20 p-5 transition-all duration-300 hover:border-red-900/30 hover:bg-red-950/10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h5 className="text-[13px] font-medium text-white/90">
                Delete Account
              </h5>
              <ul className="text-[11px] text-white/50 list-disc pl-4 space-y-1 tracking-wide">
                <li>Permanent removal of all personal and system data.</li>
                <li>Immediate loss of access to the ARDEN ecosystem.</li>
                <li>This action is absolute and cannot be undone.</li>
              </ul>
            </div>

            <button className="group flex shrink-0 items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-2 text-[12px] font-medium text-red-400 transition-all duration-300 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <Trash2 className="size-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
              Delete
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}