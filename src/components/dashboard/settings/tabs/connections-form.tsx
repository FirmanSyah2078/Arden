"use client"

import { Mail, Github, CheckCircle2, Link2Off } from "lucide-react"

export default function ConnectionsForm() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h3 className="text-lg font-medium text-foreground">Akun Tertaut</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Tautkan akun pihak ketiga untuk login lebih cepat tanpa kata sandi.
        </p>
      </div>

      <div className="h-px w-full bg-border" />

      <div className="space-y-4">
        
        {/* Google Workspace Connection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border bg-background p-5">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted/50 border border-border">
              <Mail className="size-5 text-foreground" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-foreground">Google Workspace</h4>
                <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                  <CheckCircle2 className="size-3" />
                  Terhubung
                </span>
              </div>
              <p className="text-xs text-muted-foreground">admin@mankotablitar.sch.id</p>
            </div>
          </div>
          <button className="rounded-md border border-border bg-transparent px-4 py-2 text-xs font-medium text-foreground transition-all hover:bg-muted shrink-0 w-full sm:w-auto">
            Putuskan Tautan
          </button>
        </div>

        {/* Github Connection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border bg-background p-5">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted/50 border border-border">
              <Github className="size-5 text-foreground" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-foreground">GitHub</h4>
                <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  <Link2Off className="size-3" />
                  Belum Terhubung
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Tautkan untuk keperluan development ARDEN.</p>
            </div>
          </div>
          <button className="rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background transition-all hover:bg-foreground/90 shrink-0 w-full sm:w-auto">
            Tautkan Akun
          </button>
        </div>

      </div>
    </div>
  )
}