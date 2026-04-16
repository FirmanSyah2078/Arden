// src/app/(desktop)/dashboard/integrations/page.tsx
"use client";

import { useDataIntegrations } from "@/hooks/integrations/use-integrations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Wifi, WifiOff, RefreshCw, Database, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { DailyPrayer } from "@/types/api";

const PRAYER_LIST: DailyPrayer[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export default function DataIntegrationsPage() {
  const { syncEnabled, isLoading, apiStatus, prayerRanges, bannerState, toggleApiState } = useDataIntegrations();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-background selection:bg-primary/20">
      <header className="space-y-6">
        <div className="flex flex-col gap-1 w-full">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground font-jakarta">Data Integrations</h1>
          <p className="text-sm text-muted-foreground leading-relaxed w-full font-inter">Manage third-party API connections and database synchronization.</p>
        </div>
        <div className="h-px w-full bg-linear-to-r from-border via-border/50 to-transparent" />
      </header>

      <main className="flex-1 w-full pb-8">
        <div className="mx-auto max-w-4xl w-full">
          <Card className="rounded-3xl border border-border/60 bg-card shadow-lg overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/5 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-[16px] font-bold flex items-center gap-2"><Database className="size-4 text-primary" /> Aladhan.com Integration</CardTitle>
                  <CardDescription className="text-[12px] mt-1">Astronomy API endpoints for daily schedule generation.</CardDescription>
                </div>
                <div className={cn("flex items-center w-fit gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold", isLoading || apiStatus === "syncing" ? "bg-muted/50 border-border/50 text-muted-foreground animate-pulse" : apiStatus === "connected" ? "bg-success/10 border-success/20 text-success" : "bg-destructive/10 border-destructive/20 text-destructive")}>
                  {isLoading || apiStatus === "syncing" ? <RefreshCw className="size-3 animate-spin" /> : apiStatus === "connected" ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
                  <span>{isLoading || apiStatus === "syncing" ? "SYNCING..." : apiStatus === "connected" ? "API CONNECTED" : "DISCONNECTED"}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-bold">API Endpoint</span>
                  <a href="https://aladhan.com" target="_blank" rel="noreferrer" className="text-[12px] font-mono text-primary flex items-center gap-1 hover:underline">https://api.aladhan.com/v1 <ExternalLink className="size-3" /></a>
                </div>
                <Switch checked={syncEnabled} disabled={isLoading} onCheckedChange={(val) => toggleApiState(val)} className="data-[state=unchecked]:bg-destructive" />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 mt-10 px-4">
                {PRAYER_LIST.map((prayer) => (
                  <div key={prayer} className="flex flex-col items-center gap-1">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">{prayer}</span>
                    {isLoading || apiStatus === "syncing" ? <div className="h-5 w-20 bg-muted/50 rounded animate-pulse" /> : <span className="text-[13px] font-mono font-medium">{prayerRanges ? prayerRanges[prayer] : "--:-- - --:--"}</span>}
                  </div>
                ))}
              </div>

              <div className={cn("mt-10 p-3 px-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors", bannerState.variant === "muted" ? "bg-muted/5 border-border/40" : "bg-primary/5 border-primary/20")}>
                <div className="flex items-center gap-3">
                  <div className={cn("p-1.5 rounded-md", bannerState.variant === "muted" ? "bg-background border border-border/50" : "bg-primary/10 text-primary")}>
                    <bannerState.icon className={cn("size-4", bannerState.spin && "animate-spin")} />
                  </div>
                  <div className="flex flex-col">
                    <span className={cn("text-[13px] font-bold", bannerState.variant === "muted" ? "text-foreground" : "text-primary")}>{bannerState.title}</span>
                    <span className="text-[11px] text-muted-foreground">{bannerState.desc}</span>
                  </div>
                </div>
                <Button type="button" onClick={bannerState.action} disabled={bannerState.variant === "muted" || isLoading} className={cn("h-9 px-4 rounded-lg font-bold text-[12px]", bannerState.variant === "muted" || isLoading ? "bg-muted text-muted-foreground pointer-events-none" : "bg-primary text-primary-foreground")}>
                  <bannerState.btnIcon className="size-3.5 mr-2" />{bannerState.btnText}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}