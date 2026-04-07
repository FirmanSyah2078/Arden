"use client"

import { Mail, Github, CheckCircle2, Link2Off, Link as LinkIcon } from "lucide-react"

export default function ConnectionsForm() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* --- INFO CARD TRANSPARAN --- */}
      <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-[13px] text-white/70">
        <LinkIcon className="size-4 shrink-0 mt-0.5 text-white/50" />
        <p className="leading-relaxed">
          Link third-party identities to enable Single Sign-On (SSO). This accelerates your login process securely without requiring a password.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        {/* Google Workspace */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-white/10 bg-black/20 p-4 transition-colors hover:bg-white/2">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white/5 border border-white/10">
              <Mail className="size-4 text-white/80" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-[13px] font-medium text-white/90">Google Workspace</h4>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-medium text-emerald-400">
                  <CheckCircle2 className="size-2.5" />
                  Active
                </span>
              </div>
              <p className="text-[11px] text-white/50">admin@mankotablitar.sch.id</p>
            </div>
          </div>
          <button className="group rounded-md border border-white/10 bg-transparent px-3 py-1.5 text-xs font-medium text-white/70 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 shrink-0 w-full sm:w-auto">
            Disconnect
          </button>
        </div>

        {/* Github */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-white/10 bg-black/20 p-4 transition-colors hover:bg-white/2">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white/5 border border-white/10">
              <Github className="size-4 text-white/80" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-[13px] font-medium text-white/90">GitHub</h4>
                <span className="flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-1.5 py-0.5 text-[9px] font-medium text-white/40">
                  <Link2Off className="size-2.5" />
                  Disconnected
                </span>
              </div>
              <p className="text-[11px] text-white/50">Link your account for ARDEN repositories.</p>
            </div>
          </div>
          <button className="group rounded-md bg-white px-3 py-1.5 text-xs font-medium text-black transition-all hover:bg-gray-200 shrink-0 w-full sm:w-auto">
            <span className="inline-block group-hover:ar-bounce-x">Connect</span>
          </button>
        </div>
      </div>
    </div>
  )
}